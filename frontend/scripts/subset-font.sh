#!/bin/bash
# 본문 글꼴 Scan Sans = Pretendard 가변 폰트에서 사이트에 쓰인 글자만 남긴 woff2 1개(분할 파일 26개 574KB → 1개).
# Pretendard는 OFL 1.1 + 예약 글꼴 이름 "Pretendard"라 수정본(서브셋)은 다른 이름을 쓴다. 저작권 표기·라이선스는 OFL.txt로 함께 둔다.
# 글자는 src의 .ts/.tsx(픽스처 = 실 DB 데이터 포함, 테스트 제외)에서 모으고, 영문·숫자·기호(U+0020-007E)는 항상 넣는다.
# 새 글자가 생겨 src/styles/fonts/scanSans.test.ts가 실패하면 다시 실행: bash scripts/subset-font.sh  (fonttools·brotli 필요)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=src/styles/fonts
python3 - "$OUT/scan-sans-chars.txt" <<'PY'
import pathlib, sys
chars = set()
for p in pathlib.Path("src").rglob("*"):
    if p.suffix in (".ts", ".tsx") and not p.name.endswith((".test.ts", ".test.tsx")):
        chars |= {c for c in p.read_text(encoding="utf-8") if ord(c) > 126}
pathlib.Path(sys.argv[1]).write_text("".join(sorted(chars)), encoding="utf-8")
print(f"글자 {len(chars)}개")
PY
pyftsubset node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2 \
  --text-file="$OUT/scan-sans-chars.txt" --unicodes=U+0020-007E \
  --flavor=woff2 --output-file="$OUT/ScanSans.woff2"
# 글꼴 이름에서 예약 이름을 뺀다(저작권 0·라이선스 13·14번 레코드는 그대로)
python3 - "$OUT/ScanSans.woff2" <<'PY'
import sys
from fontTools.ttLib import TTFont
f = TTFont(sys.argv[1])
for r in f["name"].names:
    if r.nameID in (0, 13, 14):
        continue
    s = r.toUnicode()
    if "Pretendard" in s:
        r.string = s.replace("PretendardVariable", "ScanSansVariable").replace("Pretendard", "Scan Sans")
f.save(sys.argv[1])
left = [r.nameID for r in f["name"].names if r.nameID not in (0, 13, 14) and "Pretendard" in r.toUnicode()]
assert not left, left
PY
ls -l "$OUT/ScanSans.woff2"
