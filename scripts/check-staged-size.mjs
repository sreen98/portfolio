// Pre-commit guard: refuse to commit files larger than the limit (raw photos,
// videos, build output). Site images are exported as small WebP files first.
import { execSync } from "node:child_process";
import { statSync } from "node:fs";

const LIMIT = 1024 * 1024; // 1 MB

const staged = execSync("git diff --cached --name-only --diff-filter=ACMR", { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const tooBig = staged.map((file) => ({ file, size: statSync(file).size })).filter(({ size }) => size > LIMIT);

if (tooBig.length) {
  console.error("\nThese staged files are over 1 MB:");
  tooBig.forEach(({ file, size }) => console.error(`  ${file} (${(size / 1048576).toFixed(1)} MB)`));
  console.error("\nCompress them (e.g. export images as WebP) or unstage them with: git restore --staged <file>\n");
  process.exit(1);
}
