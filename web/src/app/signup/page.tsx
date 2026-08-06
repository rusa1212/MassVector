"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nextNameError = name.trim() ? "" : "이름을 입력해주세요.";
    const nextEmailError = EMAIL_PATTERN.test(email)
      ? ""
      : "올바른 이메일 형식이 아니에요.";
    const nextPasswordError =
      password.length >= 8 ? "" : "비밀번호는 8자 이상이어야 해요.";
    const nextConfirmError =
      password === confirmPassword ? "" : "비밀번호가 일치하지 않습니다.";

    setNameError(nextNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setConfirmError(nextConfirmError);
    if (nextNameError || nextEmailError || nextPasswordError || nextConfirmError) {
      return;
    }

    // 회원가입 기능은 추후 백엔드 연동 예정 — 현재는 화면 흐름 확인용 임시 처리
    signup(name, email);
    router.push("/mypage");
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-10">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-medium text-fg">회원가입</h1>
        <p className="text-sm text-fg-subtle">몇 가지 정보만 입력하면 바로 시작할 수 있어요.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="name"
          label="이름"
          placeholder="홍길동"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
          required
        />
        <Input
          id="email"
          type="email"
          label="이메일"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          required
        />
        <Input
          id="password"
          type="password"
          label="비밀번호"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          required
        />
        <Input
          id="confirmPassword"
          type="password"
          label="비밀번호 확인"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={confirmError}
          required
        />
        <Button type="submit">회원가입</Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-fg-subtle">
        <div className="h-px flex-1 bg-hairline" />
        또는
        <div className="h-px flex-1 bg-hairline" />
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" type="button" disabled title="추후 지원 예정">
          Google로 계속하기 (준비 중)
        </Button>
        <Button variant="outline" type="button" disabled title="추후 지원 예정">
          카카오로 계속하기 (준비 중)
        </Button>
      </div>

      <p className="text-center text-sm text-fg-subtle">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-fg underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
