export default function LobbyScene() {
  return (
    <>
      {/* Floor */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[40, 0.2, 40]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>

      {/* Back wall (for visual) */}
      <mesh position={[0, 4, -19.9]}>
        <boxGeometry args={[40, 8, 0.2]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* A couple of cubes as "exhibits" */}
      <mesh position={[-3, 0.9, -4]} castShadow>
        <boxGeometry args={[2, 1.8, 0.5]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>

      <mesh position={[3, 0.9, -6]} castShadow>
        <boxGeometry args={[2, 1.8, 0.5]} />
        <meshStandardMaterial color="#ffd166" />
      </mesh>

      {/* Ambient decorative lights */}
      <mesh position={[-8, 2.5, -2]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial emissive="#7dd3fc" emissiveIntensity={0.6} />
      </mesh>

      <mesh position={[8, 2.5, -2]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial emissive="#c084fc" emissiveIntensity={0.6} />
      </mesh>
    </>
  );
}
