import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { ProfileCard } from "@/components/profile-card";
import { PageTitle } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";

export default function ParentProfilePage() {
  return (
    <AppShell role="PARENT">
      <PageTitle>Profile</PageTitle>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Profile />
      </Suspense>
    </AppShell>
  );
}

async function Profile() {
  const user = await requirePageRole("PARENT");
  return <ProfileCard user={user} />;
}
