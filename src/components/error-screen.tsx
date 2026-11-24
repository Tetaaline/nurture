"use client";

import Link from "next/link";
import { Button, Card, buttonClass } from "./ui";

export function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-[22px] py-10">
      <Card tone="soft" className="flex flex-col gap-4" role="alert">
        <h1 className="font-heading text-2xl font-semibold text-ink">
          Something took too long. Please try again.
        </h1>
        <p className="text-muted">
          This is usually brief. If it keeps happening, wait a minute and try again.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button size="lg" onClick={onRetry}>
            Try again
          </Button>
          <Link href="/" className={buttonClass({ variant: "secondary", size: "lg" })}>
            Go to the home page
          </Link>
        </div>
      </Card>
    </main>
  );
}
