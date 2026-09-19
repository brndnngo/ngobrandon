export function Panel({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <aside data-reveal className="my-12 border border-(--color-border) p-8">
      {eyebrow ? (
        <p className="text-eyebrow text-muted uppercase">{eyebrow}</p>
      ) : null}
      {title ? <h3 className="mt-2 text-heading">{title}</h3> : null}
      {body ? <p className="mt-4 max-w-prose text-body">{body}</p> : null}
    </aside>
  );
}
