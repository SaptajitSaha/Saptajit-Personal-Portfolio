export type PortfolioTheme = "ink" | "paper";

const STORAGE_KEY = "portfolio-theme";

export function readStoredTheme(): PortfolioTheme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "paper" ? "paper" : "ink";
  } catch {
    return "ink";
  }
}

export function applyTheme(theme: PortfolioTheme) {
  const root = document.documentElement;
  if (theme === "paper") root.dataset.theme = "paper";
  else delete root.dataset.theme;
}

export function storeTheme(theme: PortfolioTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable; theme stays session-only */
  }
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

/**
 * Applies the next theme. When the browser supports the View Transitions API
 * (and motion is allowed), the new theme is revealed as a circle expanding
 * from the toggle button's position; otherwise the swap is instant.
 */
export function transitionTheme(
  next: PortfolioTheme,
  origin: { x: number; y: number },
  apply: () => void,
) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }
  const scoped = document as ViewTransitionDocument;
  if (typeof scoped.startViewTransition !== "function") {
    apply();
    return;
  }
  const maxRadius = 1.15 * Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );
  const transition = scoped.startViewTransition(apply);
  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${maxRadius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: 640,
          easing: "cubic-bezier(.16, 1, .3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {
      /* transition skipped before ready; theme is already applied */
    });
}
