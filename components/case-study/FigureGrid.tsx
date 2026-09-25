import { Figure } from "./Figure";

export function FigureGrid({
  figures,
  columns = 2,
}: {
  columns?: number;
  figures: { src: string; alt: string; caption?: string; lightbox?: boolean }[];
}) {
  return (
    <div
      data-reveal
      className="my-10 grid gap-10"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {figures.map((figure) => (
        <Figure key={figure.src + figure.alt} {...figure} />
      ))}
    </div>
  );
}
