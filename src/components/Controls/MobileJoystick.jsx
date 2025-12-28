import { Joystick } from "react-joystick-component";

export default function MobileJoystick({ onMove, onEnd }) {
  return (
    <div className="mobile-joystick">
      <Joystick
        size={120}
        baseColor="rgba(255,255,255,0.2)"
        stickColor="rgba(255,255,255,0.6)"
        move={(e) => onMove({ x: e.x, y: e.y })}
        stop={onEnd}
      />
    </div>
  );
}
