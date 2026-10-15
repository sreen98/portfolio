// Git hook guard: commits must not credit Claude or Anthropic.
//   pre-commit:  node scripts/check-attribution.mjs            (author and committer identity)
//   commit-msg:  node scripts/check-attribution.mjs <msg-file> (Co-authored-by trailers, "Generated with" lines)
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const PATTERN = /claude|anthropic/i;
const problems = [];

for (const role of ["AUTHOR", "COMMITTER"]) {
  // "Name <email> 1760000000 +0530" -> "Name <email>"
  const ident = execSync(`git var GIT_${role}_IDENT`, { encoding: "utf8" })
    .trim()
    .replace(/ \d+ [-+]\d{4}$/, "");
  if (PATTERN.test(ident)) problems.push(`${role.toLowerCase()} is ${ident}`);
}

const msgFile = process.argv[2];
if (msgFile) {
  readFileSync(msgFile, "utf8")
    .split(/\r?\n/)
    .filter((line) => !line.startsWith("#"))
    .filter((line) => /^\s*co-authored-by:/i.test(line) || /generated (with|by)/i.test(line))
    .filter((line) => PATTERN.test(line))
    .forEach((line) => problems.push(`message line: ${line.trim()}`));
}

if (problems.length) {
  console.error("\nClaude/Anthropic must not appear as author, committer or contributor:");
  problems.forEach((p) => console.error(`  ${p}`));
  console.error("\nFix the identity (git config user.name / user.email) or remove the line, then commit again.\n");
  process.exit(1);
}
