import { customType, double, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// Large binary column. Defined via customType because some drizzle-orm builds
// don't export a `longblob` helper; dataType() emits the raw MySQL type.
const longblob = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "longblob";
  },
});

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

export const serviceCategories = mysqlTable("service_categories", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: varchar("serviceId", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  image: varchar("image", { length: 1000 }),
  category: mysqlEnum("category", ["construction", "plowing"]).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = typeof serviceCategories.$inferInsert;

// Binary object storage kept in the database itself (no external S3/AWS needed).
// storagePut() inserts here; the /mdf-storage/* proxy streams the bytes back.
export const storageObjects = mysqlTable("storage_objects", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 512 }).notNull().unique(),
  data: longblob("data").notNull(),
  contentType: varchar("contentType", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StorageObject = typeof storageObjects.$inferSelect;
export type InsertStorageObject = typeof storageObjects.$inferInsert;

// Simple key/value store for editable site settings (e.g. social page URLs).
export const siteSettings = mysqlTable("site_settings", {
  settingKey: varchar("settingKey", { length: 100 }).primaryKey(),
  settingValue: text("settingValue"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

// =====================================================================
// PlowOps — snow plowing dispatch / proof-of-service module (/plow/*)
// =====================================================================

// Owner/admin and driver accounts. Separate from the Manus OAuth `users`
// table: these log in with username + password and get a `plow_session`
// cookie.
export const plowUsers = mysqlTable("plow_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["admin", "driver"]).default("driver").notNull(),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 320 }),
  active: int("active").default(1).notNull(),
  // Live GPS tracking (updated by the driver app while a route is active)
  lastLat: double("lastLat"),
  lastLng: double("lastLng"),
  lastSeenAt: timestamp("lastSeenAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type PlowUser = typeof plowUsers.$inferSelect;
export type InsertPlowUser = typeof plowUsers.$inferInsert;

// Serviced properties (customers). Geocoded once on create/edit.
export const plowProperties = mysqlTable("plow_properties", {
  id: int("id").autoincrement().primaryKey(),
  ownerName: varchar("ownerName", { length: 255 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  lat: double("lat"),
  lng: double("lng"),
  ownerEmail: varchar("ownerEmail", { length: 320 }),
  ownerPhone: varchar("ownerPhone", { length: 30 }),
  notifyEmail: int("notifyEmail").default(1).notNull(),
  notifySms: int("notifySms").default(1).notNull(),
  // Comma-separated default services: plow,shovel,salt,sand
  services: varchar("services", { length: 100 }).default("plow").notNull(),
  // Snow depth (inches) that triggers service; informational for dispatch
  triggerDepth: double("triggerDepth").default(2),
  priority: int("priority").default(2).notNull(), // 1 = high, 2 = normal, 3 = low
  notes: text("notes"),
  gateCode: varchar("gateCode", { length: 100 }),
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type PlowProperty = typeof plowProperties.$inferSelect;
export type InsertPlowProperty = typeof plowProperties.$inferInsert;

// A route = one driver's ordered list of stops for one service date.
export const plowRoutes = mysqlTable("plow_routes", {
  id: int("id").autoincrement().primaryKey(),
  serviceDate: varchar("serviceDate", { length: 10 }).notNull(), // YYYY-MM-DD
  driverId: int("driverId").notNull(),
  name: varchar("name", { length: 255 }),
  status: mysqlEnum("status", ["planned", "active", "done"]).default("planned").notNull(),
  startedAt: timestamp("startedAt"),
  finishedAt: timestamp("finishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type PlowRoute = typeof plowRoutes.$inferSelect;
export type InsertPlowRoute = typeof plowRoutes.$inferInsert;

export const plowStops = mysqlTable("plow_stops", {
  id: int("id").autoincrement().primaryKey(),
  routeId: int("routeId").notNull(),
  propertyId: int("propertyId").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "en_route", "arrived", "done", "skipped"]).default("pending").notNull(),
  services: varchar("services", { length: 100 }), // services actually performed
  saltQty: double("saltQty"), // lbs / bags of material used
  arrivedAt: timestamp("arrivedAt"),
  completedAt: timestamp("completedAt"),
  skipReason: varchar("skipReason", { length: 255 }),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type PlowStop = typeof plowStops.$inferSelect;
export type InsertPlowStop = typeof plowStops.$inferInsert;

// Proof-of-service photo. The image stored at photoKey already carries the
// burned-in stamp (address / lat,lng / date time / driver) in its bottom-right.
export const plowProofs = mysqlTable("plow_proofs", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 40 }).notNull().unique(), // public share link id
  stopId: int("stopId"),
  propertyId: int("propertyId").notNull(),
  driverId: int("driverId").notNull(),
  driverName: varchar("driverName", { length: 255 }).notNull(),
  kind: mysqlEnum("kind", ["before", "after"]).default("after").notNull(),
  photoUrl: varchar("photoUrl", { length: 1000 }).notNull(),
  photoKey: varchar("photoKey", { length: 500 }).notNull(),
  lat: double("lat"),
  lng: double("lng"),
  accuracyM: double("accuracyM"),
  // "gps" = device GPS; "property" = fell back to geocoded property location;
  // "manual" = typed in by driver
  locationSource: varchar("locationSource", { length: 20 }).default("gps").notNull(),
  distanceFromPropertyM: double("distanceFromPropertyM"),
  address: varchar("address", { length: 500 }).notNull(),
  capturedAt: timestamp("capturedAt").notNull(),
  weather: varchar("weather", { length: 255 }), // e.g. "24°F, snow 0.3 in/h"
  note: text("note"),
  emailSentAt: timestamp("emailSentAt"),
  smsSentAt: timestamp("smsSentAt"),
  deliveryError: text("deliveryError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PlowProof = typeof plowProofs.$inferSelect;
export type InsertPlowProof = typeof plowProofs.$inferInsert;
