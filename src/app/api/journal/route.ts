import { requireRole } from "@/lib/auth";
import { apiHandler, json, readJson } from "@/lib/http";
import { journalEntryInput, journalEntrySelect, listEntries } from "@/lib/journal";
import { prisma } from "@/lib/prisma";

export const GET = apiHandler(async () => {
  const user = await requireRole("TEEN");
  const entries = await listEntries(user.id);
  return json({ entries });
});

export const POST = apiHandler(async (request: Request) => {
  const user = await requireRole("TEEN");
  const data = journalEntryInput.parse(await readJson(request));
  const entry = await prisma.journalEntry.create({
    data: { ownerId: user.id, title: data.title ?? null, body: data.body },
    select: journalEntrySelect,
  });
  return json({ entry }, 201);
});
