import { Clock } from "@/components/layout/Clock";
import { siteConfig } from "@/lib/site";

export function WordmarkFooter() {
  return (
    <footer className="wordmark-footer">
      <div className="page-grid wordmark-footer-row">
        <div className="page-grid-left home-wordmark-slot">
          <p className="home-wordmark" aria-hidden>
            {siteConfig.name}
          </p>
        </div>

        <div className="wordmark-footer-bar">
          <p className="home-photo-credit font-medium text-eyebrow text-muted">
            Built with Next.js + v0 <span className="ml-1.5">© 2026</span>
          </p>
          <div className="page-grid-clock home-photo-clock">
            <Clock variant="bar" />
          </div>
        </div>
      </div>
    </footer>
  );
}
