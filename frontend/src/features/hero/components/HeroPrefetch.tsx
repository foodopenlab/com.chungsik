import { cacheLife } from "next/cache";

import { fetchProfiles } from "../api";
import { HeroSection } from "./HeroSection";

// HERO 제목은 첫 화면의 가장 큰 글자(LCP)라 서버 HTML에 미리 넣는다. 1분 안팎으로 DB 변경을 반영한다.
// 백엔드가 꺼져 있거나 apiBase가 상대 주소(로컬 mock)면 undefined → HeroSection이 브라우저에서 불러온다.
// React Query 캐시로 넘기지 않는 이유: 데이터가 있으면 useQuery가 프리렌더 중 현재 시각을 읽어 Suspense 섹션 전체가 빈자리가 된다.
async function prefetchedProfile() {
  "use cache";
  cacheLife("minutes");
  return fetchProfiles()
    .then((r) => r.items[0])
    .catch(() => undefined);
}

export async function HeroPrefetch() {
  return <HeroSection serverProfile={await prefetchedProfile()} />;
}
