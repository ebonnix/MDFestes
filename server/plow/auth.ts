import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { SignJWT, jwtVerify } from "jose";
import type { Request, Response } from "express";
import { getSessionCookieOptions } from "../_core/cookies";

const scrypt = promisify(scryptCb) as (pw: string, salt: string, len: number) => Promise<Buffer>;

export const PLOW_COOKIE = "plow_session";
export const PLOW_UNAUTHED_MSG = "Plow login required (20001)";
export const PLOW_FORBIDDEN_MSG = "Admin access required (20002)";
const SESSION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export type PlowSession = { uid: number; role: "admin" | "driver"; name: string };

function secretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || "mdf-plow-dev-secret";
  return new TextEncoder().encode(secret);
}

// ---- Passwords (Node crypto scrypt; no extra dependency) ----
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, salt, hex] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hex) return false;
  const derived = await scrypt(password, salt, 64);
  const expected = Buffer.from(hex, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

// ---- Session JWT cookie ----
export async function signPlowSession(session: PlowSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + SESSION_MS) / 1000))
    .sign(secretKey());
}

export async function readPlowSession(req: Request): Promise<PlowSession | null> {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const match = raw.split(";").map(s => s.trim()).find(s => s.startsWith(`${PLOW_COOKIE}=`));
  if (!match) return null;
  const token = decodeURIComponent(match.slice(PLOW_COOKIE.length + 1));
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    const uid = Number(payload.uid);
    const role = payload.role;
    if (!uid || (role !== "admin" && role !== "driver")) return null;
    return { uid, role, name: String(payload.name ?? "") };
  } catch {
    return null;
  }
}

export function setPlowCookie(req: Request, res: Response, token: string) {
  const opts = getSessionCookieOptions(req);
  // sameSite "none" requires secure; on plain-http localhost use "lax"
  const sameSite = opts.secure ? "none" : "lax";
  res.cookie(PLOW_COOKIE, token, { ...opts, sameSite, maxAge: SESSION_MS });
}

export function clearPlowCookie(req: Request, res: Response) {
  const opts = getSessionCookieOptions(req);
  const sameSite = opts.secure ? "none" : "lax";
  res.clearCookie(PLOW_COOKIE, { ...opts, sameSite });
}
