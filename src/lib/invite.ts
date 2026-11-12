import "server-only";
import { createHmac, randomInt } from "node:crypto";
import { Prisma } from "@generated/prisma/client";
import { HttpError } from "./http";
import { prisma } from "./prisma";

export const CODE_LENGTH = 8;
export const CODE_TTL_MS = 24 * 60 * 60 * 1000;
export const INVALID_CODE_MESSAGE = "This code is not valid or has expired.";

const MAX_FAILURES = 5;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

// A-Z and 2-9 without I and O, which are easy to confuse with 1 and 0.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_FORMAT = /^[A-HJ-NP-Z2-9]{8}$/;

export class RateLimitedError extends HttpError {
  constructor(public readonly retryAt: Date) {
    super(429, `Too many attempts. Try again at ${retryAt.toISOString()}.`);
  }
}

export function generateCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return code;
}

export function hashCode(code: string): string {
  const secret = process.env.INVITE_CODE_SECRET;
  if (!secret) throw new Error("INVITE_CODE_SECRET is not set.");
  return createHmac("sha256", secret).update(code).digest("hex");
}

export function normalizeCode(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const code = input.trim().toUpperCase().replace(/[\s-]/g, "");
  return CODE_FORMAT.test(code) ? code : null;
}

async function parentFamily(parentId: string) {
  const family = await prisma.family.findUnique({
    where: { parentId },
    select: { id: true, teenId: true },
  });
  if (!family) throw new HttpError(403, "Only a parent can manage invitation codes.");
  if (family.teenId) throw new HttpError(409, "Your family is already linked.");
  return family;
}

export async function createInviteCode(parentId: string) {
  const family = await parentFamily(parentId);
  const code = generateCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);
  await prisma.$transaction([
    prisma.invitationCode.updateMany({
      where: { familyId: family.id, status: "ACTIVE" },
      data: { status: "REVOKED" },
    }),
    prisma.invitationCode.create({
      data: { familyId: family.id, codeHash: hashCode(code), expiresAt },
    }),
  ]);
  return { code, expiresAt };
}

export async function revokeInviteCode(parentId: string) {
  const family = await parentFamily(parentId);
  const result = await prisma.invitationCode.updateMany({
    where: { familyId: family.id, status: "ACTIVE" },
    data: { status: "REVOKED" },
  });
  return result.count;
}

export async function getActiveCode(familyId: string) {
  const now = new Date();
  await prisma.invitationCode.updateMany({
    where: { familyId, status: "ACTIVE", expiresAt: { lte: now } },
    data: { status: "EXPIRED" },
  });
  return prisma.invitationCode.findFirst({
    where: { familyId, status: "ACTIVE", expiresAt: { gt: now } },
    select: { expiresAt: true, createdAt: true },
  });
}

async function assertNotLocked(userId: string, now: Date) {
  const failures = await prisma.redemptionAttempt.findMany({
    where: { userId, success: false, createdAt: { gte: new Date(now.getTime() - FAILURE_WINDOW_MS) } },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
    take: MAX_FAILURES,
  });
  if (failures.length < MAX_FAILURES) return;
  const retryAt = new Date(failures[MAX_FAILURES - 1].createdAt.getTime() + LOCKOUT_MS);
  if (retryAt > now) throw new RateLimitedError(retryAt);
}

async function recordAttempt(userId: string, success: boolean) {
  await prisma.redemptionAttempt.create({ data: { userId, success } });
}

export async function redeemInviteCode(teenId: string, input: unknown) {
  const now = new Date();
  await assertNotLocked(teenId, now);

  const alreadyLinked = await prisma.family.findUnique({ where: { teenId }, select: { id: true } });
  if (alreadyLinked) throw new HttpError(409, "You are already linked to a family.");

  const code = normalizeCode(input);
  if (!code) {
    await recordAttempt(teenId, false);
    throw new HttpError(400, INVALID_CODE_MESSAGE);
  }

  let parentName: string | null = null;
  try {
    parentName = await prisma.$transaction(async (tx) => {
      const invitation = await tx.invitationCode.findFirst({
        where: { codeHash: hashCode(code), status: "ACTIVE", expiresAt: { gt: now } },
        select: { id: true, familyId: true },
      });
      if (!invitation) return null;

      // Both updates are conditional, so if two teens race, the second one finds 0 rows and rolls back.
      const redeemed = await tx.invitationCode.updateMany({
        where: { id: invitation.id, status: "ACTIVE" },
        data: { status: "REDEEMED", redeemedById: teenId },
      });
      if (redeemed.count !== 1) return null;

      const linked = await tx.family.updateMany({
        where: { id: invitation.familyId, teenId: null },
        data: { teenId },
      });
      if (linked.count !== 1) throw new HttpError(400, INVALID_CODE_MESSAGE);

      const family = await tx.family.findUnique({
        where: { id: invitation.familyId },
        select: { parent: { select: { displayName: true } } },
      });
      return family?.parent.displayName ?? "";
    });
  } catch (error) {
    const duplicateLink =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
    if (!(error instanceof HttpError) && !duplicateLink) throw error;
    parentName = null;
  }

  await recordAttempt(teenId, parentName !== null);
  if (parentName === null) throw new HttpError(400, INVALID_CODE_MESSAGE);
  return { parentName };
}
