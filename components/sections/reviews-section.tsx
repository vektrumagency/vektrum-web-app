import { SectionShell } from "@/components/section-shell";

type ReviewsSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  reviews: { name: string; role: string; company: string; quote: string }[];
};

export function ReviewsSection({ section, reviews }: ReviewsSectionProps) {
  return (
    <SectionShell id="reviews" eyebrow={section.eyebrow} title={section.title} description={section.description}>
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((review, index) => (
          <article
            key={`${review.name}-${review.company}`}
            className="rounded-2xl border border-border bg-white p-6 reveal"
            style={{ animationDelay: `${80 + index * 90}ms` }}
          >
            <p className="text-sm leading-relaxed text-muted">&ldquo;{review.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-semibold text-text">{review.name}</p>
            <p className="text-xs text-muted">
              {review.role}, {review.company}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
