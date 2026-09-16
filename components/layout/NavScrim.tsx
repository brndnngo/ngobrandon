const MASK = "linear-gradient(to bottom, black 0 64%, transparent 100%)";

/**
 * Replaces the three hand-built data-URI SVG masks from the Webflow build. The
 * gradient stop sits at 64% because the original SVGs went solid to y=32 of a
 * 50-unit viewBox before fading.
 *
 * Deliberately a single layer: backdrop-filter re-blurs every frame of any
 * video beneath it, so stacked progressive-blur layers would multiply that cost
 * over the homepage video hero.
 */
export function NavScrim() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[998] h-(--nav-height)"
      style={{
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    />
  );
}
