import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().startsWith("sk-ant-"),
  ARTICLE_WEBHOOK_SECRET: z.string().min(16).optional(),
  ADMIN_SECRET: z.string().min(8).optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // Set to "true" only after HTTPS/Nginx SSL is configured
  SECURE_COOKIES: z.enum(["true", "false"]).default("false"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Do not log field details — avoids exposing expected secret names in logs
  console.error("Invalid environment variables — check .env against .env.example");
  process.exit(1);
}

export const config = parsed.data;
