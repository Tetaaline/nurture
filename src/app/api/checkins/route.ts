import { requireRole } from "@/lib/auth";
import { checkInInput, checkInSelect, listCheckIns } from "@/lib/checkins";
import { apiHandler, json, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const GET = apiHandler(async () => {
  const user = await requireRole("TEEN");
  const checkIns = await listCheckIns(user.id);
  return json({ checkIns });
});

export const POST = apiHandler(async (request: Request) => {
  const user = await requireRole("TEEN");
  const data = checkInInput.parse(await readJson(request));
  const checkIn = await prisma.feelingsCheckIn.create({
    data: { ownerId: user.id, feeling: data.feeling, note: data.note ?? null },
    select: checkInSelect,
  });
  return json({ checkIn }, 201);
});
