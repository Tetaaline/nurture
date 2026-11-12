import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { JournalEditor } from "@/components/journal-editor";
import { Card, PageTitle } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";

export default function NewJournalEntryPage() {
  return (
    <AppShell role="TEEN">
      <PageTitle lead="Write as much or as little as you like.">New entry</PageTitle>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Editor />
      </Suspense>
    </AppShell>
  );
}

async function Editor() {
  await requirePageRole("TEEN");
  return (
    <Card>
      <JournalEditor />
    </Card>
  );
}
