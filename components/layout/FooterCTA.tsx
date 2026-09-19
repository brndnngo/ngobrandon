import { CopyEmailButton } from "@/components/layout/CopyEmailButton";

export function FooterCTA() {
  return (
    <section className="pt-32 pb-10">
      <div className="relative grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div className="min-w-0 @container">
          <h2
            data-reveal
            className="font-display text-[clamp(1.75rem,10cqi,var(--text-display-sm))] leading-[0.75] tracking-[-0.08rem] [text-box-trim:trim-start] [text-box-edge:cap] lg:whitespace-nowrap"
          >
            Let&rsquo;s chat sometime{" "}
            <span aria-hidden className="text-(--color-accent)">
              ✧
            </span>
          </h2>
        </div>

        <p data-reveal className="min-w-0 text-body text-muted">
          Feel free to hit my line if you want to chat — from design technology
          to French house music. I&rsquo;m always excited to exchange new ideas
          with fellow creatives.
        </p>

        <CopyEmailButton />
      </div>
    </section>
  );
}
