import { Code2, Database, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const TAU = Math.PI * 2;
const ORBIT_PERIOD_SECONDS = 56;
const CARD_PHASES = [0, TAU / 3, (2 * TAU) / 3] as const;

const cards = [
  { id: "data", label: "Data practice", Icon: Database },
  { id: "ai", label: "AI systems", Icon: Sparkles },
  { id: "code", label: "Software craft", Icon: Code2 },
] as const;

type OrbitGeometry = { cx: number; cy: number; rx: number; ry: number };

function pointOnEllipse(geometry: OrbitGeometry, theta: number) {
  return {
    x: geometry.cx + geometry.rx * Math.cos(theta),
    y: geometry.cy + geometry.ry * Math.sin(theta),
  };
}

function moveToOrbitPoint(element: HTMLElement, point: { x: number; y: number }) {
  element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate3d(-50%, -50%, 0)`;
}

export function OrbitalScene({ portraitSrc, portraitAlt }: { portraitSrc: string; portraitAlt: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLElement>(null);
  const ellipseRef = useRef<SVGEllipseElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const particleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pausedByHoverRef = useRef(false);
  const [isHoverPaused, setIsHoverPaused] = useState(false);

  const pauseOrbit = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || pausedByHoverRef.current) return;
    pausedByHoverRef.current = true;
    setIsHoverPaused(true);
  };

  const resumeOrbit = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !pausedByHoverRef.current) return;
    pausedByHoverRef.current = false;
    setIsHoverPaused(false);
  };

  useEffect(() => {
    const scene = sceneRef.current;
    const portrait = portraitRef.current;
    const ellipse = ellipseRef.current;
    if (!scene || !portrait || !ellipse) return;

    let frame = 0;
    let elapsed = 0;
    let previousTime = 0;
    let visible = true;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let geometry: OrbitGeometry | null = null;

    const measureGeometry = () => {
      const sceneBounds = scene.getBoundingClientRect();
      const portraitBounds = portrait.getBoundingClientRect();
      const cardBounds = cardRefs.current.map(card => card?.getBoundingClientRect()).filter(Boolean);
      if (!sceneBounds.width || !sceneBounds.height || !portraitBounds.width || !cardBounds.length) return null;

      const widestHalfCard = Math.max(...cardBounds.map(card => card!.width / 2));
      const tallestHalfCard = Math.max(...cardBounds.map(card => card!.height / 2));
      const furthestCardCorner = Math.max(...cardBounds.map(card => Math.hypot(card!.width / 2, card!.height / 2)));
      const portraitRadius = portraitBounds.width / 2;
      const clearance = Math.max(12, Math.min(34, sceneBounds.width * 0.045));
      const safeOrbitRadius = portraitRadius + furthestCardCorner + clearance;
      const maxRx = sceneBounds.width / 2 - widestHalfCard - 10;
      const maxRy = sceneBounds.height / 2 - tallestHalfCard - 12;
      const horizontalRatio = sceneBounds.width < 480 ? 1.1 : 1.34;

      return {
        cx: portraitBounds.left - sceneBounds.left + portraitBounds.width / 2,
        cy: portraitBounds.top - sceneBounds.top + portraitBounds.height / 2,
        rx: Math.max(1, Math.min(maxRx, Math.max(sceneBounds.width * 0.39, safeOrbitRadius))),
        ry: Math.max(1, Math.min(maxRy, safeOrbitRadius, maxRx / horizontalRatio)),
      };
    };

    const renderPath = (nextGeometry: OrbitGeometry) => {
      const sceneBounds = scene.getBoundingClientRect();
      const svg = ellipse.ownerSVGElement;
      if (!svg) return;
      svg.setAttribute("viewBox", `0 0 ${sceneBounds.width} ${sceneBounds.height}`);
      svg.setAttribute("width", String(sceneBounds.width));
      svg.setAttribute("height", String(sceneBounds.height));
      ellipse.setAttribute("cx", String(nextGeometry.cx));
      ellipse.setAttribute("cy", String(nextGeometry.cy));
      ellipse.setAttribute("rx", String(nextGeometry.rx));
      ellipse.setAttribute("ry", String(nextGeometry.ry));
    };

    const renderFrame = () => {
      if (!geometry) return;
      const theta = (elapsed / ORBIT_PERIOD_SECONDS) * TAU;
      cards.forEach((_, index) => {
        const card = cardRefs.current[index];
        if (card) moveToOrbitPoint(card, pointOnEllipse(geometry!, theta + CARD_PHASES[index]));
        const particle = particleRefs.current[index];
        if (particle) moveToOrbitPoint(particle, pointOnEllipse(geometry!, theta + CARD_PHASES[index] + Math.PI / 8));
      });
    };

    const refresh = () => {
      geometry = measureGeometry();
      if (!geometry) return;
      renderPath(geometry);
      renderFrame();
    };

    const tick = (time: number) => {
      if (!previousTime) previousTime = time;
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      if (visible && !reducedMotion && !pausedByHoverRef.current) {
        elapsed += delta;
        renderFrame();
      }
      frame = window.requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(scene);
    resizeObserver.observe(portrait);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      previousTime = performance.now();
    }, { threshold: 0.08 });
    intersectionObserver.observe(scene);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      previousTime = performance.now();
      renderFrame();
    };
    motionQuery.addEventListener("change", onMotionChange);

    refresh();
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div className="stage-wrap" aria-label="Portrait with orbiting capabilities">
      <div
        className="stage-scene"
        ref={sceneRef}
        data-orbit-paused={isHoverPaused ? "true" : "false"}
        onPointerEnter={pauseOrbit}
        onPointerMove={pauseOrbit}
        onPointerLeave={resumeOrbit}
        onPointerCancel={resumeOrbit}
      >
        <svg className="orbit-svg" aria-hidden="true"><ellipse className="orbit-svg__ring" ref={ellipseRef} /></svg>
        <span className="orbit-label orbit-label--one">Nidarr / 2026</span>
        <figure className="portrait-orb" ref={portraitRef}>
          <div className="portrait-backdrop" aria-hidden="true" />
          <img src={portraitSrc} alt={portraitAlt} width="1084" height="1448" fetchPriority="high" />
        </figure>
        <div className="orbit-foreground" aria-hidden="true">
          {cards.map((card, index) => <div className="role-planet" data-orbit-card={card.id} key={card.id} ref={element => { cardRefs.current[index] = element; }}><card.Icon size={15} /> {card.label}</div>)}
          {cards.map((card, index) => <span className="orbit-particle" data-orbit-particle={card.id} key={`particle-${card.id}`} ref={element => { particleRefs.current[index] = element; }} />)}
        </div>
      </div>
    </div>
  );
}
