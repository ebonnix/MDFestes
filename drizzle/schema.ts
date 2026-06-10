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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  rating: int("rating").notNull(),
  text: text("text").notNull(),
  service: varchar("service", { length: 255 }),
  isPrePopulated: int("isPrePopulated").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  message: text("message").notNull(),
  service: varchar("service", { length: 255 }),
  address: varchar("address", { length: 500 }),
  photoUrl: varchar("photoUrl", { length: 1000 }),
  photoKey: varchar("photoKey", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

export const serviceImages = mysqlTable("service_images", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: varchar("serviceId", { length: 100 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 1000 }).notNull(),
  imageKey: varchar("imageKey", { length: 500 }),
  isPrimary: int("isPrimary").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ServiceImage = typeof serviceImages.$inferSelect;
export type InsertServiceImage = typeof serviceImages.$inferInsert;
