import type { Metadata } from "next";
import { Gaegu, JetBrains_Mono } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import { Providers } from "@/shared/api/providers";

import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500"],
});

// 01 GAP 현장 말투 손글씨. 한글 글리프가 커서 미리 로드하지 않는다.
const gaegu = Gaegu({ variable: "--font-gaegu", subsets: ["latin"], weight: ["400"], preload: false });

export const metadata: Metadata = {
  title: "김충식 — 현장의 말을 개발의 말로",
  description: "식품기술사 · 현장 10년 5개월 · Forward Deployed Engineer",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${jetbrainsMono.variable} ${gaegu.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
