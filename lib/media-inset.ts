import type { CSSProperties } from "react";

/**
 * Aspect ratio (width / height) of the area inside the 16:9 well after the
 * Figma insets. The well is 860×483.75 at the reference width; the image sits
 * 47px from the left, 62px from the top, 45px from the right, and 54px from
 * the bottom, leaving a 768×367.75 content box.
 */
export const INSET_BOX_RATIO = 768 / 860 / (9 / 16 - 116 / 860);

export function insetItemStyle(ratio: number): CSSProperties {
  const width = Math.min(100, (ratio / INSET_BOX_RATIO) * 100);
  return {
    width: `${width}%`,
    aspectRatio: String(ratio),
  };
}
