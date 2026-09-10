import type { Locale } from "@/lib/site-config";

export const SITE_URL = "https://vektrum.agency";

/** Prefixes a PT-default path with `/en` for the English route. `ptPath` must start with "/". */
export function localizePath(ptPath: string, locale: Locale): string {
  if (locale === "pt-PT") return ptPath;
  return ptPath === "/" ? "/en" : `/en${ptPath}`;
}

/** Strips a leading `/en` prefix, e.g. for building a language switcher from the current pathname. */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

export function getDiagnosisHref(locale: Locale) {
  return localizePath("/diagnostico", locale);
}

/** hreflang alternates for a PT-default page whose English version lives at `/en${ptPath}`. */
export function buildLanguageAlternates(ptPath: string): Record<string, string> {
  return {
    "pt-PT": ptPath,
    en: localizePath(ptPath, "en"),
    "x-default": ptPath
  };
}
