import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaGithub, FaInstagram, FaLinkedinIn, FaMedium } from "react-icons/fa";
import { FiArrowRight, FiArrowUpRight, FiCheck, FiCopy, FiDownload, FiMail, FiPhone } from "react-icons/fi";
import ClientOnly from "../components/ClientOnly";
import { Reveal } from "../components/ui";
import { globe, profile } from "../data/resume";

// Shares the three.js chunk with the hero swarm.
const Globe = lazy(() => import("../components/Globe"));

const linkClass =
  "group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-ink-950/60 px-4 text-sm text-stone-300 transition hover:border-accent/60 hover:text-white";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard can be blocked; the mailto link still works on its own.
    }
  };

  const links = [
    { href: profile.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
    { href: profile.github, label: "GitHub", Icon: FaGithub },
    { href: profile.instagram, label: "Instagram", Icon: FaInstagram },
    { href: profile.medium, label: "Medium", Icon: FaMedium },
  ];

  return (
    <section id="contact" className="relative scroll-mt-24 px-4 py-12 sm:px-6 md:py-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/[0.08] bg-ink-900">
        <div className="relative grid items-center gap-6 px-6 py-16 sm:px-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:py-20">
          <div className="min-w-0">
            <Reveal>
              <h2 className="font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold leading-[1.04] tracking-tight text-white">
                {profile.status}.
                <br />
                <span className="text-accent">Available to join immediately.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-stone-400">Based in {profile.location}.</p>
            </Reveal>

            <Reveal delay={0.16} className="mt-10 flex flex-wrap items-center gap-3">
              {/* Opens the mail app and also copies the address, so the click
                  still does something on machines without a mail client. */}
              <a
                href={`mailto:${profile.email}`}
                onClick={copyEmail}
                className="inline-flex min-h-[56px] items-center gap-2 rounded-full bg-white px-6 font-medium text-ink-950 transition hover:bg-accent sm:px-7"
              >
                <FiMail />
                <span className="sm:hidden">Email me</span>
                <span className="hidden sm:inline">{profile.email}</span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-ink-950/60 text-white transition hover:border-accent/60"
                aria-label="Copy email address"
                title="Copy email address"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "y" : "n"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    {copied ? <FiCheck className="text-accent" /> : <FiCopy />}
                  </motion.span>
                </AnimatePresence>
              </button>
              <span role="status" className="text-sm text-stone-400">
                {copied ? "Email address copied" : ""}
              </span>
            </Reveal>

            <Reveal delay={0.22} className="mt-6 flex flex-wrap items-center gap-3">
              <a href={`tel:${profile.phone.replace(/-/g, "")}`} className={linkClass}>
                <FiPhone /> {profile.phone}
                <FiArrowRight className="text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </a>
              {links.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className={linkClass}>
                  <Icon /> {label}
                  <FiArrowUpRight className="text-stone-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </a>
              ))}
              <a href={profile.resume} download className={linkClass}>
                <FiDownload /> Resume (PDF)
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative min-w-0">
            <div className="relative mx-auto aspect-square w-full max-w-[460px]">
              <ClientOnly>
                <Suspense fallback={null}>
                  <Globe home={globe.home} places={globe.places} className="absolute inset-0" />
                </Suspense>
              </ClientOnly>
            </div>
            <ul className="mx-auto flex max-w-[460px] flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-stone-400">
              <li className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-stone-200">{globe.home.name}</span> · {globe.home.note}
              </li>
              {globe.places.map((place) => (
                <li key={place.name} className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                  <span className="text-stone-200">{place.name}</span> · {place.note}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
