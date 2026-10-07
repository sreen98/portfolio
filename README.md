# Sreenath P: Portfolio

Personal portfolio at [sreenathp.com](https://sreenathp.com), built with React, TypeScript, Vite, Tailwind CSS,
Three.js and Framer Motion. Deployed on Cloudflare Workers; every push to `main` deploys automatically.

## Getting started

Requires Node 24 (see `.nvmrc`).

```bash
npm install     # also installs the git hooks
npm run dev     # http://localhost:3000
```

## Scripts

| Script                   | What it does                                                                    |
| ------------------------ | ------------------------------------------------------------------------------- |
| `npm run dev`            | Start the dev server                                                            |
| `npm run build`          | Type-check (`tsc -b`) and build to `build/`                                     |
| `npm run preview`        | Serve the production build                                                      |
| `npm run typecheck`      | Type-check only                                                                 |
| `npm run lint`           | ESLint (TypeScript, React, hooks, accessibility)                                |
| `npm run format`         | Format everything with Prettier                                                 |
| `npm test`               | Run the Vitest + React Testing Library suite                                    |
| `npm run check:lockfile` | Fail if `package.json` and `package-lock.json` disagree                         |
| `npm run check:deploy`   | `wrangler deploy --dry-run` against the build                                   |
| `npm run verify`         | Everything the pre-push hook runs: lint, format, tests, lockfile, build, deploy |

## Git hooks

- **pre-commit**: Prettier and ESLint on staged files; rejects files over 1 MB.
- **pre-push**: `npm run verify`, so anything that would fail the Cloudflare build fails locally first.

## Project structure

```
src/
  App.tsx              Page layout (section order)
  main.tsx             Entry point
  types.ts             Types for all site content
  data/resume.ts       All text, links and image paths
  data/landMask.ts     Land mask for the contact globe
  sections/            One component per page section
  components/          Shared UI and the WebGL effects
  test/setup.ts        Test environment (jsdom stubs)
public/                Images, favicon set, resume PDF, link-preview image
scripts/               Lockfile and file-size checks used by the hooks
```

## Editing content

All text, links and image paths live in `src/data/resume.ts`, typed by `src/types.ts`. The tests check that every
referenced image exists, links use https, and the copy contains no em dashes, en dashes or emoji.

## Notable pieces

- `components/ParticleSwarm.tsx`: WebGL particle swarm that spells the name, bursts and re-forms, and scatters from the
  cursor. Positions itself from the real layout so it never covers the copy.
- `components/Globe.tsx`: dotted globe with flight arcs from Kochi (land dots from `data/landMask.ts`).
- `components/liquidMetal.ts` + `LiquidMetalButton.tsx`: liquid-metal shader button, ported from
  [ThreeUI Community](https://github.com/MengTo/threeui) (MIT).
- `components/ui.tsx`: reveal-on-scroll, split text, spotlight cards, magnetic buttons, count-up.
