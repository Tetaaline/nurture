"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FEELINGS, type FeelingValue } from "@/lib/feelings";
import { Button, Field, Notice, focusRing, inputClass } from "./ui";

const NOTE_MAX = 500;
const GENERIC_ERROR = "Something went wrong. Please try again.";

export function CheckInForm() {
  const router = useRouter();
  const [feeling, setFeeling] = useState<FeelingValue | null>(null);
  const [note, setNote] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setFields({});
    setSaved(false);
    try {
      const response = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeling, note }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok) {
        setFields(result.fields ?? {});
        setError(result.fields ? null : (result.error ?? GENERIC_ERROR));
        return;
      }
      setSaved(true);
      setFeeling(null);
      setNote("");
      router.refresh();
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 font-medium text-ink">How are you feeling right now?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FEELINGS.map((option) => {
            const selected = feeling === option.value;
            return (
              <label
                key={option.value}
                className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-[10px] border px-3 font-bold ${
                  selected ? "border-primary bg-soft text-ink" : "border-border bg-surface text-ink hover:bg-soft"
                } has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary`}
              >
                <input
                  type="radio"
                  name="feeling"
                  value={option.value}
                  checked={selected}
                  onChange={() => setFeeling(option.value)}
                  className="sr-only"
                />
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: option.color }}
                  aria-hidden="true"
                />
                {option.label}
              </label>
            );
          })}
        </div>
        {fields.feeling && (
          <p role="alert" className="text-sm font-medium text-[#B83A26]">
            {fields.feeling}
          </p>
        )}
      </fieldset>

      <Field
        label="Add a note (optional)"
        htmlFor="note"
        hint={`${note.length}/${NOTE_MAX}. Only you can see this.`}
        error={fields.note}
      >
        <textarea
          id="note"
          name="note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className={`${inputClass} resize-y`}
          placeholder="What is behind the feeling?"
          aria-invalid={fields.note ? true : undefined}
          aria-describedby={fields.note ? "note-error" : undefined}
        />
      </Field>

      {error && <Notice tone="error">{error}</Notice>}
      {saved && <Notice tone="success">Check-in saved.</Notice>}

      <Button type="submit" size="lg" disabled={busy || !feeling} className={focusRing}>
        {busy ? "Saving…" : "Save check-in"}
      </Button>
    </form>
  );
}
