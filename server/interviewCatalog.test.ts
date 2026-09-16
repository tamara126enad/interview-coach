import { describe, expect, it } from "vitest";
import { evaluateCatalogAnswer, interviewCatalog, pickQuestions } from "./interviewCatalog";

describe("interactive interview catalog", () => {
  it("contains multiple professions and interview-ready question types", () => {
    expect(interviewCatalog.length).toBeGreaterThanOrEqual(6);
    expect(new Set(interviewCatalog.map(job => job.category)).size).toBeGreaterThanOrEqual(3);
    expect(interviewCatalog.flatMap(job => job.questions).some(question => question.type === "technical")).toBe(true);
  });

  it("selects a bounded randomized set and rewards detailed answers", () => {
    const job = interviewCatalog[0]!;
    const questions = pickQuestions(job.id, "general", 5);
    expect(questions.length).toBeGreaterThan(0);
    expect(new Set(questions.map(question => question.id)).size).toBe(questions.length);
    const short = evaluateCatalogAnswer(questions[0]!, "أنا مطور.");
    const detailed = evaluateCatalogAnswer(questions[0]!, "أنا مطور واجهات أمامية بخبرة أربع سنوات. عملت على مشروع منصة تعليمية باستخدام React، وكان دوري تصميم الواجهات وتحسين الأداء. قست النتيجة ونجحت في تقليل زمن التحميل وتحسين تجربة المستخدم، وتعلمت أهمية القياس والتجربة.");
    expect(detailed.score).toBeGreaterThan(short.score);
    expect(detailed.missing.length).toBeLessThanOrEqual(questions[0]!.criteria.length);
  });
});
