import { requireRole } from "@/lib/auth";
import { apiHandler, json } from "@/lib/http";
import { createInviteCode, revokeInviteCode } from "@/lib/invite";

export const POST = apiHandler(async () => {
  const parent = await requireRole("PARENT");
  const { code, expiresAt } = await createInviteCode(parent.id);
  return json({ code, expiresAt }, 201);
});

export const DELETE = apiHandler(async () => {
  const parent = await requireRole("PARENT");
  const revoked = await revokeInviteCode(parent.id);
  return json({ revoked });
});
