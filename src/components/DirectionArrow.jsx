import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function DirectionArrow({ duration = 10000 }) {
  const ref = useRef();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.z = -45 + Math.cos(clock.elapsedTime * 2) * 0.15;
  });

  if (!visible) return null;

  return (
    <mesh ref={ref} position={[-5, 3.3, 45]} rotation={[89.5, Math.PI, 0.1]}>
      <coneGeometry args={[0.3, 0.8, 16]} />
      <meshStandardMaterial
        color="#4fd1ff"
        emissive="#4fd1ff"
        emissiveIntensity={1.2}
      />
    </mesh>
  );
}
