import { lazy, Suspense, useRef } from "react";
import { FiArrowDownRight, FiDownload } from "react-icons/fi";
import ClientOnly from "../components/ClientOnly";
import LiquidMetalButton from "../components/LiquidMetalButton";
import { Magnetic, SplitText } from "../components/ui";
import { profile } from "../data/resume";

// three.js is the heaviest dependency, so load it after the text paints.
const ParticleSwarm = lazy(() => import("../components/ParticleSwarm"));

// Entrance animations are plain CSS (see .fade-up in index.css) so they run
// from the pre-rendered HTML on first paint, before JavaScript loads.
const fade = (delay: number) => ({ style: { animationDelay: `${delay}s` } });

export default function Hero() {
  const textRef = useRef(null);
  const slotRef = useRef(null);

  return (
    <section id="top" className="relative flex items-start overflow-hidden pb-16 pt-28 md:min-h-[80svh] md:pt-40">
      <ClientOnly>
        <Suspense fallback={null}>
          <ParticleSwarm className="absolute inset-0" label={profile.name} textRef={textRef} slotRef={slotRef} />
        </Suspense>
      </ClientOnly>

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div ref={textRef} className="max-w-3xl">
          {/* Reserved space for the particle name on phones and portrait tablets. */}
          <div ref={slotRef} className="swarm-slot" aria-hidden="true" />
          <h1 className="font-display text-[clamp(2.3rem,5vw,4.4rem)] font-bold leading-[1.02] tracking-tight text-white">
            <SplitText text="Software Engineer," delay={0.25} />
            <br />
            <SplitText text="Frontend" delay={0.35} />
            <br />
            <span className="text-accent">
              <SplitText text="React & TypeScript" delay={0.45} />
            </span>
          </h1>

          <p {...fade(1)} className="fade-up mt-7 max-w-lg text-lg leading-relaxed text-stone-400">
            5+ years building responsive frontend systems. Shipped role-based access control for a multi-tenant SaaS
            platform, LLM-powered job description generation, and the frontend for Greenhouse and Lever integrations.
          </p>

          <div {...fade(1.15)} className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <LiquidMetalButton href="#experience" className="group">
              See my work
              <FiArrowDownRight className="transition-transform group-hover:rotate-[-45deg]" />
            </LiquidMetalButton>
            <Magnetic>
              <a
                href={profile.resume}
                download
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 text-sm font-medium text-white backdrop-blur transition hover:border-white/40"
              >
                <FiDownload /> Download resume
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Casberry-style HUD readout */}
      <div
        {...fade(1.4)}
        className="fade-up pointer-events-none absolute bottom-8 right-6 hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-400 [@media(hover:hover)_and_(min-width:768px)]:flex"
      >
        <span className="h-px w-6 bg-stone-600" />
        move cursor to disturb
      </div>

      <a
        href="#about"
        {...fade(1.6)}
        className="fade-up absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-stone-400 md:flex"
        aria-label="Scroll to about"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="scroll-cue absolute inset-x-0 top-0 h-4 bg-accent" />
        </span>
      </a>
    </section>
  );
}
