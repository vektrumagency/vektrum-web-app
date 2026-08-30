import type { Locale } from "@/lib/site-config";

export function getDiagnosisHref(locale: Locale) {
  if (locale === "en") return "/diagnostico?lang=en";
  if (locale === "es") return "/diagnostico?lang=es";
  return "/diagnostico";
}
