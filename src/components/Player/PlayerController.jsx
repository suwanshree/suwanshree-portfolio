import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";
import useKeyboardControls from "./useKeyboardControls";
import { isMobile } from "../../utils/device";

export default function PlayerController({ enabled, onReady, joystick }) {
  const bodyRef = useRef();
  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const keys = useKeyboardControls();

  const yaw = useRef(0);

  const SPEED = 10;
  const PLAYER_HEIGHT = 1.6;
  const LOOK_SENSITIVITY = 0.004;

  /* 🎯 CLEAN INITIAL SPAWN */
  useEffect(() => {
    if (!bodyRef.current) return;

    const START_POS = { x: 0, y: 1.6, z: -50 };
    bodyRef.current.setTranslation(START_POS, false);
    bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, false);
    bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, false);

    if (!isMobile && controlsRef.current) {
      controlsRef.current.getObject().rotation.set(0, Math.PI, 0);
    }

    if (isMobile) {
      yaw.current = Math.PI;
      camera.rotation.set(0, yaw.current, 0);
    }

    onReady?.();
  }, [camera, onReady]);

  /* 📱 MOBILE LOOK — YAW ONLY */
  useEffect(() => {
    if (!isMobile) return;

    let lastX = null;

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (!touch) return;

      if (lastX !== null) {
        const dx = touch.clientX - lastX;

        yaw.current -= dx * LOOK_SENSITIVITY;

        camera.rotation.order = "YXZ";
        camera.rotation.y = yaw.current;
        camera.rotation.x = 0;
        camera.rotation.z = 0;
      }

      lastX = touch.clientX;
    };

    const onTouchEnd = () => {
      lastX = null;
    };

    gl.domElement.addEventListener("touchmove", onTouchMove, { passive: true });
    gl.domElement.addEventListener("touchend", onTouchEnd);

    return () => {
      gl.domElement.removeEventListener("touchmove", onTouchMove);
      gl.domElement.removeEventListener("touchend", onTouchEnd);
    };
  }, [camera, gl]);

  useFrame(() => {
    if (!bodyRef.current) return;

    const pos = bodyRef.current.translation();
    camera.position.set(pos.x, pos.y + 1.5, pos.z);

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3()
      .crossVectors(forward, new THREE.Vector3(0, 1, 0))
      .normalize();

    const moveDir = new THREE.Vector3();

    // Desktop keyboard
    if (!isMobile) {
      if (keys.forward) moveDir.add(forward);
      if (keys.backward) moveDir.sub(forward);
      if (keys.left) moveDir.sub(right);
      if (keys.right) moveDir.add(right);
    }

    // Mobile joystick
    if (isMobile && joystick) {
      moveDir
        .add(forward.clone().multiplyScalar(joystick.y))
        .add(right.clone().multiplyScalar(joystick.x));
    }

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize().multiplyScalar(SPEED);
    }

    const velocity = bodyRef.current.linvel();
    bodyRef.current.setLinvel(
      { x: moveDir.x, y: velocity.y, z: moveDir.z },
      true
    );
  });

  return (
    <>
      {!isMobile && <PointerLockControls ref={controlsRef} enabled={enabled} />}

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
