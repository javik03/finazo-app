/**
 * Centralized WhatsApp number for all Finazo CTAs.
 *
 * Currently a placeholder — when the real Finazo WABA is provisioned,
 * change FINAZO_WA_NUMBER here and every CTA across the site updates.
 *
 * NOTE: generated article bodies in the DB also contain the literal number
 * (baked in by the strategist prompts). Bulk-replacing those is a separate
 * cleanup pass — this module only covers source-code references.
 */

export const FINAZO_WA_NUMBER = "13055551234";
export const FINAZO_WA_URL = `https://wa.me/${FINAZO_WA_NUMBER}`;

export function waUrl(prefilledText?: string): string {
  if (!prefilledText) return FINAZO_WA_URL;
  return `${FINAZO_WA_URL}?text=${encodeURIComponent(prefilledText)}`;
}
