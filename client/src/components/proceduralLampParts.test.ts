import { describe, expect, it } from "vitest";
import { PROCEDURAL_LAMP_PARTS, PROCEDURAL_LAMP_PART_LABELS } from "./proceduralLampParts";

describe("procedural lamp study contract", () => {
  it("keeps a named, action-ready twelve-part hierarchy", () => {
    expect(PROCEDURAL_LAMP_PARTS).toHaveLength(12);
    expect(new Set(PROCEDURAL_LAMP_PARTS.map((part) => part.id)).size).toBe(12);
  });

  it("retains the visible articulated and shade systems as selectable parts", () => {
    expect(PROCEDURAL_LAMP_PART_LABELS["lower-link"]).toContain("Lower");
    expect(PROCEDURAL_LAMP_PART_LABELS["upper-link"]).toContain("Upper");
    expect(PROCEDURAL_LAMP_PART_LABELS["shade-shell"]).toContain("shade");
    expect(PROCEDURAL_LAMP_PART_LABELS["power-cable"]).toContain("cable");
  });
});
