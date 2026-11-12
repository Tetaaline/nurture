import { requireUser } from "@/lib/auth";
import {
  conversationInput,
  getHistory,
  getStreak,
  recordConversation,
} from "@/lib/conversations";
import { requireLinkedFamily } from "@/lib/family";
import { apiHandler, json, readJson } from "@/lib/http";

export const GET = apiHandler(async () => {
  const user = await requireUser();
  const family = await requireLinkedFamily(user);
  const [streak, history] = await Promise.all([getStreak(family.id), getHistory(family.id)]);
  return json({ ...streak, history });
});

export const POST = apiHandler(async (request: Request) => {
  const user = await requireUser();
  const data = conversationInput.parse(await readJson(request));
  const result = await recordConversation(user, data.starterId);
  return json(result, 201);
});
