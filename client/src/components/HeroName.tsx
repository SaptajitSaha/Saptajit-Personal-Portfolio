import { animate, createScope, stagger } from "animejs";
import { useEffect, useRef } from "react";

type HeroNameProps = {
  /** The letters hold their final state once the intro overlay hands over. */
  active: boolean;
};

const GIVEN_NAME = "Saptajit";
const SURNAME = "Saha";

function Letters({ name }: { name: string }) {
  return (
    <span className="hero-name__word" aria-hidden="true">
      {name.split("").map((letter, index) => (
        <span className="hero-name__letter" key={`${letter}-${index}`}>
          {letter}
        </span>
      ))}
    </span>
  );
}

/**
 * The display name: real text for assistive tech, animated letters for
 * everyone else. anime.js staggers the letters in once the first-load
 * intro hands over; reduced-motion users get the static name immediately.
 */
export function HeroName({ active }: HeroNameProps) {
  const scopeRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!active) return;
    const scope = createScope({ root: scopeRef }).add(() => {
      animate(".hero-name__letter", {
        opacity: [0, 1],
        y: [26, 0],
        rotate: [4, 0],
        filter: ["blur(10px)", "blur(0px)"],
        duration: 620,
        delay: stagger(34, { start: 120 }),
        ease: "out(4)",
      });
    });
    return () => scope.revert();
  }, [active]);

  return (
    <h1 id="hero-title" className="hero-name" ref={scopeRef} aria-label={`${GIVEN_NAME} ${SURNAME}`}>
      <span className="hero-name__line">
        <Letters name={GIVEN_NAME} />
      </span>
      <span className="hero-name__line hero-name__line--surname">
        <Letters name={SURNAME} />
      </span>
    </h1>
  );
}
