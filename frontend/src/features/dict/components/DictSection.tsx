"use client";

import { useEffect, useRef, useState } from "react";

import { ScanReveal } from "@/shared/ui/ScanReveal";

import { useTerms } from "../hooks/useTerms";
import { translate, type Translation } from "../lib/translate";

// 현장→개발 2개, 개발→현장 1개
const DEMO_QUERIES = ["라인이 자주 서요", "다시 안 나게 해 주세요", "throughput"];
const TYPE_MS = 45;

// 지시서 §1-1: 현장 쪽은 --scan, 개발 쪽은 --data
const SIDE = { field: "text-[var(--scan)]", dev: "text-[var(--data)]" };

type Entry = { query: string; result: Translation | null };

export function DictSection() {
  const { data } = useTerms();
  const terms = data?.items ?? [];
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const run = (query: string) => {
    if (!query.trim()) return;
    setEntries((prev) => [...prev.slice(-5), { query, result: translate(query, terms) }]);
    setInput("");
  };

  const autoplay = (query: string) => {
    if (typing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return run(query);
    setTyping(true);
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      setInput(query.slice(0, i));
      if (i >= query.length) {
        window.clearInterval(timer.current);
        setTyping(false);
        run(query);
      }
    }, TYPE_MS);
  };

  return (
    <ScanReveal>
      <section aria-labelledby="dict-title" className="mx-auto max-w-[1280px] px-4 py-24 md:px-10">
        <p className="font-mono text-[13px] tracking-[0.2em] text-[var(--data)]">05 / DICT</p>
        <h2 id="dict-title" className="mt-4 text-3xl font-bold break-keep md:text-[44px]">
          현장 말과 개발 말을 오가는 사전
        </h2>

        <div className="mt-10 flex flex-wrap gap-2">
          {DEMO_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => autoplay(q)}
              disabled={typing}
              className="border border-[var(--line)] px-3 py-1.5 font-mono text-sm hover:border-[var(--scan)] disabled:opacity-50"
            >
              ▶ {q}
            </button>
          ))}
        </div>

        <div className="mt-4 border border-[var(--line)] bg-[var(--bg)] p-4 font-mono text-sm leading-relaxed md:p-6 md:text-base">
          <div role="log" aria-live="polite" className="min-h-48 space-y-4 break-keep">
            {entries.map((e, i) => (
              <div key={i}>
                <p className="text-[var(--muted)]">$ translate {e.query}</p>
                {e.result ? (
                  <>
                    <p>
                      <span className={SIDE[e.result.fromField ? "field" : "dev"]}>{e.result.from}</span>
                      <span className="text-[var(--muted)]"> ↔ </span>
                      <span className={SIDE[e.result.fromField ? "dev" : "field"]}>{e.result.to}</span>
                    </p>
                    {e.result.note && <p className="text-[var(--muted)]">{e.result.note}</p>}
                  </>
                ) : (
                  <p className="text-[var(--muted)]">사전에 없음 — 현장에서 물어보겠습니다.</p>
                )}
              </div>
            ))}
          </div>
          <form
            className="mt-4 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
            }}
          >
            <label htmlFor="dict-input" className="shrink-0 text-[var(--muted)]">
              $ translate
            </label>
            <input
              id="dict-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              readOnly={typing}
              autoComplete="off"
              placeholder="용어 입력"
              className="min-w-0 flex-1 bg-transparent text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
            />
          </form>
        </div>
      </section>
    </ScanReveal>
  );
}
