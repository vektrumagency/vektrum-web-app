import Link from "next/link";

type MobileStickyCtaProps = {
  label: string;
  href: string;
};

export function MobileStickyCta({ label, href }: MobileStickyCtaProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/92 p-3 backdrop-blur md:hidden">
      <Link
        href={href}
        className="block w-full rounded-full bg-accent px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-background"
      >
        {label}
      </Link>
    </div>
  );
}
