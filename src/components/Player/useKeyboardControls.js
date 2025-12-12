import { useEffect, useState } from "react";

export default function useKeyboardControls() {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          setKeys((k) => ({ ...k, forward: true }));
          break;
        case "KeyS":
        case "ArrowDown":
          setKeys((k) => ({ ...k, backward: true }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setKeys((k) => ({ ...k, left: true }));
          break;
        case "KeyD":
        case "ArrowRight":
          setKeys((k) => ({ ...k, right: true }));
          break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          setKeys((k) => ({ ...k, forward: false }));
          break;
        case "KeyS":
        case "ArrowDown":
          setKeys((k) => ({ ...k, backward: false }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setKeys((k) => ({ ...k, left: false }));
          break;
        case "KeyD":
        case "ArrowRight":
          setKeys((k) => ({ ...k, right: false }));
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return keys;
}
