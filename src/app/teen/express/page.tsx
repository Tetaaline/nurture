import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, PageTitle } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";

export default function ExpressPage() {
  return (
    <AppShell role="TEEN">
      <PageTitle lead="Name what you feel and find the words.">Express</PageTitle>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Content />
      </Suspense>
    </AppShell>
  );
}

async function Content() {
  await requirePageRole("TEEN");
  return (
    <Card>
      <p className="text-muted">
        Feelings check-ins and &ldquo;How do I bring it up?&rdquo; arrive in a later
        sprint. Your journal is already open from Home.
      </p>
    </Card>
  );
}
