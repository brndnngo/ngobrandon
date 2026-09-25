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
      <div className="flex flex-col gap-6 rounded-[8px] border border-border bg-cs-stat p-6 md:flex-row md:items-start md:justify-between">
        {items.map((item) => (
          <div key={item.value + item.label}>
            {item.kicker ? (
              <p className="text-cs-caption text-cs-faint">{item.kicker}</p>
            ) : null}
            <p
              className={`font-display text-cs-title text-cs-text ${item.kicker ? "mt-1" : ""}`}
            >
              {item.value}
            </p>
            <p className="mt-0.5 text-cs-caption text-cs-faint">{item.label}</p>
          </div>
        ))}
      </div>
      {note ? <figcaption className="cs-caption text-left!">{note}</figcaption> : null}
    </figure>
  );
}
