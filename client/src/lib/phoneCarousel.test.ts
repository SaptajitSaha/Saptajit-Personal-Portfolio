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

  it("uses compact indicators with one active-dot circular countdown and no cropped autoplay control", () => {
    expect(carouselSource).toContain("const DOT_PROGRESS_RADIUS = 12;");
    expect(carouselSource).toContain("const DOT_PROGRESS_CIRCUMFERENCE = 2 * Math.PI * DOT_PROGRESS_RADIUS;");
    expect(carouselSource).toContain("stroke-dashoffset");
    expect(carouselSource).toContain("phone-carousel__dot-ring-progress");
    expect(carouselSource).not.toContain("phone-carousel__autoplay");
    expect(carouselSource).not.toContain("phone-carousel__progress");
    expect(carouselStyles).toContain(".phone-carousel__dots { display:flex; align-items:center; justify-content:center; min-width:0; gap:2px;");
    expect(carouselStyles).toContain(".phone-carousel__dot-ring-progress { stroke:var(--signal); stroke-width:1.8; stroke-linecap:round;");
    expect(carouselStyles).not.toContain(".phone-carousel__progress");
  });
});
