import { Clock } from "@/components/layout/Clock";
import { CopyEmailButton } from "@/components/layout/CopyEmailButton";
import { siteConfig, socialLinks } from "@/lib/site";

export function CaseStudyFooter() {
  return (
    <footer className="mx-auto mt-20 w-full max-w-cs-page px-cs-grid pt-cs-stack pb-8">
      <div className="border-t border-(--color-border) pt-cs-tight">
        <div className="grid gap-cs-stack lg:grid-cols-3 lg:items-start">
          <CopyEmailButton variant="plain" />

          <div>
            <p className="text-body text-cs-faint">Connect with me</p>
            <ul className="mt-1 flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="text-body text-cs-text hover:opacity-60"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:text-right">
            <p className="text-body text-cs-faint">Built with Next.js + v0</p>
            <p className="mt-1 text-body text-cs-faint">© 2026</p>
          </div>
        </div>

        <div className="mt-cs-stack flex items-end justify-between gap-cs-stack">
          <p className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-[-0.03em] text-cs-text">
            {siteConfig.name}
          </p>
          <Clock variant="bar" />
        </div>
      </div>
    </footer>
  );
}
