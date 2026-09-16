import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const interviewJobs = mysqlTable("interview_jobs", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  icon: varchar("icon", { length: 40 }).notNull(),
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const interviewQuestions = mysqlTable("interview_questions", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId"),
  interviewType: varchar("interviewType", { length: 40 }).notNull(),
  prompt: text("prompt").notNull(),
  referenceAnswer: text("referenceAnswer").notNull(),
  criteria: text("criteria").notNull(),
  difficulty: varchar("difficulty", { length: 20 }).default("متوسط").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const interviewSessions = mysqlTable("interview_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  jobId: int("jobId").notNull(),
  interviewType: varchar("interviewType", { length: 40 }).notNull(),
  questionIds: text("questionIds").notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  totalScore: int("totalScore"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export const interviewAnswers = mysqlTable("interview_answers", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  questionId: varchar("questionId", { length: 80 }).notNull(),
  answer: text("answer").notNull(),
  score: int("score").notNull(),
  feedback: text("feedback").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type InterviewJob = typeof interviewJobs.$inferSelect;
export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
export type InterviewSession = typeof interviewSessions.$inferSelect;
