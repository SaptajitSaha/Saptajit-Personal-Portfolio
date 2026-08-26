import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const nidarrStyles = readFileSync(new URL("../components/nidarr-showcase.css", import.meta.url), "utf8");

describe("mobile project and lesson readability", () => {
  it("puts Nidarr copy before its media and gives lesson controls readable touch spacing", () => {
    expect(nidarrStyles).toContain(".nidarr-card .project-card__content { order:1; width:100%; min-height:0; padding:26px 20px 22px; }");
    expect(nidarrStyles).toContain(".nidarr-showcase { position:relative; z-index:1; inset:auto; order:2; width:100%; height:430px; min-height:430px; }");
    expect(stylesheet).toContain("@media (max-width:660px) { .signal-field--liquid .nidarr-card .project-card__content { width:100%; } }");
    expect(stylesheet).toContain(".learning-card__trigger { grid-template-columns:30px minmax(0,1fr) 16px; grid-template-rows:auto auto;");
    expect(stylesheet).toContain(".learning-card__detail { gap:17px; padding:8px 0 28px; }");
  });
});
