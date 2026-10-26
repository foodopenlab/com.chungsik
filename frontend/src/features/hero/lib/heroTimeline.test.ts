import { describe, expect, it } from "vitest";

import { CHART_HOLD, heroFrame } from "./heroTimeline";

describe("heroFrame", () => {
  it("처음에는 영상이 재생되고 스캔은 시작 전이다", () => {
    expect(heroFrame(0)).toMatchObject({ playing: true, scanY: 0, morph: 0 });
  });

  it("15~40% 구간에서 스캔 라인이 위에서 아래로 내려간다", () => {
    const frame = heroFrame(0.275);

    expect([frame.playing, frame.scanY]).toEqual([false, expect.closeTo(0.5)]);
  });

  it("차트 고정 구간 내내 막대가 완성된 채 카운터가 보인다", () => {
    for (const p of [CHART_HOLD.from, CHART_HOLD.snap, CHART_HOLD.to - 0.01]) {
      expect(heroFrame(p)).toMatchObject({ morph: 1, scatter: 0, counters: true });
    }
  });

  it("끝에서는 점이 흩어지고 제목만 남는다", () => {
    expect(heroFrame(1)).toMatchObject({ morph: 1, scatter: 1, title: 1, counters: false });
  });
});
