import { useEffect, useRef } from "react";

type TrailPoint = { x: number; y: number; life: number };

const BASE = [23, 20, 26] as const;
const ACTIVE = [232, 76, 53] as const;
const MAX_TRAIL_POINTS = 10;
const TRAIL_DURATION = 0.78;

function mixColor(from: readonly number[], to: readonly number[], amount: number) {
  return from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
}

export function InteractivePixelGrid({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true, desynchronized: true });
    if (!canvas || !context) {
      if (canvas) canvas.dataset.canvas = "unavailable";
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let bounds = canvas.getBoundingClientRect();
    let frame = 0;
    let lastTime = 0;
    let inView = true;
    let pointer = { x: -1000, y: -1000, active: false };
    let previousPoint: { x: number; y: number } | null = null;
    let trail: TrailPoint[] = [];

    const gridMetrics = () => {
      const cell = Math.max(16, Math.min(24, Math.round(bounds.width / 48)));
      return { cell, columns: Math.ceil(bounds.width / cell), rows: Math.ceil(bounds.height / cell) };
    };

    const resize = () => {
      bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(bounds.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const render = () => {
      const { cell, columns, rows } = gridMetrics();
      context.clearRect(0, 0, bounds.width, bounds.height);
      context.globalCompositeOperation = "source-over";

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * cell + cell * 0.5;
          const y = row * cell + cell * 0.5;
          const pointerDistance = Math.hypot(pointer.x - x, pointer.y - y);
          let energy = pointer.active ? Math.max(0, 1 - pointerDistance / (cell * 5.8)) : 0;
          for (const point of trail) {
            const distance = Math.hypot(point.x - x, point.y - y);
            energy = Math.max(energy, Math.max(0, 1 - distance / (cell * 3.9)) * point.life * 0.84);
          }
          const intensity = Math.min(1, energy * energy * 1.18);
          const color = mixColor(BASE, ACTIVE, intensity);
          context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${0.13 + intensity * 0.74})`;
          context.fillRect(column * cell + 1, row * cell + 1, cell - 2, cell - 2);
        }
      }
    };

    const requestRender = () => {
      if (!frame && inView) frame = window.requestAnimationFrame(tick);
    };

    const tick = (now: number) => {
      frame = 0;
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;
      if (!motionQuery.matches) {
        trail = trail.map(point => ({ ...point, life: Math.max(0, point.life - delta / TRAIL_DURATION) })).filter(point => point.life > 0.01);
      } else {
        pointer = { x: -1000, y: -1000, active: false };
        trail = [];
      }
      render();
      if (!motionQuery.matches && trail.length > 0) requestRender();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (motionQuery.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      const within = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!within) {
        pointer.active = false;
        previousPoint = null;
        requestRender();
        return;
      }
      const next = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      if (!previousPoint || Math.hypot(next.x - previousPoint.x, next.y - previousPoint.y) > gridMetrics().cell * 0.35) {
        trail = [...trail.slice(-(MAX_TRAIL_POINTS - 1)), { ...next, life: 1 }];
        previousPoint = next;
      }
      pointer = { ...next, active: true };
      requestRender();
    };

    const onMotionChange = () => {
      lastTime = 0;
      requestRender();
    };
    const resizeObserver = new ResizeObserver(() => {
      resize();
      requestRender();
    });
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) requestRender();
      else if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: 0.05 });
    intersectionObserver.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    motionQuery.addEventListener("change", onMotionChange);
    resize();
    requestRender();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
