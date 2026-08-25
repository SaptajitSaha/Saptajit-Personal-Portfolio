import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const orbitalSceneSource = readFileSync(new URL("../components/OrbitalScene.tsx", import.meta.url), "utf8");

describe("OrbitalScene hover pause", () => {
  it("exposes a mouse-only paused state and restores the orbit after pointer leave", () => {
    expect(orbitalSceneSource).toContain('data-orbit-paused={isHoverPaused ? "true" : "false"}');
    expect(orbitalSceneSource).toContain("onPointerEnter={pauseOrbit}");
    expect(orbitalSceneSource).toContain("onPointerMove={pauseOrbit}");
    expect(orbitalSceneSource).toContain("onPointerLeave={resumeOrbit}");
    expect(orbitalSceneSource).toContain('event.pointerType !== "mouse"');
  });
});
