import Link from "next/link";
import type { ReactNode } from "react";

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const pillars: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "Understand",
    description:
      "Practical guidance for parents on emotions, puberty, discipline and more.",
    icon: (
      <svg {...iconProps}>
        <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4H10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H3.5A1.5 1.5 0 0 1 2 16.5z" />
        <path d="M22 5.5A1.5 1.5 0 0 0 20.5 4H14a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6.5a1.5 1.5 0 0 0 1.5-1.5z" />
      </svg>
    ),
  },
  {
    title: "Express",
    description: "Tools for teens to name their feelings and find the words.",
    icon: (
      <svg {...iconProps}>
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z" />
      </svg>
    ),
  },
  {
    title: "Connect",
    description:
      "Conversation starters and a weekly streak for the whole family.",
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
        <path d="M16 5.2a3 3 0 0 1 0 5.6" />
        <path d="M21 20v-1a5 5 0 0 0-3-4.6" />
      </svg>
    ),
  },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-[22px] py-4 sm:gap-5 sm:py-6">
      <header className="flex items-center justify-between">
        <p className="text-lg font-bold tracking-[0.18em] text-primary">
          NURTURE
        </p>
        <Link
          href="/sign-in"
          className={`inline-flex min-h-11 items-center rounded-[10px] px-2 font-bold text-primary hover:underline ${focusRing}`}
        >
          Sign in
        </Link>
      </header>

      <main className="flex flex-col gap-4 sm:gap-5">
        <section
          aria-labelledby="intro-heading"
          className="flex flex-col gap-4 rounded-[14px] border border-border bg-soft p-[18px] sm:p-8"
        >
          <h1
            id="intro-heading"
            className="max-w-xl text-3xl font-semibold leading-tight text-ink sm:text-4xl"
          >
            Better conversations at home start here
          </h1>
          <p className="max-w-xl text-muted">
            Guidance for parents, a safe space for teens, and simple ways to
            talk as a family.
          </p>
          <Link
            href="/sign-up"
            className={`inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-primary px-5 font-bold text-primary-ink hover:opacity-90 sm:w-auto sm:self-start ${focusRing}`}
          >
            Create an account
          </Link>
        </section>

        <section
          aria-label="How NURTURE helps"
          className="grid gap-4 md:grid-cols-3"
        >
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="flex flex-col gap-2 rounded-[14px] border border-border bg-surface p-[18px]"
            >
              <span className="flex size-10 items-center justify-center rounded-[10px] bg-soft text-primary">
                {pillar.icon}
              </span>
              <h2 className="text-xl font-semibold text-ink">{pillar.title}</h2>
              <p className="text-muted">{pillar.description}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="mt-auto pt-4">
        <p className="text-sm text-muted">
          NURTURE is an educational tool. It is not a replacement for
          professional healthcare.
        </p>
      </footer>
    </div>
  );
}
