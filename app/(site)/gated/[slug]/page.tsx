import { FooterCTA } from "@/components/layout/FooterCTA";
import { PasswordGate } from "@/components/case-study/PasswordGate";
import { Hero } from "@/components/case-study/Hero";
import { CaseStudyBody } from "@/components/portable-text/CaseStudyBody";
import { isGatedSlug } from "@/lib/gated";
import { getProjectBody, getProjectHero } from "@/lib/sanity/fetch";
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
  const project = await getProjectHero(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    robots: { index: false, follow: false },
    alternates: { canonical: `/project/${slug}` },
    openGraph: {
      title: `${project.title} — ${siteConfig.name}`,
      description: project.summary,
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
  const project = await getProjectHero(slug);
  if (!project) notFound();

  const unlocked = await hasGateAccess();
  if (!unlocked) {
    return (
      <PasswordGate
        next={`/project/${slug}`}
        error={query.error === "1" || query.error?.[0] === "1"}
      />
    );
  }

  const body = await getProjectBody(slug);

  return (
    <>
      <Hero project={project} />
      <CaseStudyBody value={body} />
      <FooterCTA />
    </>
  );
}
