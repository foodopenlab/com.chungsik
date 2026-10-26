// 서버 전용 — Vercel이 집 서버 API를 직접 부를 때. api.chungsik.com 앞의 Cloudflare Access를 통과하는 서비스 토큰을 붙인다.
// NEXT_PUBLIC_이 아닌 env라 브라우저 번들에 들어가지 않는다.
export function upstreamFetch(path: string) {
  return fetch(`${process.env.API_ORIGIN}${path}`, {
    headers: {
      "CF-Access-Client-Id": process.env.CF_ACCESS_CLIENT_ID ?? "",
      "CF-Access-Client-Secret": process.env.CF_ACCESS_CLIENT_SECRET ?? "",
    },
  });
}
