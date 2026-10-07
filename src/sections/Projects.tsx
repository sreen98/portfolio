import { FiArrowUpRight } from "react-icons/fi";
import { Reveal, SectionHeading, SpotlightCard } from "../components/ui";
import { projects } from "../data/resume";
import type { Project } from "../types";

interface FrameProps {
  src: string;
  alt: string;
  className?: string;
}

function BrowserFrame({ src, alt, url, className = "" }: FrameProps & { url: string }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-ink-800 shadow-2xl shadow-black/60 ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-3 truncate rounded-md bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-stone-400">
          {url}
        </span>
      </div>
      <img src={src} alt={alt} width={1200} height={750} loading="lazy" className="block h-auto w-full" />
    </div>
  );
}

function PhoneFrame({ src, alt, className = "" }: FrameProps) {
  return (
    <div className={`rounded-[1.6rem] border border-white/15 bg-black p-1.5 shadow-2xl shadow-black/70 ${className}`}>
      <img
        src={src}
        alt={alt}
        width={360}
        height={780}
        loading="lazy"
        className="block h-auto w-full rounded-[1.2rem]"
      />
    </div>
  );
}

function Header({ project }: { project: Project }) {
  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        {project.icon ? (
          <img src={project.icon} alt="" width={40} height={40} className="h-10 w-10 rounded-xl" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 font-display font-bold text-white">
            {project.name[0]}
          </span>
        )}
        <div>
          <h3 className="font-display text-xl font-semibold text-white">{project.name}</h3>
          <p className="text-xs text-stone-400">{project.kind}</p>
        </div>
      </div>
      <p className="text-[15px] leading-relaxed text-stone-400">{project.description}</p>
      {project.note && <p className="mt-3 text-sm leading-relaxed text-stone-400">{project.note}</p>}
    </>
  );
}

function Footer({ project }: { project: Project }) {
  return (
    <div className="relative z-10 mt-6">
      <ul className="mb-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-stone-400">
            {tag}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group/link inline-flex min-h-[40px] items-center gap-1 rounded-full bg-white/[0.06] px-4 py-2 text-sm text-white transition hover:bg-white hover:text-ink-950"
          >
            {link.label}
            <FiArrowUpRight className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const { ethra, geovault, ajhomes, tastemagic, prephub } = projects;

  return (
    <section id="projects" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-14 md:py-20">
      <SectionHeading title="Projects" />

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Ethra: wide card with web + phone mockups */}
        <Reveal className="lg:col-span-2">
          <SpotlightCard className="flex h-full flex-col p-7">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center">
              <div>
                <Header project={ethra} />
              </div>
              <div className="relative pb-6 pr-8">
                <BrowserFrame
                  src={ethra.web}
                  alt="Ethra landing page"
                  url="ethraapp.com"
                  className="transition-transform duration-700 group-hover:-translate-y-1"
                />
                <PhoneFrame
                  src={ethra.phone}
                  alt="Ethra Android app"
                  className="absolute -bottom-2 right-0 w-[30%] rotate-[4deg] transition-transform duration-700 group-hover:-translate-y-3 group-hover:rotate-[2deg]"
                />
              </div>
            </div>
            <div className="mt-auto">
              <Footer project={ethra} />
            </div>
          </SpotlightCard>
        </Reveal>

        {/* GeoVault: tall card with phone */}
        <Reveal delay={0.08} className="lg:row-span-2">
          <SpotlightCard className="flex h-full flex-col p-7">
            <Header project={geovault} />
            <div className="relative mt-8 flex flex-1 items-end justify-center overflow-hidden">
              <div className="pointer-events-none absolute bottom-0 h-2/3 w-2/3 rounded-full bg-accent/10 blur-3xl" />
              <PhoneFrame
                src={geovault.phone}
                alt="GeoVault saved places list"
                className="relative w-[62%] max-w-[230px] translate-y-6 transition-transform duration-700 group-hover:translate-y-2"
              />
            </div>
            <Footer project={geovault} />
          </SpotlightCard>
        </Reveal>

        {/* AJ Homes: site screenshot */}
        <Reveal delay={0.1}>
          <SpotlightCard className="flex h-full flex-col p-7">
            <BrowserFrame
              src={ajhomes.web}
              alt="AJ Homes property search"
              url="ajhomeslettings.co.uk"
              className="mb-7 transition-transform duration-700 group-hover:-translate-y-1"
            />
            <Header project={ajhomes} />
            <div className="mt-auto">
              <Footer project={ajhomes} />
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Taste Magic: module map */}
        <Reveal delay={0.16}>
          <SpotlightCard className="flex h-full flex-col p-7">
            <div className="mb-7 rounded-xl border border-white/10 bg-ink-800/80 p-4">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">Workspace modules</p>
              <ul className="flex flex-wrap gap-1.5">
                {tastemagic.modules.map((m, i) => (
                  <li
                    key={m}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-stone-300 transition-colors duration-300 group-hover:border-accent/40"
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <Header project={tastemagic} />
            <div className="mt-auto">
              <Footer project={tastemagic} />
            </div>
          </SpotlightCard>
        </Reveal>

        {/* PrepHub: full-width, it is the biggest of the side projects */}
        <Reveal className="lg:col-span-3">
          <SpotlightCard className="p-7">
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
              <div>
                <Header project={prephub} />
                <dl className="mt-6 grid grid-cols-3 gap-4">
                  {prephub.stats.map((stat) => (
                    <div key={stat.label} className="border-t border-white/10 pt-3">
                      <dd className="font-display text-2xl font-bold text-white">{stat.value}</dd>
                      <dt className="mt-1 text-xs text-stone-400">{stat.label}</dt>
                    </div>
                  ))}
                </dl>
                <Footer project={prephub} />
              </div>
              <BrowserFrame
                src={prephub.web}
                alt="PrepHub home page"
                url={prephub.url}
                className="transition-transform duration-700 group-hover:-translate-y-1"
              />
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
