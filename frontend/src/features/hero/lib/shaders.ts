// 지시서 §3-3 scan.vert / scan.frag
export const vertexShader = /* glsl */ `
uniform float uScanY;
uniform float uMorph;
uniform float uScatter;
uniform float uSize;
uniform vec4 uChartRect; // 차트 틀의 화면 좌표(NDC) — 왼쪽, 아래, 오른쪽, 위
attribute vec2 targetPos; // 차트 틀 안의 정규 좌표 0~1
varying float vVisible;
varying float vNearScan;

float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }

void main() {
  // 점구름은 3D 카메라로 보고, 차트는 화면 좌표의 틀에 모은다 — 세로 화면 카메라가 비스듬해도 막대 간격이 고르고 카운터를 덮지 않는다
  vec4 origin = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vec2 ndc = origin.xy / origin.w;

  // 스캔 판정은 원래 위치의 화면 y(위=0, 아래=1) 기준 — 지나간 영역만 점구름으로 바뀐다. 카메라 뒤의 점은 차트로 모일 때만 보인다
  float yTop = 0.5 - 0.5 * ndc.y;
  vVisible = step(yTop, uScanY) * max(step(0.0, origin.w), step(0.5, uMorph));
  vNearScan = (1.0 - smoothstep(0.0, 0.015, abs(yTop - uScanY))) * (1.0 - step(1.0, uScanY));

  vec2 chart = mix(uChartRect.xy, uChartRect.zw, targetPos);
  vec2 xy = mix(ndc, chart, smoothstep(0.0, 1.0, uMorph));
  vec3 dir = vec3(hash(position) - 0.5, hash(position.yzx) - 0.5, hash(position.zxy) - 0.5);
  xy += dir.xy * uScatter * 3.0;

  gl_Position = vec4(xy, 0.0, 1.0);
  gl_PointSize = uSize;
}
`;

export const fragmentShader = /* glsl */ `
uniform vec3 uData;
uniform vec3 uScan;
uniform float uScatter;
varying float vVisible;
varying float vNearScan;

void main() {
  if (vVisible < 0.5) discard;
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  gl_FragColor = vec4(mix(uData, uScan, vNearScan), 1.0 - uScatter);
  #include <colorspace_fragment>
}
`;
