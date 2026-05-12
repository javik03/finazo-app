/**
 * Compliance lint for regulated broker domains — spec §0.1, §1.2, §1.3, §7.2,
 * §7.3, §12.1.
 *
 * Cubierto.ai (auto insurance broker) and Hogares.ai (mortgage broker, post-MLO)
 * are regulated entities. Every page on those domains is an "insurance
 * advertisement" (FL DFS 69B-215 / TX Insurance Code Chapter 541) or a
 * mortgage advertisement (NMLS 1024 + state mortgage rules). The regulatory
 * regime is materially stricter than Finazo's publisher regime.
 *
 * This module is wired but NOT YET applied — Cubierto.ai and Hogares.ai don't
 * have deployed page generation pipelines yet. When they do, the strategist
 * for those domains imports `evaluateBrokerPage()` and gates publication on
 * it.
 *
 * NEVER apply this lint to Finazo articles. The two regimes are intentionally
 * different.
 */

export type BrokerDomain = "cubierto" | "hogares";

export type BrokerLintResult = {
  pass: boolean;
  reasons: string[];
  /** 0-100. Below 92 fails per spec §12.1 (stricter than Finazo's 85). */
  score: number;
};

/**
 * Maximum body word count for any page on a broker domain.
 * Spec §1.2 — pages exceeding this fail the build with a redirect-to-Finazo
 * error.
 */
const BROKER_MAX_BODY_WORDS = 800;

/** Patterns that misframe the broker as an insurer/lender — strict block. */
const BROKER_BANNED_PHRASING = [
  // Cubierto must NEVER be described as an insurer/carrier
  { pattern: /\bCubierto\s+(?:te\s+)?asegura\b/i, label: "Cubierto descrita como aseguradora (es CORREDOR)" },
  { pattern: /\bCubierto\s+es\s+(?:una\s+)?aseguradora\b/i, label: "Cubierto descrita como aseguradora (es CORREDOR)" },
  { pattern: /\bCubierto\s+emite\s+(?:la\s+)?p[oó]liza\b/i, label: "Cubierto descrita como emisora de pólizas (es CORREDOR)" },
  // Hogares must NEVER be described as a lender
  { pattern: /\bHogares\s+(?:te\s+)?presta\b/i, label: "Hogares descrita como prestamista (es BROKER)" },
  { pattern: /\bHogares\s+es\s+(?:un\s+|el\s+)?prestamista\b/i, label: "Hogares descrita como prestamista (es BROKER)" },
];

