"use client";

import { ErrorScreen } from "@/components/error-screen";
import { dmSans, lora } from "./fonts";
import "./globals.css";

// Replaces the root layout when it fails, so it needs its own html, body and fonts.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en" className={`${lora.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ErrorScreen onRetry={retry} />
      </body>
    </html>
  );
}
