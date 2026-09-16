export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="grid gap-2">
      <p className="font-display text-stat">{value}</p>
      <p className="text-eyebrow text-muted">{label}</p>
    </div>
  );
}

export function Stats({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <div
      data-reveal
      className="my-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item) => (
        <Stat key={item.value + item.label} {...item} />
      ))}
    </div>
  );
}
