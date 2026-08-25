import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("Nidarr mobile spacing", () => {
  it("does not retain the former fixed-height content reservation before the preview", () => {
    expect(stylesheet).not.toContain(".nidarr-card .project-card__content { width:100%; min-height:940px; }");
    expect(stylesheet).toContain("@media (max-width:660px) { .nidarr-card .project-card__content { min-height:0; } }");
  });
});
