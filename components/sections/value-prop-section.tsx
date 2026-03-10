import { SectionShell } from "@/components/section-shell";

const logos = ["NORTHGRID", "ARCWELL", "CIRRUS", "LUMINO", "SHIFTWORKS"];

type ValuePropSectionProps = {
  valueProp: {
    eyebrow: string;
    title: string;
    description: string;
    highlights: { metric: string; description: string }[];
    teamsLabel: string;
  };
};

export function ValuePropSection({ valueProp }: ValuePropSectionProps) {
  return (
    <SectionShell
      eyebrow={valueProp.eyebrow}
      title={valueProp.title}
      description={valueProp.description}
      className="border-y border-border/80 bg-slate-50/60"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {valueProp.highlights.map((highlight, index) => (
          <article
            key={highlight.metric}
            className="rounded-2xl border border-border bg-white p-6 reveal"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <p className="font-heading text-3xl font-semibold text-text">{highlight.metric}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{highlight.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-12">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">{valueProp.teamsLabel}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {logos.map((logo) => (
            <div
              key={logo}
              className="rounded-xl border border-border bg-white px-4 py-3 text-center text-xs tracking-[0.15em] text-muted"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
