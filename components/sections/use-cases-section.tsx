import { SectionShell } from "@/components/section-shell";

type UseCasesSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  useCases: { title: string; description: string }[];
};

export function UseCasesSection({ section, useCases }: UseCasesSectionProps) {
  return (
    <SectionShell
      id="use-cases"
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {useCases.map((item, index) => (
          <article
            key={item.title}
            className="rounded-2xl border border-border bg-white p-6 reveal"
            style={{ animationDelay: `${100 + index * 90}ms` }}
          >
            <h3 className="font-heading text-xl font-semibold text-text">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
