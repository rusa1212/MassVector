"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { SearchBar } from "./SearchBar";

const navLinks = [
  { href: "/search", label: "종목 검색" },
  { href: "/watchlist", label: "관심 종목" },
  { href: "/compare", label: "종목 비교" },
];

export function Header() {
  const { isLoggedIn, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
          MassVector
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-600">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </nav>

        <SearchBar className="order-last w-full sm:order-none sm:ml-auto sm:w-72" />

        <div className="flex items-center gap-3 text-sm">
          {isLoggedIn ? (
            <Link
              href="/mypage"
              className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-200"
            >
              {user?.name} 님
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-700"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
