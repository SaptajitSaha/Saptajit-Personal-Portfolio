import { describe, expect, it } from "vitest";
import { toolboxPractices, toolboxTickerRows } from "./toolboxTicker";

describe("toolboxTickerRows", () => {
  it("uses unique authentic-logo entries across alternating ticker rows", () => {
    const names = toolboxTickerRows.flatMap(row => row.tools.map(tool => tool.name));
    expect(new Set(names).size).toBe(names.length);
    expect(toolboxTickerRows.map(row => row.direction)).toEqual(["left", "right", "left"]);
    expect(toolboxTickerRows.flatMap(row => row.tools).every(tool => tool.mark.kind === "simple" ? tool.mark.icon.path.length > 0 && tool.mark.icon.hex.length === 6 : tool.mark.icon.body.length > 0)).toBe(true);
    expect(toolboxPractices).toEqual(["SQL", "Statistics", "Machine learning"]);
    expect(names).toContain("Looker Studio");
  });
});
