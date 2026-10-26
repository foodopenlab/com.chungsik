import { upstreamFetch } from "@/shared/api/upstream";

// 브라우저 → 여기(Vercel) → 집 서버. 공개 데이터 8종의 GET만 넘기고, Vercel CDN이 1분 캐시해 집 서버 요청을 줄인다
const RESOURCES = new Set(["profiles", "metrics", "projects", "project-stacks", "stack-categories", "stacks", "terms", "educations"]);
const CDN_CACHE = "public, s-maxage=60, stale-while-revalidate=600";

const error = (status: number, code: string, message: string) => Response.json({ error: { code, message } }, { status });

export async function GET(req: Request, { params }: RouteContext<"/api/v1/[resource]">) {
  const { resource } = await params;
  // 쿼리마다 CDN 캐시 키가 달라 매번 집 서버까지 간다 — 사이트는 쿼리를 쓰지 않으므로 막는다
  if (!RESOURCES.has(resource) || new URL(req.url).search) return error(404, "RESOURCE_NOT_FOUND", "없는 데이터입니다.");

  const res = await upstreamFetch(`/${resource}`).catch(() => null);
  if (!res?.ok) return error(502, "UPSTREAM_UNAVAILABLE", "데이터 서버에 연결하지 못했습니다.");
  return Response.json(await res.json(), { headers: { "cache-control": CDN_CACHE } });
}
