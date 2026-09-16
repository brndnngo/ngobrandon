/** Slugs that must never prerender, because they read the gate cookie. */
export const GATED_SLUGS = ["wc", "alchemy", "receive"] as const;

export function isGatedSlug(slug: string) {
  return (GATED_SLUGS as readonly string[]).includes(slug);
}
