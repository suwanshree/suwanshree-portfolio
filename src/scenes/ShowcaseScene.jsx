import * as THREE from "three";
import { MeshReflectorMaterial } from "@react-three/drei";
import {
  RigidBody,
  CuboidCollider,
  CylinderCollider,
} from "@react-three/rapier";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import SpaceShip from "../../public/models/SpaceShip";

// -------------------------
// 🔧 GLOBAL SCENE CONTROLS
// -------------------------
const GROUND_Y = 0;

const BUILDING_RADIUS = 14;
const BUILDING_HEIGHT = 6;

const PLAZA_RADIUS = BUILDING_RADIUS + 6;

const PATH_LENGTH = 32;
const PATH_WIDTH = 4;

const RAIL_HEIGHT = 1.1;
const RAIL_THICKNESS = 0.11;

const DOOR_WIDTH = Math.PI / 6;
const DOOR_ANGLE = Math.PI;
// -------------------------

export default function ShowcaseScene() {
  const shipRef = useRef();

  useFrame((_, delta) => {
    if (shipRef.current) {
      shipRef.current.rotation.y += delta * 0.25;
    }
  });
  return (
    <>
      {/* 🌑 CIRCULAR PLAZA GROUND */}
      <RigidBody type="fixed" colliders={false}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, GROUND_Y - 0.01, 0]}
          receiveShadow
        >
          <circleGeometry args={[PLAZA_RADIUS, 128]} />
          <MeshReflectorMaterial
            blur={[400, 40]}
            resolution={2048}
            mixBlur={1}
            mixStrength={0.7}
            roughness={1}
            metalness={0.25}
            depthScale={0.015}
            color="#0b0b0f"
          />
        </mesh>

        <CylinderCollider
          args={[0.05, PLAZA_RADIUS]}
          position={[0, GROUND_Y - 0.05, 0]}
        />
      </RigidBody>

      {/* 🚶 ENTRY WALKING PATH */}
      <RigidBody type="fixed" colliders={false}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, GROUND_Y, -PATH_LENGTH - 3.8]}
          receiveShadow
        >
          <planeGeometry args={[PATH_WIDTH, PATH_LENGTH]} />
          <meshStandardMaterial
            color="#020617"
            roughness={0.85}
            metalness={0.2}
          />
        </mesh>

        <CuboidCollider
          args={[PATH_WIDTH / 2, 0.05, PATH_LENGTH / 2]}
          position={[0, GROUND_Y - 0.05, PLAZA_RADIUS + PATH_LENGTH / 2]}
        />
      </RigidBody>

      {/* 🛑 PATH GUARDRAILS */}
      {/* {[-PATH_WIDTH / 2, PATH_WIDTH / 2].map((x, i) => (
        <RigidBody key={i} type="fixed" colliders={false}>
          <mesh position={[x, GROUND_Y + RAIL_HEIGHT / 7, PLAZA_RADIUS - 55.8]}>
            <boxGeometry args={[RAIL_THICKNESS, RAIL_HEIGHT, PATH_LENGTH]} />
            <meshStandardMaterial color="#111827" />
          </mesh>

          <CuboidCollider
            args={[RAIL_THICKNESS / 2, RAIL_HEIGHT / 2, PATH_LENGTH / 2]}
            position={[
              x,
              GROUND_Y + RAIL_HEIGHT / 2,
              PLAZA_RADIUS + PATH_LENGTH / 2,
            ]}
          />
        </RigidBody>
      ))} */}

      {/* 🛑 PLAZA CIRCULAR GUARDRAIL */}
      {/* <RigidBody type="fixed" colliders={false}>
        <mesh
          position={[0, GROUND_Y + RAIL_HEIGHT / 2, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[PLAZA_RADIUS, RAIL_THICKNESS / 2, 16, 256]} />
          <meshStandardMaterial color="#111827" />
        </mesh>

        <CylinderCollider
          args={[RAIL_HEIGHT / 2, PLAZA_RADIUS]}
          position={[0, GROUND_Y + RAIL_HEIGHT / 2, 0]}
        />
      </RigidBody> */}

      {/* 🏛️ GLASS SHOWROOM STRUCTURE */}
      <group>
        {/* Outer glass wall */}
        <RigidBody type="fixed" colliders={false}>
          <mesh position={[0, GROUND_Y + BUILDING_HEIGHT / 2, 0]}>
            <cylinderGeometry
              args={[
                BUILDING_RADIUS,
                BUILDING_RADIUS,
                BUILDING_HEIGHT,
                128,
                1,
                true,
                DOOR_ANGLE + DOOR_WIDTH / 2,
                Math.PI * 2 - DOOR_WIDTH,
              ]}
            />
            <meshPhysicalMaterial
              transmission={1}
              thickness={0.35}
              roughness={0}
              ior={1.5}
              color="#dbeafe"
              side={THREE.DoubleSide}
            />
          </mesh>

          <CylinderCollider
            args={[BUILDING_HEIGHT / 2, BUILDING_RADIUS]}
            position={[0, GROUND_Y + BUILDING_HEIGHT / 2, 0]}
          />
        </RigidBody>

        {/* Inner glass wall */}
        <mesh position={[0, GROUND_Y + BUILDING_HEIGHT / 2, 0]}>
          <cylinderGeometry
            args={[
              BUILDING_RADIUS - 0.18,
              BUILDING_RADIUS - 0.18,
              BUILDING_HEIGHT,
              128,
              1,
              true,
              DOOR_ANGLE + DOOR_WIDTH / 2,
              Math.PI * 2 - DOOR_WIDTH,
            ]}
          />
          <meshPhysicalMaterial
            transmission={1}
            thickness={0.35}
            roughness={0}
            ior={1.5}
            color="#dbeafe"
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Entrance Pillars */}
        {[-DOOR_WIDTH / 2, DOOR_WIDTH / 2].map((offset, i) => {
          const x = Math.sin(DOOR_ANGLE + offset) * BUILDING_RADIUS;
          const z = Math.cos(DOOR_ANGLE + offset) * BUILDING_RADIUS;

          const pillarHeight = BUILDING_HEIGHT - 0.3;
          const pillarY = GROUND_Y + pillarHeight / 2;

          return (
            <RigidBody key={i} type="fixed" colliders="cuboid">
              <mesh position={[x, pillarY, z]}>
                <cylinderGeometry args={[0.3, 0.3, pillarHeight, 24]} />
                <meshStandardMaterial
                  color="#0f172a"
                  metalness={0.4}
                  roughness={0.35}
                />
              </mesh>
            </RigidBody>
          );
        })}

        {/* Roof rim */}
        <mesh
          position={[0, GROUND_Y + BUILDING_HEIGHT, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <torusGeometry args={[BUILDING_RADIUS, 0.25, 32, 128]} />
          <meshStandardMaterial
            color="#111827"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* LED Light Strip 1 */}
        <mesh
          position={[0, GROUND_Y + BUILDING_HEIGHT - 0.15, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[BUILDING_RADIUS - 12.4, 0.05, 8, 128]} />
          <meshStandardMaterial
            color="#4fd1ff"
            emissive="#4fd1ff"
            emissiveIntensity={1.2}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>

        {/* LED Light Strip 2 */}
        <mesh
          position={[0, GROUND_Y + BUILDING_HEIGHT - 0.15, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[BUILDING_RADIUS - 20, 0.05, 8, 128]} />
          <meshStandardMaterial
            color="#4fd1ff"
            emissive="#4fd1ff"
            emissiveIntensity={1.2}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>

        {/* LED Light Strip 3 */}
        <mesh
          position={[0, GROUND_Y + BUILDING_HEIGHT - 0.15, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[BUILDING_RADIUS - 4, 0.05, 8, 128]} />
          <meshStandardMaterial
            color="#4fd1ff"
            emissive="#4fd1ff"
            emissiveIntensity={1.2}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>

        {/* LED Light Strip 4 */}
        <mesh
          position={[0, GROUND_Y + BUILDING_HEIGHT - 0.15, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[BUILDING_RADIUS - 0.4, 0.05, 8, 128]} />
          <meshStandardMaterial
            color="#4fd1ff"
            emissive="#4fd1ff"
            emissiveIntensity={1.2}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>

        {/* Ceiling fill */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, GROUND_Y + BUILDING_HEIGHT - 0.02, 0]}
          receiveShadow
        >
          <circleGeometry args={[BUILDING_RADIUS, 64]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.3}
            roughness={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 🧱 Central Structural Pillar */}
      <mesh position={[0, GROUND_Y + (BUILDING_HEIGHT + 2.5) / 2, 0]}>
        <cylinderGeometry args={[1.6, 1.6, BUILDING_HEIGHT + 3.4, 48]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>

      {/* 🛸 Hero platform */}
      <mesh position={[0, GROUND_Y + BUILDING_HEIGHT + 2.9, 0]}>
        <cylinderGeometry args={[3.5, 3.5, 0.3, 64]} />
        <meshStandardMaterial color="#020617" metalness={0.6} roughness={0.2} />
      </mesh>

      <group ref={shipRef} position={[0, 9.65, 0]}>
        <axesHelper args={[2]} />

        <group position={[3, 0, 1]}>
          <SpaceShip scale={1} />
        </group>
      </group>

      {/* ----------------------------- */}
      {/* 🚧 FUTURE CONTENT */}
      {/* ----------------------------- */}

      {/*
      Pedestals go here
      Video walls go here
      Player collider goes here
      */}
    </>
  );
}
