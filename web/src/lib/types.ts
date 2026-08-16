export type Market = "코스피" | "코스닥";

export interface StockDefinition {
  id: string;
  name: string;
  ticker: string;
  market: Market;
  popular?: boolean;
}

export interface Stock extends StockDefinition {
  price: number;
  changeAmount: number;
  changePercent: number;
  asOf: string;
}
