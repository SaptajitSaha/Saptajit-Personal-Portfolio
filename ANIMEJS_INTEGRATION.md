# Anime.js Integration Notes

**Status:** Anime.js `4.5.0` is installed as a production dependency. It is available for future, intentionally choreographed interactions; the existing CSS, canvas, and WebGL effects remain in place because they are already the lighter and more suitable implementation for their respective jobs.

## What Anime.js Adds

Anime.js v4 supports direct ES-module imports with Vite, including `animate`, timelines, scopes, utilities, and playback controls. Its official React guidance pairs a root ref with `createScope()` inside `useEffect()`, then calls `revert()` on cleanup so component-owned animations do not leak when React unmounts a component.[1] [2]

> “Anime.js can be used with React by combining React's `useEffect()` and Anime.js `createScope()` methods.” — Anime.js documentation.[2]

| Portfolio need | Recommended approach | Reason |
|---|---|---|
| Existing case-study and learning dropdowns | Keep controlled CSS transitions | They are frequent disclosures with accessible state, interruption support, and no new JavaScript runtime work. |
| Pixel-grid trail | Keep the canvas implementation | It needs pointer-speed rendering and a dormant request-animation-frame loop, not DOM tween orchestration. |
| Mesh-drift hero layer | Keep the WebGL implementation | The effect is a shader-rendered atmospheric layer, for which Anime.js is not the rendering engine. |
| A future one-time project transition or SVG detail | Use Anime.js scope + `animate()` | A coordinated sequence across several DOM/SVG elements is a strong fit. |
| A future manual animation control | Use the returned animation instance’s playback methods | Anime.js provides methods such as `pause()` and `resume()` for explicit user controls.[3] |

## Required React Pattern

Every future Anime.js component should isolate DOM work with a scoped root and clean up on unmount. This preserves React ownership of rendering while Anime.js owns only temporary visual properties.

```tsx
import { animate, createScope } from "animejs";
import { useEffect, useRef } from "react";

export function ScopedMotionExample() {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    scope.current = createScope({
      root,
      mediaQueries: { reduceMotion: "(prefers-reduced-motion: reduce)" },
    }).add(self => {
      if (self.matches.reduceMotion) return;
      animate(".target", { opacity: [0, 1], y: [8, 0], duration: 280, ease: "out(3)" });
    });
    return () => scope.current?.revert();
  }, []);

  return <div ref={root}><div className="target" /></div>;
}
```

## Guardrails

The portfolio should continue to favor **CSS transitions** for hover, press, short disclosure, and high-frequency button feedback. Anime.js should not duplicate the carousel timer, pixel-grid animation, mesh shader, or ripple system. New Anime.js work must animate only `transform`, `opacity`, or suitable SVG properties; respect `prefers-reduced-motion`; pause when an interaction is not visible or no longer relevant; and use `scope.revert()` during cleanup. Anime.js scopes can also react to a reduced-motion media query, providing a component-level fallback when a richer future sequence genuinely needs the library.[4]

## References

[1] [Anime.js installation and ES-module imports](https://animejs.com/documentation/getting-started/installation/)

[2] [Using Anime.js with React](https://animejs.com/documentation/getting-started/using-with-react/)

[3] [Anime.js animation `pause()` method](https://animejs.com/documentation/animation/animation-methods/pause/)

[4] [Anime.js scope and media-query support](https://animejs.com/documentation/scope/)
