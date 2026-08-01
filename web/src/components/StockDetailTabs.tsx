"use client";

import { useState } from "react";
import { TabMenu } from "./TabMenu";
import { PlaceholderChart } from "./PlaceholderChart";
import { NewsCard } from "./NewsCard";
import type { NewsItem } from "@/lib/types";

const tabs = [
  { key: "history", label: "과거 주가 분석" },
  { key: "prediction", label: "예측" },
  { key: "news", label: "뉴스" },
];

export function StockDetailTabs({
  stockName,
  relatedNews,
}: {
  stockName: string;
  relatedNews: NewsItem[];
}) {
  const [activeKey, setActiveKey] = useState("history");

  return (
    <div className="flex flex-col gap-4">
      <TabMenu tabs={tabs} activeKey={activeKey} onChange={setActiveKey} />

      {activeKey === "history" && (
        <PlaceholderChart label={`${stockName} 과거 주가 차트`} />
      )}

      {activeKey === "prediction" && (
        <div className="flex flex-col gap-4">
          <PlaceholderChart label={`${stockName} 예측 그래프`} />
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
