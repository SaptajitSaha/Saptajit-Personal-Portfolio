import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");
const caseStudySource = readFileSync(new URL("../components/CaseStudyPanel.tsx", import.meta.url), "utf8");

describe("disclosure stability", () => {
  it("keeps project disclosure direct while limiting lesson reveal motion to compositor properties", () => {
    expect(stylesheet).toContain('.case-study__dropdown[data-state="closed"],.learning-card__dropdown[data-state="closed"] { display:none; }');
    expect(stylesheet).toContain(".interaction-ripple { display:none !important; }");
    expect(stylesheet).toContain(".case-study__trigger:active,.learning-card__trigger:active { transform:none !important; }");
    expect(stylesheet).toContain(".learning-card__dropdown[data-state=\"open\"] .learning-card__detail { opacity:1; transform:translateY(0); transition:opacity 180ms cubic-bezier(.22,1,.36,1) !important,transform 220ms cubic-bezier(.22,1,.36,1) !important; }");
    expect(stylesheet).toContain(".learning-card:has(.learning-card__trigger:focus-visible) .learning-card__detail { transition:none !important; }");
    expect(homeSource).not.toContain("onPointerDown={triggerInteractionRipple}");
    expect(caseStudySource).not.toContain("onPointerDown={triggerInteractionRipple}");
  });
});
