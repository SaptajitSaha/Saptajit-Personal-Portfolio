import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("signal thread layering", () => {
  it("keeps the long accent rail outside the constrained content surface", () => {
    expect(stylesheet).toContain(".liquid-signal-thread { left:max(16px,calc((100% - 1400px) / 2 - 12px)); }");
  });
});
