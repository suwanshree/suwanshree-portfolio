import { useGLTF } from "@react-three/drei";

export default function SpaceShip(props) {
  const { scene } = useGLTF(
    "/models/spaceShipModel/FluxAfterburn_animationFinal.gltf"
  );

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/spaceShipModel/FluxAfterburn_animationFinal.gltf");
