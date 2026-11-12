import { z } from "zod";
import { FEELING_VALUES } from "./feelings";
import { prisma } from "./prisma";

export const CHECKIN_NOTE_MAX = 500;
export const CHECKIN_HISTORY_LIMIT = 30;

const optionalNote = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z
    .string({ error: "Note must be text." })
    .trim()
    .max(CHECKIN_NOTE_MAX, `Note must be ${CHECKIN_NOTE_MAX} characters or fewer.`)
    .nullable()
    .optional(),
);

export const checkInInput = z.object({
  feeling: z.enum(FEELING_VALUES, { error: "Please choose one of the eight feelings." }),
  note: optionalNote,
});

export const checkInSelect = {
  id: true,
  feeling: true,
  note: true,
  createdAt: true,
} as const;

export function listCheckIns(ownerId: string) {
  return prisma.feelingsCheckIn.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    take: CHECKIN_HISTORY_LIMIT,
    select: checkInSelect,
  });
}
