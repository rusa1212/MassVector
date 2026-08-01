"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // 로그인 기능은 추후 백엔드 연동 예정 — 현재는 화면 흐름 확인용 임시 처리
    login(email || "guest@example.com");
    router.push("/");
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-10">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-semibold text-slate-900">로그인</h1>
        <p className="text-sm text-slate-500">MassVector에 오신 것을 환영해요.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          type="email"
          label="이메일"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          type="password"
          label="비밀번호"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">로그인</Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        또는
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" type="button">
          Google로 계속하기
        </Button>
        <Button variant="outline" type="button">
          카카오로 계속하기
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-slate-900 underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
