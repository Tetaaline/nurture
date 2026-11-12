import Link from "next/link";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { BookIcon, HeartIcon, PeopleIcon, ShieldIcon, SpeechIcon } from "@/components/icons";
import { Card, PageTitle, focusRing } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";
import { sectionsFor, startersPath } from "@/lib/resources";

const icons: Record<string, React.ReactNode> = {
  guides: <BookIcon />,
  sensitive: <ShieldIcon />,
  scenarios: <SpeechIcon />,
  stories: <HeartIcon />,
};

export default function UnderstandPage() {
  return (
    <AppShell role="PARENT">
      <PageTitle lead="Practical guidance for parents.">Understand</PageTitle>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Gate />
      </Suspense>
      <ul className="flex flex-col gap-3">
        {sectionsFor("PARENT").map((section) => (
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
            href={startersPath("PARENT")}
            title="Conversation starters"
            lead="Questions to open a real conversation at home."
            icon={<PeopleIcon />}
          />
        </li>
      </ul>
    </AppShell>
  );
}

async function Gate() {
  await requirePageRole("PARENT");
  return null;
}

function SectionLink({
  href,
  title,
  lead,
  icon,
}: {
  href: string;
  title: string;
  lead: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className={`block rounded-[14px] ${focusRing}`}>
      <Card className="flex items-start gap-3 hover:bg-soft">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-soft text-primary">
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
