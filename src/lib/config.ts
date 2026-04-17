import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().startsWith("sk-ant-"),
  ARTICLE_WEBHOOK_SECRET: z.string().min(16).optional(),
  ADMIN_SECRET: z.string().min(8).optional(),
  PEXELS_API_KEY: z.string().optional(),
  INDEXNOW_KEY: z.string().optional(),
  CRON_SECRET: z.string().min(16).optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // Set to "true" only after HTTPS/Nginx SSL is configured
  SECURE_COOKIES: z.enum(["true", "false"]).default("false"),
});

// During `next build` real env vars are absent — skip validation so the
// static renderer can import this module without crashing.  All pages that
// actually USE config values are force-dynamic and never rendered at build time.
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

const parsed = envSchema.safeParse(process.env);

if (!parsed.success && !isBuildTime) {
  // Do not log field details — avoids exposing expected secret names in logs
  console.error("Invalid environment variables — check .env against .env.example");
  process.exit(1);
}

// At build time return a stub so the module is importable without crashing.
// Real routes that read config are force-dynamic and never run at build time.
export const config = parsed.success
  ? parsed.data
  : ({
      DATABASE_URL: "",
      ANTHROPIC_API_KEY: "",
      NODE_ENV: "production",
      SECURE_COOKIES: "false",
    } as z.infer<typeof envSchema>);
