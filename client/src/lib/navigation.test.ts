import { describe, expect, it } from "vitest";
import { isPrimaryNavigationId, primaryNavigation } from "./navigation";

describe("primaryNavigation", () => {
  it("uses one unique anchor for every primary portfolio section", () => {
    const ids = primaryNavigation.map(item => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(["top", "work", "learning", "about", "contact"]);
  });

  it("recognizes only registered navigation anchors", () => {
    expect(isPrimaryNavigationId("contact")).toBe(true);
    expect(isPrimaryNavigationId("missing")).toBe(false);
  });
});
