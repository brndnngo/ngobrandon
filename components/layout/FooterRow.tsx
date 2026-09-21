import { Bracket } from "@/components/layout/Bracket";
import { CopyEmailButton } from "@/components/layout/CopyEmailButton";
import { socialLinks } from "@/lib/site";

const FOOTER_MASK = "linear-gradient(to top, black 0 50%, transparent 100%)";

export function FooterRow({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`.trim()}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          maskImage: FOOTER_MASK,
          WebkitMaskImage: FOOTER_MASK,
        }}
      />

      <div className="relative z-10">
        <div className="page-grid">
          <div className="col-span-full">
            <Bracket direction="up" />
          </div>
        </div>

        <div className="page-grid gap-y-6 bg-background py-4 md:gap-y-0">
          <div className="page-grid-left">
            <CopyEmailButton variant="plain" />
          </div>

          <div className="page-grid-right footer-connect flex flex-col items-start gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-medium text-eyebrow text-muted">Connect with me</p>
              <ul className="mt-1 flex items-center gap-4">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="text-body hover:opacity-60"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-credit text-left md:text-right">
              <p className="font-medium text-eyebrow text-muted">
                Built with Next.js + v0
              </p>
              <p className="mt-1 font-medium text-eyebrow text-muted">© 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
