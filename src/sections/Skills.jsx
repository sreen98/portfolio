import { Reveal, SectionHeading } from "../components/ui";
import { skillGroups } from "../data/resume";

// The stack in the resume title, picked out in the accent colour.
const CORE = new Set(["React.js", "TypeScript"]);

/** Skills as a typographic index: category on the left, tools as plain text. */
export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28 md:py-36">
      <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading title="Skills" className="mb-0" />
        </div>

        <div className="border-b border-white/10">
          {skillGroups.map((group, i) => (
            <Reveal
              key={group.title}
              delay={Math.min(i, 4) * 0.04}
              className="group grid gap-3 border-t border-white/10 py-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-8"
            >
              <h3 className="pt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500 transition-colors group-hover:text-accent">
                {group.title}
              </h3>
              <ul className="flex flex-wrap gap-x-2 gap-y-1 text-lg leading-snug">
                {group.items.map((item, j) => (
                  <li key={item} className={CORE.has(item) ? "text-accent" : "text-stone-200"}>
                    {item}
                    {j < group.items.length - 1 && <span className="ml-2 text-stone-600">/</span>}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
