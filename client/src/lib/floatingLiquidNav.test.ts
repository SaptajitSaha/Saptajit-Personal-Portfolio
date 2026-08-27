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
});
