/**
 * IndexNow — notify Bing, Yandex, and other engines when URLs change.
 * One call covers all participating engines via api.indexnow.org.
 * https://www.indexnow.org/documentation
 */

import pino from "pino";

const logger = pino({ name: "indexnow" });

const HOST = "finazo.lat";
const KEY = process.env.INDEXNOW_KEY ?? "";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

export async function notifyIndexNow(urls: string[]): Promise<void> {
  if (!KEY) {
    logger.warn("INDEXNOW_KEY not set — skipping notification");
    return;
  }
  if (urls.length === 0) return;

  // IndexNow accepts up to 10,000 URLs per request
  const batch = urls.slice(0, 10_000);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: batch,
      }),
    });

    if (res.ok || res.status === 202) {
      logger.info({ count: batch.length }, "IndexNow: URLs submitted");
    } else {
      logger.warn({ status: res.status, urls: batch }, "IndexNow: non-200 response");
    }
  } catch (err) {
    // Never throw — IndexNow is a best-effort notification, not critical path
    logger.error({ err }, "IndexNow: request failed");
  }
}
