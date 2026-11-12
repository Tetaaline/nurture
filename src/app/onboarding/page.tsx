import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { PublicShell } from "@/components/app-shell";
import { Card } from "@/components/ui";
import { dashboardPath } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingForm } from "./onboarding-form";

export default function OnboardingPage() {
  return (
    <PublicShell>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
            Welcome to NURTURE
          </h1>
          <p className="text-muted">Tell us who you are so we can set up your space.</p>
        </div>
        <Card>
          <Suspense fallback={<p className="text-muted">Loading…</p>}>
            <OnboardingGate />
          </Suspense>
        </Card>
      </main>
    </PublicShell>
  );
}

async function OnboardingGate() {
  await connection();
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const user = await prisma.user.findUnique({
    where: { authProviderId: userId },
    select: { role: true },
  });
  if (user) redirect(dashboardPath(user.role));
  return <OnboardingForm />;
}
