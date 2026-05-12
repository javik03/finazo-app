/**
 * Quality gate — runs after Claude returns an article draft, before DB insert.
 *
 * Enforces the Welter / E-E-A-T discipline encoded in US_SEO_SUFFIX so the
 * strategist doesn't ship articles that read as AI-spam or that Google's
 * Helpful Content Update will demote.
 *
 * Returns `{ pass, reasons[] }`. On fail the strategist re-prompts Claude with
 * the reasons appended so the next attempt actually fixes them.
 *
 * NOT an LLM call — pure regex + counts so retries cost nothing.
 */

export type QualityGateOptions = {
  /** Minimum body word count. Defaults vary by template — 1200 standard, 800 glossary. */
  minWordCount?: number;
  /** Allow articles without a comparison table (e.g. pure glossary explainers). */
  allowMissingTable?: boolean;
  /** Allow articles without a callout box (rare — most articles must have one). */
  allowMissingCallout?: boolean;
  /**
   * Category of the article — when "seguros", activates insurance-specific
   * compliance lints (CFPB-as-source ban, sourced/hedged competitor claim
   * requirement, sourced+state+range pricing requirement).
   */
  category?: "seguros" | "prestamos" | "tarjetas" | "educacion" | "remesas" | "ahorro";
};

export type QualityGateResult = {
  pass: boolean;
  reasons: string[];
  /** Diagnostics for logging — useful when tuning thresholds. */
  metrics: {
    wordCount: number;
    h2Count: number;
    h3Count: number;
    faqQuestionCount: number;
    authoritativeUrlCount: number;
    bannedHeadings: string[];
    bannedOpeners: string[];
    bannedPatterns: string[];
    /** Insurance-compliance findings (only populated when category="seguros"). */
    insuranceCompliance?: {
      cfpbMentions: number;
      unsourcedPricingClaims: string[];
      unsourcedCompetitorClaims: string[];
    };
  };
};

// ─── Regex banks ───────────────────────────────────────────────────────────

/**
 * Headings that are too short / lazy to carry chunk context. The list matches
 * the exact title in isolation — a heading like `## Conclusión: cómo elegir
 * seguro de auto con ITIN en Tampa en 2026` passes; `## Conclusión` fails.
 */
const BANNED_HEADING_TITLES = new Set([
  "introducción",
  "introduccion",
  "conclusión",
  "conclusion",
  "preguntas frecuentes",
  "faq",
  "resumen",
  "cómo funciona",
  "como funciona",
  "tarifas",
  "tarifas promedio",
  "por qué cubierto",
  "porque cubierto",
  "lo bueno y lo malo",
  "pros y contras",
  "veredicto",
  "veredicto final",
]);

/** Opener phrases that break paragraph independence (Welter chunk rule). */
const BANNED_OPENERS = [
  /^como\s+mencionamos\b/i,
  /^como\s+vimos\b/i,
  /^como\s+(ya\s+)?dijimos\b/i,
  /^volviendo\s+a\b/i,
  /^si\s+recuerdas\b/i,
  /^más\s+adelante\b/i,
  /^mas\s+adelante\b/i,
  /^antes\s+vimos\b/i,
  /^en\s+la\s+secci[oó]n\s+anterior\b/i,
  /^como\s+expliqu[eé]\b/i,
];

