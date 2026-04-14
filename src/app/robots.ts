import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard search crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
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
    sitemap: "https://finazo.lat/sitemap.xml",
  };
}
