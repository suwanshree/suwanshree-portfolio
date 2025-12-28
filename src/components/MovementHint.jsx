import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { isMobile } from "../utils/device";

export default function MovementHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isMobile) return;

    const onKey = (e) => {
      if (["w", "a", "s", "d"].includes(e.key.toLowerCase())) {
        setVisible(false);
        window.removeEventListener("keydown", onKey);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!visible || isMobile) return null;

  return (
    <Html>
      <div className="movement-hint">
        Press <span>W</span> to move
      </div>
    </Html>
  );
}
