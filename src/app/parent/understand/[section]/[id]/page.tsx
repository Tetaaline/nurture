import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { ResourceDetail } from "@/components/resource-detail";
import { requirePageRole } from "@/lib/auth";
import { getSection } from "@/lib/resources";

type Props = PageProps<"/parent/understand/[section]/[id]">;

export default function ParentResourcePage({ params }: Props) {
  return (
    <AppShell role="PARENT">
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Content params={params} />
      </Suspense>
    </AppShell>
  );
}

async function Content({ params }: Pick<Props, "params">) {
  await requirePageRole("PARENT");
  const { section: key, id } = await params;
  const section = getSection("PARENT", key);
  if (!section) notFound();
  return <ResourceDetail section={section} id={id} role="PARENT" />;
}
