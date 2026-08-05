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
        <h1 className="text-xl font-semibold text-slate-900">종목 비교</h1>
        <p className="text-sm text-slate-500">
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
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="font-medium">{stock.name}</div>
              <div className={isSelected ? "text-slate-300" : "text-slate-400"}>
                {stock.market}
              </div>
            </button>
          );
        })}
      </div>

      {selectedStocks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          비교할 종목을 선택해주세요.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">항목</th>
                  {selectedStocks.map((stock) => (
                    <th key={stock.id} className="px-4 py-3 font-medium">
                      {stock.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-500">시장</td>
                  {selectedStocks.map((stock) => (
                    <td key={stock.id} className="px-4 py-3">{stock.market}</td>
                  ))}
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-500">현재가</td>
                  {selectedStocks.map((stock) => (
                    <td key={stock.id} className="px-4 py-3">
                      {stock.price.toLocaleString("ko-KR")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-500">등락률</td>
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
