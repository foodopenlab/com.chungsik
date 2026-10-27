// 수상은 상태 태그(회색)와 따로 금색으로 — 프로젝트·교육 카드 공용
export function AwardTag({ award }: { award: string | null }) {
  if (!award) return null;
  return <span className="border border-[var(--award)] px-2 py-0.5 font-mono text-xs text-[var(--award)]">{award}</span>;
}
