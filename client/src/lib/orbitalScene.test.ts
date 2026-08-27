import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const orbitalSceneSource = readFileSync(new URL("../components/OrbitalScene.tsx", import.meta.url), "utf8");

describe("OrbitalScene continuous motion", () => {
  it("keeps the orbit independent from pointer hover while retaining visibility and reduced-motion guards", () => {
    expect(orbitalSceneSource).toContain("if (visible && !reducedMotion) {");
    expect(orbitalSceneSource).not.toContain("pausedByHoverRef");
    expect(orbitalSceneSource).not.toContain("isHoverPaused");
    expect(orbitalSceneSource).not.toContain("onPointerEnter={pauseOrbit}");
    expect(orbitalSceneSource).not.toContain("onPointerLeave={resumeOrbit}");
  });
});
