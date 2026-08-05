"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

const notificationOptions = [
  { key: "priceAlert", label: "목표가 도달 알림" },
  { key: "newsAlert", label: "관심 종목 뉴스 알림" },
  { key: "marketing", label: "마케팅 정보 수신" },
];

export default function MyPage() {
  const router = useRouter();
  const { user, isLoggedIn, updateProfile, logout } = useAuth();
  const [draft, setDraft] = useState<{ name: string; email: string } | null>(
    null
  );
  const [saved, setSaved] = useState(false);
  const name = draft?.name ?? user?.name ?? "";
  const email = draft?.email ?? user?.email ?? "";
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    priceAlert: true,
    newsAlert: true,
    marketing: false,
  });

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        마이페이지는 로그인 후 이용할 수 있어요.{" "}
        <Link href="/login" className="font-medium text-slate-900 underline">
          로그인하기
        </Link>
      </div>
    );
  }

  const toggleNotification = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 py-6">
      <h1 className="text-xl font-semibold text-slate-900">마이페이지</h1>

      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">회원 정보</h2>
        <Input
          id="name"
          label="이름"
          value={name}
          onChange={(e) => {
            setDraft({ name: e.target.value, email });
            setSaved(false);
          }}
        />
        <Input
          id="email"
          label="이메일"
          value={email}
          onChange={(e) => {
            setDraft({ name, email: e.target.value });
            setSaved(false);
          }}
        />
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="w-fit"
            onClick={() => {
              updateProfile(name, email);
              setSaved(true);
            }}
          >
            저장
          </Button>
          {saved && <span className="text-xs text-slate-500">저장됐어요.</span>}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">알림 설정</h2>
        {notificationOptions.map((option) => (
          <label key={option.key} className="flex items-center justify-between text-sm text-slate-600">
            {option.label}
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={notifications[option.key]}
              onChange={() => toggleNotification(option.key)}
            />
          </label>
        ))}
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">관심 종목</h2>
        <Link
          href="/watchlist"
          className="w-fit rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          관심 종목 바로가기
        </Link>
      </section>

      <Button
        variant="ghost"
        className="w-fit"
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        로그아웃
      </Button>
    </div>
  );
}
