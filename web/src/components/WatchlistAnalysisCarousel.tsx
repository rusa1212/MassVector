"use client";

import { useState } from "react";
import Link from "next/link";
import { StockChart } from "@/components/charts/StockChart";
import { ChangeText } from "@/components/StockCard";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { getStockById } from "@/data/stocks";
import { getPriceHistory } from "@/lib/priceHistory";
import { buildStockAnalysis } from "@/lib/technicalAnalysis";

export function WatchlistAnalysisCarousel() {
  const { isLoggedIn } = useAuth();
  const { stockIds } = useWatchlist();
  const [currentIndex, setCurrentIndex] = useState(0);

  const watchedStocks = stockIds.flatMap((id) => {
    const stock = getStockById(id);
    return stock ? [stock] : [];
  });

  if (!isLoggedIn) {
    return (
      <EmptyState
        title="로그인하고 관심 종목을 모아보세요"
        description="관심 종목으로 등록한 주식의 과거 흐름과 예상 주가를 이곳에서 넘겨볼 수 있어요."
        href="/login"
        action="로그인하기"
      />
    );
  }

  if (watchedStocks.length === 0) {
    return (
      <EmptyState
        title="아직 등록한 관심 종목이 없어요"
        description="관심 종목을 등록하면 종목별 과거 흐름과 예상 주가를 한 장씩 확인할 수 있어요."
        href="/search"
        action="관심 종목 찾기"
      />
    );
  }

  const safeIndex = currentIndex % watchedStocks.length;
  const stock = watchedStocks[safeIndex];
  const bars = getPriceHistory(stock);
  const analysis = buildStockAnalysis(bars);
  const hasMultipleStocks = watchedStocks.length > 1;

  const move = (direction: -1 | 1) => {
    setCurrentIndex(
      (safeIndex + direction + watchedStocks.length) % watchedStocks.length,
    );
  };

  return (
    <div className="glass-card flex flex-col gap-6 rounded-[20px] p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium tracking-[0.12em] text-fg-subtle uppercase">
            내 관심 종목 분석
          </span>
          <Link
            href={`/stock/${stock.id}`}
            className="truncate text-2xl font-medium text-fg hover:underline"
          >
            {stock.name} 과거 흐름 &amp; 예측
          </Link>
          <span className="text-xs text-fg-subtle">
            {stock.market} · {stock.ticker}
          </span>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <span className="text-2xl font-medium tabular-nums text-fg">
              {stock.price.toLocaleString("ko-KR")}
            </span>
            <ChangeText
              changeAmount={stock.changeAmount}
              changePercent={stock.changePercent}
            />
          </div>

          <div className="flex items-center gap-2" aria-label="관심 종목 페이지 이동">
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={!hasMultipleStocks}
              aria-label="이전 관심 종목"
              className="grid size-9 place-items-center rounded-full border border-hairline text-fg transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowIcon direction="left" />
            </button>
            <span
              className="min-w-10 text-center text-xs tabular-nums text-fg-subtle"
              aria-live="polite"
            >
              {safeIndex + 1} / {watchedStocks.length}
            </span>
            <button
              type="button"
              onClick={() => move(1)}
              disabled={!hasMultipleStocks}
              aria-label="다음 관심 종목"
              className="grid size-9 place-items-center rounded-full border border-hairline text-fg transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>
      </div>

      <StockChart
        key={stock.id}
        bars={bars}
        ma5={analysis.ma5}
        ma20={analysis.ma20}
        forecast={analysis.forecast}
        visibleBars={60}
        height={340}
      />

      <p className="text-sm text-fg-subtle">
        {analysis.insights[0]} 표시된 예측 구간은 목데이터 기반 추세 모델의
        참고용 추정치이며 투자 조언이 아닙니다.
      </p>
    </div>
  );
}

function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="glass-card flex min-h-80 flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-hairline p-8 text-center">
      <span className="text-xs font-medium tracking-[0.12em] text-fg-subtle uppercase">
        내 관심 종목 분석
      </span>
      <h2 className="text-xl font-medium text-fg">{title}</h2>
      <p className="max-w-lg text-sm leading-relaxed text-fg-muted">
        {description}
      </p>
      <Link
        href={href}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
      >
        {action}
      </Link>
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="size-4"
    >
      <path
        d={direction === "left" ? "m12.5 4.5-5 5.5 5 5.5" : "m7.5 4.5 5 5.5-5 5.5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
