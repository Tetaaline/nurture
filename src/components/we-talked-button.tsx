"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Notice, inputClass } from "./ui";

const GENERIC_ERROR = "Something went wrong. Please try again.";

type Starter = { id: string; text: string; category: string };

export function WeTalkedButton({ starters }: { starters: Starter[] }) {
  const router = useRouter();
  const [starterId, setStarterId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<number | null>(null);

  async function record() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starterId: starterId || null }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        streak?: number;
        error?: string;
      };
      if (!response.ok) {
        setError(result.error ?? GENERIC_ERROR);
        return;
      }
      setSaved(result.streak ?? 0);
      setStarterId("");
      router.refresh();
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {starters.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="starter" className="font-medium text-ink">
            What did you talk about? (optional)
          </label>
          <select
            id="starter"
            value={starterId}
            onChange={(event) => setStarterId(event.target.value)}
            className={inputClass}
          >
            <option value="">Something of our own</option>
            {starters.map((starter) => (
              <option key={starter.id} value={starter.id}>
                {starter.text}
              </option>
            ))}
          </select>
        </div>
      )}
      {error && <Notice tone="error">{error}</Notice>}
      {saved !== null && (
        <Notice tone="success">
          Recorded. Your streak is {saved} {saved === 1 ? "week" : "weeks"}.
        </Notice>
      )}
      <Button onClick={record} disabled={busy} size="lg">
        {busy ? "Saving…" : "We talked"}
      </Button>
    </div>
  );
}
