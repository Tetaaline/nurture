import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { CheckInForm } from "@/components/checkin-form";
import { Card, PageTitle } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";
import { listCheckIns } from "@/lib/checkins";
import { formatDateTime } from "@/lib/dates";
import { feelingInfo } from "@/lib/feelings";

export default function CheckInPage() {
  return (
    <AppShell role="TEEN">
      <PageTitle lead="A quick way to notice what is going on inside. Only you can see this.">
        Feelings check-in
      </PageTitle>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Content />
      </Suspense>
    </AppShell>
  );
}

async function Content() {
  const user = await requirePageRole("TEEN");
  const checkIns = await listCheckIns(user.id);

  return (
    <>
      <Card>
        <CheckInForm />
      </Card>

      <section className="flex flex-col gap-3" aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="text-lg font-semibold text-ink">
          Your last {checkIns.length === 1 ? "check-in" : "check-ins"}
        </h2>
        {checkIns.length === 0 ? (
          <Card tone="soft">
            <p className="text-ink">No check-ins yet. Your first one takes ten seconds.</p>
          </Card>
        ) : (
          <ul className="flex flex-col gap-2">
            {checkIns.map((checkIn) => {
              const info = feelingInfo(checkIn.feeling);
              return (
                <li key={checkIn.id}>
                  <Card className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 font-bold text-ink">
                        <span
                          className="size-3 rounded-full"
                          style={{ backgroundColor: info.color }}
                          aria-hidden="true"
                        />
                        {info.label}
                      </span>
                      <span className="text-sm text-muted">{formatDateTime(checkIn.createdAt)}</span>
                    </div>
                    {checkIn.note && <p className="whitespace-pre-wrap text-ink">{checkIn.note}</p>}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
