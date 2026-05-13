type InlineCtaProps = {
  title: string;
  ctaLabel: string;
  ctaHref: string;
};

export function InlineCta({ title, ctaLabel, ctaHref }: InlineCtaProps) {
  return (
    <section className="py-8">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-surface/95 p-6 shadow-glow sm:flex-row sm:items-center">
          <p className="font-heading text-xl font-semibold text-text">{title}</p>
          <a
            href={ctaHref}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
