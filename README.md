# Sreenath P: Portfolio

Single-page portfolio built with React, Vite, Tailwind CSS, Three.js and Framer Motion.

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # outputs to build/
npm run preview  # serve the production build
```

## Editing content

All text (summary, experience, skills, links) lives in `src/data/resume.js`.
The downloadable resume is `public/Sreenath_P_Software_Engineer_Resume.pdf`.

## Notable pieces

- `src/components/ParticleSwarm.jsx`: WebGL particle swarm that morphs between
  formations (sphere, helix, torus, "SP" monogram, galaxy) and scatters from the cursor.
- `src/components/Globe.jsx`: dotted globe with flight arcs from Kochi (land dots from `src/data/landMask.js`).
- `src/components/liquidMetal.js` + `LiquidMetalButton.jsx`: liquid-metal shader button, ported from
  [ThreeUI Community](https://github.com/MengTo/threeui) (MIT).
- `src/components/ui.jsx`: reveal-on-scroll, split text, spotlight cards, magnetic buttons, count-up.
