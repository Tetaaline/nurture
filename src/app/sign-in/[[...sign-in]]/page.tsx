import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";
import { PublicShell } from "@/components/app-shell";

export default function SignInPage() {
  return (
    <PublicShell>
      <main className="flex flex-1 flex-col items-center gap-4 py-4">
        <h1 className="sr-only">Sign in</h1>
        <Suspense fallback={<p className="text-muted">Loading sign in…</p>}>
          <SignIn />
        </Suspense>
      </main>
    </PublicShell>
  );
}
