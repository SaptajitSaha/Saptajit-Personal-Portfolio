import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");

describe("disclosure stability", () => {
  it("keeps lesson disclosure direct while using a smooth, no-overshoot dropdown transition", () => {
    expect(stylesheet).toContain('.learning-card__dropdown[data-state="closed"] { display:none; }');
    expect(stylesheet).toContain(".interaction-ripple { display:none !important; }");
    expect(stylesheet).toContain(".learning-card__trigger:active { transform:none !important; }");
    expect(stylesheet).toContain(".learning-card__dropdown { max-height:0; opacity:0; transition:max-height 480ms cubic-bezier(.16,1,.3,1),opacity 320ms cubic-bezier(.16,1,.3,1) !important; }");
    expect(stylesheet).toContain(".learning-card__dropdown[data-state=\"open\"][data-motion-ready] { max-height:var(--lesson-detail-height); opacity:1; }");
    expect(stylesheet).toContain(".learning-card:has(.learning-card__trigger:focus-visible) .learning-card__dropdown[data-state=\"open\"] { max-height:none; opacity:1; transition:none !important; }");
    expect(homeSource).not.toContain("onPointerDown={triggerInteractionRipple}");
    expect(homeSource).toContain("<AccordionContent forceMount className=\"learning-card__dropdown\" data-motion-ready={motionReady || undefined} style={{ \"--lesson-detail-height\": `${detailHeight}px` } as CSSProperties}>");
    expect(homeSource).toContain("data-motion-ready={motionReady || undefined}");
    expect(homeSource).toContain("window.requestAnimationFrame(() => setMotionReadyTopic(value))");
  });
});
