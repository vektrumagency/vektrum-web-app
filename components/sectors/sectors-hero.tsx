import Link from "next/link";
import { ScallopBadge } from "@/components/scallop-badge";
import { SectionDivider } from "@/components/section-divider";

type SectorsHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  badgeLabel: string;
  backHref?: string;
  backLabel?: string;
};

export function SectorsHero({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  badgeLabel,
  backHref,
  backLabel
}: SectorsHeroProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-accent pb-16 pt-36 sm:pb-20 sm:pt-28">
        <div className="relative mx-auto w-[90vw] sm:w-[80vw]">
          {backHref && backLabel ? (
            <Link
              href={backHref}
              className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-background/70 transition-colors hover:text-background"
            >
              <span aria-hidden="true">←</span>
              {backLabel}
            </Link>
          ) : null}
          {eyebrow ? (
            <p className="mb-8 max-w-md text-xs font-semibold uppercase tracking-[0.2em] text-background/80 sm:text-sm">
              {eyebrow}
            </p>
          ) : null}
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="max-w-3xl font-heading text-4xl uppercase leading-[1.3] tracking-tight text-background sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <ScallopBadge className="text-pop" rotateClassName="hidden h-24 w-24 shrink-0 sm:flex">
              <span className="px-1 text-center text-[11px] font-bold uppercase leading-tight text-ink">
                {badgeLabel}
              </span>
            </ScallopBadge>
          </div>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-background/75">{description}</p>
          <Link
            href={ctaHref}
            className="mt-10 inline-flex rounded-full bg-background px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:-translate-y-0.5 hover:bg-pop"
          >
            {ctaLabel}
          </Link>
        </div>
      </section>
      <SectionDivider fromClassName="bg-accent" toClassName="text-background" />
    </>
  );
}
