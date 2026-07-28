/**
 * Storage helpers backed by the application database (no external S3/AWS).
 * Uploaded bytes are stored in the `storage_objects` table and streamed back
 * out through the /mdf-storage/* proxy. This keeps everything on Railway with
 * no extra services or credentials to configure.
 */
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { storageObjects } from "../drizzle/schema";

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

function toBuffer(data: Buffer | Uint8Array | string): Buffer {
  if (Buffer.isBuffer(data)) return data;
  if (typeof data === "string") return Buffer.from(data);
  return Buffer.from(data);
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const db = await getDb();
  if (!db) {
    throw new Error("Storage unavailable: database (DATABASE_URL) is not configured");
  }
  const key = appendHashSuffix(normalizeKey(relKey));
  const body = toBuffer(data);

  // Cap at ~16MB to stay within typical MySQL max_allowed_packet limits.
  if (body.length > 16 * 1024 * 1024) {
    throw new Error("File too large: images must be 16MB or smaller");
  }

  await db.insert(storageObjects).values({ key, data: body, contentType });

  return { key, url: `/mdf-storage/${key}` };
}

/**
 * Fetch a stored object's bytes + content type by key. Returns null if the
 * database is unavailable or the key does not exist.
 */
export async function storageGetObject(
  relKey: string
): Promise<{ data: Buffer; contentType: string } | null> {
  const db = await getDb();
  if (!db) return null;
  const key = normalizeKey(relKey);
  const rows = await db
    .select()
    .from(storageObjects)
    .where(eq(storageObjects.key, key))
    .limit(1);
  if (rows.length === 0) return null;
  const row = rows[0];
  const data = Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data as Uint8Array);
  return { data, contentType: row.contentType || "application/octet-stream" };
}
