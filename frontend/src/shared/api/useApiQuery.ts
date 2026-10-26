import { useQuery, type QueryKey } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};

// 하이드레이션 동안에는 서버 HTML과 같게 "데이터 없음"을 돌려준다.
// Suspense 경계가 순서대로 하이드레이션되는 사이 앞 경계가 채운 공용 캐시를 뒤 경계가 읽으면 불일치가 난다.
export function useApiQuery<T>(options: { queryKey: QueryKey; queryFn: () => Promise<T>; staleTime?: number; enabled?: boolean }) {
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const q = useQuery(options);
  return {
    data: hydrated ? q.data : undefined,
    isPending: !hydrated || q.isPending,
    isError: hydrated && q.isError,
  };
}
