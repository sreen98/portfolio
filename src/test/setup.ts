import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Browser stubs only apply to DOM test files; Node-environment tests skip them.
if (typeof window !== "undefined") {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
  });

  // jsdom lacks the observers and media queries the site relies on.
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);

  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );

  // No WebGL or 2D canvas in jsdom: the effects take their no-WebGL fallback,
  // the same path a device without WebGL support takes.
  HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as unknown as HTMLCanvasElement["getContext"];
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
}
