import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { ProfileCard } from "@/components/profile-card";
import { PageTitle } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";

export default function TeenProfilePage() {
  return (
    <AppShell role="TEEN">
      <PageTitle>Profile</PageTitle>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Profile />
      </Suspense>
    </AppShell>
  );
}

async function Profile() {
  const user = await requirePageRole("TEEN");
  return <ProfileCard user={user} />;
}
