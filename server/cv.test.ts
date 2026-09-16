import { describe, expect, it } from "vitest";
import { analyzeCvText, extractCvText } from "./cv";

describe("CV analysis", () => {
  it("scores extracted CV text against a target role", () => {
    const text = "Frontend Engineer\nahmad@example.com\nReact JavaScript TypeScript\nExperience\nEducation\nSkills\nProjects\nLinkedIn";
    const result = analyzeCvText(text, "Frontend Engineer");
    expect(result.overallScore).toBeGreaterThan(60);
    expect(result.matchScore).toBeGreaterThan(60);
    expect(result.contactChecks.hasEmail).toBe(true);
    expect(result.detectedSections).toContain("المهارات");
  });

  it("rejects legacy .doc files with a useful message", async () => {
    await expect(extractCvText(Buffer.from("not-a-doc"), "application/msword", "resume.doc")).rejects.toThrow("DOCX أو PDF");
  });
});
