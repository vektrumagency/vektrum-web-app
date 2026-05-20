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
    flowLabels: string[];
  };
  primaryHref: string;
  secondaryHref: string;
};

export function HeroSection({ hero, heroStats, primaryHref, secondaryHref }: HeroSectionProps) {
  return (
    <section id="home" className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-240px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/14 blur-[130px]" />
        <div className="absolute bottom-[-180px] right-[-160px] h-[380px] w-[380px] rounded-full bg-accent-soft/10 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center">
        <div className="reveal min-w-0">
          <p className="mb-6 inline-flex max-w-full rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-accent-soft sm:tracking-[0.2em]">
            {hero.eyebrow}
          </p>
          <h1 className="max-w-3xl text-wrap font-heading text-4xl font-semibold leading-tight tracking-tight text-text sm:text-5xl md:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {hero.subtitle}
          </p>
          <div className="mt-8 grid w-full gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href={primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-background shadow-[0_18px_40px_-22px_rgb(74_181_211)] transition hover:-translate-y-0.5 hover:bg-accent-soft sm:w-auto"
            >
              {hero.primaryCta}
            </a>
            <a
              href={secondaryHref}
              className="w-full rounded-full border border-border bg-surface/70 px-6 py-3 text-center text-sm font-medium text-text transition hover:border-accent/40 hover:bg-surface sm:w-auto"
            >
              {hero.secondaryCta}
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {hero.proofPoints.map((point) => (
              <span
                key={point}
                className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted"
              >
                {point}
              </span>
            ))}
          </div>
        </div>
        <div className="reveal min-w-0 md:[animation-delay:180ms]">
          <div className="relative overflow-hidden rounded-3xl border border-border/90 bg-surface/85 p-5 shadow-glow backdrop-blur-xl sm:p-6">
            <div className="absolute right-[-90px] top-[-90px] h-56 w-56 rounded-full bg-accent/16 blur-3xl" />
            <div className="absolute inset-x-6 top-20 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
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
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">{heroStats.hoursSavedLabel}</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-text">86h</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">{heroStats.automationsLabel}</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-text">7</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wider text-muted">{heroStats.pipelineHealthLabel}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-border/60">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-accent to-accent-soft" />
                </div>
                <p className="mt-2 text-sm text-muted">{heroStats.pipelineHealthNote}</p>
              </div>
            </div>
            <div className="relative mt-4 grid gap-2">
              {heroStats.flowLabels.map((item, index) => (
                <div
                  key={item}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-border/80 bg-background/45 px-3 py-2 text-xs text-muted"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-[10px] font-semibold text-accent-soft">
                    {index + 1}
                  </span>
                  <span className="min-w-0 truncate">{item}</span>
                  <span className="ml-auto h-1.5 w-10 rounded-full bg-accent/35" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
