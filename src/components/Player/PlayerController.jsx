import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei/core/PointerLockControls"; // <-- FIXED
import * as THREE from "three";
import useKeyboardControls from "./useKeyboardControls";

export default function PlayerController() {
  const controlsRef = useRef();
  const { camera } = useThree();
  const keys = useKeyboardControls();

  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const speed = 4;

  useFrame((_, delta) => {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    direction.current.set(0, 0, 0);
    if (keys.forward) direction.current.add(forward);
    if (keys.backward) direction.current.sub(forward);
    if (keys.left) direction.current.sub(right);
    if (keys.right) direction.current.add(right);

    if (direction.current.lengthSq() > 0) {
      direction.current.normalize();
      velocity.current.copy(direction.current).multiplyScalar(speed * delta);
      camera.position.add(velocity.current);
    }
  });

  return <PointerLockControls ref={controlsRef} />;
}
