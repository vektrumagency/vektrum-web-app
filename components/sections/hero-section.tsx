type HeroSectionProps = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  heroStats: {
    dashboardLabel: string;
    liveLabel: string;
    hoursSavedLabel: string;
    automationsLabel: string;
    pipelineHealthLabel: string;
    pipelineHealthNote: string;
  };
};

export function HeroSection({ hero, heroStats }: HeroSectionProps) {
  return (
    <section id="home" className="relative overflow-hidden py-14 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-220px] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute bottom-[-150px] right-[-120px] h-[300px] w-[300px] rounded-full bg-slate-700/10 blur-[90px]" />
      </div>
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="reveal">
          <p className="mb-6 inline-flex rounded-full border border-border bg-surface/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {hero.eyebrow}
          </p>
          <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-text sm:text-5xl md:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {hero.subtitle}
          </p>
          <div className="mt-8 grid w-full gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href="#contact"
              className="w-full rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-600 sm:w-auto"
            >
              {hero.primaryCta}
            </a>
            <a
              href="#services"
              className="w-full rounded-full border border-border bg-surface px-6 py-3 text-center text-sm font-medium text-text transition hover:border-accent/40 hover:bg-surface/80 sm:w-auto"
            >
              {hero.secondaryCta}
            </a>
          </div>
        </div>
        <div className="reveal md:[animation-delay:180ms]">
          <div className="relative rounded-3xl border border-border bg-surface/95 p-6 shadow-glow backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-medium text-text">{heroStats.dashboardLabel}</p>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                {heroStats.liveLabel}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">{heroStats.hoursSavedLabel}</p>
                <p className="mt-2 font-heading text-2xl font-semibold text-text">37+</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">{heroStats.automationsLabel}</p>
                <p className="mt-2 font-heading text-2xl font-semibold text-text">26</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wider text-muted">{heroStats.pipelineHealthLabel}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-accent to-blue-300" />
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
