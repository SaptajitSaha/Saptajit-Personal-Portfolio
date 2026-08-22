import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import "./phone-mockups-1.css";

export type ImageItem = {
  src: string;
  alt: string;
  label: string;
};

type PhoneCarouselProps = {
  images: ImageItem[];
  className?: string;
};

function relativeIndex(index: number, active: number, total: number) {
  const value = (index - active + total) % total;
  return value > total / 2 ? value - total : value;
}

export function PhoneCarousel({ images, className = "" }: PhoneCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  if (!images.length) return null;

  const select = (index: number) => setActiveIndex((index + images.length) % images.length);
  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); select(activeIndex - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); select(activeIndex + 1); }
  };

  return (
    <section className={`phone-carousel ${className}`} aria-roledescription="carousel" aria-label="Nidarr mobile product screens" onKeyDown={onKeyDown} tabIndex={0}>
      <p className="phone-carousel__status" aria-live="polite">{activeIndex + 1} of {images.length}: {activeImage.label}</p>
      <div className="phone-carousel__stage" aria-hidden="true">
        {images.map((image, index) => {
          const position = relativeIndex(index, activeIndex, images.length);
          const slot = position === 0 ? "active" : position === -1 ? "previous" : position === 1 ? "next" : "hidden";
          return (
            <figure className="phone-carousel__phone" data-slot={slot} key={image.src}>
              <div className="phone-carousel__speaker" />
              <img src={image.src} alt="" width="440" height="871" loading={index === 0 ? "eager" : "lazy"} />
            </figure>
          );
        })}
      </div>
      <div className="phone-carousel__controls">
        <button className="phone-carousel__arrow" type="button" onClick={() => select(activeIndex - 1)} aria-label={`Show previous screen: ${images[(activeIndex - 1 + images.length) % images.length].label}`}><ChevronLeft size={17} aria-hidden="true" /></button>
        <div className="phone-carousel__dots" aria-label="Choose a Nidarr product screen">
          {images.map((image, index) => <button className="phone-carousel__dot" type="button" key={image.src} data-active={index === activeIndex || undefined} onClick={() => select(index)} aria-label={`Show ${image.label}`} aria-current={index === activeIndex ? "true" : undefined} />)}
        </div>
        <button className="phone-carousel__arrow" type="button" onClick={() => select(activeIndex + 1)} aria-label={`Show next screen: ${images[(activeIndex + 1) % images.length].label}`}><ChevronRight size={17} aria-hidden="true" /></button>
      </div>
    </section>
  );
}
