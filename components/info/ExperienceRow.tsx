import Image from "next/image";
import Link from "next/link";
import type { ExperienceItem } from "@/content/info";

function Name({ item }: { item: ExperienceItem }) {
  const className = "font-display text-heading";

  if (!item.href) {
    return <p className={className}>{item.name}</p>;
  }

  const external = item.href.startsWith("http");

  if (external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={`${className} hover:opacity-60`}
      >
        {item.name}
      </a>
    );
  }

  return (
    <Link href={item.href} className={`${className} hover:opacity-60`}>
      {item.name}
    </Link>
  );
}

export function ExperienceRow({
  item,
  showDivider,
}: {
  item: ExperienceItem;
  showDivider: boolean;
}) {
  return (
    <li className="flex items-start gap-8">
      <div className="size-[57px] shrink-0 overflow-hidden rounded-[4px]">
        <Image
          src={item.logo}
          alt=""
          width={57}
          height={57}
          unoptimized
        />
      </div>
      <div
        className={`min-w-0 flex-1 pb-4 ${
          showDivider ? "border-b border-(--color-border)" : ""
        }`}
      >
        <Name item={item} />
        <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-baseline lg:justify-between lg:gap-4">
          <p className="min-w-0 text-body text-muted">{item.description}</p>
          <p className="shrink-0 text-body text-muted lg:text-right">
            {item.year}
          </p>
        </div>
      </div>
    </li>
  );
}
