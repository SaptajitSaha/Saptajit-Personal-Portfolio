/** Signal Field: finite React Bits-style blur reveal for hero and section copy. */
import { motion, useReducedMotion } from "framer-motion";

type BlurTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function BlurText({ text, className, delay = 0.06 }: BlurTextProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          className="blur-word"
          key={`${word}-${index}`}
          initial={reduceMotion ? false : { opacity: 0, y: 10, filter: "blur(7px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.46, delay: index * delay, ease: [0.23, 1, 0.32, 1] }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}
