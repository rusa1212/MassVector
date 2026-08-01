import { notFound } from "next/navigation";
import { ChangeText } from "@/components/StockCard";
import { StockDetailTabs } from "@/components/StockDetailTabs";
import { WatchlistButton } from "@/components/WatchlistButton";
import { getStockById } from "@/data/stocks";
import { getNewsByStockId } from "@/data/news";

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stock = getStockById(id);

  if (!stock) {
    notFound();
  }

  const relatedNews = getNewsByStockId(stock.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {stock.market}
            </span>
            <span className="text-xs text-slate-400">{stock.ticker}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{stock.name}</h1>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <span className="text-2xl font-bold text-slate-900">
            {stock.price.toLocaleString("ko-KR")}
          </span>
          <ChangeText
            changeAmount={stock.changeAmount}
            changePercent={stock.changePercent}
          />
        </div>
        <WatchlistButton stockId={stock.id} />
      </div>

      <StockDetailTabs stockName={stock.name} relatedNews={relatedNews} />
    </div>
  );
}
