import * as THREE from "three";
import { MeshReflectorMaterial } from "@react-three/drei";
import {
  RigidBody,
  CuboidCollider,
  CylinderCollider,
} from "@react-three/rapier";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import SpaceShip from "/public/models/SpaceShip";
import Showcase from "../components/Showcase";
import AnimatedSpaceship from "../../public/models/AnimatedSpaceship";
import SagaV from "../../public/models/SagaV";

// -------------------------
// 🔧 GLOBAL SCENE CONTROLS
// -------------------------
const GROUND_Y = 0;

const BUILDING_RADIUS = 14;
const BUILDING_HEIGHT = 6;

const PLAZA_RADIUS = BUILDING_RADIUS + 6;

const PATH_LENGTH = 32;
const PATH_WIDTH = 4;

const RAIL_HEIGHT = 1;
const RAIL_THICKNESS = 0.11;

const DOOR_WIDTH = Math.PI / 6;
const DOOR_ANGLE = Math.PI;

const POLE_RADIUS = 0.1;
const POLE_HEIGHT = 1.2;
const POLE_OFFSET = 0.035;
const PATH_CENTER_Z = -PLAZA_RADIUS - PATH_LENGTH / 2 + 0.2;

const PATH_LED_WIDTH = 0.06;
const PATH_LED_HEIGHT = 0.02;
const PATH_LED_INSET = 0.25;

const SUPPORT_SEGMENTS = 26;
const SUPPORT_HEIGHT = 120;
const SUPPORT_START_RADIUS = PLAZA_RADIUS;
const SUPPORT_END_RADIUS = 4;
const SUPPORT_TWIST = Math.PI * 0.9;

