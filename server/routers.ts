import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getPublicReviews, getAllReviews, createReview, deleteReview, createContactSubmission, getServiceImages, getAllServiceImages, addServiceImage, deleteServiceImage, setPrimaryServiceImage } from "./db";
import { notifyOwner } from "./_core/notification";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "9708895771";

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

  // --- Admin: Service Image Management ---
  serviceImages: router({
    // Public endpoint: get primary image for a service (no auth needed)
    getPublic: publicProcedure
      .input(z.object({ serviceId: z.string() }))
      .query(async ({ input }) => {
        const images = await getServiceImages(input.serviceId);
        const primary = images.find(img => img.isPrimary === 1);
        return primary ? { imageUrl: primary.imageUrl } : null;
      }),

    // Public endpoint: get all custom images for all services
    getAllPublic: publicProcedure.query(async () => {
      const images = await getAllServiceImages();
      // Return a map of serviceId -> primary image URL
      const map: Record<string, string> = {};
      for (const img of images) {
        if (img.isPrimary === 1) {
          map[img.serviceId] = img.imageUrl;
        }
      }
      return map;
    }),

    list: publicProcedure
      .input(z.object({ password: z.string(), serviceId: z.string().optional() }))
      .query(async ({ input }) => {
        if (input.password !== ADMIN_PASSWORD) {
          throw new Error("Invalid admin password");
        }
        if (input.serviceId) {
          return getServiceImages(input.serviceId);
        }
        return getAllServiceImages();
      }),

    add: publicProcedure
      .input(z.object({
        password: z.string(),
        serviceId: z.string().min(1).max(100),
        fileName: z.string().max(255),
        contentType: z.string().max(100),
        fileData: z.string(), // base64
        isPrimary: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        if (input.password !== ADMIN_PASSWORD) {
          throw new Error("Invalid admin password");
        }
        const { storagePut } = await import("./storage");
        const buffer = Buffer.from(input.fileData, "base64");
        const key = `service-images/${input.serviceId}/${Date.now()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const result = await storagePut(key, buffer, input.contentType);
        await addServiceImage({
          serviceId: input.serviceId,
          imageUrl: result.url,
          imageKey: result.key,
          isPrimary: input.isPrimary ? 1 : 0,
        });
        return { success: true, url: result.url };
      }),

    delete: publicProcedure
      .input(z.object({
        password: z.string(),
        id: z.number(),
      }))
      .mutation(async ({ input }) => {
        if (input.password !== ADMIN_PASSWORD) {
          throw new Error("Invalid admin password");
        }
        await deleteServiceImage(input.id);
        return { success: true };
      }),

    setPrimary: publicProcedure
      .input(z.object({
        password: z.string(),
        id: z.number(),
        serviceId: z.string(),
      }))
      .mutation(async ({ input }) => {
        if (input.password !== ADMIN_PASSWORD) {
          throw new Error("Invalid admin password");
        }
        await setPrimaryServiceImage(input.id, input.serviceId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
