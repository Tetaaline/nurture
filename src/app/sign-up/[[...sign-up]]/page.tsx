import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";
import { PublicShell } from "@/components/app-shell";

export default function SignUpPage() {
  return (
    <PublicShell>
      <main className="flex flex-1 flex-col items-center gap-4 py-4">
        <h1 className="sr-only">Create an account</h1>
        <Suspense fallback={<p className="text-muted">Loading sign up…</p>}>
          <SignUp />
        </Suspense>
      </main>
    </PublicShell>
  );
}
