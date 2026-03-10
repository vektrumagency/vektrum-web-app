import { SectionShell } from "@/components/section-shell";

type ServicesSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  services: { title: string; description: string }[];
  ctaLabel: string;
  ctaHref: string;
};

export function ServicesSection({ section, services, ctaLabel, ctaHref }: ServicesSectionProps) {
  return (
    <SectionShell
      id="services"
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <article
            key={service.title}
            className="group rounded-2xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_35px_-28px_rgba(15,23,42,0.65)]"
            style={{ animationDelay: `${120 + index * 90}ms` }}
          >
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/60 text-sm font-semibold text-accent">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="font-heading text-xl font-semibold text-text">{service.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <a
          href={ctaHref}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          {ctaLabel}
        </a>
      </div>
    </SectionShell>
  );
}
