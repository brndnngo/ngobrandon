import "server-only";

import { client } from "./client";
import { isSanityConfigured } from "./env";
import {
  CASE_STUDIES_INDEX_QUERY,
  CASE_STUDY_BY_SLUG_QUERY,
} from "./caseStudyQueries";
import { seedCaseStudy } from "@/content/caseStudies";
import type { CaseStudyPage } from "@/lib/case-study";
import { caseStudyToCard, caseStudyToHero, caseStudyToPage, mergeProjectCards } from "./map";
import type { ProjectBody, ProjectCard, ProjectHero } from "./types";
import type {
  CASE_STUDIES_INDEX_QUERY_RESULT,
  CASE_STUDY_BY_SLUG_QUERY_RESULT,
} from "@/sanity.types";
import { seedBody, seedCards, seedHero } from "@/content/projects";

const tags = { next: { tags: ["case-studies"] } };

async function fetchCaseStudies() {
  if (!isSanityConfigured || !client) return [];
  try {
    const remote = await client
      .withConfig({ useCdn: false })
      .fetch<CASE_STUDIES_INDEX_QUERY_RESULT>(
        CASE_STUDIES_INDEX_QUERY,
        {},
        tags,
      );
    return (remote ?? [])
      .map(caseStudyToCard)
      .filter((card): card is ProjectCard => Boolean(card));
  } catch {
    return [];
  }
}

async function fetchCaseStudy(slug: string) {
  if (!isSanityConfigured || !client) return null;
  try {
    return await client
      .withConfig({ useCdn: false })
      .fetch<CASE_STUDY_BY_SLUG_QUERY_RESULT>(
        CASE_STUDY_BY_SLUG_QUERY,
        { slug },
        { next: { tags: ["case-studies", `case-study:${slug}`] } },
      );
  } catch {
    return null;
  }
}

export function isHiddenProject(slug: string) {
  return seedCards.some((card) => card.slug === slug && card.hidden);
}

export async function getProjectCards(): Promise<ProjectCard[]> {
  const remote = await fetchCaseStudies();
  return mergeProjectCards(seedCards, remote).filter((card) => !card.hidden);
}

export async function getProjectHero(
  slug: string,
): Promise<ProjectHero | null> {
  const remote = await fetchCaseStudy(slug);
  if (remote) return caseStudyToHero(remote);
  return seedHero(slug);
}

function legacyPage(slug: string): CaseStudyPage | null {
  const hero = seedHero(slug);
  if (!hero) return null;
  return {
    slug,
    title: hero.title,
    description: hero.summary,
    timeline: hero.timeline,
    role: hero.role,
    collaborators: hero.collaborators,
    hero: null,
    blocks: [],
    legacyBody: seedBody(slug),
  };
}

export async function getCaseStudyPage(
  slug: string,
): Promise<CaseStudyPage | null> {
  if (isHiddenProject(slug)) return null;
  const remote = await fetchCaseStudy(slug);
  const seeded = seedCaseStudy(slug) ?? legacyPage(slug);
  if (!remote) return seeded;

  const page = caseStudyToPage(remote);
  if (page.blocks.length) return page;
  if (!seeded) return page;

  return {
    ...seeded,
    title: remote.title || seeded.title,
    description: page.description || seeded.description,
    timeline: page.timeline || seeded.timeline,
    role: page.role || seeded.role,
    collaborators: page.collaborators.length
      ? page.collaborators
      : seeded.collaborators,
    hero: page.hero ?? seeded.hero,
    legacyBody: seeded.blocks.length
      ? seeded.legacyBody
      : remote.body?.length
        ? remote.body
        : seeded.legacyBody,
  };
}

export async function getProjectBody(slug: string): Promise<ProjectBody> {
  const remote = await fetchCaseStudy(slug);
  if (remote?.body?.length) return remote.body;
  return seedBody(slug);
}

export async function getPublicProjectSlugs(): Promise<string[]> {
  const cards = await getProjectCards();
  return cards
    .filter((card) => !card.gated && !card.href)
    .map((card) => card.slug);
}
