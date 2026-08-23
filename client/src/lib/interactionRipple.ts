type RippleEvent = { currentTarget: HTMLElement; clientX: number; clientY: number };

export function triggerInteractionRipple(event: RippleEvent) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = event.currentTarget;
  target.querySelectorAll(".interaction-ripple").forEach(node => node.remove());
  const bounds = target.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "interaction-ripple";
  ripple.style.setProperty("--ripple-x", `${event.clientX - bounds.left}px`);
  ripple.style.setProperty("--ripple-y", `${event.clientY - bounds.top}px`);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  target.appendChild(ripple);
}
