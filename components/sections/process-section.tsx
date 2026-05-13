import { SectionShell } from "@/components/section-shell";

type ProcessSectionProps = {
  section: { eyebrow: string; title: string; description: string; note?: string };
  processSteps: { step: string; title: string; description: string }[];
  ctaLabel: string;
  ctaHref: string;
};

export function ProcessSection({ section, processSteps, ctaLabel, ctaHref }: ProcessSectionProps) {
  return (
    <SectionShell
      id="process"
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      className="bg-background/40"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {processSteps.map((item, index) => (
          <article
            key={item.title}
            className="rounded-2xl border border-border bg-surface p-6 reveal"
            style={{ animationDelay: `${100 + index * 100}ms` }}
          >
            <p className="font-heading text-sm tracking-[0.25em] text-accent">{item.step}</p>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-text">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
          </article>
        ))}
      </div>
      {section.note ? (
        <p className="mt-6 text-center text-sm font-medium text-muted">{section.note}</p>
      ) : null}
      <div className="mt-8 flex justify-center">
        <a
          href={ctaHref}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
        >
          {ctaLabel}
        </a>
      </div>
    </SectionShell>
  );
}
