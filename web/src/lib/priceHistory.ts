import type { Stock } from "@/lib/types";

export interface PriceBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const ANCHOR_DATE = new Date("2026-08-05T00:00:00+09:00");
const HISTORY_LENGTH = 120;

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianRandom(random: () => number): number {
  const u1 = Math.max(random(), 1e-9);
  const u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function subtractTradingDays(date: Date, count: number): Date {
  const result = new Date(date);
  let remaining = count;
  while (remaining > 0) {
    result.setDate(result.getDate() - 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      remaining -= 1;
    }
  }
  return result;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const historyCache = new Map<string, PriceBar[]>();

/**
 * Deterministically generates a mock OHLCV history for a stock, seeded by
 * its id so the series is stable across server/client renders. The final
 * bar's close is rescaled to match the stock's current listed price.
 */
export function generatePriceHistory(stock: Stock): PriceBar[] {
  const cached = historyCache.get(stock.id);
  if (cached) return cached;

  const random = mulberry32(hashString(stock.id));
  const dailyVolatility = 0.012 + (hashString(`${stock.id}-vol`) % 100) / 5000;
  const drift = (stock.changePercent / 100 / 20) * 0.5;

  const rawCloses: number[] = [];
  let price = 100;
  for (let i = 0; i < HISTORY_LENGTH; i += 1) {
    const shock = gaussianRandom(random) * dailyVolatility;
    price = Math.max(price * (1 + drift + shock), 1);
    rawCloses.push(price);
  }

  const scale = stock.price / rawCloses[rawCloses.length - 1];
  const bars: PriceBar[] = [];
  let prevClose = rawCloses[0] * scale;

  for (let i = 0; i < HISTORY_LENGTH; i += 1) {
    const close = rawCloses[i] * scale;
    const open = prevClose;
    const intradayRange = Math.abs(close - open) + close * dailyVolatility * 0.6;
    const high = Math.max(open, close) + intradayRange * random() * 0.5;
    const low = Math.min(open, close) - intradayRange * random() * 0.5;
    const volume = Math.round(500000 + random() * 4500000);
    const date = formatDate(
      subtractTradingDays(ANCHOR_DATE, HISTORY_LENGTH - 1 - i),
    );

    bars.push({
      date,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(Math.max(low, 0.01) * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });
    prevClose = close;
  }

  bars[bars.length - 1].close = stock.price;

  historyCache.set(stock.id, bars);
  return bars;
}

export function getPriceHistory(stock: Stock): PriceBar[] {
  return generatePriceHistory(stock);
}
