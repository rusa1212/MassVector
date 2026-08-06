"use client";

import { useMemo, useState } from "react";
import { TabMenu } from "./TabMenu";
import { StockChart } from "./charts/StockChart";
import { AnalysisPanel } from "./AnalysisPanel";
import { NewsCard } from "./NewsCard";
import { getPriceHistory } from "@/lib/priceHistory";
import { buildStockAnalysis } from "@/lib/technicalAnalysis";
import type { NewsItem, Stock } from "@/lib/types";

const tabs = [
  { key: "history", label: "과거 주가 분석" },
  { key: "prediction", label: "예측" },
  { key: "news", label: "뉴스" },
];

export function StockDetailTabs({
  stock,
  relatedNews,
}: {
  stock: Stock;
  relatedNews: NewsItem[];
}) {
  const [activeKey, setActiveKey] = useState("history");

  const { bars, analysis } = useMemo(() => {
    const priceBars = getPriceHistory(stock);
    return { bars: priceBars, analysis: buildStockAnalysis(priceBars) };
  }, [stock]);

  const forecastInsight = analysis.insights[analysis.insights.length - 1];

  return (
    <div className="flex flex-col gap-4">
      <TabMenu tabs={tabs} activeKey={activeKey} onChange={setActiveKey} />

      {activeKey === "history" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 bg-slate-900" /> 종가
              </span>
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 bg-blue-600" /> 5일 이평선
              </span>
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 bg-amber-500" /> 20일 이평선
              </span>
            </div>
            <StockChart bars={bars} ma5={analysis.ma5} ma20={analysis.ma20} />
          </div>
          <AnalysisPanel analysis={analysis} />
        </div>
      )}

      {activeKey === "prediction" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 bg-slate-900" /> 실제 종가
              </span>
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 border-t-2 border-dashed border-violet-600" /> 예측
                가격
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-3 bg-violet-200" /> 예측 범위
              </span>
            </div>
            <StockChart bars={bars} visibleBars={40} forecast={analysis.forecast} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            {forecastInsight}
          </div>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-400">
            예측 근거 뉴스 매칭 — API/모델 연동 예정
          </div>
        </div>
      )}

      {activeKey === "news" && (
        <div className="flex flex-col gap-3">
          {relatedNews.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              관련 뉴스가 없습니다.
            </p>
          ) : (
            relatedNews.map((item) => <NewsCard key={item.id} item={item} />)
          )}
        </div>
      )}
    </div>
  );
}
