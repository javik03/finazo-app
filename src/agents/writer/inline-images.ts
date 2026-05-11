/**
 * Inline-image resolver shared by all content strategists.
 *
 * Claude is instructed to insert exactly two markers in this shape:
 *   ![INLINE: hispanic family signing insurance documents]()
 *
 * The resolver replaces each marker with a real Pexels URL keyed by the query
 * text inside the brackets. If Pexels can't find a match (rare), the marker
 * collapses to an empty string rather than leaving stray markdown.
 */

import { fetchFeaturedImage } from "@/lib/pexels";

const INLINE_MARKER = /!\[INLINE:\s*([^\]]+?)\s*\]\(\)/g;

export async function resolveInlineImages(content: string): Promise<string> {
  const matches = [...content.matchAll(INLINE_MARKER)];
  if (matches.length === 0) return content;

  const replacements = await Promise.all(
    matches.map(async (match) => {
      const query = match[1].trim();
      const url = await fetchFeaturedImage(query);
      const altText = query.charAt(0).toUpperCase() + query.slice(1);
      return {
        marker: match[0],
        replacement: url ? `![${altText}](${url})` : "",
      };
    }),
  );

  let result = content;
  for (const { marker, replacement } of replacements) {
    result = result.replace(marker, replacement);
  }
  return result;
}
