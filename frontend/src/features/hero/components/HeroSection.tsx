"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, type MouseEvent } from "react";

import { useApiQuery } from "@/shared/api/useApiQuery";
import type { Metric, Profile } from "@/shared/api/types";
import { useMetricsById } from "@/shared/metrics/useMetricsById";
import { AttributionBadge } from "@/shared/ui/AttributionBadge";
import { CountUpText } from "@/shared/ui/CountUpText";
import { ScanProgress } from "@/shared/ui/ScanProgress";

import { useProfile } from "../hooks/useProfile";
import { useScanEnabled } from "@/shared/motion/useScanEnabled";
import { useSectionProgress } from "@/shared/motion/useSectionProgress";
import { CHART_HOLD, heroFrame } from "../lib/heroTimeline";
import type { CameraFile, ChartBox } from "./HeroCanvas";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

// 지시서 §2 HERO 40% 라벨 — 연출용 데이터 라벨
const LABELS = [
  { text: "온도 4.2°C", x: "14%", y: 0.28 },
  { text: "lot 2024-0311", x: "62%", y: 0.2 },
  { text: "CCP-2 PASS", x: "38%", y: 0.46 },
  { text: "정지사유: 포장재 교체", x: "66%", y: 0.56 },
  { text: "p95 412ms", x: "22%", y: 0.66 },
];

// "스캔 시작" 자동 스크롤 시간 — 스캔부터 차트 완성까지 한 번에 보이는 길이
const SCAN_SCROLL_MS = 4200;

// 지시서 §2 HERO 65% 카운터 4개
const COUNTER_METRIC_IDS = ["translate-claims", "hero-staff", "hero-capacity", "metabole-rps"];

const CTA = [
  { label: "Docs", href: "#docs" },
];

