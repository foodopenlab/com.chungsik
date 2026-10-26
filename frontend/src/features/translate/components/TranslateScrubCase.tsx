"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type { Metric } from "@/shared/api/types";
import { useSectionProgress } from "@/shared/motion/useSectionProgress";

import type { TranslateCase } from "../lib/cases";
import { translateFrame } from "../lib/translateFrame";
import { CaseText } from "./CaseText";

const SIDE = { data: "text-[var(--data)]", scan: "text-[var(--scan)]" };

const TranslateCanvas = dynamic(() => import("./TranslateCanvas"), { ssr: false });

// 지시서 §2 02: 번역 1건 = 200svh 고정 스크럽. 캔버스는 화면 근처에 왔을 때만 만든다(동시에 1~2개).
export function TranslateScrubCase({ c, index, metrics }: { c: TranslateCase; index: number; metrics: Metric[] }) {
  const [ref, progress] = useSectionProgress<HTMLLIElement>();
  const frame = translateFrame(progress);
  const frameRef = useRef(frame);
  const [near, setNear] = useState(false);

  useEffect(() => {
    frameRef.current = frame;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "50% 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  const scanning = frame.scan > 0 && frame.scan < 1;

  return (
    <li ref={ref} className="relative h-[200svh]">
      <div className="sticky top-0 grid h-svh grid-rows-[46%_54%] overflow-hidden border-y border-[var(--line)] md:grid-cols-[3fr_2fr] md:grid-rows-1">
        <div className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${c.poster})` }}
            aria-hidden
          />
          {near && <TranslateCanvas c={c} frame={frameRef} />}
          {c.divider && (
            <div
              className="absolute inset-y-[24%] left-1/2 w-px border-l border-dashed border-[var(--text)]/50 transition-opacity duration-300"
              style={{ opacity: frame.result }}
              aria-hidden
            />
          )}
          {c.chartLabels?.map((l) => (
            <span
              key={l.text}
              className={`absolute top-[16%] -translate-x-1/2 font-mono text-sm transition-opacity duration-300 md:text-base ${SIDE[l.side]}`}
              style={{ left: `${l.x}%`, opacity: frame.result }}
            >
              {l.text}
            </span>
          ))}
          {scanning && (
            <div
              className="absolute inset-x-[8%] h-px bg-[var(--scan)] shadow-[0_0_12px_var(--scan)]"
              style={{ top: `${18 + frame.scan * 64}%` }}
              aria-hidden
            />
          )}
        </div>
        <div className="flex items-center px-4 py-4 md:px-10 md:py-6">
          <CaseText c={c} index={index} metrics={metrics} labels={frame.labels} result={frame.result} />
        </div>
      </div>
    </li>
  );
}
