import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const carouselSource = readFileSync(new URL("../components/ui/phone-mockups-1.tsx", import.meta.url), "utf8");
const carouselStyles = readFileSync(new URL("../components/ui/phone-mockups-1.css", import.meta.url), "utf8");

describe("Nidarr phone carousel touch interaction", () => {
  it("provides a guarded horizontal swipe with existing accessible controls retained", () => {
    expect(carouselSource).toContain("const SWIPE_MIN_DISTANCE = 48;");
    expect(carouselSource).toContain("if (event.pointerType !== \"touch\" || images.length < 2) return;");
    expect(carouselSource).toContain("if (Math.abs(deltaX) < SWIPE_MIN_DISTANCE || Math.abs(deltaX) <= Math.abs(deltaY)) return;");
    expect(carouselSource).toContain("select(activeIndex + (deltaX < 0 ? 1 : -1));");
    expect(carouselSource).toContain("onPointerCancel={clearSwipe}");
    expect(carouselSource).toContain("aria-describedby=\"phone-carousel-swipe-instructions\"");
    expect(carouselSource).toContain("onKeyDown={onKeyDown}");
    expect(carouselStyles).toContain(".phone-carousel { touch-action:pan-y; }");
  });
});
