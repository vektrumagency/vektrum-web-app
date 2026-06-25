"use client";

import { useState } from "react";
import { SectionShell } from "@/components/section-shell";

type UseCasesSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  useCases: { title: string; description: string }[];
};

function PlusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-text/60 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

export function UseCasesSection({ section, useCases }: UseCasesSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionShell
      id="use-cases"
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
    >
      <div className="flex flex-col gap-3 w-full my-8">
        {useCases.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <article
              key={item.title}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="group w-full cursor-pointer rounded-full bg-surface px-8 py-4 sm:px-12 sm:py-5 text-left transition-all duration-200 select-none shadow-sm hover:bg-surface/80"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-body text-base sm:text-lg font-bold text-text uppercase tracking-wide">
                  {item.title}
                </h3>
                <PlusIcon isOpen={isOpen} />
              </div>
              
              {/* Expandable description container */}
              <div
                className={`grid min-w-0 transition-[grid-template-rows] duration-200 ease-out ${
                  isOpen ? "[grid-template-rows:1fr] mt-3" : "[grid-template-rows:0fr] mt-0"
                }`}
              >
                <div className="min-w-0 overflow-hidden">
                  <p className="text-sm leading-relaxed text-muted pr-8 sm:pr-12 pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
