import { SectionShell } from "@/components/section-shell";

type ResultsSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  results: string[];
};

export function ResultsSection({ section, results }: ResultsSectionProps) {
  return (
    <SectionShell
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      className="border-y border-border/80 bg-slate-50/60"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {results.map((item, index) => (
          <article
            key={item}
            className="rounded-2xl border border-border bg-white p-5 reveal"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <p className="text-sm leading-relaxed text-muted">{item}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