export function HeroSection({ serverProfile }: { serverProfile?: Profile }) {
  const clientProfile = useProfile(!serverProfile);
  const profile = serverProfile ?? clientProfile;
  const metrics = useMetricsById();
  const scan = useScanEnabled();
  const [ref, progress] = useSectionProgress<HTMLElement>();
  const frame = heroFrame(scan ? progress : 0);
  const frameRef = useRef(frame);
  const video = useRef<HTMLVideoElement>(null);
  const counterList = useRef<HTMLDListElement>(null);
  const chartBox = useRef<ChartBox | null>(null);
  const { data: cameraFile } = useApiQuery({
    queryKey: ["hero-cameras"],
    queryFn: () => fetch("/models/hero-cameras.json").then((r) => r.json() as Promise<CameraFile>),
    staleTime: Infinity,
    enabled: scan,
  });

  useEffect(() => {
    frameRef.current = frame;
  });

  // 막대 차트는 카운터 목록 바로 아래, 카운터 글자 폭에 맞춰 모인다(카운터가 보일 때마다 다시 잰다)
  useEffect(() => {
    const dl = counterList.current;
    if (!dl?.parentElement) return;
    const base = dl.parentElement.getBoundingClientRect();
    const r = dl.getBoundingClientRect();
    const cs = getComputedStyle(dl);
    chartBox.current = {
      left: r.left - base.left + parseFloat(cs.paddingLeft),
      right: r.right - base.left - parseFloat(cs.paddingRight),
      top: r.bottom - base.top + 8,
    };
  });

  // 0~15%는 실사 루프, 스캔이 시작되면 첫 프레임(카메라 매칭 기준)에 멈춘다. reduced-motion은 포스터에 정지.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (frame.playing && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [frame.playing]);

  // "스캔 시작": 스캔→점구름→라벨→차트가 차례로 보이게 천천히 차트 고정 지점까지 내려간다.
  // 사용자가 직접 스크롤하면 즉시 멈추고 넘긴다. 애니메이션 동안만 scroll-snap을 끈다(프레임마다 붙잡히지 않게).
  const startScan = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!scan || !el) return;
    e.preventDefault();
    const from = window.scrollY;
    const to = el.offsetTop + (el.offsetHeight - window.innerHeight) * CHART_HOLD.snap;
    const root = document.documentElement;
    const start = performance.now();
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      root.style.scrollSnapType = "";
      ["wheel", "touchstart", "keydown"].forEach((ev) => window.removeEventListener(ev, stop));
    };
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / SCAN_SCROLL_MS);
      window.scrollTo(0, from + (to - from) * (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2));
      if (t < 1) frame = requestAnimationFrame(step);
      else stop();
    };
    root.style.scrollSnapType = "none";
    ["wheel", "touchstart", "keydown"].forEach((ev) => window.addEventListener(ev, stop, { passive: true }));
    frame = requestAnimationFrame(step);
  };

  const counters = COUNTER_METRIC_IDS.map((id) => metrics.get(id)).filter((m): m is Metric => !!m);
  const scanning = frame.scanY > 0 && frame.scanY < 1;

  return (
    <section ref={ref} aria-labelledby="hero-title" className={`relative ${scan ? "h-[300svh]" : ""}`}>
      <ScanProgress />
      {scan && (
        // 차트 고정 구간의 자석 지점 — 진행률이 CHART_HOLD.snap일 때 이 요소가 화면 맨 위에 온다
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-px snap-start"
          style={{ top: `calc((100% - 100svh) * ${CHART_HOLD.snap})` }}
        />
      )}
      <div className="sticky top-0 h-svh overflow-hidden">
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-poster.webp"
          aria-hidden
          className="absolute inset-0 size-full object-cover"
          style={{ clipPath: `inset(${frame.scanY * 100}% 0 0 0)` }}
        >
          <source media="(orientation: portrait)" src="/video/hero-portrait.webm" type="video/webm" />
          <source media="(orientation: portrait)" src="/video/hero-portrait.mp4" type="video/mp4" />
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>

        {scan && cameraFile && <HeroCanvas frame={frameRef} chartBox={chartBox} cameras={cameraFile.cameras} />}

        {scanning && (
          <div
            className="absolute inset-x-0 h-px bg-[var(--scan)] shadow-[0_0_12px_var(--scan)]"
            style={{ top: `${frame.scanY * 100}%` }}
            aria-hidden
          />
        )}

        <ul aria-hidden className="pointer-events-none absolute inset-0">
          {LABELS.map((l) => (
            <li
              key={l.text}
              className="absolute border border-[var(--data)] bg-[var(--bg)]/70 px-2 py-0.5 font-mono text-xs whitespace-nowrap text-[var(--data)] transition-opacity duration-300 max-md:-translate-x-1/2 md:text-sm"
              style={{ left: l.x, top: `${l.y * 100}%`, opacity: frame.scanY >= l.y ? frame.labels : 0 }}
            >
              {l.text}
            </li>
          ))}
        </ul>

        {/* 카드마다 라벨·숫자·조건 3행을 subgrid로 공유해 좌우 칸의 줄을 맞춘다 */}
        {frame.counters && (
          <dl ref={counterList} className="absolute inset-x-0 top-[4%] mx-auto grid max-w-[1280px] gap-x-16 px-4 sm:grid-cols-2 md:top-[7%] md:px-10">
            {counters.map((m) => (
              <div key={m.id} className="row-span-3 grid grid-rows-subgrid pb-6 md:pb-10">
                <dt className="flex items-center gap-2 self-end text-sm">
                  {m.label}
                  <AttributionBadge attribution={m.attribution} />
                </dt>
                <dd className={`mt-3 font-mono text-4xl leading-[1.1] font-medium tabular-nums md:text-6xl ${m.side === "field" ? "text-[var(--scan)]" : "text-[var(--data)]"}`}>
                  <CountUpText text={m.value} />
                </dd>
                <dd className="mt-3 max-w-[52ch] text-xs leading-5 break-keep text-[var(--muted)]">{m.condition}</dd>
              </div>
            ))}
          </dl>
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent"
          style={{ opacity: frame.title }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-10 md:pb-28"
          style={{ opacity: frame.title, pointerEvents: frame.title > 0.5 ? "auto" : "none" }}
        >
          <h1 id="hero-title" className="max-w-[16ch] text-4xl leading-tight font-bold break-keep md:text-[72px]">
            {profile?.headline}
          </h1>
          <p className="mt-6 text-lg text-[var(--text)]/80 break-keep md:text-xl">{profile?.subtitle}</p>
          <nav className="mt-10 flex flex-wrap gap-3" aria-label="바로가기">
            <a href="#gap" onClick={startScan} className="border border-[var(--scan)] px-5 py-3 text-sm text-[var(--scan)]">
              스캔 시작 ↓
            </a>
            {CTA.map((c) => (
              <a key={c.label} href={c.href} className="border border-[var(--line)] px-5 py-3 text-sm hover:border-[var(--scan)]">
                {c.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
