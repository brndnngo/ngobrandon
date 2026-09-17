import { siteConfig } from "@/lib/site";

export function FooterCTA() {
  return (
    <section className="pt-32 pb-16">
      <div className="grid gap-12 md:grid-cols-[3fr_2fr]">
        <h2 data-reveal className="text-balance font-display text-display">
          Let&rsquo;s chat sometime <span aria-hidden>✧</span>
        </h2>

        <div data-reveal className="flex flex-col justify-end gap-6">
          <p className="max-w-prose text-body">
            Feel free to hit my line if you want to chat — from design
            technology to French house music. I&rsquo;m always excited to
            exchange new ideas with fellow creatives.
          </p>

          <a
            href={`mailto:${siteConfig.email}`}
            className="group inline-flex flex-col gap-1 text-body"
          >
            <span className="text-muted">
              Find some time together <span aria-hidden>↓</span>
            </span>
            <span className="underline-offset-4 group-hover:underline">
              {siteConfig.email}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
