import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const call = (resource: string) => GET(new Request(`http://x/api/v1/${resource}`), { params: Promise.resolve({ resource }) });

describe("GET /api/v1/[resource] — Vercel 중계", () => {
  const upstream = vi.fn();

  beforeEach(() => {
    vi.stubEnv("API_ORIGIN", "https://api.example.test/api/v1");
    vi.stubEnv("CF_ACCESS_CLIENT_ID", "id");
    vi.stubEnv("CF_ACCESS_CLIENT_SECRET", "secret");
    vi.stubGlobal("fetch", upstream);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    upstream.mockReset();
  });

  it("허용된 리소스는 Access 토큰을 붙여 집 서버로 넘기고 CDN 캐시 헤더를 단다", async () => {
    upstream.mockResolvedValue(Response.json({ items: [] }));

    const res = await call("profiles");

    expect(upstream).toHaveBeenCalledWith("https://api.example.test/api/v1/profiles", {
      headers: { "CF-Access-Client-Id": "id", "CF-Access-Client-Secret": "secret" },
    });
    expect([res.status, res.headers.get("cache-control"), await res.json()]).toEqual([
      200,
      "public, s-maxage=60, stale-while-revalidate=600",
      { items: [] },
    ]);
  });

  it("목록에 없는 경로는 집 서버에 넘기지 않고 404", async () => {
    const res = await call("openapi.json");

    expect(upstream).not.toHaveBeenCalled();
    expect([res.status, (await res.json()).error.code]).toEqual([404, "RESOURCE_NOT_FOUND"]);
  });

  it("집 서버가 응답하지 않으면 502", async () => {
    upstream.mockRejectedValue(new TypeError("fetch failed"));

    const res = await call("profiles");

    expect([res.status, (await res.json()).error.code]).toEqual([502, "UPSTREAM_UNAVAILABLE"]);
  });
});
