"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function Lantern() {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.3) * 0.25;
      group.current.rotation.x = Math.sin(t * 0.25) * 0.08;
    }
    if (light.current) {
      light.current.intensity = 2.4 + Math.sin(t * 2.2) * 0.25;
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.8}>
      <group ref={group} position={[0, 0, 0]}>
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.06, 32]} />
          <meshStandardMaterial
            color="#3d2f23"
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 1.8, 32, 1, true]} />
          <meshStandardMaterial
            color="#f4d9a8"
            roughness={0.9}
            transparent
            opacity={0.85}
            emissive="#e9a45a"
            emissiveIntensity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.08, 32]} />
          <meshStandardMaterial
            color="#3d2f23"
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
        <mesh position={[0, 0, 0.501]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.35, 0.5]} />
          <meshBasicMaterial color="#2a1f17" transparent opacity={0.55} />
        </mesh>
        <pointLight
          ref={light}
          position={[0, 0, 0]}
          color="#f2b566"
          intensity={2.4}
          distance={6}
        />
      </group>
    </Float>
  );
}

export function LanternCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 4.2], fov: 38 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={0.6} />
      <Suspense fallback={null}>
        <Lantern />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}
