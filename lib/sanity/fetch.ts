import "server-only";

import { client } from "./client";
import { isSanityConfigured } from "./env";
import {
  projectBodyQuery,
  projectCardsQuery,
  projectHeroQuery,
  publicProjectSlugsQuery,
} from "./queries";
import type { ProjectBody, ProjectCard, ProjectHero } from "./types";
import { seedBody, seedCards, seedHero } from "@/content/projects";

export async function getProjectCards(): Promise<ProjectCard[]> {
  if (isSanityConfigured && client) {
    const remote = await client.fetch<ProjectCard[]>(
      projectCardsQuery,
      {},
      { next: { tags: ["projects"] } },
    );
    if (remote?.length) return remote;
  }
  return seedCards;
}

export async function getProjectHero(
  slug: string,
): Promise<ProjectHero | null> {
  if (isSanityConfigured && client) {
    const remote = await client.fetch<ProjectHero | null>(
      projectHeroQuery,
      { slug },
      { next: { tags: ["projects", `project:${slug}`] } },
    );
    if (remote) return remote;
  }
  return seedHero(slug);
}

export async function getProjectBody(slug: string): Promise<ProjectBody> {
  if (isSanityConfigured && client) {
    const remote = await client.fetch<{ body: ProjectBody } | null>(
      projectBodyQuery,
      { slug },
      { next: { tags: ["projects", `project:${slug}`] } },
    );
    if (remote?.body) return remote.body;
  }
  return seedBody(slug);
}

export async function getPublicProjectSlugs(): Promise<string[]> {
  if (isSanityConfigured && client) {
    const remote = await client.fetch<string[]>(
      publicProjectSlugsQuery,
      {},
      { next: { tags: ["projects"] } },
    );
    if (remote?.length) return remote;
  }
  return seedCards
    .filter((card) => !card.gated && !card.href)
    .map((card) => card.slug);
}
