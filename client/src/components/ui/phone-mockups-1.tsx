import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import "./phone-mockups-1.css";

export type ImageItem = { src: string; alt: string; label: string };

type PhoneCarouselProps = { images: ImageItem[]; className?: string };

const AUTOPLAY_DELAY = 4800;

function relativeIndex(index: number, active: number, total: number) {
  const value = (index - active + total) % total;
  return value > total / 2 ? value - total : value;
}

export function PhoneCarousel({ images, className = "" }: PhoneCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const carouselRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);
  const activeImage = images[activeIndex];
  const autoplayPaused = !autoplayEnabled || hoverPaused || focusPaused || pageHidden || reducedMotion;

  const updateProgress = useCallback((elapsed: number) => {
    progressRef.current?.style.setProperty("transform", `scaleX(${Math.min(1, elapsed / AUTOPLAY_DELAY)})`);
  }, []);
  const resetProgress = useCallback(() => { elapsedRef.current = 0; updateProgress(0); }, [updateProgress]);
  const select = useCallback((index: number) => { resetProgress(); setActiveIndex(current => (index + images.length) % images.length); }, [images.length, resetProgress]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    const syncVisibility = () => setPageHidden(document.visibilityState !== "visible");
    syncMotion(); syncVisibility();
    media.addEventListener("change", syncMotion); document.addEventListener("visibilitychange", syncVisibility);
    return () => { media.removeEventListener("change", syncMotion); document.removeEventListener("visibilitychange", syncVisibility); };
  }, []);

  useEffect(() => {
    if (images.length < 2 || autoplayPaused) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      elapsedRef.current += Math.min(now - previous, 64);
      previous = now;
      if (elapsedRef.current >= AUTOPLAY_DELAY) {
        select(activeIndex + 1);
        return;
      }
      updateProgress(elapsedRef.current);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, autoplayPaused, images.length, select, updateProgress]);

  if (!images.length) return null;

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); select(activeIndex - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); select(activeIndex + 1); }
  };
  const onBlurCapture = () => window.requestAnimationFrame(() => setFocusPaused(carouselRef.current?.contains(document.activeElement) ?? false));
  const onPointerEnter = (event: React.PointerEvent<HTMLElement>) => { if (event.pointerType === "mouse") setHoverPaused(true); };
  const onPointerLeave = (event: React.PointerEvent<HTMLElement>) => { if (event.pointerType === "mouse") setHoverPaused(false); };

  return (
    <section ref={carouselRef} className={`phone-carousel ${className}`} data-autoplay={autoplayPaused ? "paused" : "playing"} aria-roledescription="carousel" aria-label="Nidarr mobile product screens" onKeyDown={onKeyDown} onFocusCapture={() => setFocusPaused(true)} onBlurCapture={onBlurCapture} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} tabIndex={0}>
      <p className="phone-carousel__status" aria-live={autoplayPaused ? "polite" : "off"}>{activeIndex + 1} of {images.length}: {activeImage.label}</p>
      <div className="phone-carousel__stage" aria-hidden="true">{images.map((image, index) => { const position = relativeIndex(index, activeIndex, images.length); const slot = position === 0 ? "active" : position === -1 ? "previous" : position === 1 ? "next" : "hidden"; return <figure className="phone-carousel__phone" data-slot={slot} key={image.src}><div className="phone-carousel__speaker" /><img src={image.src} alt="" width="440" height="871" loading="eager" /></figure>; })}</div>
      <div className="phone-carousel__progress" aria-hidden="true"><span ref={progressRef} /></div>
      <div className="phone-carousel__controls">
        <button className="phone-carousel__arrow" type="button" onClick={() => select(activeIndex - 1)} aria-label={`Show previous screen: ${images[(activeIndex - 1 + images.length) % images.length].label}`}><ChevronLeft size={17} aria-hidden="true" /></button>
        <div className="phone-carousel__dots" aria-label="Choose a Nidarr product screen">{images.map((image, index) => <button className="phone-carousel__dot" type="button" key={image.src} data-active={index === activeIndex || undefined} onClick={() => select(index)} aria-label={`Show ${image.label}`} aria-current={index === activeIndex ? "true" : undefined} />)}</div>
        <button className="phone-carousel__arrow" type="button" onClick={() => select(activeIndex + 1)} aria-label={`Show next screen: ${images[(activeIndex + 1) % images.length].label}`}><ChevronRight size={17} aria-hidden="true" /></button>
        <button className="phone-carousel__autoplay" type="button" onClick={() => setAutoplayEnabled(enabled => !enabled)} aria-pressed={!autoplayEnabled} aria-label={autoplayEnabled ? "Pause automatic screen rotation" : "Resume automatic screen rotation"} disabled={reducedMotion}>{autoplayEnabled ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}</button>
      </div>
    </section>
  );
}