/** Patterns that are forbidden anywhere in the body. */
const BANNED_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  // Unsubstantiated savings claims
  { pattern: /\bahorra\s+\$\d+(?!\s*(?:según|sobre|al año|al mes|en|para|por))/i, label: "Cifra de ahorro sin contexto/fuente" },
  { pattern: /te\s+est[áa]n\s+cobrando\s+demasiado/i, label: "Acusación sin sustentar ('te están cobrando demasiado')" },
  { pattern: /tu\s+aseguradora\s+te\s+est[áa]\s+robando/i, label: "Acusación conspirativa" },
  // Conspiracy framing
  { pattern: /lo\s+que\s+tu\s+aseguradora\s+no\s+quiere\s+que\s+sepas/i, label: "Marco conspirativo" },
  { pattern: /el\s+secreto\s+que\s+los\s+bancos\s+esconden/i, label: "Marco conspirativo" },
  // Urgency manipulation
  { pattern: /\bsolo\s+por\s+hoy\b/i, label: "Urgencia manipuladora ('solo por hoy')" },
  { pattern: /\b[uú]ltimos\s+cupos\b/i, label: "Urgencia manipuladora ('últimos cupos')" },
  // Definitive promises without disclaimer
  { pattern: /definitivamente\s+calificas/i, label: "Promesa absoluta sin disclaimer" },
  { pattern: /seguro\s+(que\s+)?te\s+aprueban/i, label: "Promesa absoluta sin disclaimer" },
  // Wrong product framing
  { pattern: /\bcubierto\s+te\s+asegura\b/i, label: "Cubierto es CORREDOR, no aseguradora" },
  { pattern: /\bcubierto\s+es\s+una\s+aseguradora\b/i, label: "Cubierto es CORREDOR, no aseguradora" },
  { pattern: /\bhogares\s+te\s+presta\b/i, label: "Hogares es BROKER, no prestamista" },
  { pattern: /\bhogares\s+es\s+un\s+prestamista\b/i, label: "Hogares es BROKER, no prestamista" },
];

/**
 * Domains we count toward "authoritative source citation density." This is
 * intentionally narrow — Finazo's own pages, Cubierto, Hogares, and WhatsApp
 * links don't count.
 */
const AUTHORITATIVE_DOMAINS = [
  // US government
  /\birs\.gov\b/i,
  /\bcfpb\.gov\b/i,
  /\bhealthcare\.gov\b/i,
  /\bcms\.gov\b/i,
  /\bhud\.gov\b/i,
  /\bssa\.gov\b/i,
  /\bfederalreserve\.gov\b/i,
  /\bfredstlouisfed\.org\b/i,
  /\bfred\.stlouisfed\.org\b/i,
  /\bcensus\.gov\b/i,
  /\bdata\.census\.gov\b/i,
  /\bhrsa\.gov\b/i,
  /\bbls\.gov\b/i,
  /\bftc\.gov\b/i,
  /\busda\.gov\b/i,
  /\busa\.gov\b/i,
  // State regulators
  /\bfloir\.com\b/i,
  /\bmyflorida\.com\b/i,
  /\bmyflfamilies\.com\b/i,
  /\btdi\.texas\.gov\b/i,
  /\byourtexasbenefits\.com\b/i,
  /\bdfs\.ny\.gov\b/i,
  /\bdmv\.ca\.gov\b/i,
  /\bdor\.ca\.gov\b/i,
  // Industry / nonprofit authorities
  /\bkff\.org\b/i,
  /\bnilc\.org\b/i,
  /\bbrookings\.edu\b/i,
  /\burban\.org\b/i,
  /\bmigrationpolicy\.org\b/i,
  /\bnaic\.org\b/i,
  /\bahip\.org\b/i,
  /\bmba\.org\b/i,
  /\bmbafinance\.org\b/i,
  /\bfreddiemac\.com\b/i,
  /\bfanniemae\.com\b/i,
  /\bnerdwallet\.com/i, // counts toward citation, lower weight
  // BBB (for competitor alternative pages per spec §8.5)
  /\bbbb\.org\b/i,
];

// ─── Extraction helpers ─────────────────────────────────────────────────────

/** Pull all H2 headings as raw text. */
function extractHeadings(content: string, level: 2 | 3): string[] {
  const prefix = "#".repeat(level);
  const lineRegex = new RegExp(`^${prefix}\\s+(.+?)\\s*$`, "gm");
  const matches: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = lineRegex.exec(content)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}

/** Count words split by whitespace (Markdown-naive — good enough for thresholds). */
function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Normalize a heading to its banned-set lookup form: strip emoji, lowercase,
 * trim trailing colon/period, strip leading numbering.
 */
