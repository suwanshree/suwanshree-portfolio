import { useGLTF } from "@react-three/drei";

export default function SagaV(props) {
  const { scene } = useGLTF("/models/sagaV/Bottle_Shape_032_Full.gltf");

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/sagaV/Bottle_Shape_032_Full.gltf");
