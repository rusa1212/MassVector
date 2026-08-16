"use client";

import { useMemo, useState } from "react";
import { TabMenu } from "./TabMenu";
import { StockChart } from "./charts/StockChart";
import { AnalysisPanel } from "./AnalysisPanel";
import { buildStockAnalysis } from "@/lib/technicalAnalysis";
import type { PriceBar } from "@/lib/priceHistory";
import type { Stock } from "@/lib/types";

const tabs = [
  { key: "history", label: "과거 주가 분석" },
  { key: "prediction", label: "예측" },
];

export function StockDetailTabs({
  stock,
  bars,
}: {
  stock: Stock;
  bars: PriceBar[];
}) {
  const [activeKey, setActiveKey] = useState("history");
  const analysis = useMemo(() => buildStockAnalysis(bars), [bars]);
  const forecastInsight = analysis.insights[analysis.insights.length - 1];

  return (
    <div className="flex flex-col gap-4">
      <TabMenu tabs={tabs} activeKey={activeKey} onChange={setActiveKey} />

      <div className="text-right text-xs text-fg-subtle">
        공공데이터포털 · {stock.asOf} 기준
      </div>

      {activeKey === "history" && (
        <div className="flex flex-col gap-4">
          <div className="glass-card rounded-[20px] p-4">
            <div className="mb-2 flex gap-4 text-xs text-fg-subtle">
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 bg-fg" /> 종가
              </span>
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 bg-fg-muted" /> 5일 이동평균
              </span>
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 bg-fg-subtle" /> 20일 이동평균
              </span>
            </div>
            <StockChart bars={bars} ma5={analysis.ma5} ma20={analysis.ma20} />
          </div>
          <AnalysisPanel analysis={analysis} />
        </div>
      )}

      {activeKey === "prediction" && (
        <div className="flex flex-col gap-4">
          <div className="glass-card rounded-[20px] p-4">
            <div className="mb-2 flex gap-4 text-xs text-fg-subtle">
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 bg-fg" /> 실제 종가
              </span>
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 border-t-2 border-dashed border-forecast" /> 예상 가격
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-3 bg-forecast/20" /> 예상 범위
              </span>
            </div>
            <StockChart bars={bars} visibleBars={40} forecast={analysis.forecast} />
          </div>
          <div className="glass-card rounded-2xl p-4 text-sm text-fg-muted">
            {forecastInsight}
          </div>
        </div>
      )}
    </div>
  );
}
