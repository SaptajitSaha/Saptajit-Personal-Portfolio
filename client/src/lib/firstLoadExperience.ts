const SESSION_KEY = "signal-field-intro-seen";

export function shouldSkipFirstLoadExperience() {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "true" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
}

export function markFirstLoadExperienceSeen() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "true");
  } catch {
    // A blocked session store should never prevent the portfolio from becoming usable.
  }
}
