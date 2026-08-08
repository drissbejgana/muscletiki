/**
 * Cookie / storage consent.
 *
 * The record is versioned: bump CONSENT_VERSION whenever the categories or the
 * privacy terms change and every visitor is asked again on their next visit.
 *
 * Gate any future non-essential script on `hasConsent("analytics")` — the
 * "Necessary only" button is only meaningful if the code actually honours it.
 */

export type ConsentCategory = "necessary" | "preferences" | "analytics";

export interface ConsentRecord {
  version: number;
  categories: Record<ConsentCategory, boolean>;
  decidedAt: string;
}

export const CONSENT_KEY = "muscletiki_consent";
export const CONSENT_VERSION = 1;

/** Fired whenever the stored decision changes. */
export const CONSENT_CHANGED_EVENT = "muscletiki:consent-changed";
/** Fired to reopen the banner (e.g. the footer "Cookie settings" link). */
export const CONSENT_OPEN_EVENT = "muscletiki:consent-open";

/** Necessary is never optional — the app cannot function without it. */
export const DEFAULT_CATEGORIES: Record<ConsentCategory, boolean> = {
  necessary: true,
  preferences: false,
  analytics: false,
};

export const ALL_ACCEPTED: Record<ConsentCategory, boolean> = {
  necessary: true,
  preferences: true,
  analytics: true,
};

/**
 * What each category actually covers in this app, keyed for i18n.
 * `keys` are the real storage entries, so the details panel tells the truth
 * rather than generic boilerplate.
 */
export const CATEGORY_DETAILS: {
  id: ConsentCategory;
  required: boolean;
  keys: string[];
}[] = [
  {
    id: "necessary",
    required: true,
    // auth token, free-trial timer, sidebar state, and this consent record
    keys: ["token", "fitness_app_restriction_time", "sidebar:state", CONSENT_KEY],
  },
  {
    id: "preferences",
    required: false,
    keys: ["muscletiki_lang"],
  },
  {
    id: "analytics",
    required: false,
    keys: [],
  },
];

/** localStorage throws in some privacy modes — never let that break the app. */
function safeRead(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeWrite(key: string, value: string): boolean {
  try { window.localStorage.setItem(key, value); return true; } catch { return false; }
}

/**
 * The visitor's stored decision, or null when they have not decided yet or the
 * stored record predates the current version.
 */
export function getConsent(): ConsentRecord | null {
  const raw = safeRead(CONSENT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed?.version !== CONSENT_VERSION) return null;
    if (!parsed.categories || typeof parsed.categories !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** True only when the visitor has actively opted into that category. */
export function hasConsent(category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  return getConsent()?.categories?.[category] === true;
}

/** True when the banner should be shown — no valid decision on record. */
export function needsConsentDecision(): boolean {
  return getConsent() === null;
}

export function saveConsent(categories: Record<ConsentCategory, boolean>): ConsentRecord {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    categories: { ...categories, necessary: true },
    decidedAt: new Date().toISOString(),
  };
  safeWrite(CONSENT_KEY, JSON.stringify(record));
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: record }));
  return record;
}

/** Reopens the banner so a visitor can change their mind (required by GDPR). */
export function openConsentSettings(): void {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
