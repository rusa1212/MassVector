"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { WatchlistProvider } from "./WatchlistContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WatchlistProvider>{children}</WatchlistProvider>
    </AuthProvider>
  );
}
