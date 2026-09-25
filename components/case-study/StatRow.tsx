function beforeMetric(value: string) {
  const match = value.match(/^(.*?)(\s*(?:→|->)\s*)(.+)$/);
  if (!match || match[1].trim() === "") return null;
  return { before: match[1] + match[2], after: match[3] };
}

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
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6 md:rounded-[8px] md:border md:border-border md:bg-cs-stat md:p-6">
        {items.map((item) => {
          const metric = beforeMetric(item.value);

          return (
            <div
              key={item.value + item.label}
              className="rounded-[8px] border border-border bg-cs-stat p-6 md:rounded-none md:border-0 md:bg-transparent md:p-0"
            >
              {item.kicker ? (
                <p className="text-cs-caption text-cs-faint">{item.kicker}</p>
              ) : null}
              <p
                className={`font-display text-cs-title text-cs-text ${item.kicker ? "mt-1" : ""}`}
              >
                {metric ? (
                  <>
                    <span className="text-cs-faint">{metric.before}</span>
                    {metric.after}
                  </>
                ) : (
                  item.value
                )}
              </p>
              <p className="mt-0.5 text-cs-caption text-cs-faint">{item.label}</p>
            </div>
          );
        })}
      </div>
      {note ? (
        <figcaption className="cs-caption text-center md:text-right!">{note}</figcaption>
      ) : null}
    </figure>
  );
}
