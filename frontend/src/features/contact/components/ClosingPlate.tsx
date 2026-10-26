"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/shared/motion/prefersReducedMotion";
import { useInViewOnce } from "@/shared/motion/useInViewOnce";

// 스캔 라인이 내려가는 시간 — 섹션 진입(0.9s)보다 천천히, 지나가는 게 보이게
const SCAN = "2.4s";

// 07 마지막 — 스캔 라인이 한 번 더 지나가며 "스캔된 데이터"(흑백·어둡게 + 점 격자)가 실사(CLOSING, 카메라가 뒤로 빠짐, 반복)로 돌아온다.
// 영상 첫 장면이 포스터와 같아 그대로 두면 라인이 지나가도 바뀌는 게 안 보인다 — 스캔 전 상태를 다르게 만드는 이유.
// 영상·포스터는 화면 한 장 거리 안에 들어올 때만 받는다(첫 화면 용량에서 빼기). reduced-motion은 포스터에 정지.
export function ClosingPlate() {
  const [nearRef, near] = useInViewOnce<HTMLDivElement>("100% 0px 100% 0px");
  // 판 아랫변이 보일 때(판 전체가 화면 안) 시작 — 일찍 시작하면 내려왔을 때 이미 끝나 있다.
  // 페이지 맨 끝이라 윗변 기준(예: 화면 가운데)은 모바일에서 끝까지 내려도 닿지 않는다
  const [scanRef, scanned] = useInViewOnce<HTMLDivElement>("0px");
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (scanned && !prefersReducedMotion()) video.current?.play().catch(() => {});
  }, [scanned, near]);

  return (
    <div ref={nearRef} className="relative mt-24 aspect-[21/9] overflow-hidden border border-[var(--line)]">
      {near && (
        <div aria-hidden>
          <div className="absolute inset-0 bg-cover bg-center brightness-[0.35] grayscale" style={{ backgroundImage: "url(/video/closing-poster.webp)" }} />
          <div className="absolute inset-0 bg-[radial-gradient(var(--data)_1px,transparent_1.5px)] bg-[size:7px_7px] opacity-50" />
        </div>
      )}
      {/* 감지 요소(아랫변 1px)는 처음부터 그려 둔다(useInViewOnce는 마운트 때 붙은 요소만 본다) — 영상만 근처에서 넣는다 */}
      <div ref={scanRef} className="absolute inset-x-0 bottom-0 h-px" aria-hidden />
      <div className="scan-reveal absolute inset-0" data-scanned={scanned || undefined} style={{ animationDuration: SCAN }}>
        {near && (
          <video ref={video} muted loop playsInline preload="auto" aria-hidden className="size-full object-cover">
            <source src="/video/closing.webm" type="video/webm" />
            <source src="/video/closing.mp4" type="video/mp4" />
          </video>
        )}
        <div className="scan-reveal-line" style={{ animationDuration: SCAN }} aria-hidden />
      </div>
      <p
        className="absolute bottom-0 left-0 p-6 font-mono text-sm text-[var(--text)] transition-opacity duration-700"
        style={{ opacity: scanned ? 1 : 0, transitionDelay: scanned ? SCAN : "0s" }}
      >
        영상은 연출, 숫자는 실측.
      </p>
    </div>
  );
}
