"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { focusRing } from "./ui";

export type NavItem = { href: string; label: string; icon: ReactNode };

function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  const isSectionRoot = href.split("/").filter(Boolean).length === 1;
  return !isSectionRoot && pathname.startsWith(`${href}/`);
}

export function NavLinks({ items, pathname }: { items: NavItem[]; pathname: string | null }) {
  return (
    <ul className="mx-auto grid max-w-3xl grid-cols-4">
      {items.map((item) => {
        const active = pathname !== null && isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                active ? "text-primary" : "text-muted hover:text-ink"
              } ${focusRing}`}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ActiveNavLinks({ items }: { items: NavItem[] }) {
  return <NavLinks items={items} pathname={usePathname()} />;
}
