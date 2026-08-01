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
  const color = isUp
    ? "text-red-600"
    : isDown
      ? "text-blue-600"
      : "text-slate-500";
  const sign = isUp ? "+" : "";

  return (
    <span className={`text-sm font-medium ${color}`}>
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
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {stock.market}
        </span>
        <span className="text-xs text-slate-400">{stock.ticker}</span>
      </div>
      <div className="font-semibold text-slate-900">{stock.name}</div>
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-semibold text-slate-900">
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
