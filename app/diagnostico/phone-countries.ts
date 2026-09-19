type Country = {
  /** ISO 3166-1 alpha-2 — also drives the flag emoji and the localized name. */
  code: string;
  dial: string;
  /** Digit count of the national number, without the trunk prefix. */
  min: number;
  max: number;
  example: string;
};

export const DEFAULT_COUNTRY = "PT";

/** Markets we actually sell into, plus the ones leads most often call from. */
export const COUNTRIES: Country[] = [
  { code: "PT", dial: "+351", min: 9, max: 9, example: "912 345 678" },
  { code: "ES", dial: "+34", min: 9, max: 9, example: "612 345 678" },
  { code: "FR", dial: "+33", min: 9, max: 9, example: "612 345 678" },
  { code: "GB", dial: "+44", min: 9, max: 10, example: "7400 123456" },
  { code: "IE", dial: "+353", min: 7, max: 9, example: "85 123 4567" },
  { code: "DE", dial: "+49", min: 6, max: 11, example: "151 23456789" },
  { code: "IT", dial: "+39", min: 9, max: 10, example: "312 345 6789" },
  { code: "NL", dial: "+31", min: 9, max: 9, example: "6 12345678" },
  { code: "BE", dial: "+32", min: 8, max: 9, example: "470 12 34 56" },
  { code: "LU", dial: "+352", min: 6, max: 9, example: "621 123 456" },
  { code: "CH", dial: "+41", min: 9, max: 9, example: "78 123 45 67" },
  { code: "AT", dial: "+43", min: 7, max: 11, example: "664 1234567" },
  { code: "DK", dial: "+45", min: 8, max: 8, example: "32 12 34 56" },
  { code: "SE", dial: "+46", min: 7, max: 9, example: "70 123 45 67" },
  { code: "NO", dial: "+47", min: 8, max: 8, example: "406 12 345" },
  { code: "FI", dial: "+358", min: 6, max: 10, example: "41 2345678" },
  { code: "PL", dial: "+48", min: 9, max: 9, example: "512 345 678" },
  { code: "CZ", dial: "+420", min: 9, max: 9, example: "601 123 456" },
  { code: "RO", dial: "+40", min: 9, max: 9, example: "712 345 678" },
  { code: "GR", dial: "+30", min: 10, max: 10, example: "691 234 5678" },
  { code: "US", dial: "+1", min: 10, max: 10, example: "201 555 0123" },
  { code: "CA", dial: "+1", min: 10, max: 10, example: "506 234 5678" },
  { code: "BR", dial: "+55", min: 10, max: 11, example: "11 96123 4567" },
  { code: "AO", dial: "+244", min: 9, max: 9, example: "923 123 456" },
  { code: "MZ", dial: "+258", min: 9, max: 9, example: "82 123 4567" },
  { code: "CV", dial: "+238", min: 7, max: 7, example: "991 12 34" },
  { code: "AE", dial: "+971", min: 8, max: 9, example: "50 123 4567" },
  { code: "AU", dial: "+61", min: 9, max: 9, example: "412 345 678" }
];

const COUNTRY_BY_CODE = new Map(COUNTRIES.map((country) => [country.code, country]));

export function getCountry(code: string): Country {
  return COUNTRY_BY_CODE.get(code) ?? COUNTRY_BY_CODE.get(DEFAULT_COUNTRY)!;
}

/** Regional indicator symbols: 'P','T' -> 🇵🇹 */
export function flagOf(code: string): string {
  return String.fromCodePoint(...[...code].map((letter) => 0x1f1a5 + letter.charCodeAt(0)));
}

export function digitsOf(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidPhone(countryCode: string, value: string): boolean {
  const country = getCountry(countryCode);
  const digits = digitsOf(value);
  return digits.length >= country.min && digits.length <= country.max;
}

/** E.164-ish: what we hand to the webhook, e.g. "+351912345678". */
export function formatPhoneForPayload(countryCode: string, value: string): string {
  return `${getCountry(countryCode).dial}${digitsOf(value)}`;
}
