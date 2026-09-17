import { EyebrowTag } from "@/components/eyebrow-tag";
import { localizePath } from "@/lib/site-links";
import Link from "next/link";

export type FeaturedProject = {
  sectorSlug: string;
  sectorLabel: string;
  name: string;
  context: string;
  tags: string[];
};

type ProjectsSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  projects: FeaturedProject[];
  locale: "en" | "pt-PT";
};

const THEMES = [
  { bg: "bg-ink", fg: "text-background", desc: "text-background/60", num: "text-background/20", tag: "border-background/25" },
  { bg: "bg-accent", fg: "text-background", desc: "text-background/65", num: "text-background/15", tag: "border-background/25" },
  { bg: "bg-pop", fg: "text-ink", desc: "text-ink/60", num: "text-ink/10", tag: "border-ink/20" }
];

export function ProjectsSection({ eyebrow, title, description, projects, locale }: ProjectsSectionProps) {
  return (
    <section id="projects" className="relative bg-background py-16 sm:py-24">
      <div className="mx-auto w-[90vw] sm:w-[80vw]">
        <header className="mb-12 max-w-3xl">
          <EyebrowTag label={eyebrow} className="mb-5 text-accent" />
          <h2 className="font-heading text-4xl uppercase leading-[1.3] tracking-tight text-text sm:text-5xl md:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{description}</p>
        </header>

        <div className="relative pb-32">
          {projects.map((project, index) => {
            const theme = THEMES[index % THEMES.length];

            return (
              <Link
                key={`${project.sectorSlug}-${project.name}`}
                href={localizePath(`/projetos/${project.sectorSlug}`, locale)}
                style={{ top: `${88 + index * 14}px`, zIndex: index + 1 }}
                className={`sticky block overflow-hidden rounded-2xl p-8 sm:p-10 min-h-[70vh] flex flex-col justify-between ${theme.bg}`}
              >
                <div className="relative flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <p className={`font-heading text-xs uppercase tracking-[0.3em] ${theme.desc}`}>
                      {project.sectorLabel}
                    </p>
                    <h3 className={`mt-3 font-heading text-3xl uppercase leading-[1.3] tracking-tight sm:text-4xl lg:text-5xl ${theme.fg}`}>
                      {project.name}
                    </h3>
                    <p className={`mt-4 max-w-xl text-base leading-relaxed ${theme.desc}`}>
                      {project.context}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${theme.fg} ${theme.tag}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className={`hidden shrink-0 font-heading text-8xl font-black leading-none select-none lg:block ${theme.num}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
