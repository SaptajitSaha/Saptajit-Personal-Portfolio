import { ArrowUpRight, CircleDotDashed } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div style={{
      minHeight: "100dvh",
      display: "grid",
      placeItems: "center",
      background: "var(--ink)",
      color: "var(--paper)",
      fontFamily: "var(--font-sans)",
      padding: "24px",
    }}>
      <div style={{ maxWidth: "560px", textAlign: "left" }}>
        <p style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          margin: "0 0 22px",
          color: "var(--mist)",
          font: "500 11px/1.4 var(--font-mono)",
          letterSpacing: ".08em",
          textTransform: "uppercase",
        }}>
          <CircleDotDashed size={15} color="var(--signal)" aria-hidden="true" /> Signal lost
        </p>
        <h1 style={{
          margin: 0,
          fontSize: "clamp(4.5rem, 12vw, 8.5rem)",
          fontWeight: 600,
          lineHeight: .9,
          letterSpacing: "-.05em",
        }}>
          404
        </h1>
        <p style={{
          margin: "22px 0 30px",
          color: "var(--mist)",
          fontSize: "17px",
          lineHeight: 1.6,
          maxWidth: "42ch",
        }}>
          This page doesn&apos;t exist. The work, though, is exactly where it should be.
        </p>
        <button
          type="button"
          onClick={() => setLocation("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "9px",
            minHeight: "46px",
            padding: "0 18px",
            border: "1px solid var(--signal)",
            borderRadius: "999px",
            background: "var(--signal)",
            color: "#fff",
            font: "600 12px/1 var(--font-mono)",
            letterSpacing: ".02em",
            cursor: "pointer",
          }}
        >
          Back to the portfolio <ArrowUpRight size={17} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
