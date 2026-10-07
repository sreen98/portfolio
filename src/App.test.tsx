import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
import { stats } from "./data/resume";

describe("App", () => {
  it("renders every section without crashing, even with no WebGL", () => {
    const { container } = render(<App />);
    for (const id of ["top", "about", "experience", "projects", "skills", "life", "contact"]) {
      expect(container.querySelector(`#${id}`), id).not.toBeNull();
    }
  });

  it("renders the real stat values before any animation (pre-rendered HTML)", () => {
    const { container } = render(<App />);
    const values = [...container.querySelectorAll("#about dd")].map((dd) => dd.textContent);
    expect(values).toEqual(stats.map((s) => `${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`));
  });

  it("has exactly one h1", () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("gives every image alt text", () => {
    const { container } = render(<App />);
    const missing = [...container.querySelectorAll("img")].filter((img) => !img.hasAttribute("alt"));
    expect(missing).toHaveLength(0);
  });
});
