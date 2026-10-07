import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useSpring } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Splits text into words that rise in one after another. Pure CSS (see
 * .split-word in index.css), so it runs from the pre-rendered HTML.
 */
export function SplitText({ text, className = "", delay = 0, stagger = 0.06 }: SplitTextProps) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, i, words) => (
        <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden="true">
          <span className="split-word" style={{ animationDelay: `${delay + i * stagger}s` }}>
            {word}
            {i < words.length - 1 && "\u00a0"}
          </span>
        </span>
      ))}
    </span>
  );
}

interface SectionHeadingProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export function SectionHeading({ title, children, className = "mb-10" }: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <Reveal>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h2>
      </Reveal>
      {children && (
        <Reveal delay={0.08}>
          <p className="mt-5 text-lg leading-relaxed text-stone-400">{children}</p>
        </Reveal>
      )}
    </div>
  );
}

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

/** Card with a radial highlight that follows the pointer. */
export function SpotlightCard({ children, className = "", color = "#ff6b35" }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      style={{ "--spot": color } as CSSProperties}
      className={`spotlight group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900/70 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

interface MagneticProps {
  children: ReactNode;
  strength?: number;
}

/** Element that leans toward the pointer while hovered. */
export function Magnetic({ children, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

/** Counts from zero to `value` the first time it scrolls into view. */
export function CountUp({ value, prefix = "", suffix = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, value, {
      duration: 1.6,
      ease,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
