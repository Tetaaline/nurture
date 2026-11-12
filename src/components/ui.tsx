import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const buttonBase = `inline-flex items-center justify-center gap-2 rounded-[10px] px-4 font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

const buttonVariants = {
  primary: "bg-primary text-primary-ink hover:opacity-90",
  secondary: "border border-border bg-surface text-ink hover:bg-soft",
  danger: "border border-[#B83A26] bg-surface text-[#B83A26] hover:bg-[#FBEDEA]",
  ghost: "text-primary hover:underline",
} as const;

const buttonSizes = {
  md: "min-h-11",
  lg: "min-h-12 w-full sm:w-auto",
} as const;

type ButtonStyle = {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export function buttonClass({ variant = "primary", size = "md" }: ButtonStyle = {}) {
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]}`;
}

export function Button({
  variant,
  size,
  className = "",
  type = "button",
  ...rest
}: ComponentProps<"button"> & ButtonStyle) {
  return (
    <button
      type={type}
      className={`${buttonClass({ variant, size })} ${className}`}
      {...rest}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  className = "",
  ...rest
}: ComponentProps<typeof Link> & ButtonStyle) {
  return (
    <Link className={`${buttonClass({ variant, size })} ${className}`} {...rest} />
  );
}

const cardTones = {
  surface: "bg-surface",
  soft: "bg-soft",
  accent: "bg-accent-soft",
} as const;

export function Card({
  className = "",
  tone = "surface",
  ...rest
}: ComponentProps<"section"> & { tone?: keyof typeof cardTones }) {
  return (
    <section
      className={`rounded-[14px] border border-border p-4 sm:p-[18px] ${cardTones[tone]} ${className}`}
      {...rest}
    />
  );
}

export const inputClass = `w-full rounded-[10px] border border-border bg-surface px-3 py-3 text-ink placeholder:text-muted/70 ${focusRing}`;

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-sm text-muted">{hint}</p>}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-sm font-medium text-[#B83A26]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

const noticeTones = {
  neutral: "border-border bg-accent-soft text-ink",
  error: "border-[#E8B4AC] bg-[#FBEDEA] text-[#7F2A1B]",
  success: "border-[#BFE0CB] bg-[#EAF6EE] text-[#1F5E3B]",
} as const;

export function Notice({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: keyof typeof noticeTones;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={`rounded-[10px] border px-3 py-2.5 text-sm ${noticeTones[tone]}`}
    >
      {children}
    </p>
  );
}

export function HealthcareNotice() {
  return (
    <p className="text-sm text-muted">
      NURTURE is an educational tool. It is not a replacement for professional
      healthcare.
    </p>
  );
}

export function PageTitle({
  children,
  lead,
}: {
  children: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{children}</h1>
      {lead && <p className="text-muted">{lead}</p>}
    </div>
  );
}
