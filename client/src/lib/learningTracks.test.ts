import { describe, expect, it } from "vitest";
import { learningTracks } from "./learningTracks";

describe("learningTracks", () => {
  it("keeps the requested technical learning directions distinct and ordered", () => {
    expect(learningTracks.map(track => track.title)).toEqual([
      "AI / ML",
      "DSA / CP",
      "System Design",
      "Cloud Architecture",
    ]);
    expect(learningTracks.every(track => track.now.length > 0 && track.tools.length > 0 && track.question.length > 0)).toBe(true);
  });
});
