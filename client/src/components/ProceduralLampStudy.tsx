import { lazy, Suspense, useEffect, useRef, useState } from "react";

const ProceduralLampCanvas = lazy(() => import("./ProceduralLampCanvas"));

export function ProceduralLampStudy() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: "240px 0px", threshold: 0.02 });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section procedural-study" data-trail-color="85,163,255" aria-labelledby="procedural-study-heading">
      <div className="procedural-study__heading">
        <div>
          <span className="section-label">Procedural study / 01</span>
          <h2 id="procedural-study-heading">From reference<br /><em>to runtime.</em></h2>
        </div>
        <p>A controlled desk-lamp reference rebuilt as an inspectable Three.js component hierarchy. It is an honest reconstruction study: unseen geometry is approximate, while every visible part remains named and interactive.</p>
      </div>
      <div className="procedural-study__frame" ref={hostRef}>
        {shouldLoad ? <Suspense fallback={<StudyLoadingState />}><ProceduralLampCanvas /></Suspense> : <StudyLoadingState />}
      </div>
      <div className="procedural-study__footnote">
        <span>Single-view reconstruction · approximate hidden geometry</span>
        <a href="https://github.com/img2threejs/img2threejs" target="_blank" rel="noreferrer">Built as an img2threejs study <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}

function StudyLoadingState() {
  return <div className="procedural-study__loading" aria-live="polite"><span aria-hidden="true" /><p>Preparing procedural scene</p></div>;
}
