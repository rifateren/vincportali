const HTML_TAG_REGEX = /<[^>]*>/g;
const SCRIPT_REGEX = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;

export function sanitizeText(input: string): string {
  return input.replace(SCRIPT_REGEX, "").replace(HTML_TAG_REGEX, "").trim();
}

export function isValidTitle(title: string): boolean {
  const clean = sanitizeText(title);
  return clean.length >= 5 && clean.length <= 200;
}

export function isValidDescription(description: string): boolean {
  const clean = sanitizeText(description);
  return clean.length <= 5000;
}

export function isValidPrice(price: unknown): boolean {
  if (price === null || price === undefined) return true;
  const num = Number(price);
  return Number.isFinite(num) && num >= 0 && num <= 100_000_000;
}

export function isValidYear(year: unknown): boolean {
  if (year === null || year === undefined) return true;
  const num = Number(year);
  return Number.isInteger(num) && num >= 1950 && num <= new Date().getFullYear() + 1;
}

export function isValidMessageBody(body: string): boolean {
  const clean = sanitizeText(body);
  return clean.length >= 1 && clean.length <= 2000;
}
