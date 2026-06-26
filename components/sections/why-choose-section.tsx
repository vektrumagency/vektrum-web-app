import { SectionShell } from "@/components/section-shell";

type WhyChooseSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  differentiators: string[];
};

export function WhyChooseSection({ section, differentiators }: WhyChooseSectionProps) {
  return (
    <SectionShell
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
    >
      <div className="grid gap-3 md:grid-cols-2">
        {differentiators.map((item, index) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-xl bg-surface/85 p-4 reveal"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            <p className="text-sm leading-relaxed text-muted">{item}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
