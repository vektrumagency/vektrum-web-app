/* eslint-disable @next/next/no-img-element */

type BrandLogoProps = {
  href?: string;
  className?: string;
  compact?: boolean;
  showTagline?: boolean;
};

export function BrandLogo({ href = "#home", className, compact = false, showTagline = false }: BrandLogoProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-white to-slate-50 px-2.5 py-2 shadow-[0_10px_34px_-24px_rgba(15,23,42,0.45)] transition hover:shadow-[0_14px_38px_-24px_rgba(15,23,42,0.38)] ${className ?? ""}`}
      aria-label="Vektrum"
    >
      <img
        src="/vektrum-logo.png"
        alt="Vektrum"
        className={compact ? "h-8 w-auto sm:h-9" : "h-10 w-auto sm:h-11"}
      />
      {showTagline ? (
        <span className="hidden border-l border-slate-200 pl-2 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 sm:inline-block">
          AI Automation
        </span>
      ) : null}
    </a>
  );
}
