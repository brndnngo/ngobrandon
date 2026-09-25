import { Figure } from "./Figure";

export function ImageRow({
  figures,
}: {
  figures: { src: string; alt: string; caption?: string }[];
}) {
  if (!figures.length) return null;

  return (
    <div
      data-reveal
      className="my-10 grid gap-10"
      style={{
        gridTemplateColumns: `repeat(${Math.min(figures.length, 3)}, minmax(0, 1fr))`,
      }}
    >
      {figures.map((figure) => (
        <Figure
          key={`${figure.src}-${figure.alt}`}
          className="my-0"
          overlay
          {...figure}
        />
      ))}
    </div>
  );
}
