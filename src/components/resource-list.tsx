import Link from "next/link";
import { excerpt, listCategories, listResources, type Section } from "@/lib/resources";
import { Card, focusRing } from "./ui";

export async function ResourceList({
  section,
  category,
}: {
  section: Section;
  category?: string;
}) {
  const [categories, resources] = await Promise.all([
    listCategories(section),
    listResources(section, category),
  ]);

  return (
    <div className="flex flex-col gap-4">
      {categories.length > 1 && (
        <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
          <CategoryChip href={section.basePath} active={!category} label="All" />
          {categories.map((item) => (
            <CategoryChip
              key={item}
              href={`${section.basePath}?category=${encodeURIComponent(item)}`}
              active={category === item}
              label={item}
            />
          ))}
        </nav>
      )}

      {resources.length === 0 ? (
        <Card tone="soft">
          <p className="text-ink">No resources in this category.</p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {resources.map((resource) => (
            <li key={resource.id}>
              <Link
                href={`${section.basePath}/${resource.id}`}
                className={`block rounded-[14px] ${focusRing}`}
              >
                <Card className="flex flex-col gap-1 hover:bg-soft">
                  <p className="text-xs font-bold uppercase tracking-wide text-accent">
                    {resource.category}
                  </p>
                  <h2 className="text-lg font-semibold text-ink">{resource.title}</h2>
                  <p className="text-muted">{excerpt(resource.body)}</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CategoryChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold ${
        active
          ? "border-primary bg-primary text-primary-ink"
          : "border-border bg-surface text-ink hover:bg-soft"
      } ${focusRing}`}
    >
      {label}
    </Link>
  );
}
