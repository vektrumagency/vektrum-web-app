"use client";

import { useMemo } from "react";
import type { Locale } from "./diagnosis-config";
import { COUNTRIES, flagOf, getCountry } from "./phone-countries";

export function PhoneField({
  locale,
  label,
  countryCode,
  value,
  invalid,
  describedBy,
  selectLabel,
  onCountryChange,
  onValueChange,
  onEnter
}: {
  locale: Locale;
  label: string;
  countryCode: string;
  value: string;
  invalid?: boolean;
  describedBy?: string;
  selectLabel: string;
  onCountryChange: (code: string) => void;
  onValueChange: (value: string) => void;
  onEnter?: () => void;
}) {
  const country = getCountry(countryCode);

  const options = useMemo(() => {
    let nameOf: (code: string) => string;
    try {
      const display = new Intl.DisplayNames([locale], { type: "region" });
      nameOf = (code) => display.of(code) ?? code;
    } catch {
      nameOf = (code) => code;
    }
    return COUNTRIES.map((item) => ({ ...item, name: nameOf(item.code) })).sort((a, b) =>
      a.name.localeCompare(b.name, locale)
    );
  }, [locale]);

  return (
    <label className="block" data-field="phone">
      <span className="mb-2 block text-sm font-semibold text-text">{label}</span>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center gap-1.5 pl-4 text-base text-text sm:pl-5 sm:text-lg">
          <span aria-hidden="true">{flagOf(country.code)}</span>
          <span>{country.dial}</span>
          <svg viewBox="0 0 12 8" className="h-2 w-3 fill-none stroke-muted stroke-[1.75]" aria-hidden="true">
            <path d="M1 1.5 6 6.5 11 1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Transparent native select: keeps mobile/keyboard behaviour while the
            visible chip stays short (flag + dial code) instead of the full name. */}
        <select
          aria-label={selectLabel}
          value={country.code}
          onChange={(event) => onCountryChange(event.target.value)}
          className="absolute inset-y-0 left-0 z-20 w-[7.25rem] cursor-pointer appearance-none rounded-l-2xl bg-transparent pl-4 text-transparent opacity-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:w-[8rem]"
        >
          {options.map((item) => (
            <option key={item.code} value={item.code}>
              {flagOf(item.code)} {item.name} {item.dial}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="tel"
          value={value}
          placeholder={country.example}
          autoComplete="tel-national"
          aria-invalid={invalid}
          aria-describedby={describedBy}
          maxLength={20}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && onEnter) {
              event.preventDefault();
              onEnter();
            }
          }}
          className="diagnosis-input pl-[7.25rem] sm:pl-[8rem]"
        />
      </div>
    </label>
  );
}
