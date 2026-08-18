import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ENDPOINT =
  "https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(SCRIPT_DIR, "..");
const STOCKS_FILE = path.join(WEB_ROOT, "src", "data", "stocks.ts");
const PRICES_FILE = path.join(WEB_ROOT, "src", "data", "stock-prices.json");

function formatYmd(date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function decodeServiceKey(key) {
  try {
    return decodeURIComponent(key);
  } catch {
    return key;
  }
}

function mergeBars(existing, incoming) {
  const byDate = new Map(existing.map((bar) => [bar.date, bar]));
  for (const bar of incoming) byDate.set(bar.date, bar);
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
      }
    }
  }
  throw lastError;
}

async function fetchBars(ticker, serviceKey, days) {
  const endDate = new Date();
  const beginDate = new Date(endDate);
  beginDate.setUTCDate(beginDate.getUTCDate() - days);

  const url = new URL(ENDPOINT);
  url.searchParams.set("serviceKey", decodeServiceKey(serviceKey));
  url.searchParams.set("resultType", "json");
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("numOfRows", "300");
  url.searchParams.set("beginBasDt", formatYmd(beginDate));
  url.searchParams.set("endBasDt", formatYmd(endDate));
  url.searchParams.set("likeSrtnCd", ticker);

  const response = await fetchWithRetry(url);
  const payload = await response.json();
  const header = payload.response?.header;
  if (header?.resultCode && header.resultCode !== "00") {
    throw new Error(`${header.resultMsg || "API error"} (${header.resultCode})`);
  }

  const itemValue = payload.response?.body?.items;
  const rawItems = itemValue && typeof itemValue === "object" ? itemValue.item : [];
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  return items
    .filter((item) => item.srtnCd === ticker)
    .map((item) => ({
      date: `${item.basDt.slice(0, 4)}-${item.basDt.slice(4, 6)}-${item.basDt.slice(6, 8)}`,
      open: parseNumber(item.mkp),
      high: parseNumber(item.hipr),
      low: parseNumber(item.lopr),
      close: parseNumber(item.clpr),
      volume: parseNumber(item.trqu),
    }));
}

async function main() {
  const serviceKey = process.env.PUBLIC_DATA_SERVICE_KEY?.trim();
  if (!serviceKey) throw new Error("PUBLIC_DATA_SERVICE_KEY is required.");

  const stocksSource = await readFile(STOCKS_FILE, "utf8");
  const tickers = [
    ...new Set([...stocksSource.matchAll(/ticker:\s*"(\d{6})"/g)].map((match) => match[1])),
  ];
  if (tickers.length === 0) throw new Error("No Korean stock tickers were found.");

  const stored = JSON.parse(await readFile(PRICES_FILE, "utf8"));
  for (const ticker of tickers) {
    // The first run backfills roughly one year. Later runs revisit 30 days so
    // holidays, delayed publication, and temporarily failed runs are repaired.
    const days = stored[ticker]?.length ? 30 : 400;
    const incoming = await fetchBars(ticker, serviceKey, days);
    stored[ticker] = mergeBars(stored[ticker] || [], incoming);
    console.log(`${ticker}: ${incoming.length} fetched, ${stored[ticker].length} stored`);
  }

  const temporaryFile = `${PRICES_FILE}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(stored, null, 2)}\n`, "utf8");
  await rename(temporaryFile, PRICES_FILE);
}

await main();
