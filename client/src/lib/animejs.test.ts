import { animate, createScope } from "animejs";
import { describe, expect, it } from "vitest";

describe("Anime.js capability setup", () => {
  it("exposes the scoped animation API required for safe React integrations", () => {
    expect(animate).toBeTypeOf("function");
    expect(createScope).toBeTypeOf("function");
  });
});
