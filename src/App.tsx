import { MotionConfig } from "framer-motion";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Life from "./sections/Life";
import Contact from "./sections/Contact";
import { profile } from "./data/resume";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Life />
        <Contact />
      </main>
      <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 pb-10 pt-6 text-sm text-stone-400 sm:flex-row">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {profile.name}
        </p>
        <p>Built with React, Three.js &amp; Framer Motion.</p>
      </footer>
    </MotionConfig>
  );
}
