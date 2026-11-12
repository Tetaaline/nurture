import Link from "next/link";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { HeartIcon, PenIcon, PeopleIcon, SpeechIcon } from "@/components/icons";
import { Card, PageTitle, focusRing } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";
import { sectionsFor, startersPath } from "@/lib/resources";

const icons: Record<string, React.ReactNode> = {
  openers: <SpeechIcon />,
  stories: <HeartIcon />,
};

export default function ExpressPage() {
  return (
    <AppShell role="TEEN">
      <PageTitle lead="Name what you feel and find the words.">Express</PageTitle>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Gate />
      </Suspense>
      <ul className="flex flex-col gap-3">
        <li>
          <SectionLink
            href="/teen/express/checkin"
            title="Feelings check-in"
            lead="Pick a feeling, add a note if you like. Only you can see it."
            icon={<HeartIcon />}
            tone="soft"
          />
        </li>
        {sectionsFor("TEEN").map((section) => (
          <li key={section.key}>
            <SectionLink
              href={section.basePath}
              title={section.title}
              lead={section.lead}
              icon={icons[section.key]}
            />
          </li>
        ))}
        <li>
          <SectionLink
            href={startersPath("TEEN")}
            title="Conversation starters"
            lead="Questions you could ask your parent, or hand to them."
            icon={<PeopleIcon />}
          />
        </li>
        <li>
          <SectionLink
            href="/teen/journal"
            title="My journal"
            lead="Write things down privately."
            icon={<PenIcon />}
          />
        </li>
      </ul>
    </AppShell>
  );
}

async function Gate() {
  await requirePageRole("TEEN");
  return null;
}

function SectionLink({
  href,
  title,
  lead,
  icon,
  tone = "surface",
}: {
  href: string;
  title: string;
  lead: string;
  icon: React.ReactNode;
  tone?: "surface" | "soft";
}) {
  return (
    <Link href={href} className={`block rounded-[14px] ${focusRing}`}>
      <Card tone={tone} className="flex items-start gap-3 hover:bg-soft">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-[10px] text-primary ${
            tone === "soft" ? "bg-surface" : "bg-soft"
          }`}
        >
          {icon}
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-ink">{title}</span>
          <span className="text-muted">{lead}</span>
        </span>
      </Card>
    </Link>
  );
}
