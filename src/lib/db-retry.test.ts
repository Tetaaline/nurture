import { describe, expect, it, vi } from "vitest";
import { isPoolTimeoutError, retryOnPoolTimeout } from "./db-retry";

const prismaPoolTimeout = Object.assign(
  new Error(
    "Database error. Code: `45028`. Message: `pool timeout: failed to retrieve a connection from pool after 10001ms (pool connections: active=0 idle=0 limit=3)`",
  ),
  { code: "P2039" },
);
const adapterPoolTimeout = Object.assign(new Error("DriverAdapterError"), {
  cause: { originalCode: "45028", originalMessage: "pool timeout" },
});
const driverPoolTimeout = Object.assign(new Error("pool timeout"), { errno: 45028 });
const uniqueViolation = Object.assign(new Error("Unique constraint failed"), { code: "P2002" });
const otherDriverError = Object.assign(new Error("Database error. Code: `1045`."), {
  code: "P2039",
});

describe("isPoolTimeoutError", () => {
  it("recognises the pool timeout however it is wrapped", () => {
    expect(isPoolTimeoutError(prismaPoolTimeout)).toBe(true);
    expect(isPoolTimeoutError(adapterPoolTimeout)).toBe(true);
    expect(isPoolTimeoutError(driverPoolTimeout)).toBe(true);
    expect(isPoolTimeoutError(new Error("outer", { cause: driverPoolTimeout }))).toBe(true);
  });

  it("ignores every other error", () => {
    expect(isPoolTimeoutError(uniqueViolation)).toBe(false);
    expect(isPoolTimeoutError(otherDriverError)).toBe(false);
    expect(isPoolTimeoutError(new Error("45028"))).toBe(false);
    expect(isPoolTimeoutError(null)).toBe(false);
    expect(isPoolTimeoutError("45028")).toBe(false);
  });
});

describe("retryOnPoolTimeout", () => {
  it("returns the result without retrying when the first try works", async () => {
    const operation = vi.fn().mockResolvedValue("ok");
    await expect(retryOnPoolTimeout(operation, 0)).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it("retries once after a pool timeout", async () => {
    const operation = vi.fn().mockRejectedValueOnce(prismaPoolTimeout).mockResolvedValue("ok");
    await expect(retryOnPoolTimeout(operation, 0)).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("gives up after the second pool timeout", async () => {
    const operation = vi.fn().mockRejectedValue(prismaPoolTimeout);
    await expect(retryOnPoolTimeout(operation, 0)).rejects.toBe(prismaPoolTimeout);
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("does not retry or hide other errors", async () => {
    const operation = vi.fn().mockRejectedValue(uniqueViolation);
    await expect(retryOnPoolTimeout(operation, 0)).rejects.toBe(uniqueViolation);
    expect(operation).toHaveBeenCalledTimes(1);
  });
});
