import { SectionShell } from "@/components/section-shell";

type SolutionSectionProps = {
  section: {
    eyebrow: string;
    title: string;
    description: string;
    outcomes: { title: string; description: string }[];
  };
};

export function SolutionSection({ section }: SolutionSectionProps) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} description={section.description}>
      <div className="grid gap-4 md:grid-cols-2">
        {section.outcomes.map((outcome, index) => (
          <article
            key={outcome.title}
            className="rounded-2xl border border-border bg-surface/85 p-6 reveal"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="mb-4 h-1.5 w-16 rounded-full bg-accent" />
            <h3 className="font-heading text-xl font-semibold text-text">{outcome.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{outcome.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
