"use client";

import { ScanReveal } from "@/shared/ui/ScanReveal";

// 지시서 §2 "06 / DEPLOY" — 고객사에 가면 처음 30일
const STAGES = [
  { title: "현장 관찰", body: "라인에 서서 사람이 실제로 무엇을 기록하고 무엇을 건너뛰는지 본다." },
  { title: "데이터 존재 확인", body: "기록이 종이인지, 엑셀인지, 시스템인지. 없는 데이터는 없다고 적는다." },
  { title: "Rule / Data / AI 영역 구분", body: "규칙으로 끝나는 일, 데이터가 필요한 일, AI가 필요한 일을 나눈다." },
  { title: "작은 PoC", body: "한 라인, 한 공정, 한 문서 유형에서 먼저 돌려 본다." },
  { title: "평가 기준", body: "맞았는지 틀렸는지를 현장 사람이 판정할 수 있는 기준을 먼저 합의한다." },
  { title: "Production", body: "입력하는 사람이 바뀌어도 돌아가는지 확인하고 넘긴다." },
];

const POC = ["HACCP 기록 점검", "표시사항·규제 검토 RAG", "클레임·VOC 분류", "원가·생산계획 분석"];

export function DeploySection() {
  return (
    <ScanReveal>
      <section id="deploy" aria-labelledby="deploy-title" className="mx-auto max-w-[1280px] px-4 py-24 md:px-10">
        <p className="font-mono text-[13px] tracking-[0.2em] text-[var(--data)]">06 / DEPLOY</p>
        <h2 id="deploy-title" className="mt-4 text-3xl font-bold break-keep md:text-[44px]">
          고객사에 가면 처음 30일
        </h2>

        <ol className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((s, i) => (
            <li key={s.title} className="bg-[var(--bg)] p-6 break-keep">
              <p className="font-mono text-sm text-[var(--scan)] tabular-nums">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
              <p className="mt-3 leading-[1.7] text-[var(--muted)]">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--muted)]">POC 후보</p>
          <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-lg">
            {POC.map((p) => (
              <li key={p} className="before:mr-2 before:text-[var(--data)] before:content-['—']">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ScanReveal>
  );
}
