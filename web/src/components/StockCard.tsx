"use client";

import Link from "next/link";
import { useStockPrices } from "@/hooks/useStockPrices";
import type { StockDefinition } from "@/lib/types";

export function ChangeText({
  changeAmount,
  changePercent,
}: {
  changeAmount: number;
  changePercent: number;
}) {
  const isUp = changeAmount > 0;
  const isDown = changeAmount < 0;
  const color = isUp ? "text-up" : isDown ? "text-down" : "text-fg-subtle";
  const sign = isUp ? "+" : "";

  return (
    <span className={`text-sm font-medium tabular-nums ${color}`}>
      {sign}
      {changeAmount.toLocaleString("ko-KR")} ({sign}
      {changePercent.toFixed(2)}%)
    </span>
  );
}

export function StockCard({ stock }: { stock: StockDefinition }) {
  const prices = useStockPrices(stock.id);

  return (
    <Link
      href={`/stock/${stock.id}`}
      className="glass-card flex min-h-32 flex-col gap-2 rounded-2xl p-4 transition-colors hover:bg-white/[0.08]"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-fg-muted">
          {stock.market}
        </span>
        <span className="text-xs text-fg-subtle">{stock.ticker}</span>
      </div>
      <div className="font-medium text-fg">{stock.name}</div>

      {prices.status === "loading" && (
        <div className="mt-auto flex items-center justify-between text-sm text-fg-subtle">
          <span className="animate-pulse">시세 불러오는 중</span>
          <span>—</span>
        </div>
      )}
      {prices.status === "error" && (
        <div className="mt-auto text-sm text-down">시세를 불러오지 못했습니다.</div>
      )}
      {prices.status === "success" && (
        <div className="mt-auto flex items-baseline justify-between gap-3">
          <span className="text-lg font-medium tabular-nums text-fg">
            {prices.data.quote.price.toLocaleString("ko-KR")}
          </span>
          <ChangeText
            changeAmount={prices.data.quote.changeAmount}
            changePercent={prices.data.quote.changePercent}
          />
        </div>
      )}
    </Link>
  );
}
