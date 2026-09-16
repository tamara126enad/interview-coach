import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export const CV_MAX_BYTES = 10 * 1024 * 1024;
export const CV_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/octet-stream",
] as const;

const SECTION_PATTERNS: Array<[string, RegExp]> = [
  ["الملخص المهني", /(summary|profile|objective|نبذة|ملخص|هدف مهني)/i],
  ["الخبرات العملية", /(experience|employment|work history|خبرات|الخبرة)/i],
  ["التعليم", /(education|academic|degree|تعليم|دراسة|بكالوريوس|ماجستير)/i],
  ["المهارات", /(skills|technical skills|مهارات|تقنيات)/i],
  ["المشاريع", /(projects|portfolio|مشاريع|أعمال)/i],
  ["الشهادات", /(certifications|certificates|شهادات|دورات)/i],
];

function cleanText(value: string) {
  return value
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractCvText(buffer: Buffer, mimeType: string, filename: string) {
  const lowerName = filename.toLowerCase();
  const isPdf = mimeType === "application/pdf" || lowerName.endsWith(".pdf");
  const isDocx = mimeType.includes("wordprocessingml") || lowerName.endsWith(".docx");
  const isDoc = mimeType === "application/msword" || lowerName.endsWith(".doc");

  if (isPdf) {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return cleanText(result.text);
    } finally {
      await parser.destroy();
    }
  }

  if (isDocx) {
    const result = await mammoth.extractRawText({ buffer });
    return cleanText(result.value);
  }

  if (isDoc) {
    throw new Error("ملفات DOC القديمة غير مدعومة حاليًا. احفظ الملف بصيغة DOCX أو PDF ثم أعد المحاولة.");
  }

  throw new Error("نوع الملف غير مدعوم. ارفع PDF أو DOCX فقط.");
}

function scoreFrom(value: number) {
  return Math.max(35, Math.min(98, Math.round(value)));
}

export function analyzeCvText(text: string, targetJob: string) {
  const normalized = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const detectedSections = SECTION_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text);
  const hasPhone = /(?:\+?\d[\d ()-]{7,}\d)/.test(text);
  const hasLinkedIn = /linkedin/i.test(normalized);
  const hasGithub = /github/i.test(normalized);
  const jobTerms = targetJob.toLowerCase().split(/\s+/).filter(Boolean);
  const matchingTerms = jobTerms.filter(term => term.length > 2 && normalized.includes(term));
  const contentScore = scoreFrom(50 + Math.min(35, detectedSections.length * 6) + Math.min(10, wordCount / 350));
  const contactScore = scoreFrom(55 + (hasEmail ? 20 : 0) + (hasPhone ? 15 : 0) + (hasLinkedIn ? 5 : 0) + (hasGithub ? 5 : 0));
  const relevanceScore = scoreFrom(55 + Math.min(35, matchingTerms.length * 9) + (normalized.includes("achievement") || normalized.includes("إنجاز") ? 5 : 0));
  const writingScore = scoreFrom(62 + Math.min(24, wordCount / 250) - (text.match(/\b( I | worked | responsible )\b/gi)?.length ?? 0));
  const structureScore = scoreFrom(55 + detectedSections.length * 7);
  const keywordScore = scoreFrom(52 + Math.min(40, matchingTerms.length * 10));
  const overallScore = Math.round((contentScore + contactScore + relevanceScore + writingScore + structureScore + keywordScore) / 6);

  return {
    overallScore,
    matchScore: relevanceScore,
    wordCount,
    extractedCharacters: text.length,
    detectedSections,
    contactChecks: { hasEmail, hasPhone, hasLinkedIn, hasGithub },
    scores: { content: contentScore, relevance: relevanceScore, skills: keywordScore, writing: writingScore, structure: structureScore, keywords: keywordScore, contact: contactScore },
    strengths: detectedSections.length >= 4 ? ["يحتوي على أقسام رئيسية واضحة.", "تم استخراج نص قابل للتحليل من الملف.", hasEmail ? "يحتوي على بريد إلكتروني قابل للتواصل." : ""] : ["تم رفع الملف بنجاح.", "يمكن تحسين وضوح الأقسام لرفع الجاهزية."],
    improvements: [
      !hasEmail ? "أضف بريدًا إلكترونيًا واضحًا في معلومات التواصل." : "راجع اتساق صياغة البريد وروابط التواصل.",
      detectedSections.includes("الخبرات العملية") ? "حوّل وصف الخبرات إلى إنجازات مدعومة بنتائج حقيقية." : "أضف قسمًا واضحًا للخبرات العملية إن كان متاحًا.",
      relevanceScore < 75 ? "اربط الملخص والمهارات بالكلمات المستخدمة في الوظيفة المستهدفة، فقط إذا كانت تعكس خبرتك الفعلية." : "راجع الكلمات المفتاحية مع وصف الوظيفة المستهدفة.",
    ].filter(Boolean),
  };
}
