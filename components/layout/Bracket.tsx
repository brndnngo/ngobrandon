type BracketSize = "page" | "content";
type BracketOrientation = "down" | "up";

type BracketProps = {
  size?: BracketSize;
  orientation: BracketOrientation;
};

const tickClass: Record<BracketSize, string> = {
  page: "h-(--bracket-tick-page)",
  content: "h-(--bracket-tick-content)",
};

const radiusClass: Record<BracketSize, Record<BracketOrientation, string>> = {
  page: {
    down: "rounded-t-(--bracket-radius-page)",
    up: "rounded-b-(--bracket-radius-page)",
  },
  content: {
    down: "rounded-t-(--bracket-radius-content)",
    up: "rounded-b-(--bracket-radius-content)",
  },
};

export function Bracket({ size = "page", orientation }: BracketProps) {
  const isDown = orientation === "down";

  return (
    <div
      aria-hidden
      className={`w-full overflow-hidden border-x border-(--color-border) transition-[border-color] duration-[var(--theme-fade)] ${tickClass[size]} ${radiusClass[size][orientation]} ${
        isDown ? "border-t" : "border-b"
      }`}
    />
  );
}
