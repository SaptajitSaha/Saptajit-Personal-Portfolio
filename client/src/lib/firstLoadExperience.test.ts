import { afterEach, describe, expect, it, vi } from "vitest";
import { markFirstLoadExperienceSeen, shouldSkipFirstLoadExperience } from "./firstLoadExperience";

function installWindow({ seen = false, reducedMotion = false } = {}) {
  const values = new Map<string, string>(seen ? [["signal-field-intro-seen", "true"]] : []);
  vi.stubGlobal("window", {
    matchMedia: () => ({ matches: reducedMotion }),
    sessionStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
  return values;
}

afterEach(() => vi.unstubAllGlobals());

describe("first-load session policy", () => {
  it("runs only for an unseen visitor without reduced-motion preference", () => {
    installWindow();
    expect(shouldSkipFirstLoadExperience()).toBe(false);
  });

  it("skips a seen session and honors reduced-motion immediately", () => {
    installWindow({ seen: true });
    expect(shouldSkipFirstLoadExperience()).toBe(true);
    installWindow({ reducedMotion: true });
    expect(shouldSkipFirstLoadExperience()).toBe(true);
  });

  it("records completion without exposing storage details to callers", () => {
    const values = installWindow();
    markFirstLoadExperienceSeen();
    expect(values.get("signal-field-intro-seen")).toBe("true");
  });
});
