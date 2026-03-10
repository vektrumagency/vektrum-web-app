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
      className={`inline-flex items-center gap-2 px-1 py-1 ${className ?? ""}`}
      aria-label="Vektrum"
    >
      <img
        src="/vektrum-logo-transparent.png"
        alt="Vektrum"
        className={compact ? "h-8 w-auto sm:h-9" : "h-10 w-auto sm:h-11"}
      />
      {showTagline ? (
        <span className="hidden border-l border-border pl-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted sm:inline-block">
          AI Automation
        </span>
      ) : null}
    </a>
  );
}
