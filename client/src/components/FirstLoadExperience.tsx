import { animate, createScope, stagger } from "animejs";
import { markFirstLoadExperienceSeen } from "@/lib/firstLoadExperience";
import { useEffect, useRef } from "react";
import "./first-load-experience.css";

export function FirstLoadExperience({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const finishingRef = useRef(false);
  const fallbackTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const finalize = () => {
      if (finishingRef.current) return;
      finishingRef.current = true;
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
      markFirstLoadExperienceSeen();
      animate(root, {
        opacity: [1, 0],
        filter: ["blur(0px)", "blur(2px)"],
        duration: 220,
        ease: "in(2)",
        onComplete,
      });
    };

    scopeRef.current = createScope({ root: rootRef, mediaQueries: { reduceMotion: "(prefers-reduced-motion: reduce)" } }).add(self => {
      if (self?.matches.reduceMotion) {
        markFirstLoadExperienceSeen();
        onComplete();
        return;
      }
      animate(".first-load__signal", { opacity: [0, 1], y: [12, 0], filter: ["blur(8px)", "blur(0px)"], duration: 260, ease: "out(3)" });
      animate(".first-load__step", { opacity: [0, 1], y: [14, 0], filter: ["blur(7px)", "blur(0px)"], duration: 320, delay: stagger(95, { start: 120 }), ease: "out(3)" });
      animate(".first-load__title", { opacity: [0, 1], y: [20, 0], filter: ["blur(10px)", "blur(0px)"], duration: 440, delay: 300, ease: "out(3)" });
      animate(".first-load__meta", { opacity: [0, 1], y: [10, 0], filter: ["blur(5px)", "blur(0px)"], duration: 240, delay: 620, ease: "out(3)" });
      animate(".first-load__progress-fill", { scaleX: [0, 1], duration: 1480, delay: 340, ease: "linear", onComplete: finalize });
    });
    fallbackTimerRef.current = window.setTimeout(finalize, 3200);

    return () => {
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
      scopeRef.current?.revert();
    };
  }, [onComplete]);

  const skip = () => {
    if (finishingRef.current || !rootRef.current) return;
    finishingRef.current = true;
    if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
    markFirstLoadExperienceSeen();
    animate(rootRef.current, { opacity: [1, 0], filter: ["blur(0px)", "blur(2px)"], duration: 180, ease: "in(2)", onComplete });
  };

  return (
    <div ref={rootRef} className="first-load" role="status" aria-live="polite" aria-label="Loading Signal Field portfolio">
      <div className="first-load__grid" aria-hidden="true" />
      <div className="first-load__content">
        <p className="first-load__signal"><span aria-hidden="true">◌</span> Signal Field / 01</p>
        <div className="first-load__steps" aria-hidden="true"><span className="first-load__step">Observe</span><span className="first-load__step">Structure</span><span className="first-load__step">Build</span></div>
        <h1 className="first-load__title">Saptajit<br /><em>Saha</em></h1>
        <p className="first-load__meta">Loading portfolio systems<span aria-hidden="true"> · </span><span aria-hidden="true">Kolkata, India</span></p>
      </div>
      <div className="first-load__footer"><div className="first-load__progress" aria-hidden="true"><span className="first-load__progress-fill" /></div><button type="button" className="first-load__skip" onClick={skip}>Skip introduction <span aria-hidden="true">↗</span></button></div>
    </div>
  );
}
