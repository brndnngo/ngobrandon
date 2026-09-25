export function StatRow({
  items,
  note,
}: {
  items: { kicker?: string; value: string; label: string }[];
  note?: string;
}) {
  if (!items.length) return null;

  return (
    <figure data-reveal className="cs-full">
      <div className="grid grid-cols-1 gap-cs-stack bg-cs-media p-[25px] md:grid-cols-3">
        {items.map((item) => (
          <div key={item.value + item.label}>
            {item.kicker ? (
              <p className="text-body text-cs-text">{item.kicker}</p>
            ) : null}
            <p className="mt-1 font-display text-cs-title text-cs-text">
              {item.value}
            </p>
            <p className="mt-1 text-body text-cs-body">{item.label}</p>
          </div>
        ))}
      </div>
      {note ? <figcaption className="cs-caption text-left!">{note}</figcaption> : null}
    </figure>
  );
}
