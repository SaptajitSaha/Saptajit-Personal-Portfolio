/** Signal Field: finite React Bits-style blur reveal for hero and section copy. */
type BlurTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function BlurText({ text, className, delay = 0.06 }: BlurTextProps) {
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {words.map((word, index) => (
        <span
          aria-hidden="true"
          className="blur-word"
          key={`${word}-${index}`}
          style={{ animationDelay: `${index * delay}s`, marginRight: index < words.length - 1 ? "0.24em" : undefined }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
