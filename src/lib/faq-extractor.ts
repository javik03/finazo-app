/**
 * Extracts FAQ Q&A pairs from article markdown for Schema.org FAQPage JSON-LD.
 *
 * Finds the "## Preguntas frecuentes…" H2 section, then collects each H3
 * underneath (the questions) along with the prose / list content that follows
 * it (the answer). Stops at the next H2.
 *
 * Returns `[]` if no FAQ section exists — the renderer should skip the
 * FAQPage schema in that case.
 */

export type FaqEntry = {
  question: string;
  answer: string;
};

const FAQ_H2_MATCH = /^##\s+.*preguntas\s+frecuentes/i;
const H2_LINE = /^##\s+/;
const H3_LINE = /^###\s+(.+?)\s*$/;

/** Strip markdown link syntax → plain text. `[label](url)` → `label`. */
function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/** Strip bold/italic markers — schema.org wants plain text in Question/Answer. */
function stripEmphasis(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1");
}

/** Collapse paragraph breaks into single spaces for FAQ answer field. */
function flattenWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function cleanAnswerText(raw: string): string {
  return flattenWhitespace(stripEmphasis(stripMarkdownLinks(raw)));
}

export function extractFaqEntries(content: string): FaqEntry[] {
  const lines = content.split(/\r?\n/);
  let inFaq = false;
  const entries: FaqEntry[] = [];
  let currentQuestion: string | null = null;
  let currentAnswerLines: string[] = [];

  const flushCurrent = (): void => {
    if (currentQuestion !== null) {
      const answer = cleanAnswerText(currentAnswerLines.join("\n"));
      if (answer.length > 0) {
        entries.push({ question: currentQuestion, answer });
      }
    }
    currentQuestion = null;
    currentAnswerLines = [];
  };

  for (const line of lines) {
    if (!inFaq) {
      if (FAQ_H2_MATCH.test(line)) {
        inFaq = true;
      }
      continue;
    }

    // Hit the next H2 — FAQ section is over.
    if (H2_LINE.test(line) && !FAQ_H2_MATCH.test(line)) {
      flushCurrent();
      break;
    }

    const h3Match = line.match(H3_LINE);
    if (h3Match) {
      flushCurrent();
      currentQuestion = cleanAnswerText(h3Match[1]);
      continue;
    }

    if (currentQuestion !== null) {
      currentAnswerLines.push(line);
    }
  }

  // Reached EOF still inside FAQ section
  if (inFaq && currentQuestion !== null) {
    flushCurrent();
  }

  return entries;
}

/**
 * Build the Schema.org FAQPage JSON-LD payload from extracted entries.
 * Returns null when there are fewer than 2 entries — Google won't render a
 * rich result for a single Q&A anyway, so it's not worth emitting noise.
 */
export function buildFaqSchema(entries: FaqEntry[]): Record<string, unknown> | null {
  if (entries.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}
