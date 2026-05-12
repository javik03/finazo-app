/**
 * Google Search Console fetcher — pulls page+query performance for finazo.us
 * and writes daily snapshots to us_gsc_snapshots.
 *
 * Auth: service account JSON. Two ways to provide it:
 *   - GSC_SERVICE_ACCOUNT_JSON   = full JSON contents (CI / Docker secret)
 *   - GSC_SERVICE_ACCOUNT_PATH   = filesystem path (local dev)
 *
 * Setup steps (one-time, manual):
 *  1. Google Cloud Console → create service account → download JSON key
 *  2. Search Console → Settings → Users and permissions → add the service
 *     account email (e.g. finazo-gsc@xxx.iam.gserviceaccount.com) as Owner
 *     for the finazo.us property
 *  3. Set GSC_SERVICE_ACCOUNT_JSON in the server's .env (paste raw JSON)
 *  4. docker compose up -d --force-recreate seo-gsc-fetcher
 *
 * The fetcher is a no-op if creds aren't set — safe to deploy before setup.
 */

import crypto from "node:crypto";
import { db } from "@/lib/db";
import { usGscSnapshots } from "@/lib/db/schema";
import pino from "pino";

const logger = pino({ name: "gsc-fetcher" });

const GSC_SITE_URL = "sc-domain:finazo.us"; // domain property; use https://finazo.us/ for URL property
const GSC_API_BASE = "https://searchconsole.googleapis.com/v1";
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

type ServiceAccountKey = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

function loadServiceAccount(): ServiceAccountKey | null {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
      return JSON.parse(raw) as ServiceAccountKey;
    } catch (err) {
      logger.error({ err }, "GSC_SERVICE_ACCOUNT_JSON is not valid JSON");
      return null;
    }
  }
  // No filesystem-path fallback in production — keep it env-only to avoid
  // accidentally shipping creds.
  return null;
}

function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function signJwt(key: ServiceAccountKey): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: key.client_email,
    scope: GSC_SCOPE,
    aud: key.token_uri ?? GOOGLE_TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const claimB64 = base64UrlEncode(JSON.stringify(claim));
  const signingInput = `${headerB64}.${claimB64}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signingInput);
  const signature = signer.sign(key.private_key);

  return `${signingInput}.${base64UrlEncode(signature)}`;
}

async function exchangeJwtForAccessToken(jwt: string): Promise<string> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }).toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

type GscRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type GscResponse = {
  rows?: GscRow[];
};

async function querySearchAnalytics(
  accessToken: string,
  startDate: string,
  endDate: string,
): Promise<GscRow[]> {
  const endpoint = `${GSC_API_BASE}/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ["page", "query", "device"],
      rowLimit: 25_000,
      dataState: "final",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Search Analytics query failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as GscResponse;
  return json.rows ?? [];
}

function isoDateNDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/**
 * Fetch the last 7 days of GSC data and persist to us_gsc_snapshots.
 * Returns count of rows persisted, or 0 if creds unavailable.
 */
export async function fetchAndStoreGscSnapshot(): Promise<number> {
  const key = loadServiceAccount();
  if (!key) {
    logger.warn("GSC service account not configured — skipping fetch");
    return 0;
  }

  const startDate = isoDateNDaysAgo(9); // GSC has ~3 day delay; pull a 7-day window
  const endDate = isoDateNDaysAgo(2);
  logger.info({ startDate, endDate }, "Fetching GSC data");

  let accessToken: string;
  try {
    const jwt = signJwt(key);
    accessToken = await exchangeJwtForAccessToken(jwt);
  } catch (err) {
    logger.error({ err }, "Failed to obtain GSC access token");
    return 0;
  }

  let rows: GscRow[];
  try {
    rows = await querySearchAnalytics(accessToken, startDate, endDate);
  } catch (err) {
    logger.error({ err }, "GSC query failed");
    return 0;
  }

  if (rows.length === 0) {
    logger.info("No GSC rows returned");
    return 0;
  }

  const snapshotDate = new Date(`${endDate}T00:00:00Z`);
  const inserts = rows
    .filter((r) => r.keys && r.keys.length === 3)
    .map((r) => {
      const [page, query, device] = r.keys!;
      return {
        snapshotDate,
        page,
        query,
        impressions: r.impressions ?? 0,
        clicks: r.clicks ?? 0,
        ctr: r.ctr !== undefined ? r.ctr.toFixed(4) : null,
        position: r.position !== undefined ? r.position.toFixed(2) : null,
        country: "usa",
        device,
      };
    });

  if (inserts.length === 0) return 0;

  // Insert in chunks to stay under PG parameter limits
  const CHUNK = 500;
  let written = 0;
  for (let i = 0; i < inserts.length; i += CHUNK) {
    const chunk = inserts.slice(i, i + CHUNK);
    await db.insert(usGscSnapshots).values(chunk);
    written += chunk.length;
  }

  logger.info({ written }, "GSC snapshot stored");
  return written;
}

// CLI
if (require.main === module) {
  fetchAndStoreGscSnapshot()
    .then((n) => {
      logger.info({ rowsWritten: n }, "Done");
      process.exit(0);
    })
    .catch((err: unknown) => {
      logger.error({ err }, "Fatal");
      process.exit(1);
    });
}
