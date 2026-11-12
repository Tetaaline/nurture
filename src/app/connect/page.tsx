import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { FlameIcon } from "@/components/icons";
import { InviteCodePanel } from "@/components/invite-code-panel";
import { RedeemCodeForm } from "@/components/redeem-code-form";
import { Card, PageTitle } from "@/components/ui";
import { WeTalkedButton } from "@/components/we-talked-button";
import { requirePageUser } from "@/lib/auth";
import { getHistory, getStreak, listStarters } from "@/lib/conversations";
import { formatDateTime } from "@/lib/dates";
import { findFamily, partnerName } from "@/lib/family";
import { getActiveCode } from "@/lib/invite";

export default function ConnectPage() {
  return (
    <Suspense fallback={<p className="px-[22px] py-5 text-muted">Loading…</p>}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const user = await requirePageUser();
  const family = await findFamily(user);
  const partner = partnerName(family, user);
  const linked = Boolean(family?.teen && partner);

  return (
    <AppShell role={user.role}>
      <PageTitle lead="Link your family and keep the conversation going.">Connect</PageTitle>

      <Card tone={linked ? "surface" : "soft"} className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-ink">Your family</h2>
        {linked ? (
          <p className="flex items-center gap-2 font-medium text-ink">
            <span className="size-2.5 rounded-full bg-success" aria-hidden="true" />
            Linked with {partner}
          </p>
        ) : user.role === "PARENT" && family ? (
          <>
            <p className="text-muted">
              Generate a code and share it with your teen. They enter it on their
              Connect page.
            </p>
            <InviteCodePanel
              activeExpiresAt={(await getActiveCode(family.id))?.expiresAt.toISOString() ?? null}
            />
            <p className="text-sm text-muted">
              How the code works: it lasts 24 hours, can be used once, and you can
              revoke it at any time. Generating a new code cancels the old one.
            </p>
          </>
        ) : (
          <>
            <p className="text-muted">
              Ask your parent for the 8-character code from their Connect page.
            </p>
            <RedeemCodeForm />
            <p className="text-sm text-muted">
              A code works for 24 hours and only once. After five wrong tries you
              will need to wait 15 minutes.
            </p>
          </>
        )}
      </Card>

      {linked && family ? (
        <StreakSection familyId={family.id} />
      ) : (
        <Card className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-ink">Weekly streak</h2>
          <p className="text-muted">
            Once you are linked, press &ldquo;We talked&rdquo; after a real
            conversation. Every week with at least one conversation adds to your
            streak.
          </p>
        </Card>
      )}
    </AppShell>
  );
}

async function StreakSection({ familyId }: { familyId: string }) {
  const [{ streak, talkedThisWeek }, history, starters] = await Promise.all([
    getStreak(familyId),
    getHistory(familyId),
    listStarters(),
  ]);

  return (
    <>
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Weekly streak</h2>
          <span className="flex items-center gap-1 text-primary">
            <FlameIcon />
            <span className="font-heading text-3xl font-bold">{streak}</span>
            <span className="text-sm text-muted">{streak === 1 ? "week" : "weeks"}</span>
          </span>
        </div>
        <p className="text-muted">
          {talkedThisWeek
            ? "You have talked this week. Keep going next week to extend the streak."
            : "No conversation recorded this week yet."}
        </p>
        <WeTalkedButton starters={starters} />
        <p className="text-sm text-muted">
          How it is counted: weeks run Monday to Sunday (Kigali time). A week counts
          if it has at least one conversation. The streak is the number of counting
          weeks in a row, including last week if this week is still empty. A whole
          empty week resets it to 0.
        </p>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-ink">History</h2>
        {history.length === 0 ? (
          <p className="text-muted">No conversations recorded yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {history.map((record) => (
              <li key={record.id} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
                <span className="font-medium text-ink">{formatDateTime(record.completedAt)}</span>
                <span className="text-sm text-muted">
                  Recorded by {record.recordedBy.displayName}
                  {record.starter ? ` · ${record.starter.text}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
