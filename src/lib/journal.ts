import { z } from "zod";
import { prisma } from "./prisma";

export const JOURNAL_TITLE_MAX = 100;
export const JOURNAL_BODY_MAX = 5000;

const optionalTitle = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z
    .string({ error: "Title must be text." })
    .trim()
    .max(JOURNAL_TITLE_MAX, `Title must be ${JOURNAL_TITLE_MAX} characters or fewer.`)
    .nullable()
    .optional(),
);

const body = z
  .string({ error: "Please write something." })
  .trim()
  .min(1, "Please write something.")
  .max(JOURNAL_BODY_MAX, `Entry must be ${JOURNAL_BODY_MAX} characters or fewer.`);

export const journalEntryInput = z.object({ title: optionalTitle, body });
export const journalEntryPatch = z
  .object({ title: optionalTitle, body: body.optional() })
  .refine((data) => data.title !== undefined || data.body !== undefined, {
    message: "Nothing to update.",
    path: ["form"],
  });

export const idParam = z.string().regex(/^[a-z0-9]{10,40}$/);

export const journalEntrySelect = {
  id: true,
  title: true,
  body: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type JournalEntryView = {
  id: string;
  title: string | null;
  body: string;
  createdAt: Date;
  updatedAt: Date;
};

export function listEntries(ownerId: string): Promise<JournalEntryView[]> {
  return prisma.journalEntry.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    select: journalEntrySelect,
  });
}

export function findEntry(ownerId: string, id: string): Promise<JournalEntryView | null> {
  if (!idParam.safeParse(id).success) return Promise.resolve(null);
  return prisma.journalEntry.findFirst({
    where: { id, ownerId },
    select: journalEntrySelect,
  });
}
