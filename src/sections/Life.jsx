import { FaMedium } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { GiCricketBat, GiWeightLiftingUp } from "react-icons/gi";
import { Reveal, SectionHeading, SpotlightCard } from "../components/ui";
import { life } from "../data/resume";

// Alternating tilt so the postcards look tossed on a table; hover squares them up.
const tilts = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3"];

function Postcard({ place, index }) {
  return (
    <figure
      className={`${tilts[index % tilts.length]} rounded-xl bg-white/[0.06] p-1.5 shadow-xl shadow-black/50 ring-1 ring-white/10 transition duration-500 hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:scale-[1.04]`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        <img
          src={place.photo}
          alt={`Sreenath in ${place.country}`}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ objectPosition: place.position }}
        />
        <span className="absolute left-2 top-2 rounded-md bg-ink-950/70 px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-white backdrop-blur">
          {place.code}
        </span>
      </div>
      <figcaption className="px-1 pb-0.5 pt-2 text-sm font-medium text-white">{place.country}</figcaption>
    </figure>
  );
}

export default function Life() {
  const { travel, cricket, gym, writing } = life;
  const article = writing[0];

  return (
    <section id="life" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28 md:py-36">
      <SectionHeading title="Outside work">I love travelling, going to the gym and playing cricket.</SectionHeading>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Travel */}
        <Reveal className="lg:col-span-2">
          <SpotlightCard className="h-full p-6 sm:p-7">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500">Travel</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-white">
                  {travel.length} countries
                </h3>
              </div>
              <ul className="flex gap-1.5">
                {travel.map((place) => (
                  <li key={place.code} className="rounded-md border border-white/10 px-2 py-0.5 font-mono text-[11px] text-stone-300">
                    {place.code}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {travel.map((place, i) => (
                <Postcard key={place.code} place={place} index={i} />
              ))}
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Cricket */}
        <Reveal delay={0.08} className="lg:row-span-2">
          <SpotlightCard className="relative h-full min-h-[420px] overflow-hidden">
            <img
              src={cricket.photo}
              alt="Sreenath batting in a cricket match"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: "35% 45%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <div className="mb-3 flex items-center gap-2">
                <GiCricketBat className="text-xl text-accent" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-stone-300">Cricket</span>
              </div>
              <h3 className="font-display text-3xl font-bold text-white">{cricket.role}</h3>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Gym */}
        <Reveal delay={0.12}>
          <SpotlightCard className="flex h-full flex-col p-7">
            <GiWeightLiftingUp className="mb-6 text-4xl text-accent" />
            <h3 className="font-display text-2xl font-bold text-white">Gym</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-stone-400">{gym.text}</p>
            <GiWeightLiftingUp
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -right-4 text-[10rem] text-white/[0.03] transition-transform duration-700 group-hover:-rotate-6"
            />
          </SpotlightCard>
        </Reveal>

        {/* Writing */}
        <Reveal delay={0.16}>
          <SpotlightCard className="h-full">
            <a href={article.href} target="_blank" rel="noreferrer" className="flex h-full flex-col">
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl">
                <img
                  src={article.cover}
                  alt="Snowy mountain lake in Kazakhstan"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink-950/70 px-2.5 py-1 text-[11px] text-white backdrop-blur">
                  <FaMedium /> {article.platform} · {article.date}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500">Writing</p>
                <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-white">{article.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">{article.blurb}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm text-accent">
                  Read the guide
                  <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          </SpotlightCard>
        </Reveal>
      </div>

    </section>
  );
}
