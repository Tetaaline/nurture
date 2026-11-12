"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, Field, Notice, inputClass } from "./ui";

const GENERIC_ERROR = "Something went wrong. Please try again.";

export function RedeemCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkedWith, setLinkedWith] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/family/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        partnerName?: string;
        error?: string;
      };
      if (!response.ok) {
        setError(result.error ?? GENERIC_ERROR);
        return;
      }
      setLinkedWith(result.partnerName ?? "your parent");
      router.refresh();
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  }

  if (linkedWith) {
    return <Notice tone="success">You are now linked with {linkedWith}.</Notice>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <Field
        label="Invitation code"
        htmlFor="code"
        hint="8 letters and numbers from your parent."
        error={error ?? undefined}
      >
        <input
          id="code"
          name="code"
          type="text"
          inputMode="text"
          autoComplete="one-time-code"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={12}
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          className={`${inputClass} font-heading text-xl tracking-[0.25em]`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "code-error" : undefined}
        />
      </Field>
      <Button type="submit" size="lg" disabled={busy || code.trim().length === 0}>
        {busy ? "Checking…" : "Link my family"}
      </Button>
    </form>
  );
}
