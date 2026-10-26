import type { Term } from "@/shared/api/types";

// fromField: 입력이 현장 용어였는지 — 화면 색(현장 --scan, 개발 --data)을 방향과 무관하게 맞추는 데 쓴다
export type Translation = { from: string; to: string; note: string | null; fromField: boolean };

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

// 현장↔개발 양방향. 정확히 같은 항목을 먼저 찾고, 없으면 부분 일치.
export function translate(query: string, terms: Term[]): Translation | null {
  const q = norm(query);
  if (!q) return null;
  const pairs = terms.flatMap((t) => [
    { from: t.field, to: t.dev, note: t.note, fromField: true },
    { from: t.dev, to: t.field, note: t.note, fromField: false },
  ]);
  return pairs.find((p) => norm(p.from) === q) ?? pairs.find((p) => norm(p.from).includes(q)) ?? null;
}
