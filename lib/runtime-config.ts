import { defaultSiteConfig, SiteConfig } from "@/lib/site-config";

let currentConfig: SiteConfig = JSON.parse(JSON.stringify(defaultSiteConfig));

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeWithDefaults<T>(defaults: T, candidate: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(candidate) ? candidate : defaults) as T;
  }

  if (!isObject(defaults) || !isObject(candidate)) {
    return (candidate ?? defaults) as T;
  }

  const result: Record<string, unknown> = { ...defaults };

  for (const key of Object.keys(defaults)) {
    result[key] = mergeWithDefaults(
      (defaults as Record<string, unknown>)[key],
      (candidate as Record<string, unknown>)[key]
    );
  }

  return result as T;
}

export function getRuntimeConfig(): SiteConfig {
  return mergeWithDefaults(defaultSiteConfig, currentConfig);
}

export function setRuntimeConfig(nextConfig: SiteConfig) {
  currentConfig = mergeWithDefaults(defaultSiteConfig, nextConfig);
}
