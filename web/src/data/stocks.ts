import type { Market, StockDefinition } from "@/lib/types";

// 검색 가능한 국내 종목 카탈로그입니다. 시세는 공공데이터 API에서 조회합니다.
// featured 종목만 검색 화면에 기본 노출하고, 나머지는 검색어가 있을 때 보여줍니다.
export const stocks: StockDefinition[] = [
  { id: "005930", name: "삼성전자", ticker: "005930", market: "코스피", popular: true, featured: true },
  { id: "000660", name: "SK하이닉스", ticker: "000660", market: "코스피", popular: true, featured: true },
  { id: "373220", name: "LG에너지솔루션", ticker: "373220", market: "코스피", featured: true },
  { id: "207940", name: "삼성바이오로직스", ticker: "207940", market: "코스피", featured: true },
  { id: "005380", name: "현대차", ticker: "005380", market: "코스피", featured: true },
  { id: "035420", name: "NAVER", ticker: "035420", market: "코스피", popular: true, featured: true },
  { id: "035720", name: "카카오", ticker: "035720", market: "코스피", featured: true },
  { id: "005490", name: "POSCO홀딩스", ticker: "005490", market: "코스피", featured: true },
  { id: "105560", name: "KB금융", ticker: "105560", market: "코스피", featured: true },
  { id: "247540", name: "에코프로비엠", ticker: "247540", market: "코스닥", popular: true, featured: true },

  { id: "000270", name: "기아", ticker: "000270", market: "코스피" },
  { id: "068270", name: "셀트리온", ticker: "068270", market: "코스피" },
  { id: "086520", name: "에코프로", ticker: "086520", market: "코스닥" },
  { id: "051910", name: "LG화학", ticker: "051910", market: "코스피" },
  { id: "006400", name: "삼성SDI", ticker: "006400", market: "코스피" },
  { id: "066570", name: "LG전자", ticker: "066570", market: "코스피" },
  { id: "012330", name: "현대모비스", ticker: "012330", market: "코스피" },
  { id: "028260", name: "삼성물산", ticker: "028260", market: "코스피" },
  { id: "055550", name: "신한지주", ticker: "055550", market: "코스피" },
  { id: "086790", name: "하나금융지주", ticker: "086790", market: "코스피" },
  { id: "032830", name: "삼성생명", ticker: "032830", market: "코스피" },
  { id: "017670", name: "SK텔레콤", ticker: "017670", market: "코스피" },
  { id: "030200", name: "KT", ticker: "030200", market: "코스피" },
  { id: "012450", name: "한화에어로스페이스", ticker: "012450", market: "코스피" },
  { id: "034020", name: "두산에너빌리티", ticker: "034020", market: "코스피" },
  { id: "329180", name: "HD현대중공업", ticker: "329180", market: "코스피" },
  { id: "259960", name: "크래프톤", ticker: "259960", market: "코스피" },
  { id: "036570", name: "엔씨소프트", ticker: "036570", market: "코스피" },
  { id: "196170", name: "알테오젠", ticker: "196170", market: "코스닥" },
  { id: "028300", name: "HLB", ticker: "028300", market: "코스닥" },
  { id: "293490", name: "카카오게임즈", ticker: "293490", market: "코스닥" },
  { id: "263750", name: "펄어비스", ticker: "263750", market: "코스닥" },
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
