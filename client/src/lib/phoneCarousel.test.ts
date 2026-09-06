import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const carouselSource = readFileSync(new URL("../components/ui/phone-mockups-1.tsx", import.meta.url), "utf8");
const carouselStyles = readFileSync(new URL("../components/ui/phone-mockups-1.css", import.meta.url), "utf8");

describe("Nidarr phone carousel touch interaction", () => {
  it("provides a guarded live drag with existing accessible controls retained", () => {
    expect(carouselSource).toContain("const SWIPE_MIN_DISTANCE = 48;");
    expect(carouselSource).toContain('if (images.length < 2 || (event.target as HTMLElement).closest("button, a")) return;');
    expect(carouselSource).toContain("if (!event.currentTarget.hasPointerCapture(event.pointerId)) {");
    expect(carouselSource).toContain("if (Math.abs(raw) < 10 || Math.abs(event.clientY - swipeStart.y) > Math.abs(raw)) return;");
    // Live drag-follow with edge rubber-banding, then a spring settle.
    expect(carouselSource).toContain("const delta = atEdge ? raw * 0.28 : raw * 0.62;");
    expect(carouselSource).toContain("stageRef.current?.style.setProperty(\"transform\", `translateX(${delta.toFixed(1)}px)`);");
    expect(carouselSource).toContain("if (Math.abs(deltaX) < SWIPE_MIN_DISTANCE || Math.abs(deltaX) <= Math.abs(event.clientY - swipeStart.y)) return;");
    expect(carouselSource).toContain("select(activeIndex + (deltaX < 0 ? 1 : -1));");
    expect(carouselSource).toContain("onPointerMove={onPointerMove}");
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
    expect(carouselStyles).toContain(".phone-carousel__dot-ring-progress { stroke:var(--signal); stroke-width:2.45; stroke-linecap:round; filter:drop-shadow(0 0 2px rgba(var(--signal-rgb),.72)) drop-shadow(0 0 5px rgba(var(--signal-rgb),.28));");
    expect(carouselStyles).not.toContain(".phone-carousel__progress");
  });

  it("keeps dot feedback self-contained and bounces only a drag past the final screen", () => {
    expect(carouselSource).toContain("const triggerEndBounce = useCallback(() => {");
    expect(carouselSource).toContain("if (atEdge) {");
    expect(carouselSource).toContain("triggerEndBounce();");
    expect(carouselSource).toContain("{ transform: \"translateX(-12px)\", offset: .34 }");
    expect(carouselSource).toContain("boundaryAnimationRef.current?.cancel();");
    expect(carouselStyles).toContain(".phone-carousel__dot:hover { transform:scale(1.14);");
    expect(carouselStyles).toContain("@media (prefers-reduced-motion:reduce)");
  });
});
