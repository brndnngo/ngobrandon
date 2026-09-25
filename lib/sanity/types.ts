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
  /** Featured in the command palette when the search field is empty. */
  selected?: boolean;
  /** Homepage list/caption name when it differs from the case-study title. */
  indexTitle?: string | null;
  discipline?: string | null;
  /** Hex for the 8×8 index marker. */
  color?: string | null;
  /** External URL; when set, the index does not route to a case study. */
  href?: string | null;
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
  heroImage?: SanityImageSource | string | null;
  heroAlt?: string;
};

export type ProjectBody = unknown[];
