// 02 TRANSLATE 점구름: 스캔 라인 위(지나간 영역)만 보이고, morph로 차트 좌표에 모인다
export const vertexShader = /* glsl */ `
uniform float uScanY;
uniform float uMorph;
uniform float uSize;
attribute vec3 targetPos;
attribute float tone;
varying float vVisible;
varying float vNearScan;
varying float vTone;

void main() {
  float m = smoothstep(0.0, 1.0, uMorph);
  vec3 pos = mix(position, targetPos, m);
  vVisible = max(step(uScanY, position.y), step(0.001, uMorph));
  vNearScan = (1.0 - smoothstep(0.0, 0.03, abs(position.y - uScanY))) * (1.0 - step(0.001, uMorph));
  vTone = tone * m;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize;
}
`;

export const fragmentShader = /* glsl */ `
uniform vec3 uData;
uniform vec3 uScan;
varying float vVisible;
varying float vNearScan;
varying float vTone;

void main() {
  if (vVisible < 0.5) discard;
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  gl_FragColor = vec4(mix(uData, uScan, max(vTone, vNearScan)), 1.0);
  #include <colorspace_fragment>
}
`;
