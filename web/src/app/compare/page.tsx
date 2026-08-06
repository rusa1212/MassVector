"use client";

import { useState } from "react";
import { ChangeText } from "@/components/StockCard";
import { PlaceholderChart } from "@/components/PlaceholderChart";
import { getAllStocks, getStocksByIds } from "@/data/stocks";

const MAX_SELECT = 3;

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const stocks = getAllStocks();

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, id];
    });
  };

  const selectedStocks = getStocksByIds(selectedIds);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-medium text-fg">종목 비교</h1>
        <p className="text-sm text-fg-subtle">
          비교할 종목을 최대 {MAX_SELECT}개까지 선택하세요. ({selectedIds.length}/{MAX_SELECT})
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {stocks.map((stock) => {
          const isSelected = selectedIds.includes(stock.id);
          const isDisabled = !isSelected && selectedIds.length >= MAX_SELECT;
          return (
            <button
              key={stock.id}
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
                {stock.market}
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
        <div className="flex flex-col gap-6">
          <div className="glass-card overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-hairline text-xs text-fg-subtle">
                <tr>
                  <th className="px-4 py-3 font-medium">항목</th>
                  {selectedStocks.map((stock) => (
                    <th key={stock.id} className="px-4 py-3 font-medium text-fg">
                      {stock.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-hairline">
                  <td className="px-4 py-3 text-fg-subtle">시장</td>
                  {selectedStocks.map((stock) => (
                    <td key={stock.id} className="px-4 py-3 text-fg">{stock.market}</td>
                  ))}
                </tr>
                <tr className="border-b border-hairline">
                  <td className="px-4 py-3 text-fg-subtle">현재가</td>
                  {selectedStocks.map((stock) => (
                    <td key={stock.id} className="px-4 py-3 tabular-nums text-fg">
                      {stock.price.toLocaleString("ko-KR")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-fg-subtle">등락률</td>
                  {selectedStocks.map((stock) => (
                    <td key={stock.id} className="px-4 py-3">
                      <ChangeText
                        changeAmount={stock.changeAmount}
                        changePercent={stock.changePercent}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <PlaceholderChart label="종목 비교 차트" />
        </div>
      )}
    </div>
  );
}
