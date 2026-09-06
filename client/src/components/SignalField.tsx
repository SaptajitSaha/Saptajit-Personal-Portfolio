import { useCallback, useEffect, useRef } from "react";
import type { SignalFieldHandles } from "@/three/signal-field";

type SignalFieldProps = {
  /** Theme colors come from CSS custom properties, so both themes stay in sync. */
  readColors: () => { accent: string; dim: string; alpha: number };
  /** Selector of the element the orbital rings should follow (the hero portrait). */
  heroAnchorSelector: string;
};

function sceneDensity() {
  const mobile = window.matchMedia("(max-width: 900px)").matches;
  return mobile ? { threadCount: 5, segments: 140 } : { threadCount: 8, segments: 240 };
}

/**
 * Fixed, full-page WebGL backdrop. Renders behind every section; the orbital
 * rings track the hero portrait as it scrolls. The render loop stops when the
 * tab is hidden, and prefers-reduced-motion gets one static frame.
 */
export function SignalField({ readColors, heroAnchorSelector }: SignalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePointer = useCallback((event: PointerEvent) => {
    const scene = (window as unknown as { __signalField?: SignalFieldHandles }).__signalField;
    if (!scene || event.pointerType !== "mouse") return;
    const ndcX = (event.clientX / window.innerWidth) * 2 - 1;
    const ndcY = -((event.clientY / window.innerHeight) * 2 - 1);
    scene.setPointer(ndcX, ndcY, 0.14);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let frame = 0;
    let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: SignalFieldHandles | null = null;
    const startClock = performance.now();

    const renderFrame = (now: number) => {
      if (!scene) return;
      scene.update((now - startClock) / 1000);
      scene.renderer.render(scene.scene, scene.camera);
    };

    // Scroll progress is read inside the loop (no scroll event listeners).
    const loop = (now: number) => {
      frame = 0;
      if (document.hidden) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      scene?.setScrollProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
      renderFrame(now);
      frame = window.requestAnimationFrame(loop);
    };

    const requestLoop = () => {
      if (!frame && !document.hidden && !reduceMotion) frame = window.requestAnimationFrame(loop);
    };

    const syncThemeColors = () => {
      if (!scene) return;
      const { accent, dim, alpha } = readColors();
      scene.setColors(accent, dim, alpha);
    };

    const resize = () => {
      if (!scene) return;
      scene.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      scene.resize(window.innerWidth, window.innerHeight);
      if (reduceMotion) renderFrame(performance.now());
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);
    const onVisibility = () => requestLoop();
    document.addEventListener("visibilitychange", onVisibility);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      requestLoop();
    };
    motionQuery.addEventListener("change", onMotionChange);

    // Re-read palette tokens whenever the theme attribute flips.
    const themeObserver = new MutationObserver(() => syncThemeColors());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    window.addEventListener("pointermove", handlePointer, { passive: true });

    void import("@/three/signal-field").then(({ createSignalField }) => {
      if (disposed) return;
      const { accent, dim, alpha } = readColors();
      const density = sceneDensity();
      scene = createSignalField(canvas, { accent, dim, alpha, ...density });
      scene.followHero(document.querySelector<HTMLElement>(heroAnchorSelector));
      (window as unknown as { __signalField?: SignalFieldHandles }).__signalField = scene;
      resize();
      syncThemeColors();
      canvas.dataset.ready = "true";
      if (reduceMotion) {
        renderFrame(performance.now());
      } else {
        requestLoop();
      }
    });

    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      themeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      (window as unknown as { __signalField?: SignalFieldHandles }).__signalField = undefined;
      scene?.dispose();
      scene = null;
    };
  }, [handlePointer, readColors, heroAnchorSelector]);

  return <canvas ref={canvasRef} className="signal-field-canvas" aria-hidden="true" />;
}
