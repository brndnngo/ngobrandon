import { CaseStudyArticle } from "@/components/case-study/CaseStudyArticle";
import { isGatedSlug } from "@/lib/gated";
import {
  getCaseStudyPage,
  getPublicProjectSlugs,
  isHiddenProject,
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
  if (isGatedSlug(slug) || isHiddenProject(slug)) notFound();
  const project = await getCaseStudyPage(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/project/${slug}` },
    openGraph: {
      title: `${project.title} — ${siteConfig.name}`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (isGatedSlug(slug) || isHiddenProject(slug)) notFound();

  const project = await getCaseStudyPage(slug);
  if (!project) notFound();

  return <CaseStudyArticle page={project} />;
}
