import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// src 안의 글자(픽스처 = 실 DB 데이터 포함)가 서브셋 폰트 Scan Sans에 모두 들어 있어야 한다
function sourceChars(dir: string): Set<string> {
  const chars = new Set<string>();
  for (const e of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!e.isFile() || !/\.tsx?$/.test(e.name) || /\.test\.tsx?$/.test(e.name)) continue;
    for (const c of readFileSync(join(e.parentPath, e.name), "utf8")) if (c.codePointAt(0)! > 126) chars.add(c);
  }
  return chars;
}

describe("Scan Sans 서브셋 폰트", () => {
  it("사이트에 쓰인 글자를 모두 담는다 — 실패하면 scripts/subset-font.sh를 다시 실행", () => {
    const subset = new Set(readFileSync(join(__dirname, "scan-sans-chars.txt"), "utf8"));
    const missing = [...sourceChars(join(__dirname, "../.."))].filter((c) => !subset.has(c));

    expect(missing.join("")).toBe("");
  });
});
