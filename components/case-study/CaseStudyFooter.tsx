import { Bracket } from "@/components/layout/Bracket";
import { Clock } from "@/components/layout/Clock";
import { CopyEmailButton } from "@/components/layout/CopyEmailButton";
import { siteConfig, socialLinks } from "@/lib/site";

export function CaseStudyFooter() {
  return (
    <footer className="mt-20 w-full pb-8">
      <div className="page-grid pt-cs-stack">
        <div className="col-span-full">
          <Bracket orientation="up" />
        </div>

        <div className="page-grid-left pt-cs-tight">
          <CopyEmailButton variant="plain" />
        </div>

        <div className="page-grid-right flex flex-col items-start gap-6 pt-cs-tight md:flex-row md:items-start md:justify-between">
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

          <div className="text-left md:text-right">
            <p className="text-body text-cs-faint">Built with Next.js + v0</p>
            <p className="mt-1 text-body text-cs-faint">© 2026</p>
          </div>
        </div>

        <div className="col-span-full mt-cs-stack flex items-end justify-between gap-cs-stack">
          <p className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-[-0.03em] text-cs-text">
            {siteConfig.name}
          </p>
          <Clock variant="bar" />
        </div>
      </div>
    </footer>
  );
}
