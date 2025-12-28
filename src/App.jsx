import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Loader } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import Lights from "./components/Lights";
import PlayerController from "./components/Player/PlayerController";
import ShowcaseScene from "./scenes/ShowcaseScene";
import IntroOverlay from "./components/IntroOverlay";

import "./styles/globals.css";
import DirectionArrow from "./components/DirectionArrow";
import MovementHint from "./components/MovementHint";
import MobileJoystick from "./components/Controls/MobileJoystick";
import { isMobile } from "./utils/device";

export default function App() {
  const [started, setStarted] = useState(
    () => localStorage.getItem("started") === "true"
  );
  const [playerReady, setPlayerReady] = useState(false);

  const [joystick, setJoystick] = useState({ x: 0, y: 0 });

  const startExperience = () => {
    localStorage.setItem("started", "true");
    setStarted(true);
  };

  return (
    <>
      {!started && <IntroOverlay onStart={startExperience} />}

      {isMobile && started && (
        <MobileJoystick
          onMove={(data) => setJoystick(data)}
          onEnd={() => setJoystick({ x: 0, y: 0 })}
        />
      )}

      <Canvas
        shadows
        camera={{ fov: 70 }}
        gl={{ antialias: true, physicallyCorrectLights: true }}
        style={{ height: "100vh", width: "100vw" }}
      >
        {started && <MovementHint />}
        <Suspense fallback={null}>
          <Environment
            files="/textures/hdr/citrus_orchard_road_puresky_4k.hdr"
            background
          />
          <Lights />
          <Physics gravity={[0, -9.81, 0]}>
            <PlayerController
              enabled={started}
              onReady={() => setPlayerReady(true)}
              joystick={joystick}
            />
            {playerReady && <ShowcaseScene />}
            {playerReady && started && <DirectionArrow />}
          </Physics>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
