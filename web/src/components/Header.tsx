// Header함수는 “사이트 전체에서 공통으로 쓰이는 상단 메뉴 + 검색 + 로그인 상태 UI”를 만드는 컴포넌트
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
    <header className="sticky top-0 z-40 border-b border-hairline bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-medium tracking-tight text-fg">
          MassVector
        </Link>

        <nav className="flex items-center gap-4 text-sm text-fg-muted">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-fg">
              {link.label}
            </Link>
          ))}
        </nav>

        <SearchBar className="order-last w-full sm:order-none sm:ml-auto sm:w-72" />

        <div className="flex items-center gap-3 text-sm">
          {isLoggedIn ? (
            <Link
              href="/mypage"
              className="rounded-full border border-hairline px-3.5 py-1.5 font-medium text-fg transition-colors hover:bg-white/5"
            >
              {user?.name} 님
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-fg px-3.5 py-1.5 font-medium text-bg transition-opacity hover:opacity-85"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
