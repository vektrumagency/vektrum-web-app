type MobileStickyCtaProps = {
  label: string;
  href: string;
};

export function MobileStickyCta({ label, href }: MobileStickyCtaProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur md:hidden">
      <a
        href={href}
        className="block w-full rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white"
      >
        {label}
      </a>
    </div>
  );
}
