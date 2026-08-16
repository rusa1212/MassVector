import type { Market, StockDefinition } from "@/lib/types";

// 서비스에서 우선 지원하는 국내 종목 카탈로그입니다. 시세는 공공데이터 API에서 조회합니다.
export const stocks: StockDefinition[] = [
  { id: "005930", name: "삼성전자", ticker: "005930", market: "코스피", popular: true },
  { id: "000660", name: "SK하이닉스", ticker: "000660", market: "코스피", popular: true },
  { id: "035420", name: "NAVER", ticker: "035420", market: "코스피", popular: true },
  { id: "035720", name: "카카오", ticker: "035720", market: "코스피" },
  { id: "247540", name: "에코프로비엠", ticker: "247540", market: "코스닥", popular: true },
  { id: "086520", name: "에코프로", ticker: "086520", market: "코스닥" },
  { id: "051910", name: "LG화학", ticker: "051910", market: "코스피" },
];

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
      q === "" ||
      stock.name.toLowerCase().includes(q) ||
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
