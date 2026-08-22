import { Code2, Database, Pause, Play, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { pointOnEllipse, TAU, type EllipseGeometry } from "@/lib/orbitGeometry";

const orbitPeriodSeconds = 64;
const orbitRotation = -0.19;
const cardDefinitions = [
  { id: "data", label: "Data practice", phase: (5 * Math.PI) / 4, Icon: Database },
  { id: "ai", label: "AI systems", phase: (5 * Math.PI) / 4 + TAU / 3, Icon: Sparkles },
  { id: "code", label: "Software craft", phase: (5 * Math.PI) / 4 + (2 * TAU) / 3, Icon: Code2 },
] as const;

function applyPosition(element: HTMLElement, point: { x: number; y: number }, angle: number) {
  element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate3d(-50%, -50%, 0)`;
  element.dataset.orbitAngle = String(angle);
}

export function OrbitalScene({ portraitSrc, portraitAlt }: { portraitSrc: string; portraitAlt: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const primaryOrbitRef = useRef<SVGEllipseElement>(null);
  const secondaryOrbitRefs = useRef<Array<SVGEllipseElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const particleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pausedRef = useRef(false);
  const hoveredRef = useRef(false);
  const [persistentPaused, setPersistentPaused] = useState(false);

  useEffect(() => {
    pausedRef.current = persistentPaused;
  }, [persistentPaused]);

  useEffect(() => {
    const scene = sceneRef.current;
    const portrait = portraitRef.current;
    const svg = svgRef.current;
    const primaryOrbit = primaryOrbitRef.current;
    if (!scene || !portrait || !svg || !primaryOrbit) return;

    let frame = 0;
    let lastFrameTime = 0;
    let elapsedSeconds = 0;
    let visible = true;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let geometry: EllipseGeometry | null = null;

    const getGeometry = () => {
      const sceneBounds = scene.getBoundingClientRect();
      const portraitBounds = portrait.getBoundingClientRect();
      const portraitSize = Math.min(portraitBounds.width, portraitBounds.height);
      if (!sceneBounds.width || !sceneBounds.height || !portraitSize) return null;

      return {
        centerX: portraitBounds.left - sceneBounds.left + portraitBounds.width / 2,
        centerY: portraitBounds.top - sceneBounds.top + portraitBounds.height / 2,
        radiusX: Math.min(sceneBounds.width * 0.38, portraitSize * 1.95),
        radiusY: Math.min(sceneBounds.height * 0.37, portraitSize * 2),
        rotation: orbitRotation,
      };
    };

    const renderOrbitPaths = (nextGeometry: EllipseGeometry) => {
      const sceneBounds = scene.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${sceneBounds.width} ${sceneBounds.height}`);
      svg.setAttribute("width", String(sceneBounds.width));
      svg.setAttribute("height", String(sceneBounds.height));

      const setEllipse = (element: SVGEllipseElement | null, scale: number) => {
        if (!element) return;
        element.setAttribute("cx", String(nextGeometry.centerX));
        element.setAttribute("cy", String(nextGeometry.centerY));
        element.setAttribute("rx", String(nextGeometry.radiusX * scale));
        element.setAttribute("ry", String(nextGeometry.radiusY * scale));
        element.setAttribute("transform", `rotate(${(nextGeometry.rotation * 180) / Math.PI} ${nextGeometry.centerX} ${nextGeometry.centerY})`);
      };

      setEllipse(primaryOrbit, 1);
      setEllipse(secondaryOrbitRefs.current[0], 0.8);
      setEllipse(secondaryOrbitRefs.current[1], 0.62);
    };

    const renderPositions = () => {
      if (!geometry) return;
      const currentGeometry = geometry;
      const baseAngle = (elapsedSeconds / orbitPeriodSeconds) * TAU;
      cardDefinitions.forEach((card, index) => {
        const angle = baseAngle + card.phase;
        const element = cardRefs.current[index];
        if (element) applyPosition(element, pointOnEllipse(currentGeometry, angle), angle);
      });
      particleRefs.current.forEach((element, index) => {
        const angle = baseAngle + cardDefinitions[index].phase + Math.PI / 6;
        if (element) applyPosition(element, pointOnEllipse(currentGeometry, angle), angle);
      });
    };

    const refreshGeometry = () => {
      geometry = getGeometry();
      if (!geometry) return;
      renderOrbitPaths(geometry);
      renderPositions();
    };

    const update = (time: number) => {
      if (!lastFrameTime) lastFrameTime = time;
      const deltaSeconds = Math.min((time - lastFrameTime) / 1000, 0.05);
      lastFrameTime = time;
      if (!reducedMotion && visible && !pausedRef.current && !hoveredRef.current) {
        elapsedSeconds += deltaSeconds;
        renderPositions();
      }
      frame = window.requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(refreshGeometry);
    resizeObserver.observe(scene);
    resizeObserver.observe(portrait);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastFrameTime = performance.now();
    }, { threshold: 0.08 });
    intersectionObserver.observe(scene);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      lastFrameTime = performance.now();
      renderPositions();
    };
    motionQuery.addEventListener("change", onMotionChange);

    refreshGeometry();
    frame = window.requestAnimationFrame(update);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scene = sceneRef.current;
    if (!scene) return;
    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    scene.style.setProperty("--scene-rotate-x", `${Math.max(-2, Math.min(2, y * -4))}deg`);
    scene.style.setProperty("--scene-rotate-y", `${Math.max(-2.5, Math.min(2.5, x * 4.5))}deg`);
  };

  return (
    <div className="stage-wrap" aria-label="Portrait with orbiting capabilities">
      <div
        className="stage-scene"
        ref={sceneRef}
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          hoveredRef.current = false;
          sceneRef.current?.style.setProperty("--scene-rotate-x", "0deg");
          sceneRef.current?.style.setProperty("--scene-rotate-y", "0deg");
        }}
        onPointerEnter={() => { hoveredRef.current = true; }}
      >
        <svg className="orbit-svg" ref={svgRef} aria-hidden="true">
          <ellipse className="orbit-svg__ring orbit-svg__ring--primary" ref={primaryOrbitRef} />
          <ellipse className="orbit-svg__ring orbit-svg__ring--secondary" ref={element => { secondaryOrbitRefs.current[0] = element; }} />
          <ellipse className="orbit-svg__ring orbit-svg__ring--tertiary" ref={element => { secondaryOrbitRefs.current[1] = element; }} />
        </svg>
        <span className="orbit-label orbit-label--one">Nidarr / 2026</span>
        <figure className="portrait-orb" ref={portraitRef}>
          <div className="portrait-backdrop" aria-hidden="true" />
          <img src={portraitSrc} alt={portraitAlt} width="1084" height="1448" fetchPriority="high" />
        </figure>
        <div className="orbit-foreground" aria-hidden="true">
          {cardDefinitions.map((card, index) => (
            <div className={`role-planet role-planet--${card.id}`} data-orbit-card={card.id} key={card.id} ref={element => { cardRefs.current[index] = element; }}>
              <card.Icon size={15} /> {card.label}
            </div>
          ))}
          {cardDefinitions.map((card, index) => <span className="orbit-particle" data-orbit-particle={card.id} key={`particle-${card.id}`} ref={element => { particleRefs.current[index] = element; }} />)}
        </div>
        <button className="orbit-motion-toggle" type="button" aria-pressed={persistentPaused} onClick={() => setPersistentPaused(value => !value)}>
          {persistentPaused ? <><Play size={13} aria-hidden="true" /> Resume orbit</> : <><Pause size={13} aria-hidden="true" /> Pause orbit</>}
        </button>
      </div>
    </div>
  );
}
