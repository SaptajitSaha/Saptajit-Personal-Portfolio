import { useCallback, useEffect, useRef } from "react";
import type { HeroConstellationHandles } from "@/three/hero-constellation";

type HeroConstellationProps = {
  /** Theme colors come from CSS custom properties, so both themes stay in sync. */
  readColors: () => { accent: string; dim: string; alpha?: number };
};

function particleBudget() {
  return window.matchMedia("(max-width: 900px)").matches ? 550 : 1100;
}

function dprCap() {
  return Math.min(window.devicePixelRatio || 1, 1.75);
}

/**
 * Lazy three.js layer behind the hero orb.
 *
 * Cost controls: three.js loads only when this component mounts, the render
 * loop stops whenever the tab or the hero leaves view, and
 * prefers-reduced-motion gets a single static frame instead of an animation.
 */
export function HeroConstellation({ readColors }: HeroConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HeroConstellationHandles | null>(null);

  const handlePointer = useCallback((event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const scene = sceneRef.current;
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!scene || !bounds) return;
    const nx = (event.clientX - bounds.left) / bounds.width - 0.5;
    const ny = (event.clientY - bounds.top) / bounds.height - 0.5;
    scene.setTiltTarget(ny * 0.6, nx * 0.9);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let frame = 0;
    let inView = true;
    let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: HeroConstellationHandles | null = null;

    const startClock = performance.now();

    const renderFrame = (now: number) => {
      if (!scene) return;
      scene.update((now - startClock) / 1000);
      scene.renderer.render(scene.scene, scene.camera);
    };

    const loop = (now: number) => {
      frame = 0;
      if (!inView || document.hidden) return;
      renderFrame(now);
      frame = window.requestAnimationFrame(loop);
    };

    const requestLoop = () => {
      if (!frame && inView && !document.hidden && !reduceMotion) {
        frame = window.requestAnimationFrame(loop);
      }
    };

    const syncThemeColors = () => {
      if (!scene) return;
      const { accent, dim, alpha } = readColors();
      scene.setColors(accent, dim, alpha);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height || !scene) return;
      scene.renderer.setPixelRatio(dprCap());
      scene.resize(bounds.width, bounds.height);
      if (reduceMotion) renderFrame(performance.now());
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) {
        requestLoop();
        if (reduceMotion) renderFrame(performance.now());
      }
    }, { threshold: 0.05 });
    intersectionObserver.observe(canvas);

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

    // three.js is fetched only when this layer actually mounts.
    void import("@/three/hero-constellation").then(({ createHeroConstellation }) => {
      if (disposed) return;
      const { accent, dim, alpha } = readColors();
      scene = createHeroConstellation(canvas, { accent, dim, alpha, particleBudget: particleBudget() });
      sceneRef.current = scene;
      resize();
      syncThemeColors();
      canvas.dataset.ready = "true"; // fade the layer in once the first frame exists
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
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      window.removeEventListener("pointermove", handlePointer);
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [handlePointer, readColors]);

  return <canvas ref={canvasRef} className="stage-scene__constellation" aria-hidden="true" />;
}
