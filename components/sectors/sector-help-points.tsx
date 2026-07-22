import { SectionShell } from "@/components/section-shell";

type SectorHelpPointsProps = {
  title: string;
  helpPoints: string[];
};

function CheckIcon() {
  return (
    <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pop">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-ink stroke-[3]" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export function SectorHelpPoints({ title, helpPoints }: SectorHelpPointsProps) {
  return (
    <SectionShell title={title}>
      <div className="grid gap-4 sm:grid-cols-2">
        {helpPoints.map((point) => (
          <article key={point} className="flex items-start gap-4 rounded-2xl bg-surface p-6 shadow-glow">
            <CheckIcon />
            <p className="text-sm leading-relaxed text-text">{point}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
