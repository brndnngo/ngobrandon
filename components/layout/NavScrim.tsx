const PAD = "1.5rem";
const HAIRLINE = "1px";

/* Uniform blur in the nav band. Below lg the frost is full-width. From lg,
   1px columns at the page-grid inset are punched out so Bracket side
   strokes are not sampled into the filter. No Y fade and no fill. */
const MASK = `linear-gradient(to right,
  black 0,
  black calc(${PAD} - ${HAIRLINE}),
  transparent calc(${PAD} - ${HAIRLINE}),
  transparent calc(${PAD} + ${HAIRLINE}),
  black calc(${PAD} + ${HAIRLINE}),
  black calc(100% - ${PAD} - ${HAIRLINE}),
  transparent calc(100% - ${PAD} - ${HAIRLINE}),
  transparent calc(100% - ${PAD} + ${HAIRLINE}),
  black calc(100% - ${PAD} + ${HAIRLINE}),
  black 100%)`;

const frost = {
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
} as const;

export function NavScrim() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[998] h-(--nav-height) lg:hidden"
        style={frost}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[998] hidden h-(--nav-height) lg:block"
        style={{
          ...frost,
          maskImage: MASK,
          WebkitMaskImage: MASK,
        }}
      />
    </>
  );
}
