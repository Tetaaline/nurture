import { SignOutButton } from "@clerk/nextjs";
import type { SessionUser } from "@/lib/auth";
import { Card, buttonClass } from "./ui";

export function ProfileCard({ user }: { user: SessionUser }) {
  return (
    <Card className="flex flex-col gap-4">
      <dl className="grid gap-3">
        <div>
          <dt className="text-sm text-muted">Display name</dt>
          <dd className="font-medium text-ink">{user.displayName}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Email</dt>
          <dd className="font-medium text-ink break-all">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Role</dt>
          <dd className="font-medium text-ink">{user.role === "PARENT" ? "Parent" : "Teen"}</dd>
        </div>
      </dl>
      <SignOutButton redirectUrl="/">
        <button type="button" className={buttonClass({ variant: "secondary", size: "lg" })}>
          Sign out
        </button>
      </SignOutButton>
    </Card>
  );
}
