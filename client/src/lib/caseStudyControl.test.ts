import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");

describe("Nidarr case-study removal", () => {
  it("does not render or import the removed case-study control", () => {
    expect(homeSource).not.toContain("CaseStudyPanel");
    expect(homeSource).not.toContain("Explore {study.title} case study");
    expect(homeSource).not.toContain("Explore Nidarr case study");
  });
});
