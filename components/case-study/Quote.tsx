export function Quote({
  quote,
  attribution,
}: {
  quote: string;
  attribution: string;
}) {
  return (
    <blockquote
      data-reveal
      className="cs-measure border-l border-(--color-border) pl-6"
    >
      <p className="font-display text-cs-heading text-cs-text">{quote}</p>
      {attribution ? (
        <footer className="mt-cs-tight text-body text-cs-faint">
          {attribution}
        </footer>
      ) : null}
    </blockquote>
  );
}
