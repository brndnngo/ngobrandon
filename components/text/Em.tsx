import Link from "next/link";

export function Em({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const className = "text-foreground";

  if (!href) {
    return <span className={className}>{children}</span>;
  }

  const external = href.startsWith("http");

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${className} hover:opacity-60`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`${className} hover:opacity-60`}>
      {children}
    </Link>
  );
}
