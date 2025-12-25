import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";
import useKeyboardControls from "./useKeyboardControls";

export default function PlayerController({ enabled, onReady }) {
  const bodyRef = useRef();
  const controlsRef = useRef();
  const { camera } = useThree();
  const keys = useKeyboardControls();

  const SPEED = 10;
  const PLAYER_HEIGHT = 1.6;

  /* 🎯 CLEAN INITIAL SPAWN */
  useEffect(() => {
    if (!bodyRef.current || !controlsRef.current) return;
    const START_POS = { x: 0, y: 1.6, z: -50 };
    bodyRef.current.setTranslation(START_POS, false);
    bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, false);
    bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, false);
    bodyRef.current.setEnabledTranslations(true, false, true);
    const obj = controlsRef.current.getObject();
    obj.rotation.set(0, Math.PI, 0);
    requestAnimationFrame(() => {
      bodyRef.current.setEnabledTranslations(true, true, true);
      onReady?.();
    });
  }, [onReady]);

  useFrame(() => {
    if (!bodyRef.current) return;

    /* Camera follows rigid body */
    const pos = bodyRef.current.translation();
    camera.position.set(pos.x, pos.y + 1.5, pos.z);

    /* Movement vectors */
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3()
      .crossVectors(forward, camera.up)
      .normalize();

    const moveDir = new THREE.Vector3();
    if (keys.forward) moveDir.add(forward);
    if (keys.backward) moveDir.sub(forward);
    if (keys.left) moveDir.sub(right);
    if (keys.right) moveDir.add(right);

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize().multiplyScalar(SPEED);
    }

    /* Preserve gravity */
    const velocity = bodyRef.current.linvel();

    bodyRef.current.setLinvel(
      {
        x: moveDir.x,
        y: velocity.y,
        z: moveDir.z,
      },
      true
    );
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} enabled={enabled} />

      <RigidBody
        ref={bodyRef}
        colliders={false}
        mass={1}
        type="dynamic"
        enabledRotations={[false, false, false]}
        linearDamping={6}
        friction={1}
      >
        <CapsuleCollider
          args={[PLAYER_HEIGHT / 2, 0.35]}
          position={[0, PLAYER_HEIGHT / 2, 0]}
        />
      </RigidBody>
    </>
  );
}
