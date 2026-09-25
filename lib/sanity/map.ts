import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import type {
  CASE_STUDIES_INDEX_QUERY_RESULT,
  CASE_STUDY_BY_SLUG_QUERY_RESULT,
} from "@/sanity.types";
import {
  slugifyHeading,
  type CaseStudyBlock,
  type CaseStudyMedia,
  type CaseStudyPage,
} from "@/lib/case-study";
import { urlFor } from "./image";
import type { ProjectCard, ProjectHero } from "./types";

type CaseStudyCard = CASE_STUDIES_INDEX_QUERY_RESULT[number];
type CaseStudyDoc = NonNullable<CASE_STUDY_BY_SLUG_QUERY_RESULT>;

export function formatTimeline(
  timeline: CaseStudyDoc["timeline"] | null | undefined,
) {
  if (!timeline) return "";
  const start = `${timeline.startMonth} ${timeline.startYear}`;
  if (!timeline.endMonth || !timeline.endYear) return `${start} - Present`;
  return `${start} - ${timeline.endMonth} ${timeline.endYear}`;
}

export function caseStudyToCard(doc: CaseStudyCard): ProjectCard | null {
  if (!doc.slug) return null;
  return {
    slug: doc.slug,
    title: doc.title,
    cardTitle: doc.shortDescription || doc.title,
    year: String(doc.year),
    summary: doc.shortDescription || doc.title,
    gated: false,
    order: doc.orderRank,
    selected: Boolean(doc.featured),
    discipline: doc.category,
    color: doc.accentColor,
    thumbnail: doc.previewImage ?? doc.heroStill,
    preview: doc.preview,
  };
}

type MediaPaddingSource = {
  top?: number | null;
  right?: number | null;
  bottom?: number | null;
  left?: number | null;
} | null;

type MediaSource = {
  alt?: string | null;
  caption?: string | null;
  fit?: string | null;
  stroke?: boolean | null;
  padding?: MediaPaddingSource;
  width?: number | null;
  height?: number | null;
  image?: SanityImageSource | null;
  video?: { asset?: { url?: string | null } | null } | null;
};

function mediaFit(value: string | null | undefined): "cover" | "inset" {
  return value === "inset" || value === "contain" ? "inset" : "cover";
}

function mediaPadding(source: MediaPaddingSource | undefined) {
  if (!source) return undefined;
  const padding: NonNullable<CaseStudyMedia["padding"]> = {};
  for (const edge of ["top", "right", "bottom", "left"] as const) {
    const value = source[edge];
    if (typeof value === "number") padding[edge] = value;
  }
  return Object.keys(padding).length ? padding : undefined;
}

function mediaFrom(source: MediaSource | null | undefined): CaseStudyMedia | null {
  if (!source?.image) return null;
  const src = urlFor(source.image)?.width(2400).url();
  if (!src) return null;
  return {
    src,
    alt: source.alt ?? "",
    videoSrc: source.video?.asset?.url ?? undefined,
    caption: source.caption ?? undefined,
    fit: mediaFit(source.fit),
    stroke: Boolean(source.stroke),
    padding: mediaPadding(source.padding),
    width: source.width ?? undefined,
    height: source.height ?? undefined,
  };
}

function blocksFrom(
  body: NonNullable<CaseStudyDoc>["body"],
): CaseStudyBlock[] {
  if (!body) return [];
  const blocks: CaseStudyBlock[] = [];

  for (const block of body) {
    if (block._type === "section") {
      const label = block.tocLabel || block.eyebrow || block.heading;
      blocks.push({
        _type: "section",
        _key: block._key,
        id: slugifyHeading(label || block._key),
        eyebrow: block.eyebrow,
        heading: block.heading ?? "",
        tocLabel: block.tocLabel,
        includeInToc: block.includeInToc !== false,
        body: (block.body ?? []) as PortableTextBlock[],
      });
      continue;
    }

    if (block._type === "mediaBlock") {
      const media = mediaFrom(block);
      if (!media) continue;
      blocks.push({ _type: "mediaBlock", _key: block._key, media });
      continue;
    }

    if (block._type === "mediaGrid") {
      const items = (block.items ?? [])
        .map((item) => mediaFrom(item))
        .filter((item): item is CaseStudyMedia => Boolean(item));
      if (items.length < 2) continue;
      blocks.push({
        _type: "mediaGrid",
        _key: block._key,
        ratio: block.ratio,
        caption: block.caption,
        items,
      });
      continue;
    }

    if (block._type === "statRow") {
      blocks.push({
        _type: "statRow",
        _key: block._key,
        note: block.note,
        items: block.items.map((item) => ({
          kicker: item.kicker,
          value: item.value,
          label: item.label,
        })),
      });
      continue;
    }

    if (block._type === "contrast") {
      const before = block.before;
      const after = block.after;
      if (!before?.heading || !before.label || !after?.heading || !after.label) {
        continue;
      }
      blocks.push({
        _type: "contrast",
        _key: block._key,
        before: { heading: before.heading, label: before.label },
        after: { heading: after.heading, label: after.label },
      });
      continue;
    }

    if (block._type === "quote") {
      blocks.push({
        _type: "quote",
        _key: block._key,
        quote: block.quote,
        attribution: block.attribution,
      });
    }
  }

  return blocks;
}

export function caseStudyToPage(doc: CaseStudyDoc): CaseStudyPage {
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    timeline: formatTimeline(doc.timeline),
    role: doc.role,
    collaborators: (doc.collaborators ?? []).map((person) => ({
      name: person.name,
      role: person.title ?? "",
    })),
    hero: mediaFrom(doc.hero),
    blocks: blocksFrom(doc.body),
    legacyBody: null,
  };
}

export function caseStudyToHero(doc: CaseStudyDoc): ProjectHero {
  return {
    slug: doc.slug,
    title: doc.title,
    summary: doc.description,
    impact: [],
    timeline: formatTimeline(doc.timeline),
    role: doc.role,
    collaborators: (doc.collaborators ?? []).map((person) => ({
      name: person.name,
      role: person.title ?? "",
    })),
    gated: false,
    thumbnail: doc.hero?.image,
    heroImage: doc.hero?.image,
    heroAlt: doc.hero?.alt ?? "",
  };
}

export function mergeProjectCards(
  seed: ProjectCard[],
  remote: ProjectCard[],
): ProjectCard[] {
  const bySlug = new Map(seed.map((card) => [card.slug, card]));
  for (const card of remote) {
    bySlug.set(card.slug, { ...bySlug.get(card.slug), ...card });
  }
  return [...bySlug.values()].sort((a, b) => a.order - b.order);
}
