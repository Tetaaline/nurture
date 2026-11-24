import { beforeEach, describe, expect, it, vi } from "vitest";

const queryRaw = vi.fn();

vi.mock("@/lib/prisma", () => ({ prisma: { $queryRaw: queryRaw } }));
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  connection: vi.fn().mockResolvedValue(undefined),
}));

const { GET } = await import("./route");

describe("GET /api/health", () => {
  beforeEach(() => {
    queryRaw.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns ok when the database answers", async () => {
    queryRaw.mockResolvedValue([{ 1: 1 }]);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({ status: "ok" });
  });

  it("returns 503 without error details when the database cannot be reached", async () => {
    queryRaw.mockRejectedValue(new Error("connect ETIMEDOUT 10.0.0.1:4000"));
    const response = await GET();
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({ status: "error" });
  });
});
