import type { NewsItem } from "@/lib/types";

export const news: NewsItem[] = [
  {
    id: "n1",
    stockId: "005930",
    title: "삼성전자, 차세대 메모리 반도체 양산 계획 발표",
    source: "경제일보",
    date: "2026-07-28",
    summary: "삼성전자가 차세대 D램 양산 계획을 밝히며 시장 기대감이 높아지고 있다.",
  },
  {
    id: "n2",
    stockId: "005930",
    title: "삼성전자 2분기 실적, 시장 예상치 상회",
    source: "머니투데이",
    date: "2026-07-25",
    summary: "반도체 부문 실적 개선으로 영업이익이 전년 대비 큰 폭으로 증가했다.",
  },
  {
    id: "n3",
    stockId: "000660",
    title: "SK하이닉스, HBM 공급 확대 계약 체결",
    source: "IT조선",
    date: "2026-07-30",
    summary: "글로벌 AI 반도체 수요 증가에 따라 HBM 공급 계약 규모가 확대됐다.",
  },
  {
    id: "n4",
    stockId: "035420",
    title: "NAVER, AI 검색 서비스 고도화 발표",
    source: "디지털타임스",
    date: "2026-07-29",
    summary: "네이버가 생성형 AI 기반 검색 기능을 전면 개편한다고 밝혔다.",
  },
  {
    id: "n5",
    stockId: "247540",
    title: "에코프로비엠, 양극재 수출 증가세 지속",
    source: "에너지경제",
    date: "2026-07-27",
    summary: "북미 전기차 배터리 수요 증가로 양극재 수출이 꾸준히 늘고 있다.",
  },
  {
    id: "n6",
    stockId: "AAPL",
    title: "Apple, 신형 아이폰 출시일 공식 발표",
    source: "Tech News",
    date: "2026-07-26",
    summary: "애플이 하반기 신제품 출시 일정을 공식 발표하며 기대감이 커지고 있다.",
  },
  {
    id: "n7",
    stockId: "NVDA",
    title: "NVIDIA, 차세대 AI 가속기 로드맵 공개",
    source: "Global Tech",
    date: "2026-07-31",
    summary: "엔비디아가 차세대 AI 가속기 출시 로드맵을 공개하며 주가에 긍정적 영향을 미쳤다.",
  },
];

export function getNewsByStockId(stockId: string): NewsItem[] {
  return news.filter((item) => item.stockId === stockId);
}
