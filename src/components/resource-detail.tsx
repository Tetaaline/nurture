import { notFound } from "next/navigation";
import type { Role } from "@generated/prisma/enums";
import { getResource, startersPath, type Section } from "@/lib/resources";
import { ArrowLeftIcon } from "./icons";
import { ResourceBody } from "./resource-body";
import { ButtonLink, Card } from "./ui";

export async function ResourceDetail({
  section,
  id,
  role,
}: {
  section: Section;
  id: string;
  role: Role;
}) {
  const resource = await getResource(section, id);
  if (!resource) notFound();

  return (
    <div className="flex flex-col gap-4">
      <ButtonLink href={section.basePath} variant="ghost" className="self-start px-0">
        <ArrowLeftIcon size={18} />
        Back to {section.title.toLowerCase()}
      </ButtonLink>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-wide text-accent">{resource.category}</p>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{resource.title}</h1>
        </div>
        <ResourceBody body={resource.body} type={resource.type} />
      </Card>

      {resource.type === "SENSITIVE_TOPIC" && resource.starters.length > 0 && (
        <Card tone="accent" className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">Starters for this topic</h2>
          <ul className="flex flex-col gap-2">
            {resource.starters.map((starter) => (
              <li key={starter.id} className="rounded-[10px] bg-surface p-3 text-ink">
                &ldquo;{starter.text}&rdquo;
              </li>
            ))}
          </ul>
          <ButtonLink href={startersPath(role)} variant="secondary">
            See all conversation starters
          </ButtonLink>
        </Card>
      )}
    </div>
  );
}
