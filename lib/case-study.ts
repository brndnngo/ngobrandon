import type { PortableTextBlock } from "@portabletext/react";
import type { Collaborator } from "@/lib/sanity/types";
import type { TocGroup } from "@/components/case-study/SideNav";

export type CaseStudyMedia = {
  src: string;
  alt: string;
  videoSrc?: string;
  caption?: string;
  fit?: "cover" | "inset";
  stroke?: boolean;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  width?: number;
  height?: number;
};

export type CaseStudySectionBlock = {
  _type: "section";
  _key: string;
  id: string;
  eyebrow?: string;
  heading: string;
  tocLabel?: string;
  includeInToc: boolean;
  body: PortableTextBlock[];
};

export type CaseStudyMediaBlock = {
  _type: "mediaBlock";
  _key: string;
  media: CaseStudyMedia;
};

export type CaseStudyMediaGridBlock = {
  _type: "mediaGrid";
  _key: string;
  ratio: "1:1" | "16:9";
  caption?: string;
  items: CaseStudyMedia[];
};

export type CaseStudyStat = {
  kicker?: string;
  value: string;
  label: string;
};

export type CaseStudyStatBlock = {
  _type: "statRow";
  _key: string;
  note?: string;
  items: CaseStudyStat[];
};

export type CaseStudyQuoteBlock = {
  _type: "quote";
  _key: string;
  quote: string;
  attribution: string;
};

export type CaseStudyBlock =
  | CaseStudySectionBlock
  | CaseStudyMediaBlock
  | CaseStudyMediaGridBlock
  | CaseStudyStatBlock
  | CaseStudyQuoteBlock;

export type CaseStudyPage = {
  slug: string;
  title: string;
  description: string;
  timeline: string;
  role: string;
  collaborators: Collaborator[];
  hero: CaseStudyMedia | null;
  blocks: CaseStudyBlock[];
  legacyBody: unknown[] | null;
};

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function tableOfContents(blocks: CaseStudyBlock[]): TocGroup[] {
  const groups: TocGroup[] = [];

  for (const block of blocks) {
    if (block._type !== "section" || !block.includeInToc) continue;
    const label = block.tocLabel || block.eyebrow || block.heading;
    const item = { id: block.id, label };
    if (block.eyebrow) {
      groups.push({ ...item, children: [] });
      continue;
    }
    const parent = groups.at(-1);
    if (parent) parent.children.push(item);
    else groups.push({ ...item, children: [] });
  }

  return groups;
}
