import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Portfolio toasts: the palette follows the site's own ink/paper tokens. */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--surface-dialog)",
          "--normal-text": "var(--paper)",
          "--normal-border": "var(--line)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
