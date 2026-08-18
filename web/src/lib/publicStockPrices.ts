import "server-only";

import storedPriceData from "@/data/stock-prices.json";
import type { PriceBar } from "@/lib/priceHistory";

const ENDPOINT =
  "https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo";

interface PublicDataItem {
  basDt: string;
  srtnCd: string;
  clpr: string;
  vs: string;
  fltRt: string;
  mkp: string;
  hipr: string;
  lopr: string;
  trqu: string;
}

interface PublicDataResponse {
  response?: {
    header?: { resultCode?: string; resultMsg?: string };
    body?: {
      items?: { item?: PublicDataItem | PublicDataItem[] } | "";
    };
  };
}

export interface PublicStockPrices {
  bars: PriceBar[];
  quote: {
    asOf: string;
    price: number;
    changeAmount: number;
    changePercent: number;
  };
}

function formatYmd(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

function parseNumber(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function decodeServiceKey(key: string) {
  try {
    return decodeURIComponent(key);
  } catch {
    return key;
  }
}

function mergeBars(stored: PriceBar[], fetched: PriceBar[]) {
  const byDate = new Map(stored.map((bar) => [bar.date, bar]));
  for (const bar of fetched) byDate.set(bar.date, bar);
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function toPublicStockPrices(bars: PriceBar[]): PublicStockPrices {
  const latest = bars.at(-1)!;
  const previous = bars.at(-2);
  const changeAmount = previous ? latest.close - previous.close : 0;
  const changePercent = previous?.close
    ? (changeAmount / previous.close) * 100
    : 0;

  return {
    bars,
    quote: {
      asOf: latest.date,
      price: latest.close,
      changeAmount,
      changePercent,
    },
  };
}

export function isKoreanStockTicker(ticker: string) {
  return /^\d{6}$/.test(ticker);
}

export async function getPublicStockPrices(
  ticker: string,
): Promise<PublicStockPrices> {
  if (!isKoreanStockTicker(ticker)) {
    throw new Error("국내 6자리 종목코드만 조회할 수 있습니다.");
  }

  const storedBars = (storedPriceData as Record<string, PriceBar[]>)[ticker] ?? [];
  const serviceKey = process.env.PUBLIC_DATA_SERVICE_KEY?.trim();
  if (!serviceKey) {
    if (storedBars.length > 0) return toPublicStockPrices(storedBars);
    throw new Error("PUBLIC_DATA_SERVICE_KEY 환경변수가 설정되지 않았습니다.");
  }

  const endDate = new Date();
  const beginDate = new Date(endDate);
  beginDate.setDate(beginDate.getDate() - 220);

  const url = new URL(ENDPOINT);
  url.searchParams.set("serviceKey", decodeServiceKey(serviceKey));
  url.searchParams.set("resultType", "json");
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("numOfRows", "200");
  url.searchParams.set("beginBasDt", formatYmd(beginDate));
  url.searchParams.set("endBasDt", formatYmd(endDate));
  url.searchParams.set("likeSrtnCd", ticker);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    if (storedBars.length > 0) return toPublicStockPrices(storedBars);
    throw error;
  }

  if (!response.ok) {
    if (storedBars.length > 0) return toPublicStockPrices(storedBars);
    throw new Error(`공공데이터 API 요청 실패 (${response.status})`);
  }

  const raw = await response.text();
  let payload: PublicDataResponse;
  try {
    payload = JSON.parse(raw) as PublicDataResponse;
  } catch {
    if (storedBars.length > 0) return toPublicStockPrices(storedBars);
    throw new Error("공공데이터 API가 JSON이 아닌 응답을 반환했습니다.");
  }

  const header = payload.response?.header;
  if (header?.resultCode && header.resultCode !== "00") {
    if (storedBars.length > 0) return toPublicStockPrices(storedBars);
    throw new Error(header.resultMsg || `공공데이터 API 오류 (${header.resultCode})`);
  }

  const itemValue = payload.response?.body?.items;
  const rawItems = itemValue && typeof itemValue === "object" ? itemValue.item : [];
  const items = (Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [])
    .filter((item) => item.srtnCd === ticker)
    .sort((a, b) => a.basDt.localeCompare(b.basDt));

  if (items.length === 0) {
    if (storedBars.length > 0) return toPublicStockPrices(storedBars);
    throw new Error("조회 기간에 해당 종목의 주가 데이터가 없습니다.");
  }

  const fetchedBars = items.map<PriceBar>((item) => ({
    date: `${item.basDt.slice(0, 4)}-${item.basDt.slice(4, 6)}-${item.basDt.slice(6, 8)}`,
    open: parseNumber(item.mkp),
    high: parseNumber(item.hipr),
    low: parseNumber(item.lopr),
    close: parseNumber(item.clpr),
    volume: parseNumber(item.trqu),
  }));
  const bars = mergeBars(storedBars, fetchedBars);
  return toPublicStockPrices(bars);
}
