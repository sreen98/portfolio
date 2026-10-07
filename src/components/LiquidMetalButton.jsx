import { useEffect, useRef, useState } from "react";
import { createLiquidMetal } from "./liquidMetal";

/**
 * A real <a> with ThreeUI's liquid-metal shader rendered behind it.
 * Falls back to a plain dark pill when WebGL2 is unavailable.
 */
export default function LiquidMetalButton({ href, children, className = "", ...rest }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const linkRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let destroy = null;
    try {
      destroy = createLiquidMetal({ canvas: canvasRef.current, button: linkRef.current, host: hostRef.current });
    } catch {
      destroy = null;
    }
    if (!destroy) setFallback(true);
    return () => destroy?.();
  }, []);

  return (
    <span ref={hostRef} className={`liquid-metal ${fallback ? "liquid-metal--fallback" : ""} ${className}`}>
      <span className="liquid-metal__plate" aria-hidden="true" />
      <canvas ref={canvasRef} className="liquid-metal__fx" aria-hidden="true" />
      <a ref={linkRef} href={href} className="liquid-metal__btn" {...rest}>
        {children}
      </a>
    </span>
  );
}
