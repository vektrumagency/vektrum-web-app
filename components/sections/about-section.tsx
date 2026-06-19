import { SectionShell } from "@/components/section-shell";

type AboutSectionProps = {
  section: { eyebrow: string; title: string; description: string; body: string };
};

export function AboutSection({ section }: AboutSectionProps) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} description={section.description}>
      <div className="max-w-3xl border-l-2 border-accent pl-6 reveal">
        <p className="text-base leading-relaxed text-muted">{section.body}</p>
      </div>
    </SectionShell>
  );
}
