"use client";

import { useEffect, useState } from "react";
import type { PriceBar } from "@/lib/priceHistory";

export interface StockPricesPayload {
  bars: PriceBar[];
  quote: {
    asOf: string;
    price: number;
    changeAmount: number;
    changePercent: number;
  };
  source: "public-data";
}

type StockPricesState =
  | { status: "loading" }
  | { status: "success"; data: StockPricesPayload }
  | { status: "error"; message: string };

export function useStockPrices(stockId: string): StockPricesState {
  const [state, setState] = useState<StockPricesState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/stocks/${stockId}/prices`, { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json()) as StockPricesPayload | { error?: string };
        if (!response.ok) {
          throw new Error("error" in body && body.error ? body.error : "시세 조회에 실패했습니다.");
        }
        return body as StockPricesPayload;
      })
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "시세 조회에 실패했습니다.",
        });
      });

    return () => controller.abort();
  }, [stockId]);

  return state;
}
