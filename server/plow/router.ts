import { z } from "zod";
import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  plowUsers,
  plowProperties,
  plowRoutes,
  plowStops,
  plowProofs,
  type PlowUser,
} from "../../drizzle/schema";
import {
  PLOW_FORBIDDEN_MSG,
  PLOW_UNAUTHED_MSG,
  clearPlowCookie,
  hashPassword,
  setPlowCookie,
  signPlowSession,
  verifyPassword,
} from "./auth";
import { distanceMeters, geocodeAddress, nearestNeighborOrder, weatherSnapshot } from "./geo";
import { appBaseUrl, emailConfigured, sendProofEmail, sendProofSms, smsConfigured } from "./notify";
import { notifyOwner } from "../_core/notification";

const pub = publicProcedure;

async function db() {
  const d = await getDb();
  if (!d) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
  return d;
}

/** Any logged-in plow user (admin or driver). */
const plowProcedure = pub.use(async ({ ctx, next }) => {
  if (!ctx.plowUser) throw new TRPCError({ code: "UNAUTHORIZED", message: PLOW_UNAUTHED_MSG });
  return next({ ctx: { ...ctx, plowUser: ctx.plowUser } });
});
/** Owner / admin only. */
const plowAdminProcedure = plowProcedure.use(async ({ ctx, next }) => {
  if (ctx.plowUser.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: PLOW_FORBIDDEN_MSG });
  return next({ ctx });
});

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

function publicUser(u: PlowUser) {
  const { passwordHash: _ph, ...rest } = u;
  return rest;
}

function todayDenver(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Denver" }).format(new Date());
}

