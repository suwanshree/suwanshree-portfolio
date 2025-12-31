import * as THREE from "three";
import { Text, useTexture } from "@react-three/drei";
import {
  RigidBody,
  CuboidCollider,
  CylinderCollider,
} from "@react-three/rapier";
import { useEffect, useMemo } from "react";

function MediaImage({ src }) {
  const texture = useTexture(src);

  return (
    <mesh position={[0, 2.2, -1.04]}>
      <planeGeometry args={[4.1, 2.2]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function MediaVideo({ src }) {
  const video = useMemo(() => {
    const v = document.createElement("video");
    v.src = src;
    v.crossOrigin = "anonymous";
    v.loop = true;
    v.muted = true;
    v.autoplay = true;
    v.playsInline = true;
    return v;
  }, [src]);

  const texture = useMemo(() => {
    const t = new THREE.VideoTexture(video);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [video]);

  useEffect(() => {
    video.play().catch(() => {});
    return () => video.pause();
  }, [video]);

  return (
    <mesh position={[0, 2.2, -1.04]}>
      <planeGeometry args={[4.1, 2.2]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

export default function Showcase({
  /* World placement */
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  /* Model transform controls */
  modelPosition = [-3, 1.5, -0.7],
  modelRotation = [0, 0, 0],
  modelScale = 1,
  /* Optional center stand */
  centerStand = false,
  /* Content */
  title = "Project Title",
  description = "Short project description goes here.",
  media = null,
  /* 3D model */
  children,
}) {
  const hasModel = Boolean(children);

  const resolvedMedia = useMemo(() => {
    if (!media) return null;
    if (media.type === "image") return media;
    if (media.type === "video") return media;
    return null;
  }, [media]);

  return (
    <group position={position} rotation={rotation}>
      {/* 🧱 BACK WALL + MEDIA DISPLAY */}
      <RigidBody type="fixed" colliders={false}>
        {/* Wall */}
        <mesh position={[0, 2.2, -1.2]} receiveShadow>
          <boxGeometry args={[4.5, 2.6, 0.3]} />
          <meshStandardMaterial
            color="#020617"
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>

        {/* 🎥 MEDIA SURFACE */}
        {resolvedMedia?.type === "image" && (
          <MediaImage src={resolvedMedia.src} />
        )}

        {resolvedMedia?.type === "video" && (
          <MediaVideo src={resolvedMedia.src} />
        )}

        {/* Wall collider */}
        <CuboidCollider args={[2.25, 1.3, 0.2]} position={[0, 2.2, -1.2]} />

        {/* Left stand */}
        <mesh position={[-2.1, 1.3, -1.2]}>
          <cylinderGeometry args={[0.08, 0.1, 2.6, 24]} />
          <meshStandardMaterial
            color="#020617"
            roughness={0.35}
            metalness={0.55}
          />
        </mesh>

        <CylinderCollider args={[1.3, 0.1]} position={[-2.1, 1.3, -1.2]} />

        {/* Right stand */}
        <mesh position={[2.1, 1.3, -1.2]}>
          <cylinderGeometry args={[0.08, 0.1, 2.6, 24]} />
          <meshStandardMaterial
            color="#020617"
            roughness={0.35}
            metalness={0.55}
          />
        </mesh>

        <CylinderCollider args={[1.3, 0.1]} position={[2.1, 1.3, -1.2]} />
      </RigidBody>

      {/* 🗿 GLASS PEDESTAL */}
      {hasModel && (
        <RigidBody type="fixed" colliders={false}>
          {/* Visual */}
          <mesh position={[-3, 0.65, -0.3]} receiveShadow>
            <cylinderGeometry args={[0.8, 0.9, 1.3, 64]} />
            <meshPhysicalMaterial
              transmission={1}
              thickness={0.4}
              roughness={0}
              ior={1.5}
              color="#dbeafe"
            />
          </mesh>

          {/* Solid top */}
          <mesh position={[-3, 1.32, -0.3]} receiveShadow>
            <cylinderGeometry args={[0.86, 0.86, 0.12, 64]} />
            <meshStandardMaterial
              color="#020617"
              roughness={0.35}
              metalness={0.6}
            />
          </mesh>

          {/* Collider */}
          <CylinderCollider args={[0.75, 0.9]} position={[-3, 0.65, -0.3]} />
        </RigidBody>
      )}

      {/* Optional center stand */}
      {hasModel && centerStand && (
        <mesh position={[-3, 1.4, -0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 24]} />
          <meshStandardMaterial
            color="#020617"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      )}

      {/* ⭐ PROJECT MODEL */}
      {hasModel && (
        <group
          position={modelPosition}
          rotation={modelRotation}
          scale={modelScale}
        >
          {children}
        </group>
      )}

      {/* 🪄 INFO STAND POLE */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[2.8, 0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
          <meshStandardMaterial
            color="#020617"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        <CylinderCollider args={[0.6, 0.07]} position={[2.8, 0.6, 0]} />
      </RigidBody>

      {/* Hologram panel */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[2.8, 1.7, 0]} rotation={[0, 49.6, 0]}>
          <boxGeometry args={[1.8, 2, 0.02]} />
          <meshStandardMaterial color="#000000" transparent opacity={0.9} />
        </mesh>

        <CuboidCollider
          args={[0.9, 1, 0.06]}
          position={[2.8, 1.7, 0]}
          rotation={[0, 49.6, 0]}
        />
      </RigidBody>

      {/* Hologram outline */}
      <lineSegments position={[2.8, 1.7, 0]} rotation={[0, 49.6, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.8, 2, 0.02)]} />
        <lineBasicMaterial color="#4fd1ff" />
      </lineSegments>

      {/* Title */}
      <Text
        position={[2.8, 2.4, 0.05]}
        rotation={[0, 49.6, 0]}
        fontSize={0.16}
        color="#e5f3ff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.6}
      >
        {title}
      </Text>

      {/* Description */}
      <Text
        position={[2.8, 2.1, 0.05]}
        rotation={[0, 49.6, 0]}
        fontSize={0.09}
        color="#c7d2fe"
        anchorX="center"
        anchorY="top"
        maxWidth={1.6}
        lineHeight={1.3}
      >
        {description}
      </Text>
    </group>
  );
}
