type EyebrowTagProps = {
  label: string;
  className?: string;
};

export function EyebrowTag({ label, className }: EyebrowTagProps) {
  return (
    <p className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${className ?? "text-muted"}`}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-current">
        <path d="M12 0 L14 9 L24 11 L14 13 L12 22.5 L10 13 L0 11 L10 9 Z" />
      </svg>
      {label}
    </p>
  );
}
