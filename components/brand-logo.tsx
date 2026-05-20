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
      className={`inline-flex min-w-0 items-center gap-3 px-1 py-1 ${className ?? ""}`}
      aria-label="Vektrum"
    >
      <img
        src="/vektrum-logo-transparent.png"
        alt="Vektrum"
        className={compact ? "h-8 w-auto max-w-[132px] object-contain brightness-0 invert sm:h-9 sm:max-w-[150px]" : "h-10 w-auto max-w-[168px] object-contain brightness-0 invert sm:h-12 sm:max-w-[210px]"}
      />
      {showTagline ? (
        <span className="hidden border-l border-border/80 pl-3 text-[10px] font-medium uppercase tracking-[0.16em] text-muted sm:inline-block">
          Automation
        </span>
      ) : null}
    </a>
  );
}
