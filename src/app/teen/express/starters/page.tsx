import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { StartersList } from "@/components/starters-list";
import { PageTitle } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";

export default function TeenStartersPage() {
  return (
    <AppShell role="TEEN">
      <PageTitle lead="Questions to ask your parent, or to show them when you do not know how to start.">
        Conversation starters
      </PageTitle>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Content />
      </Suspense>
    </AppShell>
  );
}

async function Content() {
  await requirePageRole("TEEN");
  return <StartersList role="TEEN" />;
}
