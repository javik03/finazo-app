/**
 * US states and their license status for Cubierto / Hogares routing.
 * Per Finazo PSEO+GEO v2 Spec §5.
 *
 * A Finazo article ranking for a query in any state needs a CTA that adapts
 * to that state's license status. Hardcoding /cotizador-seguro everywhere
 * dumps users into a quote flow that may not be servicable.
 *
 * - active: Cubierto holds an active license in this state. CTA → quote flow.
 * - pending_non_resident: license filed, awaiting issue. CTA → waitlist signup.
 * - not_licensed: no plans to enter or pre-application stage. CTA → affiliate
 *   fallback (The Zebra / Insurify / direct-carrier links) with disclosure.
 *
 * This file is the source of truth. Flipping a license_status value rebuilds
 * the CTA tree on the next deploy.
 */

export type UsLicenseStatus =
  | "active"
  | "pending_non_resident"
  | "not_licensed";

export type UsState = {
  /** Lowercase URL slug — matches /us/prestamos/[estado], etc. */
  slug: string;
  /** Two-letter postal code. */
  code: string;
  /** Spanish display name. */
  nameEs: string;
  /** Cubierto auto-insurance license status. */
  cubiertoStatus: UsLicenseStatus;
  /** Hogares mortgage license status (post-MLO). */
  hogaresStatus: UsLicenseStatus;
  /** Top affiliate fallback for unlicensed states (auto insurance). */
  autoAffiliate: {
    name: string;
    url: string;
  };
};

/**
 * The Zebra is the strongest US auto-insurance affiliate that pays per-quote.
 * For LATAM-leaning audiences, Insurify is the secondary option.
 */
const FALLBACK_AUTO_AFFILIATE = {
  name: "The Zebra",
  url: "https://www.thezebra.com",
};

export const US_STATES: UsState[] = [
  { slug: "alabama",        code: "AL", nameEs: "Alabama",        cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "alaska",         code: "AK", nameEs: "Alaska",         cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "arizona",        code: "AZ", nameEs: "Arizona",        cubiertoStatus: "pending_non_resident", hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "arkansas",       code: "AR", nameEs: "Arkansas",       cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "california",     code: "CA", nameEs: "California",     cubiertoStatus: "pending_non_resident", hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "colorado",       code: "CO", nameEs: "Colorado",       cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "connecticut",    code: "CT", nameEs: "Connecticut",    cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "delaware",       code: "DE", nameEs: "Delaware",       cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "florida",        code: "FL", nameEs: "Florida",        cubiertoStatus: "active",              hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "georgia",        code: "GA", nameEs: "Georgia",        cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "hawaii",         code: "HI", nameEs: "Hawaii",         cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "idaho",          code: "ID", nameEs: "Idaho",          cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "illinois",       code: "IL", nameEs: "Illinois",       cubiertoStatus: "pending_non_resident", hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "indiana",        code: "IN", nameEs: "Indiana",        cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "iowa",           code: "IA", nameEs: "Iowa",           cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "kansas",         code: "KS", nameEs: "Kansas",         cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "kentucky",       code: "KY", nameEs: "Kentucky",       cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "louisiana",      code: "LA", nameEs: "Louisiana",      cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "maine",          code: "ME", nameEs: "Maine",          cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "maryland",       code: "MD", nameEs: "Maryland",       cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "massachusetts",  code: "MA", nameEs: "Massachusetts",  cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "michigan",       code: "MI", nameEs: "Michigan",       cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "minnesota",      code: "MN", nameEs: "Minnesota",      cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "mississippi",    code: "MS", nameEs: "Mississippi",    cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "missouri",       code: "MO", nameEs: "Missouri",       cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "montana",        code: "MT", nameEs: "Montana",        cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "nebraska",       code: "NE", nameEs: "Nebraska",       cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "nevada",         code: "NV", nameEs: "Nevada",         cubiertoStatus: "pending_non_resident", hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "new-hampshire",  code: "NH", nameEs: "New Hampshire",  cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "new-jersey",     code: "NJ", nameEs: "New Jersey",     cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "new-mexico",     code: "NM", nameEs: "Nuevo México",   cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "new-york",       code: "NY", nameEs: "Nueva York",     cubiertoStatus: "pending_non_resident", hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "north-carolina", code: "NC", nameEs: "Carolina del Norte", cubiertoStatus: "not_licensed",   hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "north-dakota",   code: "ND", nameEs: "Dakota del Norte", cubiertoStatus: "not_licensed",     hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "ohio",           code: "OH", nameEs: "Ohio",           cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "oklahoma",       code: "OK", nameEs: "Oklahoma",       cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "oregon",         code: "OR", nameEs: "Oregon",         cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "pennsylvania",   code: "PA", nameEs: "Pensilvania",    cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "rhode-island",   code: "RI", nameEs: "Rhode Island",   cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "south-carolina", code: "SC", nameEs: "Carolina del Sur", cubiertoStatus: "not_licensed",     hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "south-dakota",   code: "SD", nameEs: "Dakota del Sur", cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "tennessee",      code: "TN", nameEs: "Tennessee",      cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "texas",          code: "TX", nameEs: "Texas",          cubiertoStatus: "active",              hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "utah",           code: "UT", nameEs: "Utah",           cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "vermont",        code: "VT", nameEs: "Vermont",        cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "virginia",       code: "VA", nameEs: "Virginia",       cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "washington",     code: "WA", nameEs: "Washington",     cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "west-virginia",  code: "WV", nameEs: "Virginia Occidental", cubiertoStatus: "not_licensed", hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "wisconsin",      code: "WI", nameEs: "Wisconsin",      cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
  { slug: "wyoming",        code: "WY", nameEs: "Wyoming",        cubiertoStatus: "not_licensed",        hogaresStatus: "not_licensed", autoAffiliate: FALLBACK_AUTO_AFFILIATE },
];

const STATE_BY_SLUG = new Map(US_STATES.map((s) => [s.slug, s]));
const STATE_BY_CODE = new Map(US_STATES.map((s) => [s.code.toUpperCase(), s]));

export function getStateBySlug(slug: string): UsState | undefined {
  return STATE_BY_SLUG.get(slug.toLowerCase());
}

export function getStateByCode(code: string): UsState | undefined {
  return STATE_BY_CODE.get(code.toUpperCase());
}
