import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  getPublicReviews: vi.fn().mockResolvedValue([
    { id: 1, name: "John", rating: 5, text: "Great work!", service: "Decks", isPrePopulated: 1, createdAt: new Date() },
    { id: 2, name: "Jane", rating: 5, text: "Excellent service", service: "Plowing", isPrePopulated: 1, createdAt: new Date() },
  ]),
  getAllReviews: vi.fn().mockResolvedValue([
    { id: 1, name: "John", rating: 5, text: "Great work!", service: "Decks", isPrePopulated: 1, createdAt: new Date() },
    { id: 2, name: "Jane", rating: 5, text: "Excellent service", service: "Plowing", isPrePopulated: 1, createdAt: new Date() },
  ]),
  createReview: vi.fn().mockResolvedValue(undefined),
  deleteReview: vi.fn().mockResolvedValue(undefined),
  createContactSubmission: vi.fn().mockResolvedValue(undefined),
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

describe("reviews router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists public reviews", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.reviews.list();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("John");
  });

  it("submits a new review", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.reviews.submit({
      name: "Test User",
      rating: 5,
      text: "Amazing work on our deck!",
      service: "Decks",
    });
    expect(result).toEqual({ success: true });
  });

  it("rejects review submission with invalid rating", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.reviews.submit({
        name: "Test",
        rating: 6,
        text: "Good",
      })
    ).rejects.toThrow();
  });

  it("admin list requires correct password", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.reviews.adminList({ password: "wrong" })
    ).rejects.toThrow("Invalid admin password");
  });

  it("admin list works with correct password", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const adminPw = process.env.ADMIN_PASSWORD || "mdf2024admin";
    const result = await caller.reviews.adminList({ password: adminPw });
    expect(result).toHaveLength(2);
  });

  it("admin can delete a review with correct password", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const adminPw = process.env.ADMIN_PASSWORD || "mdf2024admin";
    const result = await caller.reviews.delete({ id: 1, password: adminPw });
    expect(result).toEqual({ success: true });
  });

  it("admin delete fails with wrong password", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.reviews.delete({ id: 1, password: "wrong" })
    ).rejects.toThrow("Invalid admin password");
  });
});

describe("contact router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits a contact form", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.contact.submit({
      name: "Bob",
      email: "bob@example.com",
      phone: "970-555-1234",
      message: "I need a new deck built.",
      service: "Decks",
    });
    expect(result).toEqual({ success: true });
  });

  it("rejects contact form with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.contact.submit({
        name: "Bob",
        email: "not-an-email",
        message: "Test",
      })
    ).rejects.toThrow();
  });

  it("rejects contact form with empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.contact.submit({
        name: "",
        email: "bob@example.com",
        message: "Test",
      })
    ).rejects.toThrow();
  });
});
