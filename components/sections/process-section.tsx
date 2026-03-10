import { SectionShell } from "@/components/section-shell";

type ProcessSectionProps = {
  section: { eyebrow: string; title: string; description: string };
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
      <div className="mt-8 flex justify-center">
        <a
          href={ctaHref}
          className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-text transition hover:border-accent/40 hover:bg-surface/80"
        >
          {ctaLabel}
        </a>
      </div>
    </SectionShell>
  );
}
