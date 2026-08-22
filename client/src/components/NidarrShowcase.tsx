import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState } from "react";
import "./nidarr-showcase.css";

type NidarrScreens = {
  dashboard: string;
  report: string;
  map: string;
};

const screens = [
  { id: "report", label: "Nidarr report an incident screen", key: "report" },
  { id: "dashboard", label: "Nidarr safety overview dashboard", key: "dashboard" },
  { id: "map", label: "Nidarr safety map centered on Kolkata", key: "map" },
] as const;

export function NidarrShowcase({ assets }: { assets: NidarrScreens }) {
  const [expanded, setExpanded] = useState(false);
  const [instant, setInstant] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const isExpanded = expanded || reducedMotion;
  const toggle = (immediately = false) => {
    if (reducedMotion) return;
    if (immediately) {
      setInstant(true);
      window.requestAnimationFrame(() => setInstant(false));
    }
    setExpanded(value => !value);
  };

  return (
    <section className={`nidarr-showcase${isExpanded ? " is-expanded" : ""}${instant ? " is-instant" : ""}`} aria-label="Interactive Nidarr product screens">
      <div className="nidarr-showcase__atmosphere" aria-hidden="true" />
      <div className="nidarr-showcase__stage">
        {screens.map(screen => (
          <a
            className={`nidarr-showcase__screen nidarr-showcase__screen--${screen.id}`}
            href="https://nidarr.vercel.app/"
            target="_blank"
            rel="noreferrer"
            key={screen.id}
            aria-label={`Open Nidarr live prototype: ${screen.label}`}
          >
            <img src={assets[screen.key]} alt={screen.label} width="437" height="865" loading="lazy" />
          </a>
        ))}
      </div>
      <button
        className="nidarr-showcase__control"
        type="button"
        aria-pressed={isExpanded}
        aria-label={isExpanded ? "Show compact Nidarr product screens" : "Expand Nidarr product screens"}
        onClick={event => { if (event.detail) toggle(); }}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle(true);
          }
        }}
      >
        {isExpanded ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
        <span>{isExpanded ? "Compact" : "Expand"}</span>
      </button>
    </section>
  );
}
