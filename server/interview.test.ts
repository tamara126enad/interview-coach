import { describe, expect, it } from "vitest";
import { evaluateInterviewAnswer } from "./interview";

describe("interview answer rubric", () => {
  it("rewards complete, specific answers over short answers", () => {
    const short = evaluateInterviewAnswer(1, "أنا مطور.", "مطور واجهات أمامية");
    const strong = evaluateInterviewAnswer(1, "أنا أحمد، مطور واجهات أمامية بخبرة 4 سنوات في React وJavaScript. طورت مشروع منصة تعليمية، وكان دوري بناء الواجهات وتحسين الأداء، مما رفع سرعة الصفحات وحسن تجربة المستخدم. أبحث عن فرصة أساهم فيها بخبرتي.", "مطور واجهات أمامية");
    expect(strong.score).toBeGreaterThan(short.score);
    expect(short.missing.length).toBeGreaterThan(0);
    expect(strong.matched).toContain("سنوات أو مستوى الخبرة");
  });
});
