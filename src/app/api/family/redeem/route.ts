import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/dates";
import { apiHandler, json, readJson } from "@/lib/http";
import { RateLimitedError, redeemInviteCode } from "@/lib/invite";

export const POST = apiHandler(async (request: Request) => {
  const teen = await requireRole("TEEN");
  const body = (await readJson(request)) as { code?: unknown } | null;
  try {
    const { parentName } = await redeemInviteCode(teen.id, body?.code);
    return json({ linked: true, partnerName: parentName });
  } catch (error) {
    if (error instanceof RateLimitedError) {
      return json(
        {
          error: `Too many attempts. Please try again after ${formatDateTime(error.retryAt)}.`,
          retryAt: error.retryAt,
        },
        429,
      );
    }
    throw error;
  }
});
