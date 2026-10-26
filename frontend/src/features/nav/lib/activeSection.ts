// 섹션 윗변(문서 기준 px)이 기준선을 지난 마지막 섹션의 번호. 첫 섹션 전(HERO)이면 -1
export function activeSection(tops: number[], line: number) {
  return tops.findLastIndex((top) => top <= line);
}
