"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export interface AlertSettings {
  priceAlert: boolean;
  volatilityAlert: boolean;
}

interface WatchlistContextValue {
  stockIds: string[];
  isWatched: (stockId: string) => boolean;
  toggleWatch: (stockId: string) => void;
  getAlertSettings: (stockId: string) => AlertSettings;
  setAlertSetting: (
    stockId: string,
    key: keyof AlertSettings,
    value: boolean
  ) => void;
}

const STORAGE_KEY = "massvector.watchlist";
const ALERTS_STORAGE_KEY = "massvector.watchlist.alerts";
const CHANGE_EVENT = "massvector-watchlist-change";
const EMPTY: string[] = [];
const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  priceAlert: false,
  volatilityAlert: false,
};

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

function readAlertsMap(): Record<string, AlertSettings> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(ALERTS_STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAlertsMap(map: Record<string, AlertSettings>) {
  window.localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(CHANGE_EVENT));
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

  const getAlertSettings = (stockId: string): AlertSettings => {
    return readAlertsMap()[stockId] ?? DEFAULT_ALERT_SETTINGS;
  };

  const setAlertSetting = (
    stockId: string,
    key: keyof AlertSettings,
    value: boolean
  ) => {
    const map = readAlertsMap();
    const current = map[stockId] ?? DEFAULT_ALERT_SETTINGS;
    writeAlertsMap({ ...map, [stockId]: { ...current, [key]: value } });
  };

  return (
    <WatchlistContext.Provider
      value={{
        stockIds,
        isWatched,
        toggleWatch,
        getAlertSettings,
        setAlertSetting,
      }}
    >
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
