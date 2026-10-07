import { useEffect, useRef, useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import { createLiquidMetal } from "./liquidMetal";

/**
 * A real <a> with ThreeUI's liquid-metal shader rendered behind it.
 * Falls back to a plain dark pill when WebGL2 is unavailable.
 */
interface LiquidMetalButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

export default function LiquidMetalButton({ href, children, className = "", ...rest }: LiquidMetalButtonProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const button = linkRef.current;
    const host = hostRef.current;
    if (!canvas || !button || !host) return undefined;
    let destroy: (() => void) | null = null;
    try {
      destroy = createLiquidMetal({ canvas, button, host });
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
