import { notFound } from "next/navigation";
import { ChangeText } from "@/components/StockCard";
import { StockDetailTabs } from "@/components/StockDetailTabs";
import { WatchlistButton } from "@/components/WatchlistButton";
import { getStockById } from "@/data/stocks";
import { getPublicStockPrices } from "@/lib/publicStockPrices";

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseStock = getStockById(id);

  if (!baseStock) {
    notFound();
  }

  let publicPrices: Awaited<ReturnType<typeof getPublicStockPrices>>;
  try {
    publicPrices = await getPublicStockPrices(baseStock.ticker);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "시세 정보를 불러오지 못했습니다.";
    return (
      <div className="rounded-2xl border border-down/30 p-10 text-center">
        <h1 className="text-lg font-medium text-fg">시세를 불러오지 못했습니다</h1>
        <p className="mt-2 text-sm text-down">{message}</p>
      </div>
    );
  }

  const stock = {
    ...baseStock,
    price: publicPrices.quote.price,
    changeAmount: publicPrices.quote.changeAmount,
    changePercent: publicPrices.quote.changePercent,
    asOf: publicPrices.quote.asOf,
  };

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

      <StockDetailTabs
        stock={stock}
        bars={publicPrices.bars}
      />
    </div>
  );
}
