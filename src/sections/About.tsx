import { CountUp, Reveal, SectionHeading } from "../components/ui";
import PhotoStack from "../components/PhotoStack";
import { education, photos, profile, stats } from "../data/resume";

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-14 md:py-20">
      {/* Photo on the left here, so the page doesn't read text-left every time. */}
      <div className="grid items-center gap-16 md:grid-cols-[300px_minmax(0,1fr)] lg:gap-24">
        <Reveal className="order-2 px-5 pb-10 md:order-1">
          <PhotoStack photos={photos} />
        </Reveal>

        <div className="order-1 md:order-2">
          <SectionHeading title="About" className="mb-6">
            {profile.summary}
          </SectionHeading>
          <Reveal delay={0.12}>
            <p className="text-sm leading-relaxed text-stone-400">
              {education.degree}, {education.school} ({education.period}), {education.score}
            </p>
          </Reveal>
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          // Reveal renders the div that groups each dt/dd pair. The figure shows
          // first visually, but the term comes first in the markup.
          <Reveal key={s.label} delay={i * 0.06} className="flex flex-col border-t border-white/15 pt-5">
            <dt className="order-2 mt-2 text-sm leading-snug text-stone-400">{s.label}</dt>
            <dd className="order-1 font-display text-4xl font-bold text-white sm:text-5xl">
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
