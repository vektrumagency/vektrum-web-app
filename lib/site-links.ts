import type { Locale } from "@/lib/site-config";

export function getDiagnosisHref(locale: Locale) {
  return locale === "en" ? "/diagnostico?lang=en" : "/diagnostico";
}
