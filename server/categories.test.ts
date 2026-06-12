import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  getPublicReviews: vi.fn().mockResolvedValue([]),
  getAllReviews: vi.fn().mockResolvedValue([]),
  createReview: vi.fn().mockResolvedValue(undefined),
  deleteReview: vi.fn().mockResolvedValue(undefined),
  createContactSubmission: vi.fn().mockResolvedValue(undefined),
  getServiceImages: vi.fn().mockResolvedValue([]),
  getAllServiceImages: vi.fn().mockResolvedValue([]),
  addServiceImage: vi.fn().mockResolvedValue(undefined),
  deleteServiceImage: vi.fn().mockResolvedValue(undefined),
  setPrimaryServiceImage: vi.fn().mockResolvedValue(undefined),
  getServiceCategories: vi.fn().mockResolvedValue([
    { id: 1, serviceId: "roofing", name: "Roofing", description: "Roof repair", image: null, category: "construction", sortOrder: 0, createdAt: new Date() },
    { id: 2, serviceId: "snow-removal", name: "Snow Removal", description: null, image: null, category: "plowing", sortOrder: 1, createdAt: new Date() },
  ]),
  getServiceCategoriesByType: vi.fn().mockResolvedValue([
    { id: 1, serviceId: "roofing", name: "Roofing", description: "Roof repair", image: null, category: "construction", sortOrder: 0, createdAt: new Date() },
  ]),
  createServiceCategory: vi.fn().mockResolvedValue(undefined),
  updateServiceCategory: vi.fn().mockResolvedValue(undefined),
  deleteServiceCategory: vi.fn().mockResolvedValue(undefined),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

const ADMIN_PASSWORD = "9708895771";

describe("categories router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const caller = appRouter.createCaller(createPublicContext());

  describe("listPublic", () => {
    it("returns all categories without password", async () => {
      const result = await caller.categories.listPublic();
      expect(result).toHaveLength(2);
      expect(result[0].serviceId).toBe("roofing");
    });
  });

  describe("listByType", () => {
    it("filters by category type", async () => {
      const result = await caller.categories.listByType({ category: "construction" });
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("construction");
    });
  });

  describe("list (admin)", () => {
    it("returns categories with valid password", async () => {
      const result = await caller.categories.list({ password: ADMIN_PASSWORD });
      expect(result).toHaveLength(2);
    });

    it("rejects invalid password", async () => {
      await expect(caller.categories.list({ password: "wrong" })).rejects.toThrow("Invalid admin password");
    });
  });

  describe("create", () => {
    it("creates a category with valid password", async () => {
      const { createServiceCategory } = await import("./db");
      const result = await caller.categories.create({
        password: ADMIN_PASSWORD,
        serviceId: "painting",
        name: "Painting",
        description: "Interior and exterior painting",
        category: "construction",
        sortOrder: 5,
      });
      expect(result.success).toBe(true);
      expect(createServiceCategory).toHaveBeenCalledWith({
        serviceId: "painting",
        name: "Painting",
        description: "Interior and exterior painting",
        image: null,
        category: "construction",
        sortOrder: 5,
      });
    });

    it("rejects invalid password", async () => {
      await expect(caller.categories.create({
        password: "wrong",
        serviceId: "painting",
        name: "Painting",
        category: "construction",
      })).rejects.toThrow("Invalid admin password");
    });

    it("rejects empty name", async () => {
      await expect(caller.categories.create({
        password: ADMIN_PASSWORD,
        serviceId: "x",
        name: "",
        category: "construction",
      })).rejects.toThrow();
    });
  });

  describe("update", () => {
    it("updates a category with valid password", async () => {
      const { updateServiceCategory } = await import("./db");
      const result = await caller.categories.update({
        password: ADMIN_PASSWORD,
        id: 1,
        name: "Roofing & Gutters",
      });
      expect(result.success).toBe(true);
      expect(updateServiceCategory).toHaveBeenCalledWith(1, { name: "Roofing & Gutters" });
    });

    it("rejects invalid password", async () => {
      await expect(caller.categories.update({
        password: "wrong",
        id: 1,
        name: "Test",
      })).rejects.toThrow("Invalid admin password");
    });
  });

  describe("delete", () => {
    it("deletes a category with valid password", async () => {
      const { deleteServiceCategory } = await import("./db");
      const result = await caller.categories.delete({
        password: ADMIN_PASSWORD,
        id: 1,
      });
      expect(result.success).toBe(true);
      expect(deleteServiceCategory).toHaveBeenCalledWith(1);
    });

    it("rejects invalid password", async () => {
      await expect(caller.categories.delete({
        password: "wrong",
        id: 1,
      })).rejects.toThrow("Invalid admin password");
    });
  });
});
