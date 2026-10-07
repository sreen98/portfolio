import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Reveal, SectionHeading } from "../components/ui";
import { experience } from "../data/resume";

export default function Experience() {
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28 md:py-36">
      <SectionHeading title="Experience" />

      <div ref={listRef} className="relative">
        <div className="absolute bottom-0 left-[7px] top-2 w-px bg-white/10 md:left-[calc(30%+7px)]" />
        <motion.div
          style={{ scaleY }}
          className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-accent md:left-[calc(30%+7px)]"
        />

        <div className="space-y-20">
          {experience.map((job) => (
            <div key={job.company} className="relative grid gap-8 md:grid-cols-[30%_1fr]">
              <div className="pl-10 md:sticky md:top-28 md:self-start md:pl-0 md:pr-12 md:text-right">
                <Reveal>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500">{job.period}</p>
                  <h3 className="mt-3 font-display text-3xl font-semibold text-white">{job.company}</h3>
                  <p className="mt-1 text-stone-400">
                    {job.title} · {job.location}
                  </p>
                </Reveal>
              </div>

              <span className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-accent bg-ink-950 md:left-[30%]" />

              <div className="space-y-6 pl-10 md:pl-12">
                <Reveal>
                  <p className="text-lg italic text-stone-300">{job.blurb}</p>
                </Reveal>
                {job.products.map((product, i) => (
                  <Reveal key={product.name} delay={i * 0.08}>
                    <article className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
                      <header className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h4 className="font-display text-xl font-semibold text-white">{product.name}</h4>
                        <span className="text-sm text-accent">{product.tagline}</span>
                      </header>
                      <ul className="space-y-3">
                        {product.points.map((point) => (
                          <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-stone-400">
                            <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
