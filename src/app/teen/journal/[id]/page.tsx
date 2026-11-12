import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { ArrowLeftIcon } from "@/components/icons";
import { JournalEntryView } from "@/components/journal-entry-view";
import { ButtonLink } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/dates";
import { findEntry } from "@/lib/journal";

export default function JournalEntryPage({ params }: PageProps<"/teen/journal/[id]">) {
  return (
    <AppShell role="TEEN">
      <ButtonLink href="/teen/journal" variant="ghost" className="self-start px-0">
        <ArrowLeftIcon size={18} />
        Back to journal
      </ButtonLink>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Entry params={params} />
      </Suspense>
    </AppShell>
  );
}

async function Entry({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageRole("TEEN");
  const { id } = await params;
  const entry = await findEntry(user.id, id);
  if (!entry) notFound();

  const edited = entry.updatedAt.getTime() - entry.createdAt.getTime() > 60_000;
  return (
    <JournalEntryView
      entry={{
        id: entry.id,
        title: entry.title,
        body: entry.body,
        createdAtLabel: formatDateTime(entry.createdAt),
        updatedAtLabel: edited ? formatDateTime(entry.updatedAt) : null,
      }}
    />
  );
}
