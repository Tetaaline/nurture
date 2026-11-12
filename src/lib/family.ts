import "server-only";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";
import { prisma } from "./prisma";

const memberSelect = { id: true, displayName: true } as const;

export type FamilyView = {
  id: string;
  parent: { id: string; displayName: string };
  teen: { id: string; displayName: string } | null;
};

export function findFamily(user: Pick<SessionUser, "id" | "role">): Promise<FamilyView | null> {
  return prisma.family.findUnique({
    where: user.role === "PARENT" ? { parentId: user.id } : { teenId: user.id },
    select: { id: true, parent: { select: memberSelect }, teen: { select: memberSelect } },
  });
}

export async function requireLinkedFamily(user: Pick<SessionUser, "id" | "role">) {
  const family = await findFamily(user);
  if (!family || !family.teen) {
    throw new HttpError(403, "Link your family before recording a conversation.");
  }
  return family as FamilyView & { teen: NonNullable<FamilyView["teen"]> };
}

export function partnerName(family: FamilyView | null, user: Pick<SessionUser, "role">) {
  if (!family || !family.teen) return null;
  return user.role === "PARENT" ? family.teen.displayName : family.parent.displayName;
}
