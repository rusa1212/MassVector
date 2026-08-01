"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

interface WatchlistContextValue {
  stockIds: string[];
  isWatched: (stockId: string) => boolean;
  toggleWatch: (stockId: string) => void;
}

const STORAGE_KEY = "massvector.watchlist";
const CHANGE_EVENT = "massvector-watchlist-change";
const EMPTY: string[] = [];

let cachedRaw: string | null = null;
let cachedIds: string[] = EMPTY;

function readIds(): string[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedIds = raw ? JSON.parse(raw) : EMPTY;
    } catch {
      cachedIds = EMPTY;
    }
  }
  return cachedIds;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function writeIds(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const stockIds = useSyncExternalStore(subscribe, readIds, getServerSnapshot);

  const isWatched = (stockId: string) => stockIds.includes(stockId);

  const toggleWatch = (stockId: string) => {
    const current = readIds();
    const next = current.includes(stockId)
      ? current.filter((id) => id !== stockId)
      : [...current, stockId];
    writeIds(next);
  };

  return (
    <WatchlistContext.Provider value={{ stockIds, isWatched, toggleWatch }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx)
    throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
}