export const plowRouter = router({
  // ------------------------------------------------------------------ auth
  auth: router({
    /** Whether any admin exists yet (drives the first-run setup screen). */
    status: pub.query(async () => {
      const d = await db();
      const [row] = await d.select({ n: sql<number>`count(*)` }).from(plowUsers).where(eq(plowUsers.role, "admin"));
      return {
        needsSetup: Number(row?.n ?? 0) === 0,
        emailConfigured: emailConfigured(),
        smsConfigured: smsConfigured(),
        mapsKey: process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || null,
      };
    }),

    /** First-run: create the owner account. Guarded by the site ADMIN_PASSWORD. */
    setup: pub
      .input(z.object({
        sitePassword: z.string(),
        username: z.string().min(3).max(64).regex(/^[a-zA-Z0-9._-]+$/),
        password: z.string().min(6).max(200),
        name: z.string().min(1).max(255),
        phone: z.string().max(30).optional(),
        email: z.string().email().max(320).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const d = await db();
        const [row] = await d.select({ n: sql<number>`count(*)` }).from(plowUsers).where(eq(plowUsers.role, "admin"));
        if (Number(row?.n ?? 0) > 0) throw new TRPCError({ code: "BAD_REQUEST", message: "Admin already exists. Log in instead." });
        const sitePw = process.env.ADMIN_PASSWORD || "9708895771";
        if (input.sitePassword !== sitePw) throw new TRPCError({ code: "FORBIDDEN", message: "Site admin password is incorrect" });
        const passwordHash = await hashPassword(input.password);
        await d.insert(plowUsers).values({
          username: input.username.toLowerCase(),
          passwordHash,
          name: input.name,
          role: "admin",
          phone: input.phone || null,
          email: input.email || null,
        });
        const [u] = await d.select().from(plowUsers).where(eq(plowUsers.username, input.username.toLowerCase()));
        const token = await signPlowSession({ uid: u.id, role: u.role, name: u.name });
        setPlowCookie(ctx.req, ctx.res, token);
        return publicUser(u);
      }),

    login: pub
      .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const d = await db();
        const [u] = await d.select().from(plowUsers).where(eq(plowUsers.username, input.username.trim().toLowerCase()));
        if (!u || !(await verifyPassword(input.password, u.passwordHash))) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid username or password" });
        }
        if (!u.active) throw new TRPCError({ code: "FORBIDDEN", message: "This account is deactivated" });
        const token = await signPlowSession({ uid: u.id, role: u.role, name: u.name });
        setPlowCookie(ctx.req, ctx.res, token);
        return publicUser(u);
      }),

    logout: pub.mutation(({ ctx }) => {
      clearPlowCookie(ctx.req, ctx.res);
      return { success: true };
    }),

    me: pub.query(async ({ ctx }) => {
      if (!ctx.plowUser) return null;
      const d = await db();
      const [u] = await d.select().from(plowUsers).where(eq(plowUsers.id, ctx.plowUser.uid));
      return u && u.active ? publicUser(u) : null;
    }),

    changePassword: plowProcedure
      .input(z.object({ current: z.string(), next: z.string().min(6).max(200) }))
      .mutation(async ({ input, ctx }) => {
        const d = await db();
        const [u] = await d.select().from(plowUsers).where(eq(plowUsers.id, ctx.plowUser.uid));
        if (!u || !(await verifyPassword(input.current, u.passwordHash))) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect" });
        }
        await d.update(plowUsers).set({ passwordHash: await hashPassword(input.next) }).where(eq(plowUsers.id, u.id));
        return { success: true };
      }),
  }),

  // --------------------------------------------------------------- drivers
  drivers: router({
    list: plowAdminProcedure.query(async () => {
      const d = await db();
      const rows = await d.select().from(plowUsers).orderBy(desc(plowUsers.active), asc(plowUsers.name));
      return rows.map(publicUser);
    }),

    create: plowAdminProcedure
      .input(z.object({
        username: z.string().min(3).max(64).regex(/^[a-zA-Z0-9._-]+$/),
        password: z.string().min(6).max(200),
        name: z.string().min(1).max(255),
        phone: z.string().max(30).optional(),
        email: z.string().email().max(320).optional().or(z.literal("")),
        role: z.enum(["admin", "driver"]).default("driver"),
      }))
      .mutation(async ({ input }) => {
        const d = await db();
        const username = input.username.toLowerCase();
        const [exists] = await d.select({ id: plowUsers.id }).from(plowUsers).where(eq(plowUsers.username, username));
        if (exists) throw new TRPCError({ code: "CONFLICT", message: "That username is taken" });
        await d.insert(plowUsers).values({
          username,
          passwordHash: await hashPassword(input.password),
          name: input.name,
          role: input.role,
          phone: input.phone || null,
          email: input.email || null,
        });
        return { success: true };
      }),

    update: plowAdminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        phone: z.string().max(30).optional().nullable(),
        email: z.string().max(320).optional().nullable(),
        role: z.enum(["admin", "driver"]).optional(),
        active: z.boolean().optional(),
        newPassword: z.string().min(6).max(200).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const d = await db();
        const set: Record<string, unknown> = {};
        if (input.name !== undefined) set.name = input.name;
        if (input.phone !== undefined) set.phone = input.phone || null;
        if (input.email !== undefined) set.email = input.email || null;
        if (input.role !== undefined) set.role = input.role;
        if (input.active !== undefined) {
          if (!input.active && input.id === ctx.plowUser.uid) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "You can't deactivate your own account" });
          }
          set.active = input.active ? 1 : 0;
        }
        if (input.newPassword) set.passwordHash = await hashPassword(input.newPassword);
        if (Object.keys(set).length) await d.update(plowUsers).set(set).where(eq(plowUsers.id, input.id));
        return { success: true };
      }),

    /** Live positions of active drivers (admin map). */
    positions: plowAdminProcedure.query(async () => {
      const d = await db();
      const rows = await d
        .select({ id: plowUsers.id, name: plowUsers.name, lat: plowUsers.lastLat, lng: plowUsers.lastLng, lastSeenAt: plowUsers.lastSeenAt })
        .from(plowUsers)
        .where(eq(plowUsers.active, 1));
      return rows.filter(r => r.lat != null && r.lng != null);
    }),
  }),

  // ------------------------------------------------------------ properties
  properties: router({
    list: plowProcedure
      .input(z.object({ includeInactive: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        const d = await db();
        const q = d.select().from(plowProperties).orderBy(asc(plowProperties.priority), asc(plowProperties.ownerName));
        if (input?.includeInactive) return q;
        return q.where(eq(plowProperties.active, 1));
      }),

    create: plowAdminProcedure
      .input(z.object({
        ownerName: z.string().min(1).max(255),
        address: z.string().min(3).max(500),
        ownerEmail: z.string().email().max(320).optional().or(z.literal("")),
        ownerPhone: z.string().max(30).optional(),
        notifyEmail: z.boolean().default(true),
        notifySms: z.boolean().default(true),
        services: z.array(z.enum(["plow", "shovel", "salt", "sand"])).default(["plow"]),
        triggerDepth: z.number().min(0).max(36).default(2),
        priority: z.number().int().min(1).max(3).default(2),
        notes: z.string().max(2000).optional(),
        gateCode: z.string().max(100).optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const d = await db();
        let lat = input.lat ?? null;
        let lng = input.lng ?? null;
        let address = input.address.trim();
        if (lat == null || lng == null) {
          const g = await geocodeAddress(address);
          if (g) {
            lat = g.lat;
            lng = g.lng;
          }
        }
        await d.insert(plowProperties).values({
          ownerName: input.ownerName,
          address,
          lat,
          lng,
          ownerEmail: input.ownerEmail || null,
          ownerPhone: input.ownerPhone || null,
          notifyEmail: input.notifyEmail ? 1 : 0,
          notifySms: input.notifySms ? 1 : 0,
          services: input.services.join(","),
          triggerDepth: input.triggerDepth,
          priority: input.priority,
          notes: input.notes || null,
          gateCode: input.gateCode || null,
        });
        return { success: true, geocoded: lat != null };
      }),

    update: plowAdminProcedure
      .input(z.object({
        id: z.number(),
        ownerName: z.string().min(1).max(255).optional(),
        address: z.string().min(3).max(500).optional(),
        ownerEmail: z.string().max(320).optional().nullable(),
        ownerPhone: z.string().max(30).optional().nullable(),
        notifyEmail: z.boolean().optional(),
        notifySms: z.boolean().optional(),
        services: z.array(z.enum(["plow", "shovel", "salt", "sand"])).optional(),
        triggerDepth: z.number().min(0).max(36).optional(),
        priority: z.number().int().min(1).max(3).optional(),
        notes: z.string().max(2000).optional().nullable(),
        gateCode: z.string().max(100).optional().nullable(),
        active: z.boolean().optional(),
        lat: z.number().optional().nullable(),
        lng: z.number().optional().nullable(),
        regeocode: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const d = await db();
        const set: Record<string, unknown> = {};
        if (input.ownerName !== undefined) set.ownerName = input.ownerName;
        if (input.address !== undefined) set.address = input.address.trim();
        if (input.ownerEmail !== undefined) set.ownerEmail = input.ownerEmail || null;
        if (input.ownerPhone !== undefined) set.ownerPhone = input.ownerPhone || null;
        if (input.notifyEmail !== undefined) set.notifyEmail = input.notifyEmail ? 1 : 0;
        if (input.notifySms !== undefined) set.notifySms = input.notifySms ? 1 : 0;
        if (input.services !== undefined) set.services = input.services.join(",");
        if (input.triggerDepth !== undefined) set.triggerDepth = input.triggerDepth;
        if (input.priority !== undefined) set.priority = input.priority;
        if (input.notes !== undefined) set.notes = input.notes || null;
        if (input.gateCode !== undefined) set.gateCode = input.gateCode || null;
        if (input.active !== undefined) set.active = input.active ? 1 : 0;
        if (input.lat !== undefined) set.lat = input.lat;
        if (input.lng !== undefined) set.lng = input.lng;
        if ((input.address !== undefined || input.regeocode) && input.lat === undefined) {
          const [cur] = await d.select().from(plowProperties).where(eq(plowProperties.id, input.id));
          const g = await geocodeAddress((input.address ?? cur?.address ?? "").trim());
          if (g) {
            set.lat = g.lat;
            set.lng = g.lng;
          }
        }
        if (Object.keys(set).length) await d.update(plowProperties).set(set).where(eq(plowProperties.id, input.id));
        return { success: true };
      }),

    delete: plowAdminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const d = await db();
      // Soft delete keeps the service history intact for liability records
      await d.update(plowProperties).set({ active: 0 }).where(eq(plowProperties.id, input.id));
      return { success: true };
    }),

    /** Bulk import "Owner, Address, Email, Phone" lines. */
    importCsv: plowAdminProcedure
      .input(z.object({ csv: z.string().max(200000) }))
      .mutation(async ({ input }) => {
        const d = await db();
        const lines = input.csv.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        let added = 0;
        for (const line of lines) {
          const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
          if (cols.length < 2 || /^owner/i.test(cols[0])) continue;
          const [ownerName, address, ownerEmail, ownerPhone] = cols;
          const g = await geocodeAddress(address);
          await d.insert(plowProperties).values({
            ownerName,
            address,
            lat: g?.lat ?? null,
            lng: g?.lng ?? null,
            ownerEmail: ownerEmail || null,
            ownerPhone: ownerPhone || null,
          });
          added++;
          // Nominatim fair-use: ~1 request / second
          if (!process.env.GOOGLE_MAPS_API_KEY) await new Promise(r => setTimeout(r, 1100));
        }
        return { added };
      }),
  }),

  // ---------------------------------------------------------------- routes
  routes: router({
    /** Admin: all routes for a date with their stops. */
    forDate: plowAdminProcedure.input(z.object({ date: dateStr })).query(async ({ input }) => {
      const d = await db();
      const routes = await d.select().from(plowRoutes).where(eq(plowRoutes.serviceDate, input.date));
      if (!routes.length) return [];
      const stops = await d
        .select()
        .from(plowStops)
        .where(inArray(plowStops.routeId, routes.map(r => r.id)))
        .orderBy(asc(plowStops.sortOrder));
      return routes.map(r => ({ ...r, stops: stops.filter(s => s.routeId === r.id) }));
    }),

    /** Admin: create (or fetch) the route for a driver on a date. */
    ensure: plowAdminProcedure
      .input(z.object({ date: dateStr, driverId: z.number(), name: z.string().max(255).optional() }))
      .mutation(async ({ input }) => {
        const d = await db();
        const [existing] = await d
          .select()
          .from(plowRoutes)
          .where(and(eq(plowRoutes.serviceDate, input.date), eq(plowRoutes.driverId, input.driverId)));
        if (existing) return existing;
        await d.insert(plowRoutes).values({ serviceDate: input.date, driverId: input.driverId, name: input.name || null });
        const [created] = await d
          .select()
          .from(plowRoutes)
          .where(and(eq(plowRoutes.serviceDate, input.date), eq(plowRoutes.driverId, input.driverId)));
        return created;
      }),

    /** Admin: assign properties to a route (appends; skips duplicates). */
    addStops: plowAdminProcedure
      .input(z.object({ routeId: z.number(), propertyIds: z.array(z.number()).min(1) }))
      .mutation(async ({ input }) => {
        const d = await db();
        const existing = await d.select().from(plowStops).where(eq(plowStops.routeId, input.routeId));
        const have = new Set(existing.map(s => s.propertyId));
        let order = existing.length ? Math.max(...existing.map(s => s.sortOrder)) + 1 : 0;
        let added = 0;
        for (const pid of input.propertyIds) {
          if (have.has(pid)) continue;
          await d.insert(plowStops).values({ routeId: input.routeId, propertyId: pid, sortOrder: order++ });
          added++;
        }
        return { added };
      }),

    removeStop: plowAdminProcedure.input(z.object({ stopId: z.number() })).mutation(async ({ input }) => {
      const d = await db();
      await d.delete(plowStops).where(eq(plowStops.id, input.stopId));
      return { success: true };
    }),

    reorder: plowAdminProcedure
      .input(z.object({ routeId: z.number(), stopIds: z.array(z.number()) }))
      .mutation(async ({ input }) => {
        const d = await db();
        for (let i = 0; i < input.stopIds.length; i++) {
          await d.update(plowStops).set({ sortOrder: i }).where(and(eq(plowStops.id, input.stopIds[i]), eq(plowStops.routeId, input.routeId)));
        }
        return { success: true };
      }),

    /** Nearest-neighbour optimisation from a start point (driver GPS or first stop). */
    optimize: plowAdminProcedure
      .input(z.object({ routeId: z.number(), start: z.object({ lat: z.number(), lng: z.number() }).optional() }))
      .mutation(async ({ input }) => {
        const d = await db();
        const stops = await d.select().from(plowStops).where(eq(plowStops.routeId, input.routeId));
        if (!stops.length) return { success: true };
        const props = await d.select().from(plowProperties).where(inArray(plowProperties.id, stops.map(s => s.propertyId)));
        const joined = stops.map(s => {
          const p = props.find(pp => pp.id === s.propertyId);
          return { id: s.id, lat: p?.lat ?? null, lng: p?.lng ?? null, priority: p?.priority ?? 2 };
        });
        // High-priority stops first, each group nearest-neighbour ordered
        const hi = nearestNeighborOrder(joined.filter(j => j.priority === 1), input.start);
        const lastHi = hi.length ? { lat: hi[hi.length - 1].lat!, lng: hi[hi.length - 1].lng! } : input.start;
        const rest = nearestNeighborOrder(joined.filter(j => j.priority !== 1), lastHi);
        const ordered = [...hi, ...rest];
        for (let i = 0; i < ordered.length; i++) {
          await d.update(plowStops).set({ sortOrder: i }).where(eq(plowStops.id, ordered[i].id));
        }
        return { success: true };
      }),

    delete: plowAdminProcedure.input(z.object({ routeId: z.number() })).mutation(async ({ input }) => {
      const d = await db();
      await d.delete(plowStops).where(eq(plowStops.routeId, input.routeId));
      await d.delete(plowRoutes).where(eq(plowRoutes.id, input.routeId));
      return { success: true };
    }),

    /** Copy a date's routes to another date (storm day templates). */
    copyDay: plowAdminProcedure
      .input(z.object({ from: dateStr, to: dateStr }))
      .mutation(async ({ input }) => {
        const d = await db();
        const src = await d.select().from(plowRoutes).where(eq(plowRoutes.serviceDate, input.from));
        let copied = 0;
        for (const r of src) {
          const [exists] = await d.select().from(plowRoutes).where(and(eq(plowRoutes.serviceDate, input.to), eq(plowRoutes.driverId, r.driverId)));
          if (exists) continue;
          await d.insert(plowRoutes).values({ serviceDate: input.to, driverId: r.driverId, name: r.name });
          const [nr] = await d.select().from(plowRoutes).where(and(eq(plowRoutes.serviceDate, input.to), eq(plowRoutes.driverId, r.driverId)));
          const stops = await d.select().from(plowStops).where(eq(plowStops.routeId, r.id)).orderBy(asc(plowStops.sortOrder));
          for (const s of stops) {
            await d.insert(plowStops).values({ routeId: nr.id, propertyId: s.propertyId, sortOrder: s.sortOrder });
          }
          copied++;
        }
        return { copied };
      }),

    // ---- Driver side ----
    /** Driver: my route for a date (default today, Mountain Time) with property details + proofs. */
    mine: plowProcedure
      .input(z.object({ date: dateStr.optional() }).optional())
      .query(async ({ input, ctx }) => {
        const d = await db();
        const date = input?.date ?? todayDenver();
        const [route] = await d
          .select()
          .from(plowRoutes)
          .where(and(eq(plowRoutes.serviceDate, date), eq(plowRoutes.driverId, ctx.plowUser.uid)));
        if (!route) return { date, route: null, stops: [] };
        const stops = await d.select().from(plowStops).where(eq(plowStops.routeId, route.id)).orderBy(asc(plowStops.sortOrder));
        const props = stops.length
          ? await d.select().from(plowProperties).where(inArray(plowProperties.id, stops.map(s => s.propertyId)))
          : [];
        const proofs = stops.length
          ? await d.select().from(plowProofs).where(inArray(plowProofs.stopId, stops.map(s => s.id)))
          : [];
        return {
          date,
          route,
          stops: stops.map(s => ({
            ...s,
            property: props.find(p => p.id === s.propertyId)!,
            proofs: proofs.filter(p => p.stopId === s.id),
          })),
        };
      }),

    /** Driver: dates (last 14 / next 7 days) that have a route for me. */
    myDates: plowProcedure.query(async ({ ctx }) => {
      const d = await db();
      const rows = await d
        .select({ serviceDate: plowRoutes.serviceDate, status: plowRoutes.status })
        .from(plowRoutes)
        .where(eq(plowRoutes.driverId, ctx.plowUser.uid))
        .orderBy(desc(plowRoutes.serviceDate))
        .limit(30);
      return rows;
    }),

    start: plowProcedure.input(z.object({ routeId: z.number() })).mutation(async ({ input, ctx }) => {
      const d = await db();
      const [r] = await d.select().from(plowRoutes).where(eq(plowRoutes.id, input.routeId));
      if (!r || (r.driverId !== ctx.plowUser.uid && ctx.plowUser.role !== "admin")) throw new TRPCError({ code: "FORBIDDEN" });
      await d.update(plowRoutes).set({ status: "active", startedAt: r.startedAt ?? new Date() }).where(eq(plowRoutes.id, r.id));
      return { success: true };
    }),

    finish: plowProcedure.input(z.object({ routeId: z.number() })).mutation(async ({ input, ctx }) => {
      const d = await db();
      const [r] = await d.select().from(plowRoutes).where(eq(plowRoutes.id, input.routeId));
      if (!r || (r.driverId !== ctx.plowUser.uid && ctx.plowUser.role !== "admin")) throw new TRPCError({ code: "FORBIDDEN" });
      await d.update(plowRoutes).set({ status: "done", finishedAt: new Date() }).where(eq(plowRoutes.id, r.id));
      return { success: true };
    }),
  }),

  // ----------------------------------------------------------------- stops
  stops: router({
    /** Driver taps "I'm here" — records arrival time + status. */
    arrive: plowProcedure.input(z.object({ stopId: z.number() })).mutation(async ({ input, ctx }) => {
      const d = await db();
      await assertStopOwner(d, input.stopId, ctx.plowUser);
      await d.update(plowStops).set({ status: "arrived", arrivedAt: new Date() }).where(eq(plowStops.id, input.stopId));
      return { success: true };
    }),

    enRoute: plowProcedure.input(z.object({ stopId: z.number() })).mutation(async ({ input, ctx }) => {
      const d = await db();
      await assertStopOwner(d, input.stopId, ctx.plowUser);
      await d.update(plowStops).set({ status: "en_route" }).where(eq(plowStops.id, input.stopId));
      return { success: true };
    }),

    complete: plowProcedure
      .input(z.object({
        stopId: z.number(),
        services: z.array(z.enum(["plow", "shovel", "salt", "sand"])).optional(),
        saltQty: z.number().min(0).optional(),
        note: z.string().max(2000).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const d = await db();
        const stop = await assertStopOwner(d, input.stopId, ctx.plowUser);
        // Require at least one "after" proof photo before completing
        const [proof] = await d.select({ id: plowProofs.id }).from(plowProofs).where(and(eq(plowProofs.stopId, stop.id), eq(plowProofs.kind, "after")));
        if (!proof) throw new TRPCError({ code: "BAD_REQUEST", message: "Take a proof-of-plow photo before completing this stop" });
        await d
          .update(plowStops)
          .set({
            status: "done",
            completedAt: new Date(),
            services: input.services?.join(",") ?? stop.services,
            saltQty: input.saltQty ?? stop.saltQty,
            note: input.note ?? stop.note,
            arrivedAt: stop.arrivedAt ?? new Date(),
          })
          .where(eq(plowStops.id, stop.id));
        return { success: true };
      }),

    skip: plowProcedure
      .input(z.object({ stopId: z.number(), reason: z.string().min(1).max(255) }))
      .mutation(async ({ input, ctx }) => {
        const d = await db();
        await assertStopOwner(d, input.stopId, ctx.plowUser);
        await d.update(plowStops).set({ status: "skipped", skipReason: input.reason, completedAt: new Date() }).where(eq(plowStops.id, input.stopId));
        return { success: true };
      }),

    reopen: plowProcedure.input(z.object({ stopId: z.number() })).mutation(async ({ input, ctx }) => {
      const d = await db();
      await assertStopOwner(d, input.stopId, ctx.plowUser);
      await d.update(plowStops).set({ status: "pending", skipReason: null, completedAt: null }).where(eq(plowStops.id, input.stopId));
      return { success: true };
    }),
  }),

  // -------------------------------------------------------------- tracking
  tracking: router({
    /** Driver app posts its position every ~30s while a route is active. */
    ping: plowProcedure
      .input(z.object({ lat: z.number(), lng: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const d = await db();
        await d.update(plowUsers).set({ lastLat: input.lat, lastLng: input.lng, lastSeenAt: new Date() }).where(eq(plowUsers.id, ctx.plowUser.uid));
        return { success: true };
      }),
  }),

  // ---------------------------------------------------------------- proofs
  proofs: router({
    /**
     * Driver uploads the already-stamped JPEG (base64) with the GPS fix used
     * for the stamp. Server stores it, computes geofence distance, attaches a
     * weather snapshot, and messages the property owner.
     */
    submit: plowProcedure
      .input(z.object({
        stopId: z.number().optional(),
        propertyId: z.number(),
        kind: z.enum(["before", "after"]).default("after"),
        imageBase64: z.string().min(100), // data without the data: prefix
        lat: z.number().nullable(),
        lng: z.number().nullable(),
        accuracyM: z.number().nullable().optional(),
        locationSource: z.enum(["gps", "property", "manual"]).default("gps"),
        capturedAt: z.string().datetime().optional(), // ISO; defaults to now
        note: z.string().max(2000).optional(),
        notifyOwnerNow: z.boolean().default(true),
      }))
      .mutation(async ({ input, ctx }) => {
        const d = await db();
        const [property] = await d.select().from(plowProperties).where(eq(plowProperties.id, input.propertyId));
        if (!property) throw new TRPCError({ code: "NOT_FOUND", message: "Property not found" });
        if (input.stopId) await assertStopOwner(d, input.stopId, ctx.plowUser);

        const { storagePut } = await import("../storage");
        const buffer = Buffer.from(input.imageBase64, "base64");
        if (buffer.length > 12 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Photo too large" });
        const capturedAt = input.capturedAt ? new Date(input.capturedAt) : new Date();
        const stamp = capturedAt.toISOString().replace(/[:.]/g, "-");
        const key = `plow-proofs/${property.id}/${stamp}-${input.kind}.jpg`;
        const stored = await storagePut(key, buffer, "image/jpeg");

        const [driver] = await d.select().from(plowUsers).where(eq(plowUsers.id, ctx.plowUser.uid));
        const driverName = driver?.name ?? ctx.plowUser.name;

        let distance: number | null = null;
        if (input.lat != null && input.lng != null && property.lat != null && property.lng != null) {
          distance = Math.round(distanceMeters({ lat: input.lat, lng: input.lng }, { lat: property.lat, lng: property.lng }));
        }
        const wx = await weatherSnapshot({ lat: input.lat ?? property.lat ?? 40.3772, lng: input.lng ?? property.lng ?? -105.5217 });
        const token = randomBytes(12).toString("hex");

        await d.insert(plowProofs).values({
          token,
          stopId: input.stopId ?? null,
          propertyId: property.id,
          driverId: ctx.plowUser.uid,
          driverName,
          kind: input.kind,
          photoUrl: stored.url,
          photoKey: stored.key,
          lat: input.lat,
          lng: input.lng,
          accuracyM: input.accuracyM ?? null,
          locationSource: input.locationSource,
          distanceFromPropertyM: distance,
          address: property.address,
          capturedAt,
          weather: wx,
          note: input.note || null,
        });
        const [proof] = await d.select().from(plowProofs).where(eq(plowProofs.token, token));

        // Keep the live position fresh too
        if (input.lat != null && input.lng != null) {
          await d.update(plowUsers).set({ lastLat: input.lat, lastLng: input.lng, lastSeenAt: new Date() }).where(eq(plowUsers.id, ctx.plowUser.uid));
        }

        let delivery: { email?: string; sms?: string } = {};
        if (input.kind === "after" && input.notifyOwnerNow) {
          delivery = await deliverProof(d, proof.id, input.imageBase64);
        }
        return { proof, distanceFromPropertyM: distance, weather: wx, delivery, geofenceWarning: distance != null && distance > 150 };
      }),

    /** Admin (or driver who owns it): re-send the owner notification. */
    resend: plowProcedure.input(z.object({ proofId: z.number() })).mutation(async ({ input, ctx }) => {
      const d = await db();
      const [p] = await d.select().from(plowProofs).where(eq(plowProofs.id, input.proofId));
      if (!p) throw new TRPCError({ code: "NOT_FOUND" });
      if (ctx.plowUser.role !== "admin" && p.driverId !== ctx.plowUser.uid) throw new TRPCError({ code: "FORBIDDEN" });
      return deliverProof(d, p.id);
    }),

    /** Admin: proof log with filters. */
    list: plowAdminProcedure
      .input(z.object({
        from: dateStr.optional(),
        to: dateStr.optional(),
        propertyId: z.number().optional(),
        driverId: z.number().optional(),
        limit: z.number().int().min(1).max(500).default(200),
      }))
      .query(async ({ input }) => {
        const d = await db();
        const conds = [] as any[];
        if (input.from) conds.push(gte(plowProofs.capturedAt, new Date(`${input.from}T00:00:00-07:00`)));
        if (input.to) conds.push(lte(plowProofs.capturedAt, new Date(`${input.to}T23:59:59-07:00`)));
        if (input.propertyId) conds.push(eq(plowProofs.propertyId, input.propertyId));
        if (input.driverId) conds.push(eq(plowProofs.driverId, input.driverId));
        const rows = await d
          .select()
          .from(plowProofs)
          .where(conds.length ? and(...conds) : undefined)
          .orderBy(desc(plowProofs.capturedAt))
          .limit(input.limit);
        const stopIds = rows.map(r => r.stopId).filter((x): x is number => x != null);
        const stops = stopIds.length ? await d.select().from(plowStops).where(inArray(plowStops.id, stopIds)) : [];
        return rows.map(r => ({ ...r, stop: stops.find(s => s.id === r.stopId) ?? null }));
      }),

    /** Public: property owner opens the link from their text/email. */
    byToken: pub.input(z.object({ token: z.string().min(10).max(40) })).query(async ({ input }) => {
      const d = await db();
      const [p] = await d.select().from(plowProofs).where(eq(plowProofs.token, input.token));
      if (!p) throw new TRPCError({ code: "NOT_FOUND", message: "Service record not found" });
      const [stop] = p.stopId ? await d.select().from(plowStops).where(eq(plowStops.id, p.stopId)) : [];
      // Any companion photos (before/after) for the same stop
      const siblings = p.stopId ? await d.select().from(plowProofs).where(eq(plowProofs.stopId, p.stopId)).orderBy(asc(plowProofs.capturedAt)) : [p];
      return {
        address: p.address,
        driverName: p.driverName,
        capturedAt: p.capturedAt,
        lat: p.lat,
        lng: p.lng,
        weather: p.weather,
        services: stop?.services ?? null,
        saltQty: stop?.saltQty ?? null,
        note: stop?.note ?? null,
        arrivedAt: stop?.arrivedAt ?? null,
        completedAt: stop?.completedAt ?? null,
        photos: siblings.map(s => ({ kind: s.kind, url: s.photoUrl, capturedAt: s.capturedAt })),
      };
    }),
  }),
});

// ---------------------------------------------------------------- helpers

async function assertStopOwner(d: Awaited<ReturnType<typeof db>>, stopId: number, user: { uid: number; role: string }) {
  const [stop] = await d.select().from(plowStops).where(eq(plowStops.id, stopId));
  if (!stop) throw new TRPCError({ code: "NOT_FOUND", message: "Stop not found" });
  if (user.role !== "admin") {
    const [route] = await d.select().from(plowRoutes).where(eq(plowRoutes.id, stop.routeId));
    if (!route || route.driverId !== user.uid) throw new TRPCError({ code: "FORBIDDEN", message: "Not your stop" });
  }
  return stop;
}

async function deliverProof(d: Awaited<ReturnType<typeof db>>, proofId: number, photoBase64?: string) {
  const [p] = await d.select().from(plowProofs).where(eq(plowProofs.id, proofId));
  if (!p) return {};
  const [property] = await d.select().from(plowProperties).where(eq(plowProperties.id, p.propertyId));
  const [stop] = p.stopId ? await d.select().from(plowStops).where(eq(plowStops.id, p.stopId)) : [];
  if (!property) return {};
  const base = appBaseUrl();
  const msg = {
    ownerName: property.ownerName,
    address: p.address,
    driverName: p.driverName,
    capturedAt: p.capturedAt,
    lat: p.lat,
    lng: p.lng,
    services: stop?.services ?? property.services,
    weather: p.weather,
    proofUrl: `${base}/plow/proof/${p.token}`,
    photoUrl: p.photoUrl.startsWith("http") ? p.photoUrl : `${base}${p.photoUrl}`,
    photoBase64,
  };
  const out: { email?: string; sms?: string } = {};
  const errors: string[] = [];
  if (property.notifyEmail && property.ownerEmail) {
    const r = await sendProofEmail(property.ownerEmail, msg);
    out.email = r.ok ? "sent" : r.skipped ? "not configured" : `failed: ${r.error}`;
    if (r.ok) await d.update(plowProofs).set({ emailSentAt: new Date() }).where(eq(plowProofs.id, p.id));
    else if (!r.skipped) errors.push(`email: ${r.error}`);
  }
  if (property.notifySms && property.ownerPhone) {
    const r = await sendProofSms(property.ownerPhone, msg);
    out.sms = r.ok ? "sent" : r.skipped ? "not configured" : `failed: ${r.error}`;
    if (r.ok) await d.update(plowProofs).set({ smsSentAt: new Date() }).where(eq(plowProofs.id, p.id));
    else if (!r.skipped) errors.push(`sms: ${r.error}`);
  }
  if (errors.length) await d.update(plowProofs).set({ deliveryError: errors.join("; ") }).where(eq(plowProofs.id, p.id));
  // Also ping the business owner through the existing channel (non-fatal)
  try {
    await notifyOwner({
      title: `Plowed: ${p.address}`,
      content: `${p.driverName} completed ${p.address} at ${p.capturedAt.toLocaleString("en-US", { timeZone: "America/Denver" })}. ${msg.proofUrl}`,
    });
  } catch {
    /* ignore */
  }
  return out;
}
