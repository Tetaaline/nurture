import Link from "next/link";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { BookIcon, PeopleIcon } from "@/components/icons";
import { Card, HealthcareNotice, focusRing } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";

export default function ParentHomePage() {
  return (
    <AppShell role="PARENT">
      <Suspense fallback={<GreetingSkeleton />}>
        <Greeting />
      </Suspense>

      <Link href="/parent/understand" className={`rounded-[14px] ${focusRing}`}>
        <Card tone="soft" className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-surface text-primary">
            <BookIcon />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-ink">Understand</span>
            <span className="text-muted">
              Practical guidance on emotions, puberty, discipline and more.
            </span>
          </span>
        </Card>
      </Link>

      <Link href="/connect" className={`rounded-[14px] ${focusRing}`}>
        <Card className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-soft text-primary">
            <PeopleIcon />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-ink">Connect</span>
            <span className="text-muted">
              Link with your teen, pick a conversation starter and keep a weekly streak.
            </span>
          </span>
        </Card>
      </Link>

      <HealthcareNotice />
    </AppShell>
  );
}

async function Greeting() {
  const user = await requirePageRole("PARENT");
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
        Hello, {user.displayName}
      </h1>
      <p className="text-muted">Small conversations add up. Where would you like to start?</p>
    </div>
  );
}

function GreetingSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      <div className="h-8 w-48 rounded-[10px] bg-soft" />
      <div className="h-5 w-72 max-w-full rounded-[10px] bg-soft" />
    </div>
  );
}
