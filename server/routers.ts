import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getPublicReviews, getAllReviews, createReview, deleteReview, createContactSubmission } from "./db";
import { notifyOwner } from "./_core/notification";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mdf2024admin";

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

  reviews: router({
    list: publicProcedure.query(async () => {
      return getPublicReviews();
    }),

    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        rating: z.number().int().min(1).max(5),
        text: z.string().min(1).max(2000),
        service: z.string().max(255).optional(),
      }))
      .mutation(async ({ input }) => {
        await createReview({
          name: input.name,
          rating: input.rating,
          text: input.text,
          service: input.service || null,
          isPrePopulated: 0,
        });
        // Notify owner of new review
        await notifyOwner({
          title: "New Review Submitted",
          content: `${input.name} left a ${input.rating}-star review: "${input.text.substring(0, 100)}..."`,
        });
        return { success: true };
      }),

    adminList: publicProcedure
      .input(z.object({ password: z.string() }))
      .query(async ({ input }) => {
        if (input.password !== ADMIN_PASSWORD) {
          throw new Error("Invalid admin password");
        }
        return getAllReviews();
      }),

    adminAdd: publicProcedure
      .input(z.object({
        password: z.string(),
        name: z.string().min(1).max(255),
        rating: z.number().int().min(1).max(5),
        text: z.string().min(1).max(2000),
        service: z.string().max(255).optional(),
      }))
      .mutation(async ({ input }) => {
        if (input.password !== ADMIN_PASSWORD) {
          throw new Error("Invalid admin password");
        }
        await createReview({
          name: input.name,
          rating: input.rating,
          text: input.text,
          service: input.service || null,
          isPrePopulated: 0,
        });
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({
        id: z.number(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        if (input.password !== ADMIN_PASSWORD) {
          throw new Error("Invalid admin password");
        }
        await deleteReview(input.id);
        return { success: true };
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        phone: z.string().max(30).optional(),
        message: z.string().min(1).max(5000),
        service: z.string().max(255).optional(),
        address: z.string().max(500).optional(),
        photoUrl: z.string().max(1000).optional(),
        photoKey: z.string().max(500).optional(),
      }))
      .mutation(async ({ input }) => {
        await createContactSubmission({
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          message: input.message,
          service: input.service || null,
          address: input.address || null,
          photoUrl: input.photoUrl || null,
          photoKey: input.photoKey || null,
        });
        // Notify owner
        await notifyOwner({
          title: "New Bid Request Submitted",
          content: `From: ${input.name} (${input.email})\nPhone: ${input.phone || "N/A"}\nService: ${input.service || "N/A"}\nAddress: ${input.address || "N/A"}\nPhoto: ${input.photoUrl ? "Yes" : "No"}\n\nMessage: ${input.message.substring(0, 200)}`,
        });
        return { success: true };
      }),

    uploadPhoto: publicProcedure
      .input(z.object({
        fileName: z.string().max(255),
        contentType: z.string().max(100),
        fileData: z.string(), // base64
      }))
      .mutation(async ({ input }) => {
        const { storagePut } = await import("./storage");
        const buffer = Buffer.from(input.fileData, "base64");
        const key = `bid-photos/${Date.now()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const result = await storagePut(key, buffer, input.contentType);
        return { url: result.url, key: result.key };
      }),
  }),
});

export type AppRouter = typeof appRouter;
