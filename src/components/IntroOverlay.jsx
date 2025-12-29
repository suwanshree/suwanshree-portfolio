import { isMobile } from "../utils/device";

export default function IntroOverlay({ onStart }) {
  return (
    <div className="intro-overlay">
      <div className="intro-panel">
        <h1>Welcome</h1>
        <h3>3D Portfolio — Suwanshree Acharya</h3>

        {isMobile ? (
          <p>
            <strong>Left joystick</strong> — Move
            <br />
            <strong>Swipe</strong> — Look left / right
            <br />
            <strong>Tap</strong> — Enter experience
          </p>
        ) : (
          <p>
            <strong>W / A / S / D</strong> — Move
            <br />
            <strong>Mouse</strong> — Look around
            <br />
            <strong>Click</strong> — Enter experience
          </p>
        )}

        <button onClick={onStart}>Enter</button>
      </div>
    </div>
  );
}