function normalizeHeading(h: string): string {
  return h
    .toLowerCase()
    .replace(/^[\d.\s]+/, "")
    .replace(/[.:;!?]+$/g, "")
    .trim();
}

/** Extract every URL written in markdown link syntax: [text](url). */
function extractMarkdownUrls(content: string): string[] {
  const urls: string[] = [];
  const re = /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    urls.push(m[1]);
  }
  return urls;
}

/**
 * Count paragraphs that start with a banned opener phrase.
 * A "paragraph" is a non-empty line that isn't a heading / list / blockquote.
 */
function findBannedOpeners(content: string): string[] {
  const offenders: string[] = [];
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#") && !p.startsWith(">") && !p.startsWith("|") && !p.startsWith("-") && !p.startsWith("*"));

  for (const para of paragraphs) {
    for (const opener of BANNED_OPENERS) {
      if (opener.test(para)) {
        offenders.push(para.slice(0, 80));
        break;
      }
    }
  }
  return offenders;
}

// ─── Insurance-compliance checks (active when category="seguros") ─────────

/**
 * Carriers we lint flat claims about. Mentions are fine — the issue is flat
 * factual statements presented without a source or hedge.
 */
const NAMED_INSURANCE_CARRIERS = [
  "Progressive",
  "GEICO",
  "State Farm",
  "Allstate",
  "Esurance",
  "Direct General",
  "Infinity",
  "Fred Loya",
  "Estrella Insurance",
  "Estrella",
  "Confie",
  "Acceptance Insurance",
  "Acceptance",
  "Bristol West",
  "Windhaven",
  "Ocean Harbor",
  "Liberty Mutual",
  "Nationwide",
  "Farmers",
  "Travelers",
  "USAA",
  "A-MAX",
  "InsureOne",
];

/**
 * Hedging phrases that legitimize a flat claim about a competitor (Pattern B
 * in the compliance spec). If a paragraph or sentence opens with one of these,
 * the claim is acceptable as opinion/observation.
 */
const HEDGE_OPENERS = [
  /\ben\s+nuestra\s+experiencia\b/i,
  /\bseg[uú]n\s+reportes\s+de\s+usuarios\b/i,
  /\banec[dó]ticamente\b/i,
  /\bcreemos\s+que\b/i,
  /\bhemos\s+observado\b/i,
  /\bsuele\s+(?:ser|requerir|cobrar|aceptar|rechazar)\b/i,
  /\btiende\s+a\b/i,
  /\bgeneralmente\b/i,
];

/**
 * Source-attribution prefix patterns (Pattern A). Sentences led by these are
 * acceptable factual claims.
 */
const SOURCE_PREFIXES = [
  /\bseg[uú]n\s+(?:el|la|los|las|un|una)?\s*[A-Z][\w]+/i, // "Según el NAIC", "Según ValuePenguin"
  /\bde\s+acuerdo\s+a\b/i,
  /\bcita(?:r|do|da)?\s+(?:al|a la|del)\b/i,
  /\bbasado\s+en\b/i,
  /\bun\s+reporte\s+de\b/i,
  /\bel\s+complaint\s+index\b/i,
  /\bel\s+rate\s+filing\b/i,
];

const CFPB_INSURANCE_PATTERNS = [
  /\bCFPB\b/,
  /\bConsumer\s+Financial\s+Protection\s+Bureau\b/i,
  /consumerfinance\.gov/i,
];

/**
 * Detect flat pricing claims like "$1,980/año", "$165/mes", "$2,490 anuales"
 * NOT preceded within ~200 chars by a source attribution or hedge.
 */
