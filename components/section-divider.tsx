type SectionDividerProps = {
  fromClassName: string;
  toClassName: string;
  flip?: boolean;
};

export function SectionDivider({ fromClassName, toClassName, flip = false }: SectionDividerProps) {
  return (
    <div className={`relative h-12 sm:h-20 ${fromClassName}`}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`absolute inset-0 h-full w-full ${toClassName} ${flip ? "rotate-180" : ""}`}
        aria-hidden="true"
      >
        <path
          d="M0,0 C 240,120 480,120 720,60 C 960,0 1200,0 1440,80 L1440,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
