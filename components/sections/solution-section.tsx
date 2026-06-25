import { Fragment } from "react";
import { CardGrid } from "@/components/card-grid";
import { SectionShell } from "@/components/section-shell";

type SolutionSectionProps = {
  section: {
    eyebrow: string;
    title: string;
    description: string;
    outcomes: { title: string; description: string }[];
  };
};

function getWordsWithIndices(text: string) {
  const words = text.split(" ");
  let cumCharIndex = 0;
  return words.map((word) => {
    const startIndex = cumCharIndex;
    cumCharIndex += word.length + 1; // +1 for the space
    return { word, startIndex };
  });
}

function AnimatedDescription({ text }: { text: string }) {
  const wordsWithIndices = getWordsWithIndices(text);

  return (
    <p className="mt-3 text-sm leading-relaxed text-background/80">
      {wordsWithIndices.map(({ word, startIndex }, wordIndex) => (
        <Fragment key={wordIndex}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIdx) => {
              const delay = (startIndex + charIdx) * 6;
              return (
                <span
                  key={delay}
                  className="inline-block -translate-y-1 opacity-0 transition-all duration-100 ease-out sm:group-hover:translate-y-0 sm:group-hover:opacity-100 group-[.is-open]:translate-y-0 group-[.is-open]:opacity-100"
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  {char}
                </span>
              );
            })}
          </span>
          {wordIndex < wordsWithIndices.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}

export function SolutionSection({ section }: SolutionSectionProps) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} description={section.description} className="!pt-32 sm:!pt-40">
      <CardGrid
        items={section.outcomes.map((outcome) => ({
          key: outcome.title,
          title: <h3 className="min-w-0 font-heading text-xl font-semibold text-background">{outcome.title}</h3>,
          description: <AnimatedDescription text={outcome.description} />
        }))}
      />
    </SectionShell>
  );
}
