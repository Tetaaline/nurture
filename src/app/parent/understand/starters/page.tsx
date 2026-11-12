import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { StartersList } from "@/components/starters-list";
import { PageTitle } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";

export default function ParentStartersPage() {
  return (
    <AppShell role="PARENT">
      <PageTitle lead="Pick one, ask it tonight, and press “We talked” on Connect afterwards.">
        Conversation starters
      </PageTitle>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Content />
      </Suspense>
    </AppShell>
  );
}

async function Content() {
  await requirePageRole("PARENT");
  return <StartersList role="PARENT" />;
}
