import { Joystick } from "react-joystick-component";

export default function MobileJoystick({ onMove, onEnd }) {
  return (
    <div
      className="mobile-joystick"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        width: "120px",
        height: "120px",
        zIndex: 100,
        touchAction: "none",
      }}
    >
      <Joystick
        size={120}
        baseColor="rgba(0, 0, 0, 0.2)"
        stickColor="rgba(255,255,255,0.6)"
        move={(e) => onMove({ x: e.x, y: e.y })}
        stop={onEnd}
      />
    </div>
  );
}
