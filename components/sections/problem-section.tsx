import { CardGrid } from "@/components/card-grid";
import { SectionShell } from "@/components/section-shell";
import { ProblemStackMobile } from "@/components/problem-stack-mobile";

type ProblemSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  problems: string[];
};

export function ProblemSection({ section, problems }: ProblemSectionProps) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} description={section.description}>
      <ProblemStackMobile problems={problems} />
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
