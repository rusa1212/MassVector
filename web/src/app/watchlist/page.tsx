"use client";

import { useState } from "react";
import Link from "next/link";
import { ChangeText } from "@/components/StockCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { getStocksByIds } from "@/data/stocks";

export default function WatchlistPage() {
  const { isLoggedIn } = useAuth();
  const { stockIds, toggleWatch, getAlertSettings, setAlertSetting } = useWatchlist();
  const [alertTargetId, setAlertTargetId] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline p-10 text-center text-sm text-fg-subtle">
        관심 종목은 로그인 후 이용할 수 있어요.{" "}
        <Link href="/login" className="font-medium text-fg underline">
          로그인하기
        </Link>
      </div>
    );
  }

  const watchedStocks = getStocksByIds(stockIds);
  const alertTarget = watchedStocks.find((stock) => stock.id === alertTargetId);
  const alertSettings = alertTargetId ? getAlertSettings(alertTargetId) : null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium text-fg">관심 종목</h1>

      {watchedStocks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline p-10 text-center text-sm text-fg-subtle">
          아직 등록한 관심 종목이 없어요.{" "}
          <Link href="/search" className="font-medium text-fg underline">
            종목 검색하러 가기
          </Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-hairline text-xs text-fg-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">종목명</th>
                <th className="px-4 py-3 font-medium">시장</th>
                <th className="px-4 py-3 font-medium">현재가</th>
                <th className="px-4 py-3 font-medium">등락률</th>
                <th className="px-4 py-3 font-medium">알림</th>
                <th className="px-4 py-3 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {watchedStocks.map((stock) => (
                <tr
                  key={stock.id}
                  className="border-b border-hairline transition-colors last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <Link href={`/stock/${stock.id}`} className="font-medium text-fg hover:underline">
                      {stock.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-fg-subtle">{stock.market}</td>
                  <td className="px-4 py-3 tabular-nums text-fg">{stock.price.toLocaleString("ko-KR")}</td>
                  <td className="px-4 py-3">
                    <ChangeText
                      changeAmount={stock.changeAmount}
                      changePercent={stock.changePercent}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAlertTargetId(stock.id)}
                    >
                      알림 설정
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWatch(stock.id)}
                    >
                      삭제
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!alertTarget}
        onClose={() => setAlertTargetId(null)}
        title={`${alertTarget?.name ?? ""} 알림 설정`}
      >
        <div className="flex flex-col gap-3 text-sm text-fg-muted">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[oklch(0.7_0.13_285)]"
              checked={alertSettings?.priceAlert ?? false}
              onChange={(e) =>
                alertTargetId &&
                setAlertSetting(alertTargetId, "priceAlert", e.target.checked)
              }
            />
            목표가 도달 시 알림
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[oklch(0.7_0.13_285)]"
              checked={alertSettings?.volatilityAlert ?? false}
              onChange={(e) =>
                alertTargetId &&
                setAlertSetting(alertTargetId, "volatilityAlert", e.target.checked)
              }
            />
            급등락(±5%) 알림
          </label>
          <Button size="sm" onClick={() => setAlertTargetId(null)}>
            닫기
          </Button>
        </div>
      </Modal>
    </div>
  );
}
