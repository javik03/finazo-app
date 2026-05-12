/**
 * IndexNow — notify Bing, Yandex, and other engines when URLs change.
 * One call covers all participating engines via api.indexnow.org.
 * https://www.indexnow.org/documentation
 *
 * IndexNow requires `host` in the request body to match the hostname of every
 * URL in `urlList`. Derive host per call by grouping URLs and submitting one
 * request per hostname.
 */

import pino from "pino";

const logger = pino({ name: "indexnow" });

const KEY = process.env.INDEXNOW_KEY ?? "";
const ENDPOINT = "https://api.indexnow.org/indexnow";

function groupByHost(urls: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const url of urls) {
    try {
      const host = new URL(url).hostname;
      const list = groups.get(host) ?? [];
      list.push(url);
      groups.set(host, list);
    } catch {
      logger.warn({ url }, "IndexNow: skipping invalid URL");
    }
  }
  return groups;
}

async function submitForHost(host: string, urls: string[]): Promise<void> {
  const batch = urls.slice(0, 10_000);
  const keyLocation = `https://${host}/${KEY}.txt`;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host, key: KEY, keyLocation, urlList: batch }),
    });

    if (res.ok || res.status === 202) {
      logger.info({ host, count: batch.length }, "IndexNow: URLs submitted");
    } else {
      logger.warn({ host, status: res.status }, "IndexNow: non-200 response");
    }
  } catch (err) {
    logger.error({ host, err }, "IndexNow: request failed");
  }
}

export async function notifyIndexNow(urls: string[]): Promise<void> {
  if (!KEY) {
    logger.warn("INDEXNOW_KEY not set — skipping notification");
    return;
  }
  if (urls.length === 0) return;

  const groups = groupByHost(urls);
  await Promise.all(Array.from(groups.entries()).map(([host, list]) => submitForHost(host, list)));
}
