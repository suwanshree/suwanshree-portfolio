export default function IntroOverlay({ onStart }) {
  return (
    <div className="intro-overlay">
      <div className="intro-panel">
        <h1>Welcome</h1>
        <h3>3D Portfolio - Suwanshree Acharya</h3>
        <p>
          <strong>W / A / S / D</strong> — Move
          <br />
          <strong>Mouse</strong> — Look around
          <br />
          <strong>Click</strong> — Enter experience
        </p>

        <button onClick={onStart}>Enter</button>
      </div>
    </div>
  );
}
