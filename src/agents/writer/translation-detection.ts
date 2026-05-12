/**
 * Translation detection lint — spec §1.7.1 / §4.4.
 *
 * The bilingual structure on Finazo (Spanish-default + English `/en/`) only
 * compounds value if the English content is independently written. Translated
 * Spanish content pattern-matches as low-quality to Google and AI engines,
 * and damages domain quality across BOTH languages.
 *
 * This lint detects markers of machine-translated-from-Spanish English:
 * calque expressions, copula-heavy sentences, Spanish-inflected register.
 * It runs in two modes:
 *
 * 1. Standalone: scans English text for translation markers without needing
 *    a Spanish counterpart.
 * 2. Comparative: if a Spanish counterpart is provided, additionally checks
 *    structural alignment (H2 sequences, paragraph counts, sentence-level
 *    similarity).
 *
 * Returns a score 0-100 (lower = looks more translated) and the specific
 * markers that triggered. The strategist refuses to insert below the
 * configured threshold (default 70).
 */

export type TranslationCheckResult = {
  /** 0-100. Lower = more translation markers detected. */
  nativenessScore: number;
  /** Specific markers that fired. */
  markers: Array<{
    rule: string;
    excerpt: string;
  }>;
  /** Convenience flag — true if nativenessScore < threshold (default 70). */
  looksTranslated: boolean;
};

/**
 * Calque patterns — direct word-for-word translations from Spanish that read
 * unnaturally in English. Each pattern includes a regex + a brief label.
 */
const CALQUE_PATTERNS: Array<{ pattern: RegExp; rule: string }> = [
  // "hacer una pregunta" → "make a question" (should be "ask a question")
  { pattern: /\bmake\s+(?:a\s+|the\s+)?questions?\b/i, rule: "calque: 'make a question' (use 'ask a question')" },
  // "tener X años" → "have X years" (should be "be X years old")
  { pattern: /\bhave\s+\d+\s+years\b(?!\s+of)/i, rule: "calque: 'have N years' (use 'be N years old' or 'N years of experience')" },
  // "realizar" used in Spanish sense (to do/perform) — common false friend
  { pattern: /\brealize\s+(?:a|the|an|your)\s+(?:payment|application|process|transaction|deposit|withdrawal|task|operation)\b/i, rule: "calque: 'realize a payment/application' (use 'make a payment', 'submit an application')" },
  // "asistir" → "assist" used as "attend"
  { pattern: /\bassist\s+(?:to|the)\s+(?:meeting|class|event|appointment)\b/i, rule: "calque: 'assist to a meeting' (use 'attend a meeting')" },
  // "lo mismo" → "the same" as adverb
  { pattern: /\bthe\s+same\s+(?:works|applies|happens|goes)\s+(?:for|with)\b/i, rule: "calque: 'the same works for' (use 'the same applies to')" },
  // "actualmente" → "actually" (Spanish "actualmente" = currently, not "actually")
  { pattern: /\bactually\s+(?:we\s+have|there\s+(?:is|are)|the\s+government)\b/i, rule: "false friend: 'actually' used as Spanish 'actualmente' (use 'currently')" },
  // "carrera" → "career" used as university degree/major
  { pattern: /\b(?:study|finished?|complete)\s+(?:my|the|her|his|their)\s+career\b/i, rule: "calque: 'study my career' (use 'study my degree' or 'study my major')" },
  // "molestar" → "molest" (Spanish "molestar" = to bother; English "molest" has very different meaning)
  { pattern: /\bdon[' ]t\s+molest\b/i, rule: "calque: 'don't molest' (use 'don't bother' / 'don't disturb')" },
  // "tomar una decisión" → "take a decision" (should be "make a decision")
  { pattern: /\btake\s+(?:a|the)\s+decisions?\b/i, rule: "calque: 'take a decision' (use 'make a decision')" },
  // "asunto" → "matter" used incorrectly in formal openers
  { pattern: /\bin\s+matter\s+of\b/i, rule: "calque: 'in matter of' (use 'regarding' or 'in matters of')" },
  // Spanish capitalization patterns leaking through
  { pattern: /\bSpanish\s+language\b(?!\s+publisher|\s+person)/i, rule: "register: 'Spanish language' as redundant modifier (often a translation tic)" },
  // "informar" → "inform to"
  { pattern: /\binform\s+to\s+(?:the|your|our)\b/i, rule: "calque: 'inform to' (drop the 'to': 'inform the IRS')" },
  // "demanda" → "demand" used as legal claim/lawsuit
  { pattern: /\bfile\s+(?:a\s+)?demand\s+against\b/i, rule: "calque: 'file a demand' (use 'file a lawsuit' or 'file a claim')" },
  // "sufrir" → "suffer" used loosely for "experience"
  { pattern: /\bsuffer\s+(?:a\s+)?(?:change|delay|increase|reduction)\b/i, rule: "calque: 'suffer a delay/change' (use 'experience' or 'undergo')" },
  // "esperar" → "wait" used as "expect"
  { pattern: /\bwe\s+wait\s+(?:that|the\s+government|the\s+IRS|prices?)\b/i, rule: "calque: 'we wait that...' (use 'we expect that...')" },
  // "ir a" + verb (immediate future) overused
  { pattern: /\bI\s+am\s+going\s+to\s+going\b/i, rule: "calque: redundant 'going to going'" },
  // Wrong preposition: "depend of" instead of "depend on"
  { pattern: /\bdepends?\s+of\s+(?:the|your|how|what)\b/i, rule: "calque: 'depends of' (use 'depends on')" },
  // "consist of" misused
  { pattern: /\bconsists?\s+in\s+(?:the|having|making)\b/i, rule: "calque: 'consists in' (use 'consists of' or 'involves')" },
];

/**
 * Copula-heavy structures — Spanish leans more on "ser/estar + adjective"
 * than English does on "be + adjective." Excessive copula sentences are a
 * translation tell.
 */
function countCopulaSentences(text: string): { count: number; total: number } {
  const sentences = text
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const COPULA = /^(?:It\s+is|This\s+is|These\s+(?:are|is)|That\s+is|There\s+(?:is|are))\s+(?:a|an|the|very|really|quite|so)\b/i;
  const copulaCount = sentences.filter((s) => COPULA.test(s)).length;
  return { count: copulaCount, total: sentences.length };
}

/**
 * Spanish sentence-length distribution — Spanish averages longer sentences
 * than English personal-finance writing. Translated English often keeps
 * Spanish-length sentences (high mean, low variance).
 */
function avgSentenceWordCount(text: string): number {
  const sentences = text
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (sentences.length === 0) return 0;
  const totalWords = sentences.reduce(
    (acc, s) => acc + s.split(/\s+/).filter(Boolean).length,
    0,
  );
  return totalWords / sentences.length;
}

/**
 * Strip markdown so the lint runs on text-only content. We keep this simple:
 * remove headings/lists/code/links wrappers but preserve sentence boundaries.
 */
function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^[*-]\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^\s*\|.*\|.*$/gm, " ")
    .replace(/^>\s+/gm, "");
}

