import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDb } from "@/test/fake-prisma";
import { HttpError } from "./http";
import {
  CODE_TTL_MS,
  INVALID_CODE_MESSAGE,
  RateLimitedError,
  createInviteCode,
  generateCode,
  getActiveCode,
  hashCode,
  normalizeCode,
  redeemInviteCode,
  revokeInviteCode,
} from "./invite";

vi.mock("./prisma", async () => ({ prisma: (await import("@/test/fake-prisma")).fakeDb.prisma }));
vi.mock("@generated/prisma/client", () => ({
  Prisma: { PrismaClientKnownRequestError: class extends Error { code = ""; } },
}));

const SECRET = "test-secret-not-real";
const START = new Date("2026-03-02T08:00:00Z");
const MINUTE = 60_000;
const CODE_FORMAT = /^[A-HJ-NP-Z2-9]{8}$/;

async function seedFamily() {
  const parent = await fakeDb.prisma.user.create({ data: { displayName: "Grace", role: "PARENT" } });
  const teen = await fakeDb.prisma.user.create({ data: { displayName: "Keza", role: "TEEN" } });
  const otherTeen = await fakeDb.prisma.user.create({ data: { displayName: "Mugisha", role: "TEEN" } });
  const family = await fakeDb.prisma.family.create({ data: { parentId: parent.id } });
  return {
    parentId: parent.id as string,
    teenId: teen.id as string,
    otherTeenId: otherTeen.id as string,
    familyId: family.id as string,
  };
}

function wrongCode(code: string) {
  return code.startsWith("A") ? `B${code.slice(1)}` : `A${code.slice(1)}`;
}

function familyTeen(familyId: string) {
  return fakeDb.tables.family.find((f) => f.id === familyId)?.teenId;
}

async function expectInvalid(promise: Promise<unknown>) {
  const error = await promise.then(
    () => null,
    (e: unknown) => e,
  );
  expect(error).toBeInstanceOf(HttpError);
  expect(error).not.toBeInstanceOf(RateLimitedError);
  expect((error as HttpError).message).toBe(INVALID_CODE_MESSAGE);
}

