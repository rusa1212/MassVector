"use client";

import { useState } from "react";
import { ChangeText } from "@/components/StockCard";
import { StockChart } from "@/components/charts/StockChart";
import { getAllStocks, getStocksByIds } from "@/data/stocks";
import { useStockPrices } from "@/hooks/useStockPrices";
import type { StockDefinition } from "@/lib/types";

const MAX_SELECT = 3;

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const stocks = getAllStocks();

  const toggleSelect = (id: string) => {
    setSelectedIds((previous) => {
      if (previous.includes(id)) return previous.filter((value) => value !== id);
      if (previous.length >= MAX_SELECT) return previous;
      return [...previous, id];
    });
  };

  const selectedStocks = getStocksByIds(selectedIds);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-medium text-fg">종목 비교</h1>
        <p className="text-sm text-fg-subtle">
          비교할 국내 종목을 최대 {MAX_SELECT}개까지 선택하세요. ({selectedIds.length}/{MAX_SELECT})
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {stocks.map((stock) => {
          const isSelected = selectedIds.includes(stock.id);
          const isDisabled = !isSelected && selectedIds.length >= MAX_SELECT;
          return (
            <button
              key={stock.id}
              type="button"
              onClick={() => toggleSelect(stock.id)}
              disabled={isDisabled}
              className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected
                  ? "border-fg bg-fg text-bg"
                  : "border-hairline bg-white/5 text-fg-muted hover:bg-white/10"
              }`}
            >
              <div className="font-medium">{stock.name}</div>
              <div className={isSelected ? "text-bg/60" : "text-fg-subtle"}>
                {stock.market} · {stock.ticker}
              </div>
            </button>
          );
        })}
      </div>

      {selectedStocks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline p-10 text-center text-sm text-fg-subtle">
          비교할 종목을 선택해주세요.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {selectedStocks.map((stock) => (
            <ComparisonCard key={stock.id} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
}

function ComparisonCard({ stock }: { stock: StockDefinition }) {
  const prices = useStockPrices(stock.id);

  return (
    <div className="glass-card flex min-h-80 flex-col gap-3 rounded-2xl p-4">
      <div>
        <div className="font-medium text-fg">{stock.name}</div>
        <div className="text-xs text-fg-subtle">
          {stock.market} · {stock.ticker}
        </div>
      </div>

      {prices.status === "loading" && (
        <div className="grid flex-1 place-items-center text-sm text-fg-subtle">
          시세 불러오는 중
        </div>
      )}
      {prices.status === "error" && (
        <div className="grid flex-1 place-items-center text-center text-sm text-down">
          {prices.message}
        </div>
      )}
      {prices.status === "success" && (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-xl font-medium tabular-nums text-fg">
              {prices.data.quote.price.toLocaleString("ko-KR")}
            </span>
            <ChangeText
              changeAmount={prices.data.quote.changeAmount}
              changePercent={prices.data.quote.changePercent}
            />
          </div>
          <StockChart bars={prices.data.bars} visibleBars={40} height={220} />
          <div className="text-right text-xs text-fg-subtle">
            {prices.data.quote.asOf} 기준
          </div>
        </>
      )}
    </div>
  );
}
