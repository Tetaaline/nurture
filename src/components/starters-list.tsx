import Link from "next/link";
import type { Role } from "@generated/prisma/enums";
import { listStartersWithTopics, sectionsFor } from "@/lib/resources";
import { Card, focusRing } from "./ui";

export async function StartersList({ role }: { role: Role }) {
  const starters = await listStartersWithTopics();
  const sections = sectionsFor(role);

  const grouped = new Map<string, typeof starters>();
  for (const starter of starters) {
    const list = grouped.get(starter.category) ?? [];
    list.push(starter);
    grouped.set(starter.category, list);
  }

  if (starters.length === 0) {
    return (
      <Card tone="soft">
        <p className="text-ink">No conversation starters yet.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {[...grouped.entries()].map(([category, items]) => (
        <section key={category} className="flex flex-col gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wide text-accent">{category}</h2>
          <ul className="flex flex-col gap-2">
            {items.map((starter) => {
              const topic = starter.resource;
              const section =
                topic && topic.isPublished
                  ? sections.find(
                      (candidate) =>
                        candidate.type === topic.type &&
                        (candidate.audiences === null || candidate.audiences.includes(topic.audience)),
                    )
                  : undefined;
              return (
                <li key={starter.id}>
                  <Card className="flex flex-col gap-1">
                    <p className="text-ink">&ldquo;{starter.text}&rdquo;</p>
                    {topic && section && (
                      <Link
                        href={`${section.basePath}/${topic.id}`}
                        className={`inline-flex min-h-11 items-center self-start rounded-[10px] text-sm font-bold text-primary hover:underline ${focusRing}`}
                      >
                        Read: {topic.title}
                      </Link>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
