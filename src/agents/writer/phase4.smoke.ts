/**
 * Smoke tests for Phase 4 modules:
 *  - translation-detection
 *  - oep-cadence
 *  - compliance-broker
 *
 * Run with:
 *   node_modules/.bin/tsx src/agents/writer/phase4.smoke.ts
 */

import { detectTranslation } from "./translation-detection";
import { detectOepMode, isAcaTopic, prioritizeForOep } from "./oep-cadence";
import { evaluateBrokerPage } from "./compliance-broker";

let failures = 0;
function check(name: string, condition: boolean, info?: unknown): void {
  if (condition) {
    console.log(`[OK]   ${name}`);
  } else {
    console.log(`[FAIL] ${name}`, info ?? "");
    failures += 1;
  }
}

// ─── translation-detection ─────────────────────────────────────────────────

const NATIVE_ENGLISH = `# Helping your immigrant parent build US credit

If you're helping your mom or dad build credit from zero in the US, the
playbook is simple. Open a secured card. Use it lightly each month. Pay it
off in full. Watch the FICO score climb over 12 months.

The catch is which secured cards actually accept ITIN. Most issuers don't
say either way in their public application — they make you apply to find
out. According to a 2024 CFPB report, only four issuers consistently accept
ITIN-only applicants and report to all three bureaus.

Discover it Secured is the standout. Capital One Platinum Secured works too.
Self Visa and Chime Credit Builder round out the list. Skip the rest.`;

const TRANSLATED_ENGLISH = `# Build the credit of your immigrant parent

If you go to help to your mom or dad to make a credit from zero in the US,
the playbook consists in being simple. Open a secured card. It is true that
you have to make a question to the issuer if accepts ITIN. There is a thing
that is very important to know. It depends of the issuer. We wait that you
realize the payment every month. The same works for all the cards.

Actually we have only four issuers that consistently accept the ITIN-only
applicants. We have to inform to the bureau. It is the only way to take a
decision. It is the same that we did before.`;

const nativeCheck = detectTranslation(NATIVE_ENGLISH);
check(
  "native English text scores ≥80 nativeness",
  nativeCheck.nativenessScore >= 80,
  nativeCheck,
);
check(
  "native English not flagged as translated",
  !nativeCheck.looksTranslated,
);

const translatedCheck = detectTranslation(TRANSLATED_ENGLISH);
check(
  "obviously-translated text scores <70 nativeness",
  translatedCheck.nativenessScore < 70,
  translatedCheck,
);
check(
  "translated text IS flagged as translated",
  translatedCheck.looksTranslated,
);
check(
  "translated text catches at least 4 markers",
  translatedCheck.markers.length >= 4,
  { count: translatedCheck.markers.length, sample: translatedCheck.markers.slice(0, 3) },
);

// ─── oep-cadence ───────────────────────────────────────────────────────────

check("Nov 15 → active", detectOepMode(new Date("2026-11-15")) === "active");
check("Dec 31 → active", detectOepMode(new Date("2026-12-31")) === "active");
check("Jan 10 → active", detectOepMode(new Date("2027-01-10")) === "active");
check("Jan 20 → post", detectOepMode(new Date("2027-01-20")) === "post");
check("Sept 1 → preparation", detectOepMode(new Date("2026-09-01")) === "preparation");
check("Oct 31 → preparation", detectOepMode(new Date("2026-10-31")) === "preparation");
check("June 1 → post", detectOepMode(new Date("2026-06-01")) === "post");

check("isAcaTopic catches 'que-es-aca-marketplace-2026'", isAcaTopic("que-es-aca-marketplace-2026"));
check("isAcaTopic catches 'aca-elegibilidad-inmigrantes'", isAcaTopic("aca-elegibilidad-inmigrantes"));
check("isAcaTopic catches 'medicaid-expansion-2026'", isAcaTopic("medicaid-expansion-2026"));
check("isAcaTopic NOT catches 'seguro-auto-texas'", !isAcaTopic("seguro-auto-texas"));
check("isAcaTopic NOT catches 'comprar-casa-sin-social-security-houston'", !isAcaTopic("comprar-casa-sin-social-security-houston"));

const queue = [
  { slug: "seguro-auto-texas-2026" },
  { slug: "que-es-aca-marketplace-2026" },
  { slug: "comprar-casa-sin-social-security-houston-2026" },
  { slug: "medicaid-expansion-2026" },
  { slug: "remitly-vs-wise-2026" },
];
const prioritized = prioritizeForOep(queue, "active");
check(
  "active mode floats ACA topics to front",
  isAcaTopic(prioritized[0].slug) && isAcaTopic(prioritized[1].slug),
  prioritized.map((t) => t.slug),
);
const unchanged = prioritizeForOep(queue, "post");
check(
  "post mode leaves queue unchanged",
  unchanged[0].slug === "seguro-auto-texas-2026",
);

// ─── compliance-broker ─────────────────────────────────────────────────────

const VALID_CUBIERTO_PAGE = `# Cubierto — Cotizá tu seguro de auto en Florida

Cubierto te conecta con 8+ aseguradoras en una sola conversación de WhatsApp.

## Cómo funciona

Carmen, nuestra agente virtual, recibe tu información y cotiza con
Progressive, GEICO y otras carriers en tu estado.

## Cotizá ahora

[Hablar con Carmen](https://wa.me/...) — sin formularios, en español.

---
NPN: 19831245
Licencia: P-189301 (FL DFS)
DFS Florida — para denuncias contactar: floir.com/consumers/
`;

const BAD_CUBIERTO_EDITORIAL = `# Progressive vs GEICO vs State Farm en Florida

Una comparativa exhaustiva entre las tres aseguradoras grandes en Florida
para conductores hispanos con ITIN. Cubierto te asegura con cualquiera de
ellas.

## Tarifas promedio

Progressive cotiza más barato para conductores jóvenes...

## Aceptación de ITIN

GEICO acepta ITIN via su brokerage hispano...

## Reclamos en español

Bristol West tiene equipos bilingües en Florida...

## Servicio al cliente

State Farm es la mejor del país...

## Veredicto

Cubierto es la mejor opción.

NPN: 19831245
`;

const cubiertoOk = evaluateBrokerPage(VALID_CUBIERTO_PAGE, "cubierto");
check("valid Cubierto page passes broker lint", cubiertoOk.pass, cubiertoOk);

const cubiertoBad = evaluateBrokerPage(BAD_CUBIERTO_EDITORIAL, "cubierto");
check(
  "editorial content on Cubierto FAILS broker lint",
  !cubiertoBad.pass,
);
check(
  "broker lint catches >3 H2 sections",
  cubiertoBad.reasons.some((r) => r.includes("editorial")),
  cubiertoBad.reasons,
);
check(
  "broker lint catches 'Cubierto te asegura' phrasing",
  cubiertoBad.reasons.some((r) => r.includes("aseguradora")),
  cubiertoBad.reasons,
);

console.log(failures === 0 ? "\nALL SMOKE TESTS PASSED" : `\n${failures} SMOKE TESTS FAILED`);
process.exit(failures === 0 ? 0 : 1);