/** Editorial markers — long-form expansion that violates spec §1.2 / §1.3. */
const EDITORIAL_MARKERS = [
  // Multiple H2 sections is a strong editorial signal
  { test: (content: string): boolean => (content.match(/^##\s/gm) ?? []).length > 3, label: "Más de 3 H2 — contenido editorial (debe vivir en Finazo)" },
  // FAQ block with >3 questions
  { test: (content: string): boolean => (content.match(/^###\s+[¿¡].+\?/gm) ?? []).length > 3, label: "Bloque FAQ extenso — contenido editorial (debe vivir en Finazo)" },
  // Comparison table is an editorial pattern
  { test: (content: string): boolean => /^\s*\|.*vs\.?.*\|/im.test(content), label: "Tabla comparativa carrier-vs-carrier — contenido editorial (debe vivir en Finazo)" },
];

/** Competitor names — comparative claims about these on broker domains are
 *  banned per spec §1.2 / §8.5. Comparative content lives on Finazo only. */
const NAMED_COMPETITORS = [
  "Freeway",
  "Estrella Insurance",
  "Confie",
  "Acceptance Insurance",
  "A-MAX",
  "InsureOne",
  "Direct General",
  "Bristol West",
];

/** Required disclosures per domain. */
const REQUIRED_DISCLOSURES: Record<BrokerDomain, RegExp[]> = {
  cubierto: [
    /\bNPN[\s:#]*\s*[\w-]+/i,
    /\b(?:licencia|license)[\s:#]*\s*[\w-]+/i,
    /\b(?:DFS|TDI|FL OIR|TX TDI)\b/i,
  ],
  hogares: [
    /\bNMLS[\s:#]*\s*[\w-]+/i,
    /\b(?:Consumer\s+Access|nmlsconsumeraccess)\b/i,
  ],
};

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function evaluateBrokerPage(
  content: string,
  domain: BrokerDomain,
): BrokerLintResult {
  const reasons: string[] = [];

  // ── Body word count ─────────────────────────────────────────────────────
  const totalWords = wordCount(content);
  if (totalWords > BROKER_MAX_BODY_WORDS) {
    reasons.push(
      `Conteo de palabras ${totalWords} excede el máximo de ${BROKER_MAX_BODY_WORDS} para ${domain}.ai. Contenido editorial debe vivir en Finazo (spec §1.2/§1.3).`,
    );
  }

  // ── Editorial-shape markers ─────────────────────────────────────────────
  for (const { test, label } of EDITORIAL_MARKERS) {
    if (test(content)) {
      reasons.push(label);
    }
  }

  // ── Banned phrasing (brand as wrong entity type) ────────────────────────
  for (const { pattern, label } of BROKER_BANNED_PHRASING) {
    if (pattern.test(content)) {
      reasons.push(`Lenguaje prohibido: ${label}`);
    }
  }

  // ── Competitor name mentions in comparative context ─────────────────────
  // Comparative claims about named competitors live on Finazo only (§8.5).
  // A simple mention is OK; "vs" or "alternativa" trigger the block.
  for (const name of NAMED_COMPETITORS) {
    const namePattern = new RegExp(`\\b${name.replace(/\s/g, "\\s+")}\\b`, "i");
    if (namePattern.test(content)) {
      const isComparative = /vs\.?|alternativa|mejor\s+que|peor\s+que/i.test(content);
      if (isComparative) {
        reasons.push(
          `Contenido comparativo nombrando competidor (${name}). Comparativas viven en Finazo (spec §8.5), no en ${domain}.ai.`,
        );
        break;
      }
    }
  }

  // ── Required disclosures ────────────────────────────────────────────────
  const disclosures = REQUIRED_DISCLOSURES[domain];
  for (const pattern of disclosures) {
    if (!pattern.test(content)) {
      reasons.push(
        `Falta disclosure regulatoria requerida en ${domain}.ai (patrón: ${pattern.source}).`,
      );
    }
  }

  // ── Score — broker pages need higher threshold than Finazo (92 vs 85) ──
  const penaltyPerReason = 20;
  const score = Math.max(0, 100 - reasons.length * penaltyPerReason);

  return {
    pass: reasons.length === 0,
    reasons,
    score,
  };
}

/**
 * Build a re-prompt instruction for the broker strategist when lint fails.
 * Different from Finazo retry because broker pages can't simply "add more
 * content" — they need to be tighter or moved to Finazo entirely.
 */
export function buildBrokerRetryInstructions(result: BrokerLintResult): string {
  if (result.pass) return "";
  return `

REGENERACIÓN REQUERIDA — la página falla compliance para dominio regulado (score ${result.score}/100). Razones:

${result.reasons.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Reescribí la página manteniendo:
- Máximo ${BROKER_MAX_BODY_WORDS} palabras de cuerpo.
- Lenguaje broker (NO insurer/lender).
- Sin comparativas carrier-vs-carrier (esas van en Finazo).
- Disclosure regulatoria completa (NPN, licencia, regulador).

Si el contenido necesita más de ${BROKER_MAX_BODY_WORDS} palabras o comparativas para responder al usuario, eso significa que ESTE CONTENIDO DEBERÍA VIVIR EN FINAZO, no en el dominio regulado. Cortar al máximo y enlazar a Finazo.`;
}
