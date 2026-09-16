import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { analyzeCvText, CV_MAX_BYTES, CV_MIME_TYPES, extractCvText } from "./cv";
import { evaluateInterviewAnswer } from "./interview";

const uploadInput = z.object({
  filename: z.string().min(1).max(180),
  mimeType: z.enum(CV_MIME_TYPES),
  data: z.string().min(16).max(14_000_000),
  targetJob: z.string().trim().min(2).max(120),
});

function safeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(-140);
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  cv: router({
    uploadAndAnalyze: publicProcedure.input(uploadInput).mutation(async ({ input, ctx }) => {
      let buffer: Buffer;
      try {
        buffer = Buffer.from(input.data, "base64");
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST", message: "تعذر قراءة الملف المرفوع." });
      }
      if (!buffer.length || buffer.length > CV_MAX_BYTES) {
        throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "حجم الملف يجب ألا يتجاوز 10MB." });
      }
      let extractedText = "";
      try {
        extractedText = await extractCvText(buffer, input.mimeType, input.filename);
      } catch (error) {
        const message = error instanceof Error ? error.message : "تعذر استخراج النص من الملف.";
        throw new TRPCError({ code: "BAD_REQUEST", message });
      }
      if (extractedText.length < 30) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "لم نتمكن من استخراج نص كافٍ. إذا كانت السيرة صورة ممسوحة ضوئيًا، استخدم نسخة قابلة لتحديد النص." });
      }
      const ownerKey = ctx.user?.openId ?? "guest";
      const stored = await storagePut(`cv-uploads/${ownerKey}/${Date.now()}-${safeFilename(input.filename)}`, buffer, input.mimeType);
      const analysis = analyzeCvText(extractedText, input.targetJob);
      return { ...analysis, filename: input.filename, fileUrl: stored.url, fileKey: stored.key, targetJob: input.targetJob, extractedText: extractedText.slice(0, 60_000) };
    }),
  }),
  interview: router({
    evaluateAnswer: publicProcedure.input(z.object({ question: z.number().int().min(1).max(3), answer: z.string().max(12_000), targetJob: z.string().trim().min(2).max(120) })).mutation(({ input }) => {
      if (!input.answer.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: "اكتب إجابة قبل إرسالها." });
      return evaluateInterviewAnswer(input.question as 1 | 2 | 3, input.answer, input.targetJob);
    }),
  }),
});

export type AppRouter = typeof appRouter;
