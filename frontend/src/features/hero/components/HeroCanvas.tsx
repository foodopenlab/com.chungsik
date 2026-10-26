"use client";
/* eslint-disable react-hooks/immutability -- three.js 카메라·지오메트리·uniform은 프레임마다 직접 바꾸는 것이 정상 사용법 */

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, type RefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { evenBarTargets } from "../lib/barTargets";
import type { HeroFrame } from "../lib/heroTimeline";
import { fragmentShader, vertexShader } from "../lib/shaders";

type CameraParams = { position: number[]; quaternion: number[]; fov_y_degrees: number; near: number; far: number };
type CameraFile = { cameras: { landscape: CameraParams; portrait: CameraParams } };
// 차트가 모일 틀 — 캔버스 기준 px. 위쪽은 카운터 목록 바로 아래(HeroSection이 측정), 아래쪽은 화면 높이의 92%
type ChartBox = { left: number; right: number; top: number };

const CHART_BOTTOM = 0.92;
const mobileCount = (count: number) => Math.floor(count / 3);

const MOBILE_WIDTH = 768;

const cssColor = (name: string) =>
  new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim());

function CameraRig({ cameras }: { cameras: CameraFile["cameras"] }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const c = size.width >= size.height ? cameras.landscape : cameras.portrait;
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.fromArray(c.position);
    cam.quaternion.fromArray(c.quaternion);
    cam.fov = c.fov_y_degrees;
    cam.near = c.near;
    cam.far = c.far;
    cam.updateProjectionMatrix();
  }, [camera, size, cameras]);
  return null;
}

function PointCloud({ frame, chartBox }: { frame: RefObject<HeroFrame>; chartBox: RefObject<ChartBox | null> }) {
  const gltf = useLoader(GLTFLoader, "/models/hero-pointcloud.glb");
  const { size, viewport } = useThree();

  const points = useMemo(() => {
    const source = gltf.scene.getObjectByProperty("type", "Points") as THREE.Points;
    const geometry = source.geometry.clone();
    const xyz = (a: THREE.BufferAttribute) => Float32Array.from({ length: a.count * 3 }, (_, j) => a.getComponent(Math.floor(j / 3), j % 3));
    const position = geometry.getAttribute("position") as THREE.BufferAttribute;
    const target = evenBarTargets(
      xyz(position),
      xyz(geometry.getAttribute("_target_pos") as THREE.BufferAttribute),
      mobileCount(position.count),
    );
    geometry.setAttribute("targetPos", new THREE.BufferAttribute(target, 2));
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uScanY: { value: 0 },
        uMorph: { value: 0 },
        uScatter: { value: 0 },
        uSize: { value: 2 },
        uChartRect: { value: new THREE.Vector4() },
        uData: { value: cssColor("--data") },
        uScan: { value: cssColor("--scan") },
      },
    });
    const cloud = new THREE.Points(geometry, material);
    cloud.frustumCulled = false; // 차트 단계의 위치는 셰이더가 화면 좌표로 정한다
    return cloud;
  }, [gltf]);

  // 모바일: 점 1/3
  useEffect(() => {
    const mobile = size.width < MOBILE_WIDTH;
    const count = points.geometry.getAttribute("position").count;
    points.geometry.setDrawRange(0, mobile ? mobileCount(count) : count);
    const u = (points.material as THREE.ShaderMaterial).uniforms;
    u.uSize.value = (mobile ? 2.5 : 2) * viewport.dpr;
  }, [points, size, viewport.dpr]);

  useFrame(() => {
    const u = (points.material as THREE.ShaderMaterial).uniforms;
    u.uScanY.value = frame.current.scanY;
    u.uMorph.value = frame.current.morph;
    u.uScatter.value = frame.current.scatter;
    // 카운터를 아직 못 쟀으면 화면 아래 절반
    const box = chartBox.current ?? { left: size.width * 0.08, right: size.width * 0.92, top: size.height * 0.5 };
    const top = Math.min(box.top, size.height * (CHART_BOTTOM - 0.15));
    const ndcX = (px: number) => (px / size.width) * 2 - 1;
    const ndcY = (px: number) => 1 - (px / size.height) * 2;
    u.uChartRect.value.set(ndcX(box.left), ndcY(size.height * CHART_BOTTOM), ndcX(box.right), ndcY(top));
  });

  return <primitive object={points} />;
}

export default function HeroCanvas({
  frame,
  chartBox,
  cameras,
}: {
  frame: RefObject<HeroFrame>;
  chartBox: RefObject<ChartBox | null>;
  cameras: CameraFile["cameras"];
}) {
  return (
    <Canvas
      dpr={[1, typeof window !== "undefined" && window.innerWidth < MOBILE_WIDTH ? 1.5 : 2]}
      gl={{ antialias: false, alpha: true }}
      className="!absolute inset-0"
      aria-hidden
    >
      <CameraRig cameras={cameras} />
      <PointCloud frame={frame} chartBox={chartBox} />
    </Canvas>
  );
}

export type { CameraFile, ChartBox };
