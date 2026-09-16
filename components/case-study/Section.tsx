export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section data-reveal className={`py-8 ${className}`.trim()}>
      {children}
    </section>
  );
}
