import type { CSSProperties } from "react";

/** Desktop frame width the padding fields are measured against. */
export const MEDIA_FRAME_WIDTH = 860;

/**
 * Default inset for a 16:9 well. Keep in sync with the Frame padding
 * description in sanity/schemaTypes/objects/media.ts.
 */
export const DEFAULT_MEDIA_INSET = {
  top: 62,
  right: 45,
  bottom: 54,
  left: 47,
} as const;

export type MediaPadding = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export function resolveMediaInset(padding?: MediaPadding | null) {
  return {
    top: padding?.top ?? DEFAULT_MEDIA_INSET.top,
    right: padding?.right ?? DEFAULT_MEDIA_INSET.right,
    bottom: padding?.bottom ?? DEFAULT_MEDIA_INSET.bottom,
    left: padding?.left ?? DEFAULT_MEDIA_INSET.left,
  };
}

/** Percentage padding. CSS percentages resolve against the frame width. */
export function insetPaddingStyle(
  padding?: MediaPadding | null,
): CSSProperties {
  const inset = resolveMediaInset(padding);
  const edge = (pixels: number) =>
    `calc(${pixels} / ${MEDIA_FRAME_WIDTH} * 100%)`;
  return {
    paddingTop: edge(inset.top),
    paddingRight: edge(inset.right),
    paddingBottom: edge(inset.bottom),
    paddingLeft: edge(inset.left),
  };
}

/**
 * The frame hugs the asset. Padding is the only gap, so a 0 on one side
 * sits that edge flush with the frame. Corners on a flush edge stay square
 * and let the frame's radius clip them.
 */
export function insetItemStyle(
  ratio?: number,
  padding?: MediaPadding | null,
): CSSProperties {
  const inset = resolveMediaInset(padding);
  const corner = (vertical: number, horizontal: number) =>
    vertical > 0 && horizontal > 0 ? "8px" : "0";
  return {
    width: "100%",
    maxHeight: "none",
    aspectRatio: ratio ? String(ratio) : undefined,
    borderRadius: `${corner(inset.top, inset.left)} ${corner(inset.top, inset.right)} ${corner(inset.bottom, inset.right)} ${corner(inset.bottom, inset.left)}`,
  };
}
