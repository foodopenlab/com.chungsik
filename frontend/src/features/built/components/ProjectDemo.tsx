"use client";

import { useEffect, useRef } from "react";

// 녹화가 있는 프로젝트 — 파일: public/video/projects/{slug}.webm|.mp4|-poster.webp
const DEMO_SLUGS = new Set(["metabole", "life-tutorial", "localhost-daegu", "townpulse", "remakeday"]);

// 지시서 §2 04: 동작 녹화는 뷰포트에 들어왔을 때만 재생
export function ProjectDemo({ slug, title }: { slug: string; title: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.5 },
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  if (!DEMO_SLUGS.has(slug)) {
    return (
      <div className="flex aspect-video items-center justify-center border border-[var(--line)] bg-[var(--bg-tile)]">
        <span className="font-mono text-sm text-[var(--muted)]">동작 녹화 없음 — 문서 사이트에서 확인</span>
      </div>
    );
  }

  const base = `/video/projects/${slug}`;
  return (
    <div className="border border-[var(--line)] bg-[var(--bg-tile)] p-1.5">
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        poster={`${base}-poster.webp`}
        aria-label={`${title} 동작 녹화`}
        className="block aspect-video w-full"
      >
        <source src={`${base}.webm`} type="video/webm" />
        <source src={`${base}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
