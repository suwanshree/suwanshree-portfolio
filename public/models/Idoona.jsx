import { useGLTF } from "@react-three/drei";

export default function Idoona(props) {
  const { scene } = useGLTF("/models/Idoona/Infinity_001.gltf");

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/Idoona/Infinity_001.gltf");
