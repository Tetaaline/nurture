import { requireRole } from "@/lib/auth";
import { HttpError, apiHandler, json, readJson } from "@/lib/http";
import { findEntry, journalEntryPatch, journalEntrySelect } from "@/lib/journal";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

async function ownedEntry(ownerId: string, context: Context) {
  const { id } = await context.params;
  const entry = await findEntry(ownerId, id);
  if (!entry) throw new HttpError(404, "Entry not found.");
  return entry;
}

export const GET = apiHandler(async (_request: Request, context: Context) => {
  const user = await requireRole("TEEN");
  const entry = await ownedEntry(user.id, context);
  return json({ entry });
});

export const PATCH = apiHandler(async (request: Request, context: Context) => {
  const user = await requireRole("TEEN");
  const existing = await ownedEntry(user.id, context);
  const data = journalEntryPatch.parse(await readJson(request));
  const entry = await prisma.journalEntry.update({
    where: { id: existing.id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.body !== undefined && { body: data.body }),
    },
    select: journalEntrySelect,
  });
  return json({ entry });
});

export const DELETE = apiHandler(async (_request: Request, context: Context) => {
  const user = await requireRole("TEEN");
  const existing = await ownedEntry(user.id, context);
  await prisma.journalEntry.delete({ where: { id: existing.id } });
  return json({ ok: true });
});
