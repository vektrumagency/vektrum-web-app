"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  problems: string[];
};

export function ProblemStackMobile({ problems }: Props) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const onScroll = () => {
      if (!spacerRef.current) return;
      const rect = spacerRef.current.getBoundingClientRect();

      if (rect.top >= 0 || rect.bottom <= 0) {
        setActiveIndex(-1);
        return;
      }

      const scrolledIn = -rect.top;
      const scrollable = spacerRef.current.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.max(0, Math.min(1, scrolledIn / scrollable)) : 0;
      setActiveIndex(Math.min(Math.floor(progress * problems.length), problems.length - 1));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [problems.length]);

  return (
    <div ref={spacerRef} className="sm:hidden" style={{ height: `${problems.length * 80}vh` }}>
      {activeIndex >= 0 && (
        <div
          key={activeIndex}
          className="fixed left-[5vw] w-[90vw] flex flex-col justify-center rounded-3xl border border-border bg-accent p-8"
          style={{ top: "88px", height: "58vh", zIndex: 20, animation: "card-enter 0.22s ease-out forwards" }}
        >
          <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-pop text-base font-bold text-ink">
            {activeIndex + 1}
          </span>
          <h3 className="font-heading text-3xl uppercase leading-[1.05] text-background">
            {problems[activeIndex]}
          </h3>
        </div>
      )}
    </div>
  );
}
