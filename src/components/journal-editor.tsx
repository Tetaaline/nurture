"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, ButtonLink, Field, Notice, inputClass } from "./ui";

const TITLE_MAX = 100;
const BODY_MAX = 5000;
const GENERIC_ERROR = "Something went wrong. Please try again.";

type Entry = { id: string; title: string | null; body: string };

type ApiResult = {
  entry?: { id: string };
  error?: string;
  fields?: Record<string, string>;
};

export function JournalEditor({
  entry,
  onCancel,
}: {
  entry?: Entry;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(entry?.title ?? "");
  const [body, setBody] = useState(entry?.body ?? "");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFields({});
    try {
      const response = await fetch(entry ? `/api/journal/${entry.id}` : "/api/journal", {
        method: entry ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const result = (await response.json().catch(() => ({}))) as ApiResult;
      if (!response.ok) {
        setFields(result.fields ?? {});
        setError(result.fields ? null : (result.error ?? GENERIC_ERROR));
        return;
      }
      const id = result.entry?.id ?? entry?.id;
      router.push(id ? `/teen/journal/${id}` : "/teen/journal");
      router.refresh();
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label="Title (optional)"
        htmlFor="title"
        hint={`${title.length}/${TITLE_MAX}`}
        error={fields.title}
      >
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClass}
          placeholder="A few words, if you like"
          aria-invalid={fields.title ? true : undefined}
          aria-describedby={fields.title ? "title-error" : undefined}
        />
      </Field>

      <Field
        label="What is on your mind?"
        htmlFor="body"
        hint={`${body.length}/${BODY_MAX}`}
        error={fields.body}
      >
        <textarea
          id="body"
          name="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={10}
          className={`${inputClass} min-h-48 resize-y`}
          placeholder="Write freely. Only you can see this, not even your parent."
          aria-invalid={fields.body ? true : undefined}
          aria-describedby={fields.body ? "body-error" : undefined}
        />
      </Field>

      {error && <Notice tone="error">{error}</Notice>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Saving…" : entry ? "Save changes" : "Save entry"}
        </Button>
        {onCancel ? (
          <Button variant="secondary" size="lg" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        ) : (
          <ButtonLink href="/teen/journal" variant="secondary" size="lg">
            Cancel
          </ButtonLink>
        )}
      </div>
    </form>
  );
}
