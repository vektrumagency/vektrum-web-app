type FinalCtaSectionProps = {
  section: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
  };
  ctaHref: string;
};

export function FinalCtaSection({ section, ctaHref }: FinalCtaSectionProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-text px-6 py-10 shadow-glow sm:px-10 sm:py-14">
          <div className="absolute right-[-120px] top-[-120px] h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              {section.eyebrow}
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              {section.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
              {section.description}
            </p>
            <a
              href={ctaHref}
              className="mt-8 inline-flex w-full justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent/90 sm:w-auto"
            >
              {section.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
