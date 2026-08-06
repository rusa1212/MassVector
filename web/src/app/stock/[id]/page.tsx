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
      <div className="glass-card flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-fg-muted">
              {stock.market}
            </span>
            <span className="text-xs text-fg-subtle">{stock.ticker}</span>
          </div>
          <h1 className="text-2xl font-medium text-fg">{stock.name}</h1>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <span className="text-2xl font-medium tabular-nums text-fg">
            {stock.price.toLocaleString("ko-KR")}
          </span>
          <ChangeText
            changeAmount={stock.changeAmount}
            changePercent={stock.changePercent}
          />
        </div>
        <WatchlistButton stockId={stock.id} />
      </div>

      <StockDetailTabs stock={stock} relatedNews={relatedNews} />
    </div>
  );
}
