"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { JournalEditor } from "./journal-editor";
import { Button, Card, Notice } from "./ui";

const GENERIC_ERROR = "Something went wrong. Please try again.";

type Entry = {
  id: string;
  title: string | null;
  body: string;
  createdAtLabel: string;
  updatedAtLabel: string | null;
};

export function JournalEntryView({ entry }: { entry: Entry }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/journal/${entry.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = (await response.json().catch(() => ({}))) as { error?: string };
        setError(result.error ?? GENERIC_ERROR);
        return;
      }
      router.push("/teen/journal");
      router.refresh();
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <Card>
        <JournalEditor entry={entry} onCancel={() => setEditing(false)} />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-ink">
            {entry.title ?? "Untitled entry"}
          </h1>
          <p className="text-sm text-muted">
            {entry.createdAtLabel}
            {entry.updatedAtLabel && ` · edited ${entry.updatedAtLabel}`}
          </p>
        </div>
        <p className="whitespace-pre-wrap text-ink">{entry.body}</p>
      </Card>

      {error && <Notice tone="error">{error}</Notice>}

      {confirming ? (
        <Card tone="soft" className="flex flex-col gap-3" aria-live="polite">
          <p className="font-medium text-ink">Delete this entry? This cannot be undone.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Yes, delete it"}
            </Button>
            <Button variant="secondary" onClick={() => setConfirming(false)} disabled={deleting}>
              Keep it
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => setEditing(true)}>Edit</Button>
          <Button variant="danger" onClick={() => setConfirming(true)}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
