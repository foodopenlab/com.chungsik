import type { Metadata } from "next";
import { Gaegu, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

import { Providers } from "@/shared/api/providers";

import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500"],
});

// 본문 글꼴. Pretendard에서 사이트에 쓰인 글자만 담은 서브셋 1개(scripts/subset-font.sh) — 분할 파일 26개를 받던 것을 줄임
const scanSans = localFont({
  src: "../styles/fonts/ScanSans.woff2",
  variable: "--font-scan-sans",
  weight: "45 930",
  // 미리 받으면 첫 페인트 전에 항상 끝나 Lighthouse가 LCP 의존으로 계산한다(측정: 중앙값 98 → 94.5). 제목은 swap으로 먼저 그려진다
  preload: false,
});

// 01 GAP 현장 말투 손글씨. 한글 글리프가 커서 미리 로드하지 않는다.
const gaegu = Gaegu({ variable: "--font-gaegu", subsets: ["latin"], weight: ["400"], preload: false });

const TITLE = "김충식 — 현장의 말을 개발의 말로";
// 현장 10년 5개월은 식품 경력, 개발은 AX 아카데미에서 — 둘을 섞어 읽지 않게(HERO 부제와 같은 내용)
const DESCRIPTION = "식품기술사 · 식품 현장 10년 5개월 · 개발: IBM × RedHat AX 아카데미 7기 · 해커톤 고용노동부장관상";

// og:image는 app/opengraph-image.jpg 파일 규약으로 자동 연결된다
export const metadata: Metadata = {
  metadataBase: new URL("https://www.chungsik.com"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/", siteName: "김충식 포트폴리오", locale: "ko_KR", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${scanSans.variable} ${jetbrainsMono.variable} ${gaegu.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
