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
 * Applies the next theme. Where the View Transitions API is available (and
 * motion is allowed), the new theme is revealed as a circle expanding from
 * the toggle button: the button's coordinates are baked into --reveal-x/y
 * custom properties and the expansion itself runs as a pure CSS animation on
 * ::view-transition-new(root), which survives minification and engine
 * differences far better than a JS-driven pseudo-element animation.
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

  const root = document.documentElement;
  const maxRadius = Math.round(
    1.15 * Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y),
    ),
  );
  root.style.setProperty("--reveal-x", `${Math.round(origin.x)}px`);
  root.style.setProperty("--reveal-y", `${Math.round(origin.y)}px`);
  root.style.setProperty("--reveal-r", `${maxRadius}px`);

  const transition = scoped.startViewTransition(apply);
  transition.ready.catch(() => {
    /* transition skipped (e.g. document hidden); theme is already applied */
  });
}