export function detectTranslation(
  englishContent: string,
  options: { threshold?: number; spanishCounterpart?: string } = {},
): TranslationCheckResult {
  const threshold = options.threshold ?? 70;
  const text = stripMarkdown(englishContent);

  const markers: TranslationCheckResult["markers"] = [];

  // ── Calque scan ──────────────────────────────────────────────────────────
  for (const { pattern, rule } of CALQUE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const idx = match.index ?? 0;
      const start = Math.max(0, idx - 30);
      const excerpt = text.slice(start, Math.min(text.length, idx + match[0].length + 30)).replace(/\s+/g, " ").trim();
      markers.push({ rule, excerpt: `…${excerpt}…` });
    }
  }

  // ── Copula density ───────────────────────────────────────────────────────
  const { count: copulaCount, total: sentenceCount } = countCopulaSentences(text);
  const copulaRatio = sentenceCount > 0 ? copulaCount / sentenceCount : 0;
  if (sentenceCount >= 10 && copulaRatio > 0.18) {
    markers.push({
      rule: `register: copula-heavy structure (${(copulaRatio * 100).toFixed(0)}% sentences start with 'It is / There is / This is')`,
      excerpt: `${copulaCount} of ${sentenceCount} sentences`,
    });
  }

  // ── Sentence length ──────────────────────────────────────────────────────
  const avgLen = avgSentenceWordCount(text);
  if (avgLen > 28) {
    markers.push({
      rule: `register: sentences average ${avgLen.toFixed(1)} words (Spanish-typical; US English personal-finance writing averages 14-22)`,
      excerpt: `avg=${avgLen.toFixed(1)}`,
    });
  }

  // ── Structural alignment with Spanish counterpart (optional) ────────────
  if (options.spanishCounterpart) {
    const esText = stripMarkdown(options.spanishCounterpart);
    const esH2s = (options.spanishCounterpart.match(/^##\s/gm) ?? []).length;
    const enH2s = (englishContent.match(/^##\s/gm) ?? []).length;
    if (esH2s > 0 && enH2s === esH2s && esH2s >= 4) {
      markers.push({
        rule: `structural alignment: English and Spanish have identical H2 count (${enH2s}) and likely identical order — strong translation signal`,
        excerpt: `H2s: en=${enH2s}, es=${esH2s}`,
      });
    }
    // Word-count similarity as a sanity check (translation usually within ±15%)
    const enWords = text.split(/\s+/).filter(Boolean).length;
    const esWords = esText.split(/\s+/).filter(Boolean).length;
    if (esWords > 100 && enWords > 100) {
      const ratio = enWords / esWords;
      if (ratio > 0.85 && ratio < 1.15) {
        markers.push({
          rule: `word-count alignment: en/es ratio is ${ratio.toFixed(2)} — independent articles should diverge more (target <0.7 or >1.3)`,
          excerpt: `en=${enWords}, es=${esWords}`,
        });
      }
    }
  }

  // Each marker deducts; cap at 0.
  const penaltyPerMarker = 15;
  const nativenessScore = Math.max(0, 100 - markers.length * penaltyPerMarker);

  return {
    nativenessScore,
    markers,
    looksTranslated: nativenessScore < threshold,
  };
}

/**
 * Build a retry instruction snippet the strategist can append to the prompt
 * when translation markers are detected.
 */
export function buildTranslationRetryInstructions(
  result: TranslationCheckResult,
): string {
  if (!result.looksTranslated) return "";
  return `

RETRY REQUIRED — the previous draft shows translation-from-Spanish markers (nativeness score ${result.nativenessScore}/100). Rewrite from scratch in English-native register. Specific markers detected:

${result.markers.map((m, i) => `${i + 1}. ${m.rule}\n   excerpt: ${m.excerpt}`).join("\n")}

Rewrite the entire article in natural US English personal-finance register. Avoid the patterns above. Do NOT translate from Spanish — the brief is English-native.`;
}
