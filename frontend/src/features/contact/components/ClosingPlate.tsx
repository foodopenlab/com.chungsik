"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/shared/motion/prefersReducedMotion";
import { useInViewOnce } from "@/shared/motion/useInViewOnce";

// 스캔 라인이 내려가는 시간 — 섹션 진입(0.9s)보다 천천히, HERO처럼 마지막 한 번
const SCAN = "1.8s";

// 07 마지막 — 스캔 라인이 한 번 더 지나가며 정지 화면이 실사(CLOSING, 카메라가 뒤로 빠짐)로 바뀐다.
// 영상·포스터는 화면 한 장 거리 안에 들어올 때만 받는다(첫 화면 용량에서 빼기). reduced-motion은 포스터에 정지.
export function ClosingPlate() {
  const [nearRef, near] = useInViewOnce<HTMLDivElement>("100% 0px 100% 0px");
  const [scanRef, scanned] = useInViewOnce<HTMLDivElement>();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (scanned && !prefersReducedMotion()) video.current?.play().catch(() => {});
  }, [scanned, near]);

  return (
    <div ref={nearRef} className="relative mt-24 aspect-[21/9] overflow-hidden border border-[var(--line)]">
      {near && (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/video/closing-poster.webp)" }} aria-hidden />
      )}
      {/* 감지 요소는 처음부터 그려 둔다(useInViewOnce는 마운트 때 붙은 요소만 본다) — 영상만 근처에서 넣는다 */}
      <div ref={scanRef} className="scan-reveal absolute inset-0" data-scanned={scanned || undefined} style={{ animationDuration: SCAN }}>
        {near && (
          <video ref={video} muted playsInline preload="auto" aria-hidden className="size-full object-cover">
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