const STRUT_COUNT = 25;
const STRUT_HEIGHT = 0.5;
const STRUT_THICKNESS = 2;
const STRUT_DROP = 15;

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
          position={[0, GROUND_Y + 0.02, 0]}
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

        {/* Thin visual depth skirt */}
        <mesh position={[0, GROUND_Y - 0.12, 0]} receiveShadow>
          <cylinderGeometry args={[PLAZA_RADIUS, PLAZA_RADIUS, 0.25, 128]} />
          <meshStandardMaterial color="#07070a" roughness={1} metalness={0} />
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
          position={[0, GROUND_Y - 0.1, -PLAZA_RADIUS - PATH_LENGTH / 2 + 0.2]}
          receiveShadow
        >
          <boxGeometry args={[PATH_WIDTH, PATH_LENGTH, 0.2]} />
          <meshStandardMaterial
            color="#07070a"
            roughness={0.85}
            metalness={0.2}
          />
        </mesh>

        <CuboidCollider
          args={[PATH_WIDTH / 2, 0.05, PATH_LENGTH / 2]}
          position={[0, GROUND_Y - 0.05, -PLAZA_RADIUS - PATH_LENGTH / 2 + 0.2]}
        />
      </RigidBody>

      {/* 🏗️ PATH → MEGA PILLAR SUPPORT STRUTS with LEDs */}
      <group>
        {Array.from({ length: STRUT_COUNT }).map((_, i) => {
          const t = i / (STRUT_COUNT - 1);

          // Spread struts along the path length
          const z = -PLAZA_RADIUS - PATH_LENGTH * (0.25 + t * 0.7) + 0.2;

          // Start under path, aim toward pillar center
          const start = new THREE.Vector3(0, GROUND_Y - 0.25, z);
          const end = new THREE.Vector3(0, GROUND_Y - STRUT_DROP, 0);

          const dir = new THREE.Vector3().subVectors(end, start);
          const length = dir.length();

          const mid = start.clone().add(dir.multiplyScalar(0.5));

          // Rotation to aim the strut
          const quat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            dir.clone().normalize()
          );

          return (
            <group key={i} position={mid} quaternion={quat}>
              {/* Main strut */}
              <mesh receiveShadow castShadow>
                <boxGeometry args={[STRUT_THICKNESS, length, STRUT_HEIGHT]} />
                <meshStandardMaterial
                  color="#020617"
                  metalness={0.6}
                  roughness={0.35}
                />
              </mesh>

              {/* LED accent strip */}
              <mesh position={[0, length / 2 + 0.01, 0]}>
                <boxGeometry
                  args={[STRUT_THICKNESS * 0.6, 0.05, STRUT_HEIGHT * 0.6]}
                />
                <meshStandardMaterial
                  color="#4fd1ff"
                  emissive="#4fd1ff"
                  emissiveIntensity={1.5}
                  metalness={0.5}
                  roughness={0.1}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 🛑 PATH GUARDRAILS */}
      {[-PATH_WIDTH / 2, PATH_WIDTH / 2].map((x, i) => (
        <RigidBody key={i} type="fixed" colliders={false}>
          {/* Top bar */}
          <mesh
            position={[
              x,
              GROUND_Y + RAIL_HEIGHT - 0.08,
              -PLAZA_RADIUS - PATH_LENGTH / 2 + 0.2,
            ]}
          >
            <boxGeometry args={[RAIL_THICKNESS, 0.15, PATH_LENGTH]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.6}
              roughness={0.35}
            />
          </mesh>

          {/* Glass panel */}
          <mesh
            position={[
              x,
              GROUND_Y + (RAIL_HEIGHT - 0.15) / 2,
              -PLAZA_RADIUS - PATH_LENGTH / 2 + 0.15,
            ]}
          >
            <boxGeometry args={[0.03, RAIL_HEIGHT - 0.2, PATH_LENGTH]} />
            <meshPhysicalMaterial
              transmission={1}
              thickness={0.15}
              roughness={0}
              ior={1.45}
              color="#dbeafe"
            />
          </mesh>

          <CuboidCollider
            args={[RAIL_THICKNESS / 2, RAIL_HEIGHT / 2, PATH_LENGTH / 2]}
            position={[
              x,
              GROUND_Y + RAIL_HEIGHT / 2,
              -PLAZA_RADIUS - PATH_LENGTH / 2 + 0.2,
            ]}
          />
        </RigidBody>
      ))}

      {/* 🛑 PATH END GUARDRAIL */}
      <RigidBody type="fixed" colliders={false}>
        {/* Top bar */}
        <mesh
          position={[
            0,
            GROUND_Y + RAIL_HEIGHT - 0.08,
            -PLAZA_RADIUS - PATH_LENGTH + RAIL_THICKNESS / 2 + 0.2,
          ]}
        >
          <boxGeometry args={[PATH_WIDTH + 0.1, 0.15, RAIL_THICKNESS]} />
          <meshStandardMaterial
            color="#111827"
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>

        {/* Glass panel */}
        <mesh
          position={[
            0,
            GROUND_Y + (RAIL_HEIGHT - 0.15) / 2,
            -PLAZA_RADIUS - PATH_LENGTH + 0.15,
          ]}
        >
          <boxGeometry args={[PATH_WIDTH + 0.1, RAIL_HEIGHT - 0.1, 0.03]} />
          <meshPhysicalMaterial
            transmission={1}
            thickness={0.15}
            roughness={0}
            ior={1.45}
            color="#dbeafe"
          />
        </mesh>

        <CuboidCollider
          args={[PATH_WIDTH / 2, RAIL_HEIGHT / 2, RAIL_THICKNESS / 2]}
          position={[
            0,
            GROUND_Y + RAIL_HEIGHT / 2,
            -PLAZA_RADIUS - PATH_LENGTH + RAIL_THICKNESS / 2,
          ]}
        />
      </RigidBody>

      {/* 🪵 PATH CORNER POLES */}
      {[
        // Front-left
        [
          -PATH_WIDTH / 2 + POLE_OFFSET,
          PATH_CENTER_Z + PATH_LENGTH / 2 - POLE_OFFSET,
        ],
        // Front-right
        [
          PATH_WIDTH / 2 - POLE_OFFSET,
          PATH_CENTER_Z + PATH_LENGTH / 2 - POLE_OFFSET,
        ],
        // Back-left
        [
          -PATH_WIDTH / 2 + POLE_OFFSET,
          PATH_CENTER_Z - PATH_LENGTH / 2 + POLE_OFFSET,
        ],
        // Back-right
        [
          PATH_WIDTH / 2 - POLE_OFFSET,
          PATH_CENTER_Z - PATH_LENGTH / 2 + POLE_OFFSET,
        ],
      ].map(([x, z], i) => (
        <RigidBody key={i} type="fixed" colliders={false}>
          {/* Pole mesh */}
          <mesh
            position={[x, GROUND_Y + POLE_HEIGHT / 2, z]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry
              args={[POLE_RADIUS, POLE_RADIUS, POLE_HEIGHT, 24]}
            />
            <meshStandardMaterial
              color="#111827"
              metalness={0.7}
              roughness={0.35}
            />
          </mesh>

          <mesh position={[x, GROUND_Y + POLE_HEIGHT + 0.04, z]}>
            <sphereGeometry args={[POLE_RADIUS * 1.1, 16, 16]} />
          </mesh>

          {/* Pole collider */}
          <CylinderCollider
            args={[POLE_HEIGHT / 2, POLE_RADIUS]}
            position={[x, GROUND_Y + POLE_HEIGHT / 2, z]}
          />
        </RigidBody>
      ))}

      {/* 🛑 PLAZA CIRCULAR GUARDRAIL */}
      <RigidBody type="fixed" colliders={false}>
        {/* Top metal rail */}
        <mesh
          position={[0, GROUND_Y + RAIL_HEIGHT - 0.1, 0]}
          rotation={[Math.PI / 2, 0, 36.23]}
        >
          <torusGeometry
            args={[
              PLAZA_RADIUS,
              RAIL_THICKNESS / 2,
              16,
              256,
              Math.PI * 2 - DOOR_WIDTH + 0.32,
            ]}
          />
          <meshStandardMaterial
            color="#111827"
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>

        {/* Glass wall under rail */}
        <mesh position={[0, GROUND_Y + (RAIL_HEIGHT - 0.15) / 2, 0]}>
          <cylinderGeometry
            args={[
              PLAZA_RADIUS - 0.03,
              PLAZA_RADIUS - 0.03,
              RAIL_HEIGHT - 0.15,
              128,
              1,
              true,
              15.81,
              Math.PI * 2 - DOOR_WIDTH + 0.32,
            ]}
          />
          w
          <meshPhysicalMaterial
            transmission={1}
            thickness={0.2}
            roughness={0}
            ior={1.45}
            color="#dbeafe"
            side={THREE.DoubleSide}
          />
        </mesh>

        {Array.from({ length: 20 }).map((_, i) => {
          const arc = Math.PI * 2 - DOOR_WIDTH + 0.32;

          const angle = 36.23 + (i / 20) * arc + arc / 40;

          const x = Math.cos(angle) * PLAZA_RADIUS;
          const z = Math.sin(angle) * PLAZA_RADIUS;

          return (
            <RigidBody key={i} type="fixed">
              <CuboidCollider
                args={[
                  RAIL_THICKNESS / 2,
                  RAIL_HEIGHT / 2,
                  (PLAZA_RADIUS * arc) / 20 / 2,
                ]}
                position={[x, GROUND_Y + RAIL_HEIGHT - 0.1, z]}
                rotation={[0, -angle, 0]}
              />
            </RigidBody>
          );
        })}
      </RigidBody>

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

          {/* 🧱 GLASS SHOWROOM COLLIDERS */}
          {Array.from({ length: 32 }).map((_, i) => {
            const arc = Math.PI * 2 - DOOR_WIDTH;
            const segmentCount = 32;
            const segmentArc = arc / segmentCount;

            // center each segment
            const angle =
              DOOR_ANGLE +
              DOOR_WIDTH / 2 +
              i * segmentArc +
              segmentArc / 2 +
              Math.PI / 2;

            const x = Math.cos(angle) * BUILDING_RADIUS;
            const z = Math.sin(angle) * BUILDING_RADIUS;

            return (
              <RigidBody key={i} type="fixed">
                <CuboidCollider
                  args={[
                    0.18,
                    BUILDING_HEIGHT / 2,
                    (BUILDING_RADIUS * segmentArc) / 2 + 0.05,
                  ]}
                  position={[x, GROUND_Y + BUILDING_HEIGHT / 2, z]}
                  rotation={[0, -angle, 0]}
                />
              </RigidBody>
            );
          })}
        </RigidBody>

        {/* Inner glass wall */}
        <RigidBody type="fixed" colliders={false}>
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
        </RigidBody>
      </group>

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
        <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.3} />
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

      {/* LED Light Strip 5 */}
      <mesh position={[0, GROUND_Y - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[PLAZA_RADIUS - 0.18, 0.05, 8, 128]} />
        <meshStandardMaterial
          color="#4fd1ff"
          emissive="#4fd1ff"
          emissiveIntensity={1.2}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* LED Light Strip 5 */}
      <mesh position={[0, GROUND_Y - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[BUILDING_RADIUS - 0.32, 0.05, 8, 128]} />
        <meshStandardMaterial
          color="#4fd1ff"
          emissive="#4fd1ff"
          emissiveIntensity={1.2}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* 🔵 PATH GROUND LED STRIPS */}
      {[-1, 1].map((side, i) => (
        <mesh
          key={i}
          position={[
            side * (PATH_WIDTH / 2 - PATH_LED_INSET),
            GROUND_Y + PATH_LED_HEIGHT / 2 + 0.005,
            -PLAZA_RADIUS - PATH_LENGTH / 2 + 0.23,
          ]}
          receiveShadow={false}
          castShadow={false}
        >
          <boxGeometry
            args={[PATH_LED_WIDTH, PATH_LED_HEIGHT, PATH_LENGTH + 0.07]}
          />
          <meshStandardMaterial
            color="#4fd1ff"
            emissive="#4fd1ff"
            emissiveIntensity={1.1}
            metalness={0.4}
            roughness={0.15}
          />
        </mesh>
      ))}

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

      {/* 🧱 Central Structural Pillar */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, GROUND_Y + (BUILDING_HEIGHT + 3.4) / 2, 0]}>
          <cylinderGeometry args={[1.6, 1.6, BUILDING_HEIGHT + 3.4, 48]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.4}
            roughness={0.35}
          />
        </mesh>

        <CylinderCollider
          args={[(BUILDING_HEIGHT + 3.4) / 2, 1.6]}
          position={[0, GROUND_Y + (BUILDING_HEIGHT + 3.4) / 2, 0]}
        />
      </RigidBody>

      {/* 🛸 Hero platform */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, GROUND_Y + BUILDING_HEIGHT + 2.9, 0]}>
          <cylinderGeometry args={[3.5, 3.5, 0.3, 64]} />
          <meshStandardMaterial
            color="#020617"
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>

        <CylinderCollider
          args={[0.15, 3.5]}
          position={[0, GROUND_Y + BUILDING_HEIGHT + 2.9, 0]}
        />
      </RigidBody>

      {/* 🚀 SPACESHIP */}
      <group ref={shipRef} position={[0, 9.65, 0]}>
        <group position={[3, 0, 1]}>
          <SpaceShip scale={1} />
        </group>
      </group>

      {/* 🏗️ MEGA SUPPORT PILLAR */}
      <group position={[0, GROUND_Y, 0]}>
        {Array.from({ length: SUPPORT_SEGMENTS }).map((_, i) => {
          const t = i / (SUPPORT_SEGMENTS - 1);

          const radius =
            SUPPORT_START_RADIUS * (1 - t) + SUPPORT_END_RADIUS * t;

          const height = SUPPORT_HEIGHT / SUPPORT_SEGMENTS;
          const y = -t * SUPPORT_HEIGHT - height / 2;

          const twist = t * SUPPORT_TWIST;

          return (
            <mesh
              key={i}
              position={[0, y, 0]}
              rotation={[0, twist, 0]}
              receiveShadow
              castShadow
            >
              <cylinderGeometry
                args={[radius, radius * 0.92, height, 64, 1, true]}
              />
              <meshStandardMaterial
                color="#020617"
                metalness={0.55}
                roughness={0.35}
              />
            </mesh>
          );
        })}
      </group>

      {/* SHOWCASE */}
      <Showcase
        position={[-6.8, 0, -9.8]}
        rotation={[0, 44.7, 0]}
        title="Flux Afterburn: 3D Animation Sequence"
        description="On Flux Afterburn, I shaped a concise narrative through concept sketches and storyboards, grounding tone and pacing with targeted visual references. I then built the starship asset from top- and side-view drawings to ensure scene-to-scene continuity. Animation and effects were executed, followed by rendering, compositing, and audio mixing to deliver the finished film."
        centerStand={true}
        modelScale={0.12}
        modelRotation={[0, Math.PI / 2, 0]}
        modelPosition={[-3, 1.6, -0.7]}
        media={{
          type: "youtube",
          src: "https://youtu.be/yynJ9WZEkGM",
        }}
      >
        <AnimatedSpaceship />
      </Showcase>

      <Showcase
        position={[0, 0, -3.1]}
        rotation={[0, Math.PI, 0]}
        title="SagaV: Designing the Pour"
        description="Saga V is a premium mocktail brand designed to deliver a high-end experience through cohesive brand identity, packaging, and storytelling. As lead for 3D mockups, I used Autodesk Maya to design and render bottle prototypes, and finalized on tarot-inspired round bottle featuring textured glass for grip and elegance, aligning with the brand’s premium vision while ensuring functionality."
        centerStand={false}
        modelScale={0.018}
        modelRotation={[0, Math.PI / 6, 0]}
        modelPosition={[-3.1, 1.4, -0.5]}
        media={{
          type: "image",
          src: "/public/images/sagaV-reveal.jpg",
        }}
      >
        <SagaV />
      </Showcase>
    </>
  );
}
