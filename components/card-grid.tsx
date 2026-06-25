"use client";

import { ReactNode, useState } from "react";

type CardGridItem = {
  key: string;
  title: ReactNode;
  description: ReactNode;
};

type CardGridProps = {
  items: CardGridItem[];
  aspectSquare?: boolean;
  hideMobile?: boolean;
};

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 text-background/70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function CardGrid({ items, aspectSquare = false, hideMobile = false }: CardGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className={`flex w-full flex-col gap-4 sm:hidden ${hideMobile ? "hidden" : ""}`}>
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <article
              key={item.key}
              onClick={() => setOpenIndex((current) => (current === index ? null : index))}
              className={`group flex w-full cursor-pointer flex-col rounded-2xl border border-border bg-accent p-6 text-left transition-[height] duration-150 ease-out reveal ${
                isOpen ? "is-open h-auto" : "h-28"
              }`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="grow transition-[flex-grow] duration-150 ease-out group-[.is-open]:grow-0" />
              <div className="flex min-w-0 shrink-0 items-center justify-between gap-2">
                <div className="min-w-0">{item.title}</div>
                <Chevron isOpen={isOpen} />
              </div>
              <div className="grid min-w-0 [grid-template-rows:0fr] transition-[grid-template-rows] duration-150 ease-out group-[.is-open]:[grid-template-rows:1fr]">
                <div className="min-w-0 overflow-hidden">{item.description}</div>
              </div>
              <div className="grow" />
            </article>
          );
        })}
      </div>

      {aspectSquare ? (
        <div className="hidden flex-wrap justify-center gap-4 sm:flex">
          {items.map((item, index) => (
            <article
              key={item.key}
              className="flex aspect-square w-[calc((100%-32px)/3)] flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-accent p-6 text-left reveal md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-64px)/5)]"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {item.title}
              {item.description}
            </article>
          ))}
        </div>
      ) : (
        <div className="hidden flex-row flex-wrap justify-center gap-4 sm:flex">
          {items.map((item, index) => (
            <article
              key={item.key}
              className="group flex h-44 w-64 shrink-0 grow-0 flex-col rounded-2xl border border-border bg-accent p-6 text-left transition-[height] duration-150 ease-out reveal hover:h-64"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="grow transition-[flex-grow] duration-150 ease-out group-hover:grow-0" />
              <div className="min-w-0 shrink-0">{item.title}</div>
              <div className="grid min-w-0 [grid-template-rows:0fr] transition-[grid-template-rows] duration-150 ease-out group-hover:[grid-template-rows:1fr]">
                <div className="min-w-0 overflow-hidden">{item.description}</div>
              </div>
              <div className="grow" />
            </article>
          ))}
        </div>
      )}
    </>
  );
}
