/**
 * OEP-aware cadence — spec §8.6.4.
 *
 * ACA Open Enrollment Period runs Nov 1 – Jan 15 each plan-year cycle. ACA
 * content must rank BEFORE Nov 1 — meaning indexed, authoritative, and
 * refreshed-recent by mid-September latest.
 *
 * This module helps the strategists prioritize ACA topics during the three
 * relevant windows:
 *
 *   preparation: Aug–Oct → refresh ACA-pillar articles + generate any
 *                missing ACA leafs. dateModified bump for AI-citation lift.
 *   active:      Nov 1 – Jan 15 → push ACA topics to the front of the
 *                generation queue. New ACA content gets priority over other
 *                clusters.
 *   post:        Feb–Jul → normal cadence; ACA content is no priority.
 *
 * Auto-detection runs off the current date if no explicit mode is passed.
 */

export type OepMode = "preparation" | "active" | "post";

/**
 * Detect the OEP mode from the current date. OEP cycle is roughly:
 *   - active: Nov 1 (year N) → Jan 15 (year N+1)
 *   - preparation: Aug 1 → Oct 31 (year N)
 *   - post: Jan 16 → Jul 31
 */
export function detectOepMode(now: Date = new Date()): OepMode {
  const month = now.getMonth(); // 0-indexed: Jan=0, Dec=11
  const day = now.getDate();

  // Active window: Nov 1 - Jan 15
  if (month === 10 || month === 11) return "active"; // November + December
  if (month === 0 && day <= 15) return "active"; // first half of January

  // Preparation: Aug 1 - Oct 31
  if (month >= 7 && month <= 9) return "preparation";

  return "post";
}

/**
 * Slug patterns that mark a topic as ACA-related. Used to prioritize during
 * preparation/active modes. Slug match is intentional — programmatic
 * templates encode topic in the slug, so this stays decoupled from category.
 */
const ACA_SLUG_PATTERNS = [
  /\baca\b/i,
  /obamacare/i,
  /marketplace/i,
  /healthcare-aca/i,
  /seguro-de-salud/i,
  /aseguranza-salud/i,
  /premium-tax-credit/i,
  /\baptc\b/i,
  /open-enrollment/i,
  /\boep\b/i,
  /medicaid/i,
  /\bfpl\b/i,
  /federal-poverty-level/i,
  /healthcare-gov/i,
  /fqhc/i,
  /elegibilidad-aca/i,
  /familias-mixtas/i,
  /mixed-status/i,
];

export function isAcaTopic(slug: string): boolean {
  return ACA_SLUG_PATTERNS.some((pattern) => pattern.test(slug));
}

/**
 * Re-order a topic queue based on OEP mode. During preparation/active modes,
 * ACA topics float to the front. During post mode, queue is unchanged.
 */
export function prioritizeForOep<T extends { slug: string }>(
  topics: T[],
  mode: OepMode,
): T[] {
  if (mode === "post") return topics;
  const aca: T[] = [];
  const rest: T[] = [];
  for (const t of topics) {
    if (isAcaTopic(t.slug)) aca.push(t);
    else rest.push(t);
  }
  return [...aca, ...rest];
}
