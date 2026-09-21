type BracketProps = {
  direction: "down" | "up";
};

export function Bracket({ direction }: BracketProps) {
  const isDown = direction === "down";

  return (
    <div
      aria-hidden
      className={
        isDown
          ? "h-[13px] w-full overflow-hidden rounded-t-[3px] border-t border-x border-(--color-border) transition-[border-color] duration-[var(--theme-fade)]"
          : "h-[13px] w-full overflow-hidden rounded-b-[3px] border-b border-x border-(--color-border) transition-[border-color] duration-[var(--theme-fade)]"
      }
    />
  );
}
