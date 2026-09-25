import { CaseStudyArticle } from "@/components/case-study/CaseStudyArticle";
import { PasswordGate } from "@/components/case-study/PasswordGate";
import { FooterRow } from "@/components/layout/FooterRow";
import { isGatedSlug } from "@/lib/gated";
import { getCaseStudyPage } from "@/lib/sanity/fetch";
import { hasGateAccess } from "@/lib/session";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getCaseStudyPage(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    robots: { index: false, follow: false },
    alternates: { canonical: `/project/${slug}` },
    openGraph: {
      title: `${project.title} — ${siteConfig.name}`,
      description: project.description,
    },
  };
}

export default async function GatedProjectPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  if (!isGatedSlug(slug)) notFound();

  const query = await searchParams;
  const project = await getCaseStudyPage(slug);
  if (!project) notFound();

  const unlocked = await hasGateAccess();
  if (!unlocked) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <PasswordGate
            next={`/project/${slug}`}
            error={query.error === "1" || query.error?.[0] === "1"}
          />
        </div>
        <FooterRow />
      </div>
    );
  }

  return <CaseStudyArticle page={project} />;
}
