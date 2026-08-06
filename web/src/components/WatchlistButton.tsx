"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { Button } from "./ui/Button";

export function WatchlistButton({ stockId }: { stockId: string }) {
  const { isLoggedIn } = useAuth();
  const { isWatched, toggleWatch } = useWatchlist();

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline px-3.5 py-1.5 text-sm font-medium text-fg-muted hover:bg-white/5"
      >
        로그인 후 관심 종목 등록
      </Link>
    );
  }

  const watched = isWatched(stockId);

  return (
    <Button
      variant={watched ? "secondary" : "primary"}
      size="sm"
      onClick={() => toggleWatch(stockId)}
    >
      {watched ? "★ 관심 종목 등록됨" : "☆ 관심 종목 등록"}
    </Button>
  );
}
