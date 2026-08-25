import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("iPhone-style disclosure motion", () => {
  it("uses a reversible iOS-native curve without restoring scale or ripple feedback", () => {
    expect(stylesheet).toContain("@media (prefers-reduced-motion:no-preference)");
    expect(stylesheet).toContain("transition:grid-template-rows 280ms cubic-bezier(.32,.72,0,1) !important");
    expect(stylesheet).toContain(".case-study__dropdown[data-state=\"open\"],.learning-card__dropdown[data-state=\"open\"],.nidarr-card .case-study__dropdown[data-state=\"open\"] { display:grid; grid-template-rows:1fr; }");
    expect(stylesheet).toContain(".interaction-ripple { display:none !important; }");
    expect(stylesheet).toContain(".case-study__trigger:active,.learning-card__trigger:active { transform:none !important; }");
  });
});
