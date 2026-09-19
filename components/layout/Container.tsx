export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full ${className}`.trim()}
    >
      {children}
    </div>
  );
}
