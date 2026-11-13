import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import type { Role } from "@generated/prisma/enums";
import { ActiveNavLinks, NavLinks, type NavItem } from "./bottom-nav";
import { BookIcon, HomeIcon, PeopleIcon, PersonIcon, SpeechIcon } from "./icons";
import { focusRing } from "./ui";

const navFor: Record<Role, NavItem[]> = {
  PARENT: [
    { href: "/parent", label: "Home", icon: <HomeIcon /> },
    { href: "/parent/understand", label: "Understand", icon: <BookIcon /> },
    { href: "/connect", label: "Connect", icon: <PeopleIcon /> },
    { href: "/parent/profile", label: "Profile", icon: <PersonIcon /> },
  ],
  TEEN: [
    { href: "/teen", label: "Home", icon: <HomeIcon /> },
    { href: "/teen/express", label: "Express", icon: <SpeechIcon /> },
    { href: "/connect", label: "Connect", icon: <PeopleIcon /> },
    { href: "/teen/profile", label: "Profile", icon: <PersonIcon /> },
  ],
};

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-[22px] py-3">
          <Link
            href={role === "PARENT" ? "/parent" : "/teen"}
            className={`inline-flex min-h-11 items-center rounded-[10px] text-lg font-bold tracking-[0.18em] text-primary ${focusRing}`}
          >
            NURTURE
          </Link>
          <span className="rounded-full bg-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            {role === "PARENT" ? "Parent" : "Teen"}
          </span>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-[22px] py-5 pb-24">
        {children}
      </main>
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
      >
        <Suspense fallback={<NavLinks items={navFor[role]} pathname={null} />}>
          <ActiveNavLinks items={navFor[role]} />
        </Suspense>
      </nav>
    </div>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-[22px] py-4 sm:gap-5 sm:py-6">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className={`inline-flex min-h-11 items-center rounded-[10px] text-lg font-bold tracking-[0.18em] text-primary ${focusRing}`}
        >
          NURTURE
        </Link>
      </header>
      {children}
    </div>
  );
}
