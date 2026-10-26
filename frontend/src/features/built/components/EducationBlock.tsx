"use client";

import { useEducations } from "../hooks/useEducations";

const dotted = (iso: string) => iso.replaceAll("-", ".");

// 04 머리말 — 다섯 프로젝트가 어디서 나왔는지. 현장 경력(식품)과 개발 이력(교육 과정)을 섞어 읽지 않게 한다
export function EducationBlock({ projectCount }: { projectCount: number }) {
  const educations = useEducations();

  return educations.map((e) => (
    <div key={e.id} className="mt-10 border border-[var(--line)] p-6 break-keep md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--muted)]">EDUCATION</p>
        <span className="border border-[var(--line)] px-2 py-0.5 font-mono text-xs text-[var(--muted)]">{e.status}</span>
      </div>
      <p className="mt-4 font-mono text-sm text-[var(--data)]">
        {dotted(e.startedOn)} – {dotted(e.endedOn)}
      </p>
      <p className="mt-2 text-xl font-bold md:text-2xl">{e.title}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{e.organization}</p>
      <p className="mt-4 leading-[1.7]">{e.description}</p>
      {projectCount > 0 && (
        <p className="mt-2 leading-[1.7]">아래 프로젝트 {projectCount}개는 모두 이 과정에서 팀으로 만들었습니다.</p>
      )}
    </div>
  ));
}
