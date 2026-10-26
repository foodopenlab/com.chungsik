// 지시서 §3-3 scan.vert / scan.frag
export const vertexShader = /* glsl */ `
uniform float uScanY;
uniform float uMorph;
uniform float uScatter;
uniform float uSize;
uniform float uBarScale;
uniform float uBarCenterX;
attribute vec3 targetPos;
varying float vVisible;
varying float vNearScan;

float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }

void main() {
  vec3 target = targetPos;
  target.x = uBarCenterX + (target.x - uBarCenterX) * uBarScale;
  vec3 pos = mix(position, target, smoothstep(0.0, 1.0, uMorph));
  vec3 dir = vec3(hash(position) - 0.5, hash(position.yzx) - 0.5, hash(position.zxy) - 0.5);
  pos += dir * uScatter * 12.0;

  // 스캔 판정은 원래 위치의 화면 y(위=0, 아래=1) 기준 — 지나간 영역만 점구름으로 바뀐다
  vec4 origin = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  float yTop = 0.5 - 0.5 * origin.y / origin.w;
  vVisible = step(yTop, uScanY);
  vNearScan = (1.0 - smoothstep(0.0, 0.015, abs(yTop - uScanY))) * (1.0 - step(1.0, uScanY));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
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
