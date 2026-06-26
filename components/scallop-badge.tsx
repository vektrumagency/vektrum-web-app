import { ReactNode } from "react";

const LOBES = 14;
const POINTS = 240;
const OUTER_R = 48;
const INNER_R = 43;
const CENTER = 50;

const SCALLOP_PATH = Array.from({ length: POINTS }, (_, i) => {
  const angle = (i / POINTS) * Math.PI * 2;
  const radius = OUTER_R - (OUTER_R - INNER_R) * (0.5 + 0.5 * Math.cos(angle * LOBES));
  const x = CENTER + radius * Math.cos(angle);
  const y = CENTER + radius * Math.sin(angle);
  return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
}).join(" ") + " Z";

type ScallopBadgeProps = {
  children: ReactNode;
  className?: string;
  rotateClassName?: string;
};

export function ScallopBadge({ children, className, rotateClassName }: ScallopBadgeProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${rotateClassName ?? ""}`}>
      <svg viewBox="0 0 100 100" className={`absolute inset-0 h-full w-full fill-current animate-[spin_8s_linear_infinite] ${className ?? "text-accent"}`} aria-hidden="true">
        <path d={SCALLOP_PATH} />
      </svg>
      <div className="relative z-10 flex items-center justify-center px-2 text-center">{children}</div>
    </div>
  );
}
