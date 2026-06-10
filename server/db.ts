import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, reviews, contactSubmissions, serviceImages, InsertReview, InsertContactSubmission, InsertServiceImage } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// --- Reviews ---

export async function getPublicReviews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).orderBy(desc(reviews.createdAt));
}

export async function getAllReviews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).orderBy(desc(reviews.createdAt));
}

export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(reviews).values(data);
}

export async function deleteReview(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(reviews).where(eq(reviews.id, id));
}

// --- Contact Submissions ---

export async function createContactSubmission(data: InsertContactSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactSubmissions).values(data);
}

// --- Service Images ---

export async function getServiceImages(serviceId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(serviceImages).where(eq(serviceImages.serviceId, serviceId)).orderBy(desc(serviceImages.isPrimary), desc(serviceImages.createdAt));
}

export async function getAllServiceImages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(serviceImages).orderBy(desc(serviceImages.createdAt));
}

export async function addServiceImage(data: InsertServiceImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(serviceImages).values(data);
}

export async function deleteServiceImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(serviceImages).where(eq(serviceImages.id, id));
}

export async function setPrimaryServiceImage(id: number, serviceId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Remove primary from all images of this service
  await db.update(serviceImages).set({ isPrimary: 0 }).where(eq(serviceImages.serviceId, serviceId));
  // Set new primary
  await db.update(serviceImages).set({ isPrimary: 1 }).where(eq(serviceImages.id, id));
}
