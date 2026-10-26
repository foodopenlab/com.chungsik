"use client";

import { useStackGroups } from "@/shared/stack/useStackGroups";
import { StackGrid } from "@/shared/ui/StackGrid";
import { ScanReveal } from "@/shared/ui/ScanReveal";

export function StackSection() {
  const { groups, isPending, isError } = useStackGroups();

  return (
    <ScanReveal>
      <section id="stack" aria-labelledby="stack-title" className="mx-auto max-w-[1280px] px-4 py-24 md:px-10">
        <p className="font-mono text-[13px] tracking-[0.2em] text-[var(--data)]">03 / STACK</p>
        <h2 id="stack-title" className="mt-4 max-w-[30ch] text-3xl leading-snug font-bold break-keep md:text-[44px]">
          한 프로세스로 배포하는 모듈러 모놀리스. 모든 외부 기술은 포트 뒤 어댑터라 교체 비용이 작습니다.
        </h2>

        {isError && <p className="mt-12 text-[var(--muted)]">기술 스택을 불러오지 못했습니다.</p>}

        <div className="mt-12" aria-busy={isPending}>
          <StackGrid groups={groups} />
        </div>

        <aside className="mt-8 border border-[var(--alert)] p-4 break-keep md:p-6">
          <p className="font-bold">외부 기술은 전부 ‘포트 뒤 어댑터’</p>
          <p className="mt-2 text-[var(--muted)]">
            Gemini ↔ Claude, 로컬 Ollama ↔ 다른 서버, Docker Compose ↔ EKS로 바꿔도 안쪽 코드는 그대로입니다.
          </p>
        </aside>
      </section>
    </ScanReveal>
  );
}
