import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard search crawlers — allow /_next/static and /_next/image so
      // Googlebot can fetch JS/CSS for rendering. Blocking them caused
      // "Discovered – currently not indexed" because Google saw empty HTML.
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/_next/image"],
        disallow: ["/api/"],
      },
      // OpenAI / ChatGPT
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      // Anthropic / Claude
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      // Google Gemini / AI Overview
      { userAgent: "Google-Extended", allow: "/" },
      // Perplexity
      { userAgent: "PerplexityBot", allow: "/" },
      // Meta AI
      { userAgent: "meta-externalagent", allow: "/" },
      // Microsoft Copilot
      { userAgent: "msnbot", allow: "/" },
      // You.com
      { userAgent: "YouBot", allow: "/" },
      // Cohere
      { userAgent: "cohere-ai", allow: "/" },
      // Common Crawl (training data for many models)
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: [
      "https://finazo.lat/sitemap.xml",
      "https://finazo.us/sitemap.xml",
    ],
  };
}
