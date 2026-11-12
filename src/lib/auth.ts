import "server-only";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Role } from "@generated/prisma/enums";
import { HttpError } from "./http";
import { prisma } from "./prisma";

export type SessionUser = {
  id: string;
  displayName: string;
  email: string;
  role: Role;
};

const sessionUserSelect = {
  id: true,
  displayName: true,
  email: true,
  role: true,
} as const;

export function dashboardPath(role: Role) {
  return role === "PARENT" ? "/parent" : "/teen";
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const { userId } = await auth();
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { authProviderId: userId },
    select: sessionUserSelect,
  });
}

export async function requireRole(role: Role): Promise<SessionUser> {
  const { userId } = await auth();
  if (!userId) throw new HttpError(401, "Please sign in.");
  const user = await prisma.user.findUnique({
    where: { authProviderId: userId },
    select: sessionUserSelect,
  });
  if (!user || user.role !== role) {
    throw new HttpError(403, "You do not have access to this.");
  }
  return user;
}

export async function requirePageUser(): Promise<SessionUser> {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const user = await prisma.user.findUnique({
    where: { authProviderId: userId },
    select: sessionUserSelect,
  });
  if (!user) redirect("/onboarding");
  return user;
}

export async function requirePageRole(role: Role): Promise<SessionUser> {
  const user = await requirePageUser();
  if (user.role !== role) redirect(dashboardPath(user.role));
  return user;
}
