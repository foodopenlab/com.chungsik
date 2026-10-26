"use client";
/* eslint-disable react-hooks/immutability -- three.js 지오메트리·재질·uniform은 프레임마다 직접 바꾸는 것이 정상 사용법 */

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useMemo, type RefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { chartTargets, pairByX } from "../lib/chartTargets";
import type { TranslateCase } from "../lib/cases";
import { fragmentShader, vertexShader } from "../lib/shaders";
import type { TranslateFrame } from "../lib/translateFrame";

const FIT = 1.25; // 오브젝트를 화면 틀 안에 맞출 크기(가장 긴 변)
const FOV = 35;
const HALF_WIDTH = 1.08; // 차트 틀(가로 ±1) + 여백

const cssColor = (name: string) =>
  new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim());

// 오브젝트 원본 좌표 → 화면 틀: 눕힌 오브젝트 세우기(tilt)·돌리기(yaw)·위아래 바로잡기(roll) → 중심 맞추기 → 크기 맞추기
function fitMatrix(geometry: THREE.BufferGeometry, { tilt, yaw, roll }: Pick<TranslateCase, "tilt" | "yaw" | "roll">) {
  const rot = new THREE.Matrix4()
    .makeRotationX(tilt)
    .premultiply(new THREE.Matrix4().makeRotationY(yaw))
    .premultiply(new THREE.Matrix4().makeRotationZ(roll));
  const box = new THREE.Box3().setFromBufferAttribute(geometry.getAttribute("position") as THREE.BufferAttribute);
  box.applyMatrix4(rot);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = FIT / Math.max(size.x, size.y);
  return new THREE.Matrix4().makeScale(scale, scale, scale).multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z)).multiply(rot);
}

// 세로로 좁은 화면(모바일)에서는 카메라를 물려 차트 가로 폭이 다 들어오게 한다
function CameraFit() {
  const { camera, size } = useThree();
  const tan = Math.tan(((FOV / 2) * Math.PI) / 180);
  camera.position.z = Math.max(3.2, HALF_WIDTH / (tan * (size.width / size.height)));
  camera.updateProjectionMatrix();
  return null;
}

function Scene({ c, frame }: { c: TranslateCase; frame: RefObject<TranslateFrame> }) {
  const [meshGltf, pointsGltf] = useLoader(GLTFLoader, [`/models/obj-${c.model}.glb`, `/models/obj-${c.model}-points.glb`]);
  const { gl, viewport } = useThree();
  gl.localClippingEnabled = true;

  const { points, mesh, top, bottom, clip, uniforms } = useMemo(() => {
    const src = pointsGltf.scene.getObjectByProperty("type", "Points") as THREE.Points;
    const m = fitMatrix(src.geometry, c);
    const geometry = src.geometry.clone().applyMatrix4(m);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const n = geometry.getAttribute("position").count;
    const { pos, tone } = pairByX(geometry.getAttribute("position").array as Float32Array, chartTargets(c.chart, n));
    geometry.setAttribute("targetPos", new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute("tone", new THREE.BufferAttribute(tone, 1));
    const u = {
      uScanY: { value: box.max.y + 0.01 },
      uMorph: { value: 0 },
      uSize: { value: 2.2 },
      uData: { value: cssColor("--data") },
      uScan: { value: cssColor("--scan") },
    };
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms: u, transparent: true, depthWrite: false });

    // 실물 메쉬: 스캔 라인 아래(아직 안 지나간 영역)만 남기는 클리핑 평면
    const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), box.max.y + 0.01);
    const group = new THREE.Group();
    const object = meshGltf.scene.clone(true);
    object.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const mesh = o as THREE.Mesh;
        mesh.material = (mesh.material as THREE.Material).clone();
        (mesh.material as THREE.Material).clippingPlanes = [plane];
      }
    });
    group.add(object);
    group.matrixAutoUpdate = false;
    group.matrix.copy(m);

    return { points: new THREE.Points(geometry, material), mesh: group, top: box.max.y + 0.01, bottom: box.min.y - 0.01, clip: plane, uniforms: u };
  }, [meshGltf, pointsGltf, c]);

  uniforms.uSize.value = 2.2 * viewport.dpr;

  useFrame(() => {
    const f = frame.current;
    const y = top - (top - bottom) * f.scan;
    uniforms.uScanY.value = y;
    uniforms.uMorph.value = f.morph;
    clip.constant = y;
    mesh.visible = f.scan < 1;
  });

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[1.5, 2, 3]} intensity={2.2} />
      <primitive object={mesh} />
      <primitive object={points} />
    </>
  );
}

export default function TranslateCanvas({ c, frame }: { c: TranslateCase; frame: RefObject<TranslateFrame> }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.2], fov: FOV, near: 0.1, far: 20 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
      aria-hidden
    >
      <CameraFit />
      <Scene c={c} frame={frame} />
    </Canvas>
  );
}
