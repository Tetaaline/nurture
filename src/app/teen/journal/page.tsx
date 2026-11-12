import Link from "next/link";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { PlusIcon } from "@/components/icons";
import { ButtonLink, Card, PageTitle, focusRing } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/dates";
import { listEntries } from "@/lib/journal";

export default function JournalPage() {
  return (
    <AppShell role="TEEN">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageTitle lead="Only you can see what you write here.">My journal</PageTitle>
        <ButtonLink href="/teen/journal/new">
          <PlusIcon size={18} />
          New entry
        </ButtonLink>
      </div>
      <Suspense fallback={<p className="text-muted">Loading your entries…</p>}>
        <Entries />
      </Suspense>
    </AppShell>
  );
}

async function Entries() {
  const user = await requirePageRole("TEEN");
  const entries = await listEntries(user.id);

  if (entries.length === 0) {
    return (
      <Card tone="soft">
        <p className="text-ink">No entries yet. Your first one can be a single sentence.</p>
      </Card>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link href={`/teen/journal/${entry.id}`} className={`block rounded-[14px] ${focusRing}`}>
            <Card className="flex flex-col gap-1 hover:bg-soft">
              <h2 className="text-lg font-semibold text-ink">
                {entry.title ?? "Untitled entry"}
              </h2>
              <p className="text-sm text-muted">{formatDateTime(entry.createdAt)}</p>
              <p className="line-clamp-2 text-ink">{entry.body}</p>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
