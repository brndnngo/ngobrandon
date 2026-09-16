export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-(--container-page) px-gutter ${className}`.trim()}
    >
      {children}
    </div>
  );
}
