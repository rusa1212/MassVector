import { readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ENDPOINT =
  "https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(SCRIPT_DIR, "..");
const STOCKS_FILE = path.join(WEB_ROOT, "src", "data", "stocks.ts");
const NUM_OF_ROWS = 1000;

// Syncs web/src/data/stocks.ts with the full list of KOSPI/KOSDAQ tickers
// available from the public data API (KONEX and anything without an active
// listing on the queried day are excluded, since the app's Market type only
// covers KOSPI/KOSDAQ). Existing popular/featured flags are preserved for
// tickers that are still listed. Run with:
//   cd web && node --env-file=.env.local scripts/sync-stock-catalog.mjs

function decodeServiceKey(key) {
  try {
    return decodeURIComponent(key);
  } catch {
    return key;
  }
}

function ymd(date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

const MARKET_MAP = { KOSPI: "코스피", KOSDAQ: "코스닥" };

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

async function fetchAllListings(serviceKey) {
  // A same-day beginBasDt/endBasDt pair returns zero rows (API quirk), so a
  // window is used instead. It spans a week to reliably cross at least one
  // trading day regardless of weekends/holidays.
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1);
  const begin = new Date(end);
  begin.setUTCDate(begin.getUTCDate() - 7);

  const byTicker = new Map();
  let page = 1;
  let totalCount = Infinity;

  while ((page - 1) * NUM_OF_ROWS < totalCount) {
    const url = new URL(ENDPOINT);
    url.searchParams.set("serviceKey", decodeServiceKey(serviceKey));
    url.searchParams.set("resultType", "json");
    url.searchParams.set("pageNo", String(page));
    url.searchParams.set("numOfRows", String(NUM_OF_ROWS));
    url.searchParams.set("beginBasDt", ymd(begin));
    url.searchParams.set("endBasDt", ymd(end));

    const response = await fetchWithRetry(url);
    const payload = await response.json();
    const header = payload.response?.header;
    if (header?.resultCode && header.resultCode !== "00") {
      throw new Error(`${header.resultMsg || "API error"} (${header.resultCode})`);
    }

    totalCount = payload.response?.body?.totalCount ?? 0;
    const rawItems = payload.response?.body?.items?.item;
    const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
    for (const item of items) {
      const market = MARKET_MAP[item.mrktCtg];
      if (!market) continue;
      byTicker.set(item.srtnCd, { ticker: item.srtnCd, name: item.itmsNm, market });
    }
    page += 1;
  }

  if (byTicker.size === 0) throw new Error("No listings were returned by the API.");
  return byTicker;
}

function parseExistingFlags(source) {
  const flags = new Map();
  for (const match of source.matchAll(/\{\s*id:\s*"([0-9A-Z]{6})"[^}]*\}/g)) {
    const block = match[0];
    const ticker = match[1];
    flags.set(ticker, {
      popular: /popular:\s*true/.test(block),
      featured: /featured:\s*true/.test(block),
    });
  }
  return flags;
}

function formatEntry({ ticker, name, market }, flags) {
  const parts = [
    `id: "${ticker}"`,
    `name: "${name}"`,
    `ticker: "${ticker}"`,
    `market: "${market}"`,
  ];
  if (flags?.popular) parts.push("popular: true");
  if (flags?.featured) parts.push("featured: true");
  return `  { ${parts.join(", ")} },`;
}

async function main() {
  const serviceKey = process.env.PUBLIC_DATA_SERVICE_KEY?.trim();
  if (!serviceKey) throw new Error("PUBLIC_DATA_SERVICE_KEY is required.");

  const existingSource = await readFile(STOCKS_FILE, "utf8");
  const existingFlags = parseExistingFlags(existingSource);

  const listings = await fetchAllListings(serviceKey);
  const sorted = [...listings.values()].sort((a, b) => {
    if (a.market !== b.market) return a.market === "코스피" ? -1 : 1;
    return a.ticker.localeCompare(b.ticker);
  });

  const lines = sorted.map((entry) => formatEntry(entry, existingFlags.get(entry.ticker)));

  const output = `import type { Market, StockDefinition } from "@/lib/types";

// 검색 가능한 국내 종목 카탈로그입니다. 시세는 공공데이터 API에서 조회합니다.
// featured 종목만 검색 화면에 기본 노출하고, 나머지는 검색어가 있을 때 보여줍니다.
// scripts/sync-stock-catalog.mjs로 갱신하며, 코스피/코스닥 전 종목을 담습니다.
// 종목 수가 많아 배열에 StockDefinition[] 타입을 직접 지정하면 TypeScript가
// "Expression produces a union type that is too complex to represent" 오류를
// 내므로, 타입 추론 없이 만든 뒤 한 번에 단언한다.
const rawStocks = [
${lines.join("\n")}
];

export const stocks: StockDefinition[] = rawStocks as StockDefinition[];

export function getStockById(id: string): StockDefinition | undefined {
  return stocks.find((stock) => stock.id === id);
}

export function getPopularStocks(): StockDefinition[] {
  return stocks.filter((stock) => stock.popular);
}

export function getAllStocks(): StockDefinition[] {
  return stocks;
}

export function searchStocks(
  query: string,
  market: Market | "전체" = "전체",
): StockDefinition[] {
  const q = query.trim().toLowerCase();
  return stocks.filter((stock) => {
    const matchesQuery =
      q === ""
        ? stock.featured
        : stock.name.toLowerCase().includes(q) ||
          stock.ticker.toLowerCase().includes(q);
    const matchesMarket = market === "전체" || stock.market === market;
    return matchesQuery && matchesMarket;
  });
}

export function getStocksByIds(ids: string[]): StockDefinition[] {
  return ids.flatMap((id) => {
    const stock = getStockById(id);
    return stock ? [stock] : [];
  });
}
`;

  const tmpFile = `${STOCKS_FILE}.tmp`;
  await writeFile(tmpFile, output, "utf8");
  await rename(tmpFile, STOCKS_FILE);
  console.log(`stocks.ts updated: ${sorted.length} tickers (was ${existingFlags.size}).`);
}

await main();
