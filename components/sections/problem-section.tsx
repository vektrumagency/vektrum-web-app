import { SectionShell } from "@/components/section-shell";

type ProblemSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  problems: string[];
};

export function ProblemSection({ section, problems }: ProblemSectionProps) {
  return (
    <SectionShell
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      className="border-y border-border/80 bg-surface/25"
    >
      <div className="grid gap-3 md:grid-cols-5">
        {problems.map((problem, index) => (
          <article
            key={problem}
            className="rounded-2xl border border-border bg-surface/85 p-5 reveal"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-muted">{problem}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
