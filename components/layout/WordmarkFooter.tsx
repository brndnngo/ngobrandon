import { Clock } from "@/components/layout/Clock";
import { siteConfig } from "@/lib/site";

export function WordmarkFooter() {
  return (
    <footer className="wordmark-footer">
      <div className="page-grid wordmark-footer-row">
        <div className="home-wordmark-slot">
          <p className="home-wordmark" aria-hidden>
            {siteConfig.name}
          </p>
        </div>

        <p className="home-photo-credit font-medium text-eyebrow text-muted">
          Built with Next.js + v0 © 2026
        </p>

        <div className="page-grid-clock home-photo-clock">
          <Clock variant="bar" />
        </div>
      </div>
    </footer>
  );
}
