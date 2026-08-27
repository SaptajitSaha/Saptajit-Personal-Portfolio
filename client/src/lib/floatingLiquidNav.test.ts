import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("../components/floating-liquid-nav.css", import.meta.url), "utf8");

describe("floating liquid navigation material", () => {
  it("uses a light translucent surface with restrained blur and readable labels", () => {
    expect(styles).toContain("rgba(13,13,17,.42)");
    expect(styles).toContain("backdrop-filter:blur(14px) saturate(1.24)");
    expect(styles).toContain("-webkit-backdrop-filter:blur(14px) saturate(1.24)");
    expect(styles).toContain("color:rgba(241,238,233,.78)");
    expect(styles).toContain("@media (prefers-reduced-transparency:reduce)");
  });

  it("uses one clean liquid pop treatment with larger desktop and mobile labels", () => {
    expect(styles).toContain("font:600 12px/1 var(--font-sans)");
    expect(styles).toContain("font-size:11.25px");
    expect(styles).toContain(".liquid-nav a:hover {\n  color:var(--paper);\n  transform:translateY(-3px) scale(1.065);");
    expect(styles).toContain("transition:color 160ms var(--ease-out),background-color 180ms var(--ease-out),border-color 180ms var(--ease-out),box-shadow 180ms var(--ease-out),transform 220ms cubic-bezier(.16,1,.3,1)");
    expect(styles).toContain(".liquid-nav a:hover:not([data-active])::before {\n  opacity:.7;\n  transform:scale(1);");
    expect(styles).toContain(".liquid-nav a:hover:not([data-active])::after {\n  opacity:.4;\n  transform:scaleX(.82);");
    expect(styles).not.toContain("translateY(-1px)");
    expect(styles).toContain("@media (prefers-reduced-motion:reduce)");
  });
});
