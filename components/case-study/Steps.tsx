export function Steps({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <ol data-reveal className="my-12 grid gap-10">
      {items.map((item, index) => (
        <li key={item.title} className="grid gap-2 md:grid-cols-[4rem_1fr]">
          <span className="text-eyebrow text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-heading">{item.title}</h3>
            <p className="mt-2 max-w-prose text-body">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
