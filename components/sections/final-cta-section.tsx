import { ScallopBadge } from "@/components/scallop-badge";
import { SectionDivider } from "@/components/section-divider";

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
    <>
      <SectionDivider fromClassName="bg-background" toClassName="text-accent" />
      <section className="relative overflow-hidden bg-accent py-16 sm:py-24">
        <div className="relative mx-auto w-[90vw] sm:w-[80vw]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-pop">{section.eyebrow}</p>
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-heading text-4xl uppercase leading-[0.95] tracking-tight text-background sm:text-5xl md:text-6xl">
                {section.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-background/75">{section.description}</p>
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-background px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:-translate-y-0.5 hover:bg-pop"
              >
                {section.cta}
              </a>
            </div>
            <ScallopBadge className="text-pop" rotateClassName="hidden h-32 w-32 shrink-0 -rotate-6 lg:flex">
              <span className="text-xs font-bold uppercase leading-tight text-ink">{section.cta}</span>
            </ScallopBadge>
          </div>
        </div>
      </section>
      <SectionDivider fromClassName="bg-accent" toClassName="text-background" flip />
    </>
  );
}
