import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function AnimatedSpaceship(props) {
  const group = useRef();

  const { scene, animations } = useGLTF(
    "/models/animatedSpaceShipModel/FluxAfterburn_animationFinal2.gltf"
  );

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play ALL animations (safe default)
    Object.values(actions).forEach((action) => {
      action.reset().fadeIn(0.5).play();
    });
  }, [actions]);

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  );
}

// Optional but recommended
useGLTF.preload(
  "/models/animatedSpaceShipModel/FluxAfterburn_animationFinal2.gltf"
);
