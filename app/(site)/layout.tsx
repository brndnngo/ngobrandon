import { SiteShell } from "@/components/layout/SiteShell";
import { getProjectCards } from "@/lib/sanity/fetch";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getProjectCards();
  return <SiteShell projects={projects}>{children}</SiteShell>;
}
