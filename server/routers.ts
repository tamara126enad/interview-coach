import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { analyzeCvText, CV_MAX_BYTES, CV_MIME_TYPES, extractCvText } from "./cv";
import { evaluateInterviewAnswer } from "./interview";
import { evaluateCatalogAnswer, getJob, interviewCatalog, pickQuestions, type InterviewType } from "./interviewCatalog";
import { completeInterviewSession, createInterviewSession, ensureInterviewSeed, getInterviewHistory, saveInterviewAnswer } from "./interviewDb";

const uploadInput = z.object({ filename: z.string().min(1).max(180), mimeType: z.enum(CV_MIME_TYPES), data: z.string().min(16).max(14_000_000), targetJob: z.string().trim().min(2).max(120) });
const interviewType = z.enum(["general", "technical", "behavioral", "hr", "managerial"]);

function safeFilename(filename: string) { return filename.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(-140); }

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  cv: router({
    uploadAndAnalyze: publicProcedure.input(uploadInput).mutation(async ({ input, ctx }) => {
      let buffer: Buffer;
      try { buffer = Buffer.from(input.data, "base64"); } catch { throw new TRPCError({ code: "BAD_REQUEST", message: "تعذر قراءة الملف المرفوع." }); }
      if (!buffer.length || buffer.length > CV_MAX_BYTES) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "حجم الملف يجب ألا يتجاوز 10MB." });
      let extractedText = "";
      try { extractedText = await extractCvText(buffer, input.mimeType, input.filename); } catch (error) { throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "تعذر استخراج النص من الملف." }); }
      if (extractedText.length < 30) throw new TRPCError({ code: "BAD_REQUEST", message: "لم نتمكن من استخراج نص كافٍ. إذا كانت السيرة صورة ممسوحة ضوئيًا، استخدم نسخة قابلة لتحديد النص." });
      const stored = await storagePut(`cv-uploads/${ctx.user?.openId ?? "guest"}/${Date.now()}-${safeFilename(input.filename)}`, buffer, input.mimeType);
      const analysis = analyzeCvText(extractedText, input.targetJob);
      return { ...analysis, filename: input.filename, fileUrl: stored.url, fileKey: stored.key, targetJob: input.targetJob, extractedText: extractedText.slice(0, 60_000) };
    }),
  }),
  interview: router({
    catalog: publicProcedure.query(async () => { await ensureInterviewSeed(); return interviewCatalog.map(({ questions, ...job }) => ({ ...job, questionCount: questions.length })); }),
    startSession: publicProcedure.input(z.object({ jobId: z.string().min(1), type: interviewType, questionCount: z.number().int().min(3).max(10) })).mutation(async ({ input, ctx }) => {
      await ensureInterviewSeed();
      const questions = pickQuestions(input.jobId, input.type as InterviewType, input.questionCount);
      if (!questions.length) throw new TRPCError({ code: "NOT_FOUND", message: "لا توجد أسئلة متاحة لهذا الاختيار." });
      const sessionId = await createInterviewSession({ jobId: String(interviewCatalog.findIndex(job => job.id === input.jobId) + 1), type: input.type as InterviewType, questionIds: questions.map(question => question.id), userId: ctx.user?.id });
      return { sessionId, job: getJob(input.jobId), questions, total: questions.length };
    }),
    evaluateAnswer: publicProcedure.input(z.object({ jobId: z.string().optional(), questionId: z.string().optional(), answer: z.string().max(12_000), sessionId: z.number().nullable().optional(), question: z.number().int().min(1).max(3).optional(), targetJob: z.string().optional() })).mutation(async ({ input }) => {
      if (!input.answer.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: "اكتب إجابة قبل إرسالها." });
      if (!input.jobId || !input.questionId) return evaluateInterviewAnswer((input.question ?? 1) as 1 | 2 | 3, input.answer, input.targetJob ?? "مطور واجهات أمامية");
      const question = getJob(input.jobId).questions.find(item => item.id === input.questionId);
      if (!question) throw new TRPCError({ code: "NOT_FOUND", message: "السؤال غير موجود." });
      const result = evaluateCatalogAnswer(question, input.answer);
      if (input.sessionId) await saveInterviewAnswer({ sessionId: input.sessionId, questionId: input.questionId, answer: input.answer, score: result.score, feedback: result });
      return { ...result, prompt: question.prompt, referenceAnswer: question.referenceAnswer, criteria: question.criteria };
    }),
    completeSession: publicProcedure.input(z.object({ sessionId: z.number().nullable().optional(), totalScore: z.number().int().min(0).max(100) })).mutation(async ({ input }) => { if (input.sessionId) await completeInterviewSession(input.sessionId, input.totalScore); return { success: true }; }),
    history: publicProcedure.query(async ({ ctx }) => getInterviewHistory(ctx.user?.id)),
    legacyEvaluate: publicProcedure.input(z.object({ question: z.number().int().min(1).max(3), answer: z.string().max(12_000), targetJob: z.string().trim().min(2).max(120) })).mutation(({ input }) => { if (!input.answer.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: "اكتب إجابة قبل إرسالها." }); return evaluateInterviewAnswer(input.question as 1 | 2 | 3, input.answer, input.targetJob); }),
  }),
});

export type AppRouter = typeof appRouter;