function findUnsourcedPricingClaims(content: string): string[] {
  const offenders: string[] = [];
  const text = content;
  const pricingRegex = /\$\s?\d{2,3}(?:[,.]?\d{3})?\s?\/?\s?(?:año|anuales?|mes|mensuales?|year|month)/gi;
  let match: RegExpExecArray | null;
  while ((match = pricingRegex.exec(text)) !== null) {
    const start = Math.max(0, match.index - 250);
    const window = text.slice(start, match.index + match[0].length);
    const hasSource = SOURCE_PREFIXES.some((p) => p.test(window));
    const hasHedge = HEDGE_OPENERS.some((p) => p.test(window));
    const hasYear = /\b(20\d{2})\b/.test(window);
    if (!hasSource && !hasHedge) {
      // Also skip if it's clearly a label inside a markdown table cell where
      // the table heading row already cited a source — those edge cases get
      // a free pass when both source-prefix AND year exist somewhere in
      // the previous ~500 chars.
      const widerWindow = text.slice(Math.max(0, match.index - 500), match.index);
      const widerHasSource = SOURCE_PREFIXES.some((p) => p.test(widerWindow));
      if (!widerHasSource || !hasYear) {
        offenders.push(match[0]);
      }
    }
  }
  return offenders;
}

/**
 * Detect flat competitor claims: paragraphs containing a named carrier AND a
 * factual assertion (verb like "recibe", "requiere", "rechaza", "es más",
 * "tiene más quejas"), where the paragraph does NOT open with a hedge or
 * source prefix.
 */
function findUnsourcedCompetitorClaims(content: string): string[] {
  const carrierPattern = new RegExp(
    `\\b(${NAMED_INSURANCE_CARRIERS.map((c) => c.replace(/\s+/g, "\\s+")).join("|")})\\b`,
    "i",
  );
  const assertionPattern =
    /\b(recibe|requiere|rechaza|acepta|cobra|es\s+m[aá]s|tiene\s+m[aá]s|tiene\s+menos|hist[oó]ricamente|sus\s+descuentos|sus\s+tarifas)\b/i;

  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(
      (p) =>
        p &&
        !p.startsWith("#") &&
        !p.startsWith(">") &&
        !p.startsWith("|") &&
        !p.startsWith("-") &&
        !p.startsWith("*"),
    );

  const offenders: string[] = [];
  for (const para of paragraphs) {
    if (!carrierPattern.test(para) || !assertionPattern.test(para)) continue;

    // Skip if the paragraph leads with a source prefix or hedge.
    const hasSource = SOURCE_PREFIXES.some((p) => p.test(para));
    const hasHedge = HEDGE_OPENERS.some((p) => p.test(para));
    if (hasSource || hasHedge) continue;

    offenders.push(para.slice(0, 120) + (para.length > 120 ? "…" : ""));
  }
  return offenders;
}

function evaluateInsuranceCompliance(content: string): {
  reasons: string[];
  metrics: NonNullable<QualityGateResult["metrics"]["insuranceCompliance"]>;
} {
  const reasons: string[] = [];

  // 1. CFPB used as source for insurance content
  let cfpbMentions = 0;
  for (const p of CFPB_INSURANCE_PATTERNS) {
    const matches = content.match(new RegExp(p.source, p.flags + "g"));
    if (matches) cfpbMentions += matches.length;
  }
  if (cfpbMentions > 0) {
    reasons.push(
      `Citado CFPB ${cfpbMentions} vez(es) en artículo de seguros. CFPB no tiene jurisdicción sobre seguros (Dodd-Frank § 1027(f)) — usar NAIC complaint index (content.naic.org/cis_consumer_information.htm) o el state DOI correspondiente.`,
    );
  }

  // 2. Flat pricing claims
  const unsourcedPricingClaims = findUnsourcedPricingClaims(content);
  if (unsourcedPricingClaims.length > 0) {
    reasons.push(
      `${unsourcedPricingClaims.length} cifra(s) de precio sin fuente nombrada o hedge cerca: ${unsourcedPricingClaims.slice(0, 3).join(", ")}. Toda prima debe estar precedida por "Según [fuente con año]" e incluir un rango con calificador estatal — no número plano.`,
    );
  }

  // 3. Flat competitor claims
  const unsourcedCompetitorClaims = findUnsourcedCompetitorClaims(content);
  if (unsourcedCompetitorClaims.length > 0) {
    reasons.push(
      `${unsourcedCompetitorClaims.length} afirmación(es) sobre carrier nombrado sin fuente ni hedge. Toda afirmación específica sobre Progressive/GEICO/etc. debe empezar con "Según [fuente]" o con un hedge ("En nuestra experiencia", "Hemos observado"). Primera muestra: "${unsourcedCompetitorClaims[0]}"`,
    );
  }

  return {
    reasons,
    metrics: {
      cfpbMentions,
      unsourcedPricingClaims,
      unsourcedCompetitorClaims,
    },
  };
}

