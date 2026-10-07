import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { HiOutlineMenuAlt4, HiX } from "react-icons/hi";
import { profile } from "../data/resume";

interface NavLink {
  id: string;
  label: string;
  href?: string;
}

const links: NavLink[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "life", label: "Life" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Keep the page behind the mobile menu from scrolling.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent" style={{ scaleX: progress }} />
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
      >
        <nav
          className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-3 py-2 transition-colors duration-500 ${
            scrolled ? "border-white/10 bg-ink-900/70 backdrop-blur-xl" : "border-transparent bg-transparent"
          }`}
        >
          <a href="#top" className="flex min-h-[40px] items-center gap-2.5 pl-1">
            <img src="/img/avatar.webp" alt="" className="h-8 w-8 rounded-full ring-1 ring-white/20" />
            <span className="font-display text-sm font-semibold tracking-tight text-white">{profile.name}</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`relative block rounded-full px-4 py-2.5 text-sm transition-colors ${
                    active === id ? "text-white" : "text-stone-400 hover:text-white"
                  }`}
                >
                  {active === id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.08]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={profile.resume}
            download
            className="hidden rounded-full bg-white px-4 py-2.5 text-sm font-medium text-ink-950 transition hover:bg-accent lg:inline-block"
          >
            Resume
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2.5 text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <HiX size={22} /> : <HiOutlineMenuAlt4 size={22} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex overflow-y-auto bg-ink-950/95 px-8 pb-8 pt-24 backdrop-blur-xl lg:hidden"
          >
            <nav className="m-auto flex w-full max-w-md flex-col gap-1" aria-label="Mobile">
              {[...links, { id: "resume", label: "Download resume", href: profile.resume } satisfies NavLink].map(
                ({ id, label, href }, i) => (
                  <motion.a
                    key={id}
                    href={href || `#${id}`}
                    download={href ? true : undefined}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="py-1 font-display text-[clamp(1.4rem,5vh,2.25rem)] font-semibold text-white"
                  >
                    {label}
                  </motion.a>
                ),
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
