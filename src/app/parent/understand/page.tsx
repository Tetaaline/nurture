import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, PageTitle } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";

export default function UnderstandPage() {
  return (
    <AppShell role="PARENT">
      <PageTitle lead="Practical guidance for parents.">Understand</PageTitle>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Content />
      </Suspense>
    </AppShell>
  );
}

async function Content() {
  await requirePageRole("PARENT");
  return (
    <Card>
      <p className="text-muted">
        Parent guides, sensitive conversations and practice scenarios arrive in a
        later sprint.
      </p>
    </Card>
  );
}
