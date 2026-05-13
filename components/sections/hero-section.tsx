type HeroSectionProps = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    auditLabel: string;
    proofPoints: string[];
  };
  heroStats: {
    dashboardLabel: string;
    liveLabel: string;
    hoursSavedLabel: string;
    automationsLabel: string;
    pipelineHealthLabel: string;
    pipelineHealthNote: string;
  };
  primaryHref: string;
  secondaryHref: string;
};

export function HeroSection({ hero, heroStats, primaryHref, secondaryHref }: HeroSectionProps) {
  return (
    <section id="home" className="relative overflow-hidden py-14 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-220px] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute bottom-[-150px] right-[-120px] h-[320px] w-[320px] rounded-full bg-sky-900/10 blur-[90px]" />
      </div>
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="reveal">
          <p className="mb-6 inline-flex rounded-full border border-border bg-surface/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {hero.eyebrow}
          </p>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-tight text-text sm:text-5xl md:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {hero.subtitle}
          </p>
          <div className="mt-8 grid w-full gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href={primaryHref}
              className="w-full rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_16px_35px_-20px_rgba(83,183,221,0.9)] transition hover:-translate-y-0.5 hover:bg-accent/90 sm:w-auto"
            >
              {hero.primaryCta}
            </a>
            <a
              href={secondaryHref}
              className="w-full rounded-full border border-border bg-surface px-6 py-3 text-center text-sm font-medium text-text transition hover:border-accent/40 hover:bg-surface/80 sm:w-auto"
            >
              {hero.secondaryCta}
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {hero.proofPoints.map((point) => (
              <span
                key={point}
                className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium text-text"
              >
                {point}
              </span>
            ))}
          </div>
        </div>
        <div className="reveal md:[animation-delay:180ms]">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/95 p-6 shadow-glow backdrop-blur-xl">
            <div className="absolute right-[-80px] top-[-80px] h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">{heroStats.dashboardLabel}</p>
                <p className="mt-1 text-xs text-muted">{hero.auditLabel}</p>
              </div>
              <span className="rounded-full border border-accent/25 bg-accent/10 px-2 py-1 text-xs text-text">
                {heroStats.liveLabel}
              </span>
            </div>
            <div className="relative grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">{heroStats.hoursSavedLabel}</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-text">86h</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">{heroStats.automationsLabel}</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-text">7</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wider text-muted">{heroStats.pipelineHealthLabel}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-accent to-sky-300" />
                </div>
                <p className="mt-2 text-sm text-muted">{heroStats.pipelineHealthNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
