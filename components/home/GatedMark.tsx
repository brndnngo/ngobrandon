export function GatedMark({ visible }: { visible: boolean }) {
  return (
    <span
      className={`inline-flex size-3 shrink-0 items-center justify-center ${
        visible ? "" : "invisible"
      }`}
      aria-hidden
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <rect
          x="2.6"
          y="5.4"
          width="6.8"
          height="5"
          rx="0.6"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M4.15 5.4V3.7a1.85 1.85 0 1 1 3.7 0V5.4"
          stroke="currentColor"
          strokeWidth="1.15"
        />
      </svg>
    </span>
  );
}
