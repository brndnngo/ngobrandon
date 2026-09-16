import type { SanityImageSource } from "@sanity/image-url";

export type Collaborator = {
  name: string;
  role: string;
};

export type ProjectCard = {
  slug: string;
  title: string;
  cardTitle: string;
  year: string;
  summary: string;
  gated: boolean;
  order: number;
  preview?: string | null;
  thumbnail?: SanityImageSource | string | null;
};

export type ProjectHero = {
  slug: string;
  title: string;
  summary: string;
  impact: string[];
  timeline: string;
  role: string;
  collaborators: Collaborator[];
  gated: boolean;
  thumbnail?: SanityImageSource | string | null;
};

export type ProjectBody = unknown[];
