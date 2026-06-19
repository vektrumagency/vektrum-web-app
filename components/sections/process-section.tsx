import { SectionShell } from "@/components/section-shell";
import { SectionDivider } from "@/components/section-divider";

type ProcessSectionProps = {
  section: { eyebrow: string; title: string; description: string; note?: string };
  processSteps: { step: string; title: string; description: string }[];
  ctaLabel: string;
  ctaHref: string;
};

export function ProcessSection({ section, processSteps, ctaLabel, ctaHref }: ProcessSectionProps) {
  return (
    <>
      <SectionDivider fromClassName="bg-background" toClassName="text-ink" />
      <SectionShell id="process" eyebrow={section.eyebrow} title={section.title} description={section.description} tone="ink">
        <div className="grid gap-4 md:grid-cols-2">
          {processSteps.map((item, index) => (
            <article
              key={item.title}
              className="rounded-2xl border border-background/15 bg-background/5 p-6 reveal"
              style={{ animationDelay: `${100 + index * 100}ms` }}
            >
              <p className="font-heading text-sm tracking-[0.25em] text-pop">{item.step}</p>
              <h3 className="mt-3 font-heading text-2xl uppercase text-background">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-background/70">{item.description}</p>
            </article>
          ))}
        </div>
        {section.note ? (
          <p className="mt-6 text-center text-sm font-medium text-background/70">{section.note}</p>
        ) : null}
        <div className="mt-8 flex justify-center">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-pop px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition hover:-translate-y-0.5"
          >
            {ctaLabel}
          </a>
        </div>
      </SectionShell>
      <SectionDivider fromClassName="bg-ink" toClassName="text-background" flip />
    </>
  );
}
