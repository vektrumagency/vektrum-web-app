import { ScallopBadge } from "@/components/scallop-badge";
import { SectionDivider } from "@/components/section-divider";

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
    <>
      <section id="home" className="relative overflow-hidden bg-accent pb-20 pt-36 sm:pt-28">
        <div className="pointer-events-none absolute right-6 top-6 h-3 w-3 rounded-full bg-pop sm:right-10 sm:top-10 sm:h-4 sm:w-4" />
        <div className="relative mx-auto w-[90vw] sm:w-[80vw]">
          <p className="mb-8 max-w-xs text-xs font-semibold uppercase tracking-[0.2em] text-background/80 sm:text-sm">
            {hero.eyebrow}
          </p>
          <h1 className="font-heading text-5xl uppercase leading-[0.92] tracking-tight text-background sm:text-7xl lg:text-[5.4rem]">
            {hero.title}
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12">
            <a
              href={primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-background px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:-translate-y-0.5 hover:bg-pop"
            >
              {hero.primaryCta}
            </a>
            <a
              href={secondaryHref}
              className="rounded-full border-2 border-background/40 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-background transition hover:border-background"
            >
              {hero.secondaryCta}
            </a>
            <ScallopBadge className="text-pop" rotateClassName="hidden h-24 w-24 shrink-0 animate-[spin_8s_linear_infinite] sm:flex">
              <span className="text-[11px] font-bold uppercase leading-tight text-ink">{heroStats.liveLabel}</span>
            </ScallopBadge>
          </div>
          <div className="mt-10 flex flex-wrap gap-2 sm:mt-12">
            {hero.proofPoints.map((point) => (
              <span
                key={point}
                className="rounded-full border border-background/30 px-3 py-1 text-xs font-medium text-background/85"
              >
                {point}
              </span>
            ))}
          </div>

          <div className="mt-14 grid gap-3 border-t border-background/20 pt-8 sm:mt-16 sm:grid-cols-3">
            <div>
              <p className="font-heading text-4xl text-pop sm:text-5xl">86h</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-background/70">{heroStats.hoursSavedLabel}</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-pop sm:text-5xl">7</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-background/70">{heroStats.automationsLabel}</p>
            </div>
            <div className="sm:col-span-1">
              <p className="text-sm font-semibold text-background">{heroStats.pipelineHealthLabel}</p>
              <p className="mt-1 text-xs leading-relaxed text-background/70">{heroStats.pipelineHealthNote}</p>
            </div>
          </div>
        </div>
      </section>
      <SectionDivider fromClassName="bg-accent" toClassName="text-background" />
    </>
  );
}
