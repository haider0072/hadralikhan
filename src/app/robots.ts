import type { MetadataRoute } from "next";
import { seo } from "@/data/seo";

// Explicitly allow mainstream search and AI crawlers so the portfolio is
// discoverable both in classic search and in LLM answers.
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Google-Extended",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot-Extended",
  "Amazonbot",
  "DuckAssistBot",
  "YouBot",
  "Bytespider",
  "cohere-ai",
  "Diffbot",
  "Meta-ExternalAgent",
  "FacebookBot",
  "Mistral-AI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: `${seo.url}/sitemap.xml`,
    host: seo.url,
  };
}
