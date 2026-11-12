import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { ResourceList } from "@/components/resource-list";
import { PageTitle } from "@/components/ui";
import { requirePageRole } from "@/lib/auth";
import { getSection } from "@/lib/resources";

type Props = PageProps<"/teen/express/[section]">;

export default function TeenSectionPage({ params, searchParams }: Props) {
  return (
    <AppShell role="TEEN">
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Content params={params} searchParams={searchParams} />
      </Suspense>
    </AppShell>
  );
}

async function Content({ params, searchParams }: Props) {
  await requirePageRole("TEEN");
  const { section: key } = await params;
  const section = getSection("TEEN", key);
  if (!section) notFound();
  const { category } = await searchParams;
  const selected = typeof category === "string" && category ? category : undefined;

  return (
    <>
      <PageTitle lead={section.lead}>{section.title}</PageTitle>
      <ResourceList section={section} category={selected} />
    </>
  );
}
