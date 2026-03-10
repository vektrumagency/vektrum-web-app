import { SectionShell } from "@/components/section-shell";

type AboutSectionProps = {
  section: { eyebrow: string; title: string; description: string; body: string };
};

export function AboutSection({ section }: AboutSectionProps) {
  return (
    <SectionShell
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      className="bg-slate-50/50"
    >
      <div className="rounded-2xl border border-border bg-white p-6 reveal">
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          {section.body}
        </p>
      </div>
    </SectionShell>
  );
}
