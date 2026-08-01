export type Market = "코스피" | "코스닥" | "미국";

export interface Stock {
  id: string;
  name: string;
  ticker: string;
  market: Market;
  price: number;
  changeAmount: number;
  changePercent: number;
  popular?: boolean;
}

export interface NewsItem {
  id: string;
  stockId: string;
  title: string;
  source: string;
  date: string;
  summary: string;
}
