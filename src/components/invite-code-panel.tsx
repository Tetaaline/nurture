"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Notice } from "./ui";

const GENERIC_ERROR = "Something went wrong. Please try again.";

export function InviteCodePanel({
  activeExpiresAt,
}: {
  activeExpiresAt: string | null;
}) {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revoked, setRevoked] = useState(false);

  const hasActive = Boolean(activeExpiresAt) && !revoked;

  async function generate() {
    setBusy(true);
    setError(null);
    setRevoked(false);
    try {
      const response = await fetch("/api/family/code", { method: "POST" });
      const result = (await response.json().catch(() => ({}))) as {
        code?: string;
        expiresAt?: string;
        error?: string;
      };
      if (!response.ok || !result.code) {
        setError(result.error ?? GENERIC_ERROR);
        return;
      }
      setCode(result.code);
      setExpiresAt(result.expiresAt ?? null);
      router.refresh();
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  }

  async function revoke() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/family/code", { method: "DELETE" });
      if (!response.ok) {
        const result = (await response.json().catch(() => ({}))) as { error?: string };
        setError(result.error ?? GENERIC_ERROR);
        return;
      }
      setCode(null);
      setExpiresAt(null);
      setRevoked(true);
      router.refresh();
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {code ? (
        <div className="flex flex-col gap-1 rounded-[10px] bg-surface p-4 text-center">
          <p className="text-sm text-muted">Your invitation code</p>
          <p className="font-heading text-3xl font-bold tracking-[0.3em] text-ink" aria-live="polite">
            {code}
          </p>
          {expiresAt && (
            <p className="text-sm text-muted">Expires {formatLocal(expiresAt)}</p>
          )}
          <p className="text-sm text-muted">
            Write it down now: for safety it is shown only once.
          </p>
        </div>
      ) : hasActive && activeExpiresAt ? (
        <Notice>
          A code is active until {formatLocal(activeExpiresAt)}. Generating a new one
          cancels it.
        </Notice>
      ) : (
        <Notice>No active code right now.</Notice>
      )}

      {error && <Notice tone="error">{error}</Notice>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={generate} disabled={busy} size="lg">
          {busy ? "Working…" : code || hasActive ? "Generate a new code" : "Generate code"}
        </Button>
        {(code || hasActive) && (
          <Button onClick={revoke} disabled={busy} variant="secondary" size="lg">
            Revoke code
          </Button>
        )}
      </div>
    </div>
  );
}

function formatLocal(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Kigali",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