// ─── Main gate ─────────────────────────────────────────────────────────────

export function evaluateArticle(
  content: string,
  options: QualityGateOptions = {},
): QualityGateResult {
  const reasons: string[] = [];

  const minWordCount = options.minWordCount ?? 1200;
  const totalWords = wordCount(content);

  const h2Headings = extractHeadings(content, 2);
  const h3Headings = extractHeadings(content, 3);

  // ── Word count ───────────────────────────────────────────────────────────
  if (totalWords < minWordCount) {
    reasons.push(
      `Conteo de palabras ${totalWords} debajo del mínimo ${minWordCount}. Expandí cada H2 con un párrafo más de contexto local o un sub-tema.`,
    );
  }

  // ── Banned headings (Welter rule) ────────────────────────────────────────
  const bannedHeadings: string[] = [];
  for (const h of [...h2Headings, ...h3Headings]) {
    const norm = normalizeHeading(h);
    if (BANNED_HEADING_TITLES.has(norm)) {
      bannedHeadings.push(h);
    }
  }
  if (bannedHeadings.length > 0) {
    reasons.push(
      `Encabezados prohibidos por reglas Welter (deben cargar tema + geo + cohorte, no etiquetas perezosas): ${bannedHeadings.map((h) => `"${h}"`).join(", ")}. Reescribilos con 8+ palabras incluyendo el tema y la geo.`,
    );
  }

  // ── H2 word-count minimum ────────────────────────────────────────────────
  const shortH2s = h2Headings.filter((h) => wordCount(h) < 8);
  if (shortH2s.length > 0) {
    reasons.push(
      `H2 con menos de 8 palabras (no aportan contexto semántico): ${shortH2s.slice(0, 3).map((h) => `"${h}"`).join(", ")}${shortH2s.length > 3 ? "…" : ""}. Cada H2 debe cargar tema + geo + cohorte (o año si aplica).`,
    );
  }

  // ── Banned opener phrases (chunk independence) ───────────────────────────
  const bannedOpeners = findBannedOpeners(content);
  if (bannedOpeners.length > 0) {
    reasons.push(
      `Párrafos rompen independencia de chunk (empiezan con frase de referencia hacia atrás): ${bannedOpeners.slice(0, 2).map((p) => `"${p}…"`).join("; ")}. Reescribí cada párrafo para que pueda citarse fuera de contexto.`,
    );
  }

  // ── Citation density ─────────────────────────────────────────────────────
  const urls = extractMarkdownUrls(content);
  const authoritativeUrls = urls.filter((u) =>
    AUTHORITATIVE_DOMAINS.some((pattern) => pattern.test(u)),
  );
  const distinctAuthoritativeDomains = new Set(
    authoritativeUrls.map((u) => {
      try {
        return new URL(u).hostname.replace(/^www\./, "");
      } catch {
        return u;
      }
    }),
  );
  if (distinctAuthoritativeDomains.size < 2) {
    reasons.push(
      `Solo ${distinctAuthoritativeDomains.size} fuente(s) autoritativa(s) citadas (mínimo 2 dominios distintos: IRS.gov, CFPB.gov, HealthCare.gov, KFF.org, FRED, state DOI, etc). Agregá citas con URL en markdown.`,
    );
  }

  // ── Banned content patterns ──────────────────────────────────────────────
  const bannedHits: string[] = [];
  for (const { pattern, label } of BANNED_PATTERNS) {
    if (pattern.test(content)) {
      bannedHits.push(label);
    }
  }
  if (bannedHits.length > 0) {
    reasons.push(
      `Patrones de contenido prohibidos detectados: ${bannedHits.join(", ")}. Reescribí esas secciones.`,
    );
  }

  // ── Required structural elements ─────────────────────────────────────────
  const hasFaqSection = h2Headings.some((h) => /preguntas\s+frecuentes/i.test(h));
  const faqQuestionCount = h3Headings.filter((h) => /\?$/.test(h)).length;
  if (!hasFaqSection) {
    reasons.push(
      "Falta sección de Preguntas Frecuentes (H2 con 'Preguntas frecuentes…'). Agregar 5-7 preguntas con respuestas de 2-3 oraciones.",
    );
  } else if (faqQuestionCount < 5) {
    reasons.push(
      `Sección FAQ presente pero con solo ${faqQuestionCount} pregunta(s) detectada(s) (H3 terminando en '?'). Mínimo 5 preguntas reales.`,
    );
  }

  const hasMarkdownTable = /\n\s*\|[^\n]+\|\s*\n\s*\|[\s|:-]+\|/m.test(content);
  if (!options.allowMissingTable && !hasMarkdownTable) {
    reasons.push(
      "Falta tabla comparativa en formato Markdown (mínimo una con headers + separator row).",
    );
  }

  const hasCallout = /\n>\s*\*\*Lo esencial:\*\*/.test(content);
  if (!options.allowMissingCallout && !hasCallout) {
    reasons.push(
      "Falta el callout 'Lo esencial' después de la introducción (`> **Lo esencial:** …`).",
    );
  }

  // ── Image markers (must be exactly 2 unresolved markers OR 2 resolved images) ──
  const inlineMarkers = (content.match(/!\[INLINE:[^\]]+\]\(\)/g) ?? []).length;
  const resolvedImages = (content.match(/!\[[^\]]*\]\(https?:\/\/[^)]+\)/g) ?? []).length;
  const totalInlineImages = inlineMarkers + resolvedImages;
  if (totalInlineImages < 2) {
    reasons.push(
      `Solo ${totalInlineImages} imagen(es) inline (deben ser exactamente 2: una después del callout, otra a 2/3 del artículo).`,
    );
  }

  // ── Insurance-compliance checks (only when category === "seguros") ─────
  // The bug that exposed Finazo to Lanham Act risk: CFPB was cited as a
  // source for insurance complaint data even though CFPB has no jurisdiction
  // over insurance per Dodd-Frank § 1027(f). These rules block the three
  // patterns documented in finazo-insurance-compliance.md.
  let insuranceMetrics: QualityGateResult["metrics"]["insuranceCompliance"];
  if (options.category === "seguros") {
    const ins = evaluateInsuranceCompliance(content);
    insuranceMetrics = ins.metrics;
    reasons.push(...ins.reasons);
  }

  return {
    pass: reasons.length === 0,
    reasons,
    metrics: {
      wordCount: totalWords,
      h2Count: h2Headings.length,
      h3Count: h3Headings.length,
      faqQuestionCount,
      authoritativeUrlCount: distinctAuthoritativeDomains.size,
      bannedHeadings,
      bannedOpeners,
      bannedPatterns: bannedHits,
      ...(insuranceMetrics ? { insuranceCompliance: insuranceMetrics } : {}),
    },
  };
}

/**
 * Build a retry-prompt suffix that tells Claude exactly what to fix on the
 * next attempt. The strategist appends this to the original prompt.
 */
export function buildRetryInstructions(result: QualityGateResult): string {
  if (result.pass) return "";
  return `

REINTENTO REQUERIDO — la versión anterior falló las puertas de calidad por las siguientes razones:

${result.reasons.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Reescribí el artículo completo arreglando TODOS los puntos anteriores. Mantenelo en el mismo formato (META + KEYWORDS al final).`;
}
