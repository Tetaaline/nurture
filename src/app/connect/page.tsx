import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, PageTitle } from "@/components/ui";
import { requirePageUser } from "@/lib/auth";

export default function ConnectPage() {
  return (
    <Suspense fallback={<p className="px-[22px] py-5 text-muted">Loading…</p>}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const user = await requirePageUser();
  return (
    <AppShell role={user.role}>
      <PageTitle lead="Link your family and keep the conversation going.">Connect</PageTitle>
      <Card>
        <p className="text-muted">
          Family linking, conversation starters and the weekly streak arrive in the
          next sprint.
        </p>
      </Card>
    </AppShell>
  );
}
