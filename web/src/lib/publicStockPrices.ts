import "server-only";

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

export function isKoreanStockTicker(ticker: string) {
  return /^\d{6}$/.test(ticker);
}

export async function getPublicStockPrices(
  ticker: string,
): Promise<PublicStockPrices> {
  if (!isKoreanStockTicker(ticker)) {
    throw new Error("국내 6자리 종목코드만 조회할 수 있습니다.");
  }

  const serviceKey = process.env.PUBLIC_DATA_SERVICE_KEY?.trim();
  if (!serviceKey) {
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

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 * 6 },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`공공데이터 API 요청 실패 (${response.status})`);
  }

  const raw = await response.text();
  let payload: PublicDataResponse;
  try {
    payload = JSON.parse(raw) as PublicDataResponse;
  } catch {
    throw new Error("공공데이터 API가 JSON이 아닌 응답을 반환했습니다.");
  }

  const header = payload.response?.header;
  if (header?.resultCode && header.resultCode !== "00") {
    throw new Error(header.resultMsg || `공공데이터 API 오류 (${header.resultCode})`);
  }

  const itemValue = payload.response?.body?.items;
  const rawItems = itemValue && typeof itemValue === "object" ? itemValue.item : [];
  const items = (Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [])
    .filter((item) => item.srtnCd === ticker)
    .sort((a, b) => a.basDt.localeCompare(b.basDt));

  if (items.length === 0) {
    throw new Error("조회 기간에 해당 종목의 주가 데이터가 없습니다.");
  }

  const bars = items.map<PriceBar>((item) => ({
    date: `${item.basDt.slice(0, 4)}-${item.basDt.slice(4, 6)}-${item.basDt.slice(6, 8)}`,
    open: parseNumber(item.mkp),
    high: parseNumber(item.hipr),
    low: parseNumber(item.lopr),
    close: parseNumber(item.clpr),
    volume: parseNumber(item.trqu),
  }));
  const latest = items.at(-1)!;

  return {
    bars,
    quote: {
      asOf: bars.at(-1)!.date,
      price: parseNumber(latest.clpr),
      changeAmount: parseNumber(latest.vs),
      changePercent: parseNumber(latest.fltRt),
    },
  };
}
