import { animate, createScope } from "animejs";
import { primaryNavigation, type PrimaryNavigationId } from "@/lib/navigation";
import { useEffect, useRef } from "react";
import "./floating-liquid-nav.css";

type FloatingLiquidNavProps = {
  activeSection: PrimaryNavigationId;
  onNavigate: (id: PrimaryNavigationId) => void;
};

export function FloatingLiquidNav({ activeSection, onNavigate }: FloatingLiquidNavProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scope = createScope({ root: navRef, mediaQueries: { reduceMotion: "(prefers-reduced-motion: reduce)" } }).add(self => {
      if (self?.matches.reduceMotion) return;
      animate(".liquid-nav__surface", {
        opacity: [0, 1],
        y: [-14, 0],
        filter: ["blur(8px)", "blur(0px)"],
        duration: 460,
        ease: "out(3)",
      });
    });
    return () => scope.revert();
  }, []);

  return (
    <nav ref={navRef} className="liquid-nav" aria-label="Primary navigation">
      <div className="liquid-nav__surface">
        {primaryNavigation.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-active={activeSection === item.id || undefined}
            aria-current={activeSection === item.id ? "location" : undefined}
            onClick={() => onNavigate(item.id)}
          >
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
