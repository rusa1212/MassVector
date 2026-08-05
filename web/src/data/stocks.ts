import type { Market, Stock } from "@/lib/types";

export const stocks: Stock[] = [
  {
    id: "005930",
    name: "삼성전자",
    ticker: "005930",
    market: "코스피",
    price: 78500,
    changeAmount: 1200,
    changePercent: 1.55,
    popular: true,
  },
  {
    id: "000660",
    name: "SK하이닉스",
    ticker: "000660",
    market: "코스피",
    price: 215000,
    changeAmount: -3500,
    changePercent: -1.6,
    popular: true,
  },
  {
    id: "035420",
    name: "NAVER",
    ticker: "035420",
    market: "코스피",
    price: 189500,
    changeAmount: 2500,
    changePercent: 1.34,
    popular: true,
  },
  {
    id: "035720",
    name: "카카오",
    ticker: "035720",
    market: "코스피",
    price: 41250,
    changeAmount: -450,
    changePercent: -1.08,
  },
  {
    id: "247540",
    name: "에코프로비엠",
    ticker: "247540",
    market: "코스닥",
    price: 142300,
    changeAmount: 3200,
    changePercent: 2.3,
    popular: true,
  },
  {
    id: "086520",
    name: "에코프로",
    ticker: "086520",
    market: "코스닥",
    price: 98700,
    changeAmount: -1300,
    changePercent: -1.3,
  },
  {
    id: "AAPL",
    name: "Apple",
    ticker: "AAPL",
    market: "미국",
    price: 227.5,
    changeAmount: 1.8,
    changePercent: 0.8,
    popular: true,
  },
  {
    id: "TSLA",
    name: "Tesla",
    ticker: "TSLA",
    market: "미국",
    price: 248.3,
    changeAmount: -5.6,
    changePercent: -2.2,
  },
  {
    id: "NVDA",
    name: "NVIDIA",
    ticker: "NVDA",
    market: "미국",
    price: 118.4,
    changeAmount: 3.1,
    changePercent: 2.69,
    popular: true,
  },
  {
    id: "051910",
    name: "LG화학",
    ticker: "051910",
    market: "코스피",
    price: 356000,
    changeAmount: 4000,
    changePercent: 1.13,
  },
];

export function getStockById(id: string): Stock | undefined {
  return stocks.find((stock) => stock.id === id);
}

export function getPopularStocks(): Stock[] {
  return stocks.filter((stock) => stock.popular);
}

export function getAllStocks(): Stock[] {
  return stocks;
}

export function searchStocks(query: string, market: Market | "전체" = "전체"): Stock[] {
  const q = query.trim().toLowerCase();
  return stocks.filter((stock) => {
    const matchesQuery =
      q === "" ||
      stock.name.toLowerCase().includes(q) ||
      stock.ticker.toLowerCase().includes(q);
    const matchesMarket = market === "전체" || stock.market === market;
    return matchesQuery && matchesMarket;
  });
}

export function getStocksByIds(ids: string[]): Stock[] {
  return stocks.filter((stock) => ids.includes(stock.id));
}
