const MASK = "linear-gradient(to bottom, black 0 50%, transparent 100%)";

/**
 * Soft fade under the nav so content passing beneath reads as frost, not a
 * solid bar. One backdrop-filter layer — stacking blurs on the header as well
 * would muddy every frame.
 */
export function NavScrim() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[998] h-14"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    />
  );
}
