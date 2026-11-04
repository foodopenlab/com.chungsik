"use client";

import type { Metric } from "@/shared/api/types";
import { useMetricsById } from "@/shared/metrics/useMetricsById";
import { AttributionBadge } from "@/shared/ui/AttributionBadge";
import { CountUpText } from "@/shared/ui/CountUpText";
import { ScanReveal } from "@/shared/ui/ScanReveal";

import { ClosingPlate } from "./ClosingPlate";

const TEACH_METRIC_IDS = ["teach-ncs-years", "teach-satisfaction", "teach-youtube-reviews"];

const EMAIL = "kcs8815@gmail.com";

// 직접 운영하는 식품 채널·서비스 — 위 "대본 검수 9편"(한국식품정보원)과는 별개
const OPERATED = [
  {
    label: "운영 채널",
    links: [
      { title: "YouTube @foodopenlab", href: "https://www.youtube.com/@foodopenlab" },
      { title: "YouTube @TodayKoreaFood (미국 대상)", href: "https://www.youtube.com/@TodayKoreaFood" },
      { title: "Instagram @foodopenlab", href: "https://www.instagram.com/foodopenlab" },
    ],
  },
  {
    label: "운영 서비스",
    links: [{ title: "FoodRM — 식품 실무자 도구", href: "https://www.foodrm.co.kr" }],
  },
];

// 푸터 Docs 인덱스 — 프로젝트 문서 사이트(근거: docs/project-facts.md 매핑 표)
const DOCS = [
  { title: "Metabole", href: "https://metabole.beyondfacade.cloud" },
  { title: "Life Tutorial", href: "https://lifetutorial.beyondfacade.cloud" },
  { title: "localhost:daegu", href: "https://053.localhostdaegu.cloud" },
  { title: "TownPulse", href: "https://townpulse.beyondfacade.cloud" },
  { title: "REMAKE DAY 개발 허브", href: "https://blog.remakeday.com" },
  { title: "REMAKE DAY Research", href: "https://research.remakeday.com" },
];

export function ContactSection() {
  const metrics = useMetricsById();
  const teach = TEACH_METRIC_IDS.map((id) => metrics.get(id)).filter((m): m is Metric => !!m);
  // 제목의 연수는 카운터와 같은 metric에서 — 숫자는 컴포넌트에 직접 쓰지 않는다
  const years = metrics.get("teach-ncs-years")?.value;

  return (
    <ScanReveal>
      <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-[1280px] px-4 py-24 md:px-10">
        <p className="font-mono text-[13px] tracking-[0.2em] text-[var(--data)]">07 / TEACH + CONTACT</p>
        <h2 id="contact-title" className="mt-4 text-3xl font-bold break-keep md:text-[44px]">
          가르친 {years ?? "시간"}, 그리고 연락처
        </h2>

        <dl className="mt-12 grid gap-8 sm:grid-cols-3">
          {teach.map((m) => (
            <div key={m.id}>
              <dt className="flex items-center gap-2 text-sm">
              {m.label}
              <AttributionBadge attribution={m.attribution} />
            </dt>
              <dd className="mt-1 font-mono text-4xl font-medium text-[var(--scan)] tabular-nums"><CountUpText text={m.value} /></dd>
              <dd className="mt-2 text-xs text-[var(--muted)]">{m.condition}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-lg">공저 『먹는거로취업하자』</p>

        <p className="mt-12">
          <a href={`mailto:${EMAIL}`} className="font-mono text-lg text-[var(--data)] hover:underline">
            {EMAIL}
          </a>
        </p>
        {/* 데스크톱은 라벨 칸 너비를 두 줄이 공유해 링크 시작점을 맞춘다 */}
        <dl className="mt-4 grid gap-y-3 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-x-6 sm:gap-y-2">
          {OPERATED.map((g) => (
            <div key={g.label} className="sm:contents">
              <dt className="text-xs text-[var(--muted)]">{g.label}</dt>
              <dd className="mt-2 sm:mt-0">
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {g.links.map((c) => (
                    <li key={c.href}>
                      <a href={c.href} target="_blank" rel="noreferrer" className="text-[var(--data)] hover:underline">
                        {c.title} →
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>

        <nav id="docs" aria-label="문서 사이트" className="mt-16 border-t border-[var(--line)] pt-8">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--muted)]">DOCS</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {DOCS.map((d) => (
              <li key={d.href}>
                <a href={d.href} target="_blank" rel="noreferrer" className="text-[var(--data)] hover:underline">
                  {d.title} →
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ClosingPlate />
      </section>
    </ScanReveal>
  );
}
