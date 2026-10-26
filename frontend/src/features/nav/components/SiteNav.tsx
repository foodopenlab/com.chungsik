"use client";

import { useEffect, useRef, useState } from "react";

import { activeSection } from "../lib/activeSection";

const SECTIONS = [
  { id: "gap", label: "GAP" },
  { id: "translate", label: "TRANSLATE" },
  { id: "stack", label: "STACK" },
  { id: "built", label: "BUILT" },
  { id: "dict", label: "DICT" },
  { id: "deploy", label: "DEPLOY" },
  { id: "contact", label: "CONTACT" },
];

// 화면 위에서 45% 선을 지난 섹션이 현재 섹션
const LINE = 0.45;

// 상단 내비게이션 — HERO(첫 섹션 전)에서는 숨고, 01부터 나타나 현재 섹션을 강조한다
export function SiteNav() {
  const [active, setActive] = useState(-1);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const update = () => {
      const tops = SECTIONS.map((s) => document.getElementById(s.id)?.getBoundingClientRect().top ?? Infinity);
      setActive(activeSection(tops, window.innerHeight * LINE));
    };
    // 섹션이 나중에 채워지며 위치가 바뀌므로 페이지 크기 변화에도 다시 잰다
    const resize = new ResizeObserver(update);
    resize.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  // 모바일은 항목이 넘쳐 가로로 밀리므로 현재 항목이 보이게 목록만 옮긴다(페이지는 그대로). offsetLeft 기준이 목록이 되게 ul은 relative
  useEffect(() => {
    const item = list.current?.children[active] as HTMLElement | undefined;
    if (item) list.current?.scrollTo({ left: item.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  const visible = active >= 0;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur transition-transform duration-300 ${visible ? "" : "-translate-y-full"}`}
      inert={!visible}
    >
      <div className="mx-auto flex h-12 max-w-[1280px] items-center gap-6 px-4 md:px-10">
        <a href="#" className="shrink-0 text-sm font-bold">
          김충식
        </a>
        <nav aria-label="섹션" className="min-w-0 flex-1">
          <ul ref={list} className="relative flex gap-5 overflow-x-auto [scrollbar-width:none] md:justify-end">
            {SECTIONS.map((s, i) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  aria-current={i === active ? "location" : undefined}
                  className={`font-mono text-xs tracking-[0.15em] ${i === active ? "text-[var(--scan)]" : "text-[var(--muted)] hover:text-[var(--text)]"}`}
                >
                  {String(i + 1).padStart(2, "0")} {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
