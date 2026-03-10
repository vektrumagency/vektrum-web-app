import { SectionShell } from "@/components/section-shell";

type ProcessSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  processSteps: { step: string; title: string; description: string }[];
};

export function ProcessSection({ section, processSteps }: ProcessSectionProps) {
  return (
    <SectionShell
      id="process"
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      className="bg-slate-50/50"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {processSteps.map((item, index) => (
          <article
            key={item.title}
            className="rounded-2xl border border-border bg-white p-6 reveal"
            style={{ animationDelay: `${100 + index * 100}ms` }}
          >
            <p className="font-heading text-sm tracking-[0.25em] text-accent">{item.step}</p>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-text">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
