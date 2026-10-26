"use client";
/* eslint-disable react-hooks/immutability -- three.js 카메라·지오메트리·uniform은 프레임마다 직접 바꾸는 것이 정상 사용법 */

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, type RefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import type { HeroFrame } from "../lib/heroTimeline";
import { fragmentShader, vertexShader } from "../lib/shaders";

type CameraParams = { position: number[]; quaternion: number[]; fov_y_degrees: number; near: number; far: number };
type CameraFile = { cameras: { landscape: CameraParams; portrait: CameraParams } };

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

function PointCloud({ frame }: { frame: RefObject<HeroFrame> }) {
  const gltf = useLoader(GLTFLoader, "/models/hero-pointcloud.glb");
  const { size, viewport } = useThree();

  const points = useMemo(() => {
    const source = gltf.scene.getObjectByProperty("type", "Points") as THREE.Points;
    const geometry = source.geometry.clone();
    const target = geometry.getAttribute("_target_pos") as THREE.BufferAttribute;
    geometry.setAttribute("targetPos", target);
    let sumX = 0;
    for (let i = 0; i < target.count; i++) sumX += target.getX(i);
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
        uBarScale: { value: 1 },
        uBarCenterX: { value: sumX / target.count },
        uData: { value: cssColor("--data") },
        uScan: { value: cssColor("--scan") },
      },
    });
    return new THREE.Points(geometry, material);
  }, [gltf]);

  // 모바일: 점 1/3, 막대를 화면 폭에 맞게 좁힘(막대 배치는 데스크톱 카메라 기준)
  useEffect(() => {
    const mobile = size.width < MOBILE_WIDTH;
    const count = points.geometry.getAttribute("position").count;
    points.geometry.setDrawRange(0, mobile ? Math.floor(count / 3) : count);
    const u = (points.material as THREE.ShaderMaterial).uniforms;
    u.uBarScale.value = Math.min(1, (size.width / size.height) / (16 / 9));
    u.uSize.value = (mobile ? 2.5 : 2) * viewport.dpr;
  }, [points, size, viewport.dpr]);

  useFrame(() => {
    const u = (points.material as THREE.ShaderMaterial).uniforms;
    u.uScanY.value = frame.current.scanY;
    u.uMorph.value = frame.current.morph;
    u.uScatter.value = frame.current.scatter;
  });

  return <primitive object={points} />;
}

export default function HeroCanvas({ frame, cameras }: { frame: RefObject<HeroFrame>; cameras: CameraFile["cameras"] }) {
  return (
    <Canvas
      dpr={[1, typeof window !== "undefined" && window.innerWidth < MOBILE_WIDTH ? 1.5 : 2]}
      gl={{ antialias: false, alpha: true }}
      className="!absolute inset-0"
      aria-hidden
    >
      <CameraRig cameras={cameras} />
      <PointCloud frame={frame} />
    </Canvas>
  );
}

export type { CameraFile };
