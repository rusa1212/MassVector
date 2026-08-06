import Link from "next/link";
import type { Stock } from "@/lib/types";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

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

export function StockCard({ stock }: { stock: Stock }) {
  return (
    <Link
      href={`/stock/${stock.id}`}
      className="glass-card flex flex-col gap-2 rounded-2xl p-4 transition-colors hover:bg-white/[0.08]"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-fg-muted">
          {stock.market}
        </span>
        <span className="text-xs text-fg-subtle">{stock.ticker}</span>
      </div>
      <div className="font-medium text-fg">{stock.name}</div>
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-medium tabular-nums text-fg">
          {formatPrice(stock.price)}
        </span>
        <ChangeText
          changeAmount={stock.changeAmount}
          changePercent={stock.changePercent}
        />
      </div>
    </Link>
  );
}
