import { urlFor } from "@/lib/sanity/image";
import type { ProjectCard } from "@/lib/sanity/types";

export function projectIndexTitle(card: ProjectCard) {
  return card.indexTitle || card.title;
}

export function projectHref(card: ProjectCard) {
  return card.href || `/project/${card.slug}`;
}

export function projectIsExternal(card: ProjectCard) {
  return Boolean(card.href);
}

export function projectColor(card: ProjectCard) {
  if (!card.color) return "var(--color-foreground)";
  // Near-black Watch Club swatch would vanish on the dark page; map it to a token.
  if (card.color.replace("#", "").toLowerCase() === "171717") {
    return "var(--color-watch-club)";
  }
  return card.color;
}

export function projectIsSelected(card: ProjectCard) {
  return Boolean(card.selected);
}

export type ProjectMediaSource =
  | { type: "image"; src: string; poster?: string }
  | { type: "video"; src: string; poster?: string }
  | null;

function thumbnailUrl(card: ProjectCard) {
  if (!card.thumbnail) return null;
  if (typeof card.thumbnail === "string") return card.thumbnail;
  return urlFor(card.thumbnail)?.width(1600).url() ?? null;
}

export function projectMedia(card: ProjectCard): ProjectMediaSource {
  const poster = thumbnailUrl(card) ?? undefined;
  if (card.preview) {
    return { type: "video", src: card.preview, poster };
  }
  if (poster) return { type: "image", src: poster };
  return null;
}
