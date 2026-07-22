import { SectorProject } from "@/lib/sectors-content";

type ProjectCardProps = {
  project: SectorProject;
  whatWeBuiltLabel: string;
  resultsLabel: string;
  tone: "ink" | "accent";
  isOpen: boolean;
  onToggle: () => void;
};

const TONE_STYLES = {
  ink: { bg: "bg-ink", label: "text-background/55", body: "text-background/80" },
  accent: { bg: "bg-accent", label: "text-background/60", body: "text-background/85" }
};

function PlusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`mt-1 h-5 w-5 shrink-0 text-background transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
    >
      <path d="M12 4v16m8-8H4" />
    </svg>
  );
}

export function ProjectCard({ project, whatWeBuiltLabel, resultsLabel, tone, isOpen, onToggle }: ProjectCardProps) {
  const styles = TONE_STYLES[tone];

  return (
    <article className={`overflow-hidden rounded-2xl ${styles.bg}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-6 p-8 text-left sm:p-10"
      >
        <div>
          <h3 className="font-heading text-2xl uppercase leading-[1.3] tracking-tight text-background sm:text-3xl">
            {project.name}
          </h3>
          <p className={`mt-3 max-w-2xl text-sm leading-relaxed sm:text-base ${styles.body}`}>{project.context}</p>
        </div>
        <PlusIcon isOpen={isOpen} />
      </button>

      <div
        className={`grid px-8 transition-[grid-template-rows] duration-200 ease-out sm:px-10 ${
          isOpen ? "[grid-template-rows:1fr] pb-8 sm:pb-10" : "[grid-template-rows:0fr] pb-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${styles.label}`}>{whatWeBuiltLabel}</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {project.work.map((item) => (
              <li key={item} className={`flex items-start gap-3 text-sm leading-relaxed sm:text-base ${styles.body}`}>
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pop" />
                {item}
              </li>
            ))}
          </ul>

          {project.phases && project.phases.length > 0 ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {project.phases.map((phase) => (
                <div key={phase.label} className="rounded-xl bg-background/10 p-4">
                  <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${styles.label}`}>{phase.label}</p>
                  <p className="mt-1.5 text-sm leading-snug text-background/90">{phase.title}</p>
                </div>
              ))}
            </div>
          ) : null}

          {project.results.length > 0 ? (
            <>
              <p className={`mt-8 text-xs font-semibold uppercase tracking-[0.2em] ${styles.label}`}>{resultsLabel}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {project.results.map((result) => (
                  <p key={result} className="rounded-xl bg-pop px-4 py-3 text-sm font-semibold leading-snug text-ink">
                    {result}
                  </p>
                ))}
              </div>
            </>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-background/10 px-3 py-1 text-xs font-medium text-background/85 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
