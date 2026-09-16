import { FooterCTA } from "@/components/layout/FooterCTA";
import { Hero } from "@/components/case-study/Hero";
import { CaseStudyBody } from "@/components/portable-text/CaseStudyBody";
import { isGatedSlug } from "@/lib/gated";
import {
  getProjectBody,
  getProjectHero,
  getPublicProjectSlugs,
} from "@/lib/sanity/fetch";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPublicProjectSlugs();
  return slugs
    .filter((slug) => !isGatedSlug(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (isGatedSlug(slug)) notFound();
  const project = await getProjectHero(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/project/${slug}` },
    openGraph: {
      title: `${project.title} — ${siteConfig.name}`,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (isGatedSlug(slug)) notFound();

  const project = await getProjectHero(slug);
  if (!project) notFound();

  const body = await getProjectBody(slug);

  return (
    <>
      <Hero project={project} />
      <CaseStudyBody value={body} />
      <FooterCTA />
    </>
  );
}
