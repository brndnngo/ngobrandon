import { Bracket } from "@/components/layout/Bracket";
import { CopyEmailButton } from "@/components/layout/CopyEmailButton";
import { socialLinks } from "@/lib/site";

export function FooterRow({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-background ${className}`.trim()}>
      <div className="page-grid">
        <div className="col-span-full">
          <Bracket direction="up" />
        </div>
      </div>

      <div className="page-grid py-4">
        <div className="page-grid-left">
          <CopyEmailButton variant="plain" />
        </div>

        <div className="page-grid-right flex items-start justify-between gap-6">
          <div>
            <p className="text-eyebrow text-muted">Connect with me</p>
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

          <div className="text-right">
            <p className="text-eyebrow text-muted">© 2026</p>
            <p className="mt-1 text-eyebrow text-muted">
              Built with Next.js + v0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
