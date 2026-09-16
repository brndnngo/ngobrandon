import { Clock } from "@/components/layout/Clock";
import { socialLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-(--container-page) px-gutter pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-(--color-border) pt-6">
        <ul className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
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
