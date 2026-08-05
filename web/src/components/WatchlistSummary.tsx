"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { getStocksByIds } from "@/data/stocks";
import { StockCard } from "./StockCard";

export function WatchlistSummary() {
  const { isLoggedIn } = useAuth();
  const { stockIds } = useWatchlist();

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        로그인하면 관심 종목 요약을 볼 수 있어요.{" "}
        <Link href="/login" className="font-medium text-slate-900 underline">
          로그인하기
        </Link>
      </div>
    );
  }

  const watchedStocks = getStocksByIds(stockIds);

  if (watchedStocks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        아직 등록한 관심 종목이 없어요.{" "}
        <Link href="/search" className="font-medium text-slate-900 underline">
          종목 검색하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {watchedStocks.map((stock) => (
        <StockCard key={stock.id} stock={stock} />
      ))}
    </div>
  );
}
