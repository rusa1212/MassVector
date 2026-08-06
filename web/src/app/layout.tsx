import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/context/AppProviders";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "MassVector | 주가 예측 서비스",
  description: "종목 검색, 관심 종목, 주가 예측을 한눈에 보는 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <AppProviders>
          <Header />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
