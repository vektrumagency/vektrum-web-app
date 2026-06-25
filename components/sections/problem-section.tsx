import { CardGrid } from "@/components/card-grid";
import { SectionShell } from "@/components/section-shell";

type ProblemSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  problems: string[];
};

export function ProblemSection({ section, problems }: ProblemSectionProps) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} description={section.description}>
      <div className="flex flex-col sm:hidden">
        {problems.map((problem, index) => (
          <div key={problem} className="relative h-[85vh]">
            <div
              className="sticky top-24 flex h-[55vh] flex-col justify-center rounded-3xl border border-border bg-accent p-8"
              style={{ zIndex: index + 1 }}
            >
              <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-pop text-base font-bold text-ink">
                {index + 1}
              </span>
              <h3 className="font-heading text-3xl uppercase leading-[1.05] text-background">{problem}</h3>
            </div>
          </div>
        ))}
      </div>
      <CardGrid
        aspectSquare
        hideMobile
        items={problems.map((problem, index) => ({
          key: problem,
          title: (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pop text-sm font-bold text-ink">
              {index + 1}
            </span>
          ),
          description: <p className="min-w-0 text-sm leading-relaxed text-background/85">{problem}</p>
        }))}
      />
    </SectionShell>
  );
}
