import { desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { interviewAnswers, interviewJobs, interviewQuestions, interviewSessions } from "../drizzle/schema";
import { getJob, interviewCatalog, type InterviewType, type CatalogQuestion } from "./interviewCatalog";

export async function ensureInterviewSeed() {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select({ id: interviewJobs.id }).from(interviewJobs).limit(1);
  if (existing.length) return;
  for (const job of interviewCatalog) {
    const inserted = await db.insert(interviewJobs).values({ slug: job.id, title: job.title, category: job.category, icon: job.icon });
    const jobId = Number((inserted as any).insertId);
    if (!jobId) continue;
    await db.insert(interviewQuestions).values(job.questions.map(question => ({ jobId, interviewType: question.type, prompt: question.prompt, referenceAnswer: question.referenceAnswer, criteria: JSON.stringify(question.criteria), difficulty: question.difficulty })));
  }
}

export async function createInterviewSession(input: { jobId: string; type: InterviewType; questionIds: string[]; userId?: number }) {
  const db = await getDb();
  if (!db) return null;
  const inserted = await db.insert(interviewSessions).values({ userId: input.userId, jobId: Number.isFinite(Number(input.jobId)) ? Number(input.jobId) : 0, interviewType: input.type, questionIds: JSON.stringify(input.questionIds) });
  return Number((inserted as any).insertId) || null;
}

export async function saveInterviewAnswer(input: { sessionId: number; questionId: string; answer: string; score: number; feedback: unknown }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(interviewAnswers).values({ sessionId: input.sessionId, questionId: input.questionId, answer: input.answer, score: input.score, feedback: JSON.stringify(input.feedback) });
}

export async function completeInterviewSession(sessionId: number, totalScore: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(interviewSessions).set({ status: "completed", totalScore, completedAt: new Date() }).where(eq(interviewSessions.id, sessionId));
}

export async function getInterviewHistory(userId?: number) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(interviewSessions).orderBy(desc(interviewSessions.createdAt)).limit(20);
  if (userId) return query.where(eq(interviewSessions.userId, userId));
  return query;
}

export function questionFor(jobId: string, questionId: string): CatalogQuestion | undefined {
  return getJob(jobId).questions.find(question => question.id === questionId);
}
