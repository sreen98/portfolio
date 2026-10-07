// @vitest-environment node
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as content from "./resume";

/** Every string in the exported content, with its path for error messages. */
function strings(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  }
  return [];
}

const all = strings(content);
const publicDir = new URL("../../public/", import.meta.url);

describe("site content", () => {
  it("has no em dashes, en dashes or emoji", () => {
    const banned = /[\u2013\u2014\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
    const offenders = all.filter(([, text]) => banned.test(text)).map(([path]) => path);
    expect(offenders).toEqual([]);
  });

  it("links out over https only", () => {
    const insecure = all.filter(([, text]) => text.startsWith("http://")).map(([path]) => path);
    expect(insecure).toEqual([]);
  });

  it("only references images and files that exist in public/", () => {
    const local = all.filter(([, text]) => /^\/[\w./-]+\.(webp|jpg|png|pdf)$/.test(text));
    expect(local.length).toBeGreaterThan(0);
    const missing = local
      .filter(([, file]) => !existsSync(fileURLToPath(new URL(`.${file}`, publicDir))))
      .map(([path]) => path);
    expect(missing).toEqual([]);
  });

  it("gives every project at least one link", () => {
    for (const project of Object.values(content.projects)) {
      expect(project.links.length, project.name).toBeGreaterThan(0);
    }
  });
});
