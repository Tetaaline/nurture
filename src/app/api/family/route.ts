import { requireUser } from "@/lib/auth";
import { findFamily, partnerName } from "@/lib/family";
import { apiHandler, json } from "@/lib/http";
import { getActiveCode } from "@/lib/invite";

export const GET = apiHandler(async () => {
  const user = await requireUser();
  const family = await findFamily(user);
  const linked = Boolean(family?.teen);
  const activeCode =
    user.role === "PARENT" && family && !linked ? await getActiveCode(family.id) : null;

  return json({
    role: user.role,
    linked,
    partnerName: partnerName(family, user),
    activeCode: activeCode ? { expiresAt: activeCode.expiresAt } : null,
  });
});
