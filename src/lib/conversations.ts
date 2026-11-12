import "server-only";
import { z } from "zod";
import type { SessionUser } from "./auth";
import { requireLinkedFamily } from "./family";
import { HttpError } from "./http";
import { prisma } from "./prisma";
import { calculateStreak, talkedThisWeek } from "./streak";

export const conversationInput = z.object({
  starterId: z.string().regex(/^[a-z0-9]{10,40}$/).nullable().optional(),
});

const recordSelect = {
  id: true,
  completedAt: true,
  recordedBy: { select: { displayName: true } },
  starter: { select: { text: true } },
} as const;

export type ConversationView = {
  id: string;
  completedAt: Date;
  recordedBy: { displayName: string };
  starter: { text: string } | null;
};

export async function getStreak(familyId: string, now = new Date()) {
  const records = await prisma.conversationRecord.findMany({
    where: { familyId },
    select: { completedAt: true },
  });
  const dates = records.map((record) => record.completedAt);
  return { streak: calculateStreak(dates, now), talkedThisWeek: talkedThisWeek(dates, now) };
}

export function getHistory(familyId: string, limit = 100): Promise<ConversationView[]> {
  return prisma.conversationRecord.findMany({
    where: { familyId },
    orderBy: { completedAt: "desc" },
    take: limit,
    select: recordSelect,
  });
}

export function listStarters() {
  return prisma.conversationStarter.findMany({
    orderBy: [{ category: "asc" }, { text: "asc" }],
    select: { id: true, text: true, category: true },
  });
}

export async function recordConversation(user: SessionUser, starterId: string | null | undefined) {
  const family = await requireLinkedFamily(user);
  if (starterId) {
    const starter = await prisma.conversationStarter.findUnique({
      where: { id: starterId },
      select: { id: true },
    });
    if (!starter) throw new HttpError(400, "That conversation starter does not exist.");
  }
  const record = await prisma.conversationRecord.create({
    data: { familyId: family.id, recordedById: user.id, starterId: starterId ?? null },
    select: recordSelect,
  });
  const streak = await getStreak(family.id);
  return { record, ...streak };
}