beforeEach(() => {
  vi.stubEnv("INVITE_CODE_SECRET", SECRET);
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(START);
  fakeDb.reset();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("code format", () => {
  it("generates 8 characters from A-Z and 2-9 without I or O", () => {
    for (let i = 0; i < 2000; i++) {
      const code = generateCode();
      expect(code).toMatch(CODE_FORMAT);
      expect(code).not.toMatch(/[IO01]/);
    }
  });

  it("uses all 32 allowed characters over many codes", () => {
    const seen = new Set(Array.from({ length: 500 }, generateCode).join(""));
    expect(seen.size).toBe(32);
  });

  it("trims and uppercases input before checking the format", () => {
    expect(normalizeCode("  abcd2345 ")).toBe("ABCD2345");
  });

  it.each([
    "ABCD234",
    "ABCD23456",
    "ABCDI234",
    "ABCDO234",
    "ABCD1234",
    "ABCD0234",
    "ABCD23$5",
    "",
    12345678,
    null,
  ])("rejects %s", (input) => {
    expect(normalizeCode(input)).toBeNull();
  });
});

describe("code storage", () => {
  it("stores only an HMAC-SHA-256 hash of the code", async () => {
    const { parentId, familyId } = await seedFamily();
    const { code, expiresAt } = await createInviteCode(parentId);

    expect(code).toMatch(CODE_FORMAT);
    expect(expiresAt.getTime()).toBe(START.getTime() + CODE_TTL_MS);

    const [stored] = fakeDb.tables.invitationCode;
    expect(stored.familyId).toBe(familyId);
    expect(stored.codeHash).toBe(createHmac("sha256", SECRET).update(code).digest("hex"));
    expect(JSON.stringify(fakeDb.tables)).not.toContain(code);
  });

  it("refuses to hash without a secret", () => {
    vi.stubEnv("INVITE_CODE_SECRET", "");
    expect(() => hashCode("ABCD2345")).toThrow();
  });
});

describe("one active code per family", () => {
  it("revokes the previous active code when a new one is generated", async () => {
    const { parentId, familyId, teenId } = await seedFamily();
    const first = await createInviteCode(parentId);
    const second = await createInviteCode(parentId);

    expect(fakeDb.tables.invitationCode.map((c) => c.status)).toEqual(["REVOKED", "ACTIVE"]);
    expect(await getActiveCode(familyId)).not.toBeNull();

    await expectInvalid(redeemInviteCode(teenId, first.code));
    await expect(redeemInviteCode(teenId, second.code)).resolves.toEqual({ parentName: "Grace" });
  });

  it("marks an active code as expired once its time has passed", async () => {
    const { parentId, familyId } = await seedFamily();
    await createInviteCode(parentId);
    vi.setSystemTime(START.getTime() + CODE_TTL_MS);

    expect(await getActiveCode(familyId)).toBeNull();
    expect(fakeDb.tables.invitationCode[0].status).toBe("EXPIRED");
  });

  it("does not let a linked family generate another code", async () => {
    const { parentId, teenId } = await seedFamily();
    const { code } = await createInviteCode(parentId);
    await redeemInviteCode(teenId, code);
    await expect(createInviteCode(parentId)).rejects.toMatchObject({ status: 409 });
  });

  it("does not let a teen generate a code", async () => {
    const { teenId } = await seedFamily();
    await expect(createInviteCode(teenId)).rejects.toMatchObject({ status: 403 });
  });
});

describe("redeeming", () => {
  it("links the teen to the family with a valid code typed loosely", async () => {
    const { parentId, teenId, familyId } = await seedFamily();
    const { code } = await createInviteCode(parentId);

    await expect(redeemInviteCode(teenId, ` ${code.toLowerCase()} `)).resolves.toEqual({
      parentName: "Grace",
    });
    expect(familyTeen(familyId)).toBe(teenId);
    expect(fakeDb.tables.invitationCode[0]).toMatchObject({ status: "REDEEMED", redeemedById: teenId });
  });

  it("rejects an expired code with the generic message", async () => {
    const { parentId, teenId, familyId } = await seedFamily();
    const { code } = await createInviteCode(parentId);
    vi.setSystemTime(START.getTime() + CODE_TTL_MS);

    await expectInvalid(redeemInviteCode(teenId, code));
    expect(familyTeen(familyId)).toBeNull();
  });

  it("accepts a code one millisecond before it expires", async () => {
    const { parentId, teenId } = await seedFamily();
    const { code } = await createInviteCode(parentId);
    vi.setSystemTime(START.getTime() + CODE_TTL_MS - 1);
    await expect(redeemInviteCode(teenId, code)).resolves.toEqual({ parentName: "Grace" });
  });

  it("rejects a code that was already used with the generic message", async () => {
    const { parentId, teenId, otherTeenId, familyId } = await seedFamily();
    const { code } = await createInviteCode(parentId);
    await redeemInviteCode(teenId, code);

    await expectInvalid(redeemInviteCode(otherTeenId, code));
    expect(familyTeen(familyId)).toBe(teenId);
  });

  it("rejects a revoked code with the generic message", async () => {
    const { parentId, teenId, familyId } = await seedFamily();
    const { code } = await createInviteCode(parentId);
    expect(await revokeInviteCode(parentId)).toBe(1);

    await expectInvalid(redeemInviteCode(teenId, code));
    expect(familyTeen(familyId)).toBeNull();
  });

  it("rejects unknown and malformed codes with the same message", async () => {
    const { parentId, teenId } = await seedFamily();
    const { code } = await createInviteCode(parentId);

    await expectInvalid(redeemInviteCode(teenId, wrongCode(code)));
    await expectInvalid(redeemInviteCode(teenId, "nope"));
  });

  it("records every attempt, successful or not", async () => {
    const { parentId, teenId } = await seedFamily();
    const { code } = await createInviteCode(parentId);
    await expectInvalid(redeemInviteCode(teenId, wrongCode(code)));
    await redeemInviteCode(teenId, code);

    expect(fakeDb.tables.redemptionAttempt.map((a) => a.success)).toEqual([false, true]);
  });
});

describe("lockout", () => {
  async function failFiveTimes(teenId: string, code: string) {
    for (let i = 0; i < 5; i++) {
      vi.setSystemTime(START.getTime() + i * MINUTE);
      await expectInvalid(redeemInviteCode(teenId, wrongCode(code)));
    }
    return START.getTime() + 4 * MINUTE;
  }

  it("blocks for 15 minutes from the fifth failure, even with the right code", async () => {
    const { parentId, teenId } = await seedFamily();
    const { code } = await createInviteCode(parentId);
    const fifthFailure = await failFiveTimes(teenId, code);

    vi.setSystemTime(fifthFailure + MINUTE);
    const error = await redeemInviteCode(teenId, code).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(RateLimitedError);
    expect((error as RateLimitedError).status).toBe(429);
    expect((error as RateLimitedError).retryAt.getTime()).toBe(fifthFailure + 15 * MINUTE);

    vi.setSystemTime(fifthFailure + 15 * MINUTE - 1);
    await expect(redeemInviteCode(teenId, code)).rejects.toBeInstanceOf(RateLimitedError);

    vi.setSystemTime(fifthFailure + 15 * MINUTE);
    await expect(redeemInviteCode(teenId, code)).resolves.toEqual({ parentName: "Grace" });
  });

  it("does not record blocked attempts as new failures", async () => {
    const { parentId, teenId } = await seedFamily();
    const { code } = await createInviteCode(parentId);
    await failFiveTimes(teenId, code);

    await expect(redeemInviteCode(teenId, code)).rejects.toBeInstanceOf(RateLimitedError);
    expect(fakeDb.tables.redemptionAttempt).toHaveLength(5);
  });

  it("allows four failures without locking", async () => {
    const { parentId, teenId } = await seedFamily();
    const { code } = await createInviteCode(parentId);
    for (let i = 0; i < 4; i++) await expectInvalid(redeemInviteCode(teenId, wrongCode(code)));

    await expect(redeemInviteCode(teenId, code)).resolves.toEqual({ parentName: "Grace" });
  });

  it("ignores failures older than 15 minutes", async () => {
    const { parentId, teenId } = await seedFamily();
    const { code } = await createInviteCode(parentId);
    for (let i = 0; i < 4; i++) await expectInvalid(redeemInviteCode(teenId, wrongCode(code)));

    vi.setSystemTime(START.getTime() + 15 * MINUTE + 1);
    await expectInvalid(redeemInviteCode(teenId, wrongCode(code)));
    await expect(redeemInviteCode(teenId, code)).resolves.toEqual({ parentName: "Grace" });
  });

  it("locks one account without blocking others", async () => {
    const { parentId, teenId, otherTeenId } = await seedFamily();
    const { code } = await createInviteCode(parentId);
    await failFiveTimes(teenId, code);

    await expect(redeemInviteCode(otherTeenId, code)).resolves.toEqual({ parentName: "Grace" });
  });
});
