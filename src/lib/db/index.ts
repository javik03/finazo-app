import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// During `next build` DATABASE_URL is not available — defer the throw to query
// time so Next.js can import this module without crashing.
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

if (!connectionString && !isBuildTime) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Use a placeholder URL at build time — no real connections are made because
// all pages that hit the DB are marked `force-dynamic` and skipped by the
// static renderer.
const safeUrl = connectionString ?? "postgresql://localhost:5432/placeholder";

// For migrations and one-off scripts — max 1 connection
export const migrationClient = postgres(safeUrl, { max: 1 });

// For query use — connection pool
const queryClient = postgres(safeUrl);
export const db = drizzle(queryClient, { schema });
