import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { getStreak } from "@/lib/conversations";
import { findFamily, partnerName } from "@/lib/family";
import { FlameIcon } from "./icons";
import { Card, focusRing } from "./ui";

export async function FamilyCard({ user }: { user: SessionUser }) {
  const family = await findFamily(user);
  const partner = partnerName(family, user);

  if (!family || !family.teen || !partner) {
    return (
      <Link href="/connect" className={`rounded-[14px] ${focusRing}`}>
        <Card tone="accent" className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-border" aria-hidden="true" />
            <span className="font-medium text-ink">
              {user.role === "PARENT"
                ? "Not linked yet. Invite your teen."
                : "Not linked yet. Enter your parent's code."}
            </span>
          </span>
          <span className="text-sm font-bold text-primary">Connect</span>
        </Card>
      </Link>
    );
  }

  const { streak, talkedThisWeek } = await getStreak(family.id);
  return (
    <Link href="/connect" className={`rounded-[14px] ${focusRing}`}>
      <Card className="flex items-center justify-between gap-3">
        <span className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-success" aria-hidden="true" />
            <span className="font-medium text-ink">Linked with {partner}</span>
          </span>
          <span className="text-sm text-muted">
            {talkedThisWeek ? "You talked this week." : "No conversation yet this week."}
          </span>
        </span>
        <span className="flex items-center gap-1 text-primary">
          <FlameIcon />
          <span className="font-heading text-2xl font-bold">{streak}</span>
          <span className="sr-only">week streak</span>
        </span>
      </Card>
    </Link>
  );
}
