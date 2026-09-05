import { animate, createScope } from "animejs";
import { primaryNavigation, type PrimaryNavigationId } from "@/lib/navigation";
import { applyTheme, readStoredTheme, storeTheme, transitionTheme, type PortfolioTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import "./floating-liquid-nav.css";

type FloatingLiquidNavProps = {
  activeSection: PrimaryNavigationId;
  onNavigate: (id: PrimaryNavigationId) => void;
};

export function FloatingLiquidNav({ activeSection, onNavigate }: FloatingLiquidNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<PortfolioTheme>(() => readStoredTheme());

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

  const switchTheme = useCallback(() => {
    const next: PortfolioTheme = theme === "paper" ? "ink" : "paper";
    const rect = themeButtonRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth - 40, y: 32 };
    transitionTheme(next, origin, () => {
      flushSync(() => {
        applyTheme(next);
        storeTheme(next);
        setTheme(next);
      });
    });
  }, [theme]);

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
        <button
          ref={themeButtonRef}
          type="button"
          className="liquid-nav__theme"
          data-current={theme}
          onClick={switchTheme}
          aria-label={theme === "paper" ? "Switch to dark theme" : "Switch to light theme"}
          title={theme === "paper" ? "Dark" : "Light"}
        >
          <span className="liquid-nav__theme-icon liquid-nav__theme-icon--moon" aria-hidden="true"><Moon size={15} /></span>
          <span className="liquid-nav__theme-icon liquid-nav__theme-icon--sun" aria-hidden="true"><Sun size={15} /></span>
        </button>
      </div>
    </nav>
  );
}
