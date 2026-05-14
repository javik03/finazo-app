/**
 * Host-aware robots.txt. Each domain (finazo.us, finazo.lat) gets its
 * OWN sitemap reference — cross-domain sitemap declarations are bad
 * practice (Google requires verified ownership of the target domain
 * to honor them, and it signals an unintended relationship between
 * the two properties).
 *
 * Replaces the previous src/app/robots.ts metadata route which emitted
 * both sitemaps on both domains.
 */

const AI_BOTS = [
  // OpenAI / ChatGPT
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic / Claude
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  // Google Gemini / AI Overview
  "Google-Extended",
  // Perplexity
  "PerplexityBot",
  // Meta AI
  "meta-externalagent",
  // Microsoft Copilot
  "msnbot",
  // You.com
  "YouBot",
  // Cohere
  "cohere-ai",
  // Common Crawl (training data for many models)
  "CCBot",
];

function buildRobots(host: string): string {
  const sitemapUrl = `https://${host}/sitemap.xml`;
  const lines = [
    "# Standard search crawlers — allow /_next/static and /_next/image",
    "# so Googlebot can fetch JS/CSS for SSR rendering. Blocking those",
    "# previously caused \"Discovered – currently not indexed\".",
    "User-Agent: *",
    "Allow: /",
    "Allow: /_next/static/",
    "Allow: /_next/image",
    "Disallow: /api/",
    "",
  ];

  for (const bot of AI_BOTS) {
    lines.push(`User-Agent: ${bot}`);
    lines.push("Allow: /");
    lines.push("");
  }

  lines.push(`Sitemap: ${sitemapUrl}`);
  return lines.join("\n");
}

export function GET(request: Request): Response {
  const host = (
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "finazo.us"
  ).toLowerCase().split(":")[0];

  // Normalize www → non-www (we 301 those at the Nginx layer anyway,
  // but if a bot somehow lands on www, serve the canonical robots).
  const canonicalHost = host.replace(/^www\./, "");

  // Default to finazo.us when host is unknown (e.g., direct IP access)
  // — finazo.us is the priority property per the 2026-04-17 pivot.
  const targetHost =
    canonicalHost === "finazo.lat" ? "finazo.lat" : "finazo.us";

  return new Response(buildRobots(targetHost), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
