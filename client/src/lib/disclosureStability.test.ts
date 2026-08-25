import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");
const caseStudySource = readFileSync(new URL("../components/CaseStudyPanel.tsx", import.meta.url), "utf8");

describe("disclosure stability", () => {
  it("uses instant project and lesson disclosure states without ripple or press-scale feedback", () => {
    expect(stylesheet).toContain('.case-study__dropdown[data-state="closed"],.learning-card__dropdown[data-state="closed"] { display:none; }');
    expect(stylesheet).toContain(".interaction-ripple { display:none !important; }");
    expect(stylesheet).toContain(".case-study__trigger:active,.learning-card__trigger:active { transform:none !important; }");
    expect(homeSource).not.toContain("onPointerDown={triggerInteractionRipple}");
    expect(caseStudySource).not.toContain("onPointerDown={triggerInteractionRipple}");
  });
});
