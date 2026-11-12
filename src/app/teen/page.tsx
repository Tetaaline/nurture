import Link from "next/link";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { PenIcon, PeopleIcon, SpeechIcon } from "@/components/icons";
import { Card, HealthcareNotice, focusRing } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";

const sections = [
  {
    href: "/teen/journal",
    title: "My journal",
    description: "A private place to write things down. Only you can see it.",
    icon: <PenIcon />,
    tone: "soft" as const,
  },
  {
    href: "/teen/express",
    title: "Express",
    description: "Name what you feel and find the words to bring it up.",
    icon: <SpeechIcon />,
    tone: "surface" as const,
  },
  {
    href: "/connect",
    title: "Connect",
    description: "Link with your parent and keep a weekly conversation streak.",
    icon: <PeopleIcon />,
    tone: "surface" as const,
  },
];

export default function TeenHomePage() {
  return (
    <AppShell role="TEEN">
      <Suspense fallback={<GreetingSkeleton />}>
        <Greeting />
      </Suspense>

      {sections.map((section) => (
        <Link key={section.href} href={section.href} className={`rounded-[14px] ${focusRing}`}>
          <Card tone={section.tone} className="flex items-start gap-3">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-[10px] text-primary ${
                section.tone === "soft" ? "bg-surface" : "bg-soft"
              }`}
            >
              {section.icon}
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-lg font-semibold text-ink">{section.title}</span>
              <span className="text-muted">{section.description}</span>
            </span>
          </Card>
        </Link>
      ))}

      <HealthcareNotice />
    </AppShell>
  );
}

async function Greeting() {
  const user = await requirePageRole("TEEN");
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
        Hi, {user.displayName}
      </h1>
      <p className="text-muted">This is your space. What do you need today?</p>
    </div>
  );
}

function GreetingSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      <div className="h-8 w-40 rounded-[10px] bg-soft" />
      <div className="h-5 w-64 max-w-full rounded-[10px] bg-soft" />
    </div>
  );
}
