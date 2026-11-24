"use client";

import { ErrorScreen } from "@/components/error-screen";

// The error itself is never rendered: it can contain technical details.
export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return <ErrorScreen onRetry={retry} />;
}
