import { CountUp, Reveal, SectionHeading } from "../components/ui";
import PhotoStack from "../components/PhotoStack";
import { education, photos, profile, stats } from "../data/resume";

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28 md:py-36">
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
            <p className="text-sm leading-relaxed text-stone-500">
              {education.degree}, {education.school} ({education.period}), {education.score}
            </p>
          </Reveal>
        </div>
      </div>

      <dl className="mt-24 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className="border-t border-white/15 pt-5">
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-4xl font-bold text-white sm:text-5xl">
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </dd>
            <p className="mt-2 text-sm leading-snug text-stone-400">{s.label}</p>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
