"use client";

import { useActionState } from "react";
import { Button, Field, Notice, inputClass } from "@/components/ui";
import { completeOnboarding, type OnboardingState } from "./actions";

const roles = [
  {
    value: "PARENT",
    title: "Parent",
    description: "Guidance, conversation starters and a shared weekly streak.",
  },
  {
    value: "TEEN",
    title: "Teen",
    description: "A private journal, feelings check-ins and ways to bring things up.",
  },
] as const;

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState<OnboardingState, FormData>(
    completeOnboarding,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <Field
        label="What should we call you?"
        htmlFor="displayName"
        hint="Your first name or a nickname. Between 2 and 40 characters."
        error={state.fields?.displayName}
      >
        <input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="nickname"
          maxLength={40}
          required
          className={inputClass}
          aria-invalid={state.fields?.displayName ? true : undefined}
          aria-describedby={state.fields?.displayName ? "displayName-error" : undefined}
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 font-medium text-ink">I am a…</legend>
        {roles.map((role) => (
          <label
            key={role.value}
            className="flex cursor-pointer items-start gap-3 rounded-[14px] border border-border bg-surface p-4 has-[:checked]:border-primary has-[:checked]:bg-soft"
          >
            <input
              type="radio"
              name="role"
              value={role.value}
              required
              className="mt-1 size-5 accent-primary"
            />
            <span className="flex flex-col">
              <span className="font-bold text-ink">{role.title}</span>
              <span className="text-sm text-muted">{role.description}</span>
            </span>
          </label>
        ))}
        {state.fields?.role && (
          <p role="alert" className="text-sm font-medium text-[#B83A26]">
            {state.fields.role}
          </p>
        )}
      </fieldset>

      {state.error && <Notice tone="error">{state.error}</Notice>}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : "Continue"}
      </Button>
    </form>
  );
}
