"use client";

type Props = {
  problems: string[];
};

export function ProblemStackMobile({ problems }: Props) {
  return (
    <div className="relative flex flex-col gap-6 pb-20 sm:hidden">
      {problems.map((problem, index) => {
        return (
          <article
            key={problem}
            style={{ top: `${88 + index * 14}px`, zIndex: index + 1 }}
            className="sticky flex min-h-[45vh] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-accent p-8"
          >
            <div className="relative flex flex-col h-full justify-between">
              <div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pop text-sm font-bold text-ink">
                  {index + 1}
                </span>
                <p className="mt-6 text-lg leading-relaxed text-background/90 font-medium">
                  {problem}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
