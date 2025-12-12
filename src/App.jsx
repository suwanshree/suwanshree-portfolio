import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Lights from "./components/Lights";
import PlayerController from "./components/Player/PlayerController";
import LobbyScene from "./scenes/LobbyScene";
import { Environment } from "@react-three/drei";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1.6, 6] }}
        style={{ background: "#111217" }}
      >
        <Suspense fallback={null}>
          <Environment
            files="/textures/hdr/citrus_orchard_road_puresky_4k.hdr"
            background
          />
          <Lights />
          <PlayerController />
          <LobbyScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
