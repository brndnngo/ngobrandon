import { Bracket } from "@/components/layout/Bracket";
import { Clock } from "@/components/layout/Clock";
import { socialLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="page-column pb-8">
      <Bracket direction="up" />
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
        <ul className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  className="text-body text-muted hover:text-(--color-foreground)"
                >
                  {link.label}
                </a>
              </li>
            ))}
        </ul>

        <Clock />
      </div>
    </footer>
  );
}
