// Pre-push guard: Cloudflare installs with `npm ci`, which fails outright if
// package.json and package-lock.json disagree. Catch that before pushing.
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const root = lock.packages?.[""] ?? {};

const problems = [];
for (const field of ["dependencies", "devDependencies"]) {
  const want = pkg[field] ?? {};
  const have = root[field] ?? {};
  for (const name of new Set([...Object.keys(want), ...Object.keys(have)])) {
    if (want[name] !== have[name]) {
      problems.push(
        `${field}.${name}: package.json has ${want[name] ?? "nothing"}, lockfile has ${have[name] ?? "nothing"}`,
      );
    }
  }
}

if (problems.length) {
  console.error("\npackage.json and package-lock.json are out of sync:");
  problems.forEach((p) => console.error(`  ${p}`));
  console.error("\nRun `npm install` and commit the updated package-lock.json.\n");
  process.exit(1);
}
console.log("package-lock.json is in sync with package.json");
