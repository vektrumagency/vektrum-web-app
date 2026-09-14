import { Booker } from "@/components/Booker";

type Locale = "en" | "pt-PT" | "es";

function resolveLocale(lang?: string): Locale {
  if (lang === "en") return "en";
  if (lang === "es") return "es";
  return "pt-PT";
}

export default async function MarcarPage({
  searchParams
}: {
  searchParams: Promise<{ name?: string; email?: string; lang?: string }>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);

  return (
    <main className="mx-auto w-[90vw] max-w-xl py-16 sm:w-[70vw] sm:py-24">
      <Booker name={params.name} email={params.email} locale={locale} />
    </main>
  );
}
