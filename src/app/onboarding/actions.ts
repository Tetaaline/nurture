"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@generated/prisma/client";
import type { Role } from "@generated/prisma/enums";
import { dashboardPath } from "@/lib/auth";
import { GENERIC_ERROR, fieldErrors } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export type OnboardingState = {
  fields?: Record<string, string>;
  error?: string;
};

const onboardingInput = z.object({
  displayName: z
    .string({ error: "Please enter a display name." })
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(40, "Display name must be 40 characters or fewer."),
  role: z.enum(["PARENT", "TEEN"], { error: "Please choose Parent or Teen." }),
});

async function findRole(authProviderId: string): Promise<Role | null> {
  const user = await prisma.user.findUnique({
    where: { authProviderId },
    select: { role: true },
  });
  return user?.role ?? null;
}

export async function completeOnboarding(
  _previous: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = onboardingInput.safeParse({
    displayName: formData.get("displayName"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { fields: fieldErrors(parsed.error) };

  const existingRole = await findRole(userId);
  if (existingRole) redirect(dashboardPath(existingRole));

  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses[0]?.emailAddress ??
    "";

  const { displayName, role } = parsed.data;
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { authProviderId: userId, email, displayName, role },
        select: { id: true },
      });
      if (role === "PARENT") {
        await tx.family.create({ data: { parentId: user.id } });
      }
    });
  } catch (error) {
    // Two submissions can race; the first one wins and the second just follows it.
    const duplicate =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
    const roleAfterRace = duplicate ? await findRole(userId) : null;
    if (roleAfterRace) redirect(dashboardPath(roleAfterRace));
    console.error(`[onboarding] ${error instanceof Error ? error.name : "Error"}`);
    return { error: GENERIC_ERROR };
  }

  redirect(dashboardPath(role));
}
