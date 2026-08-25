import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("Nidarr case-study control", () => {
  it("keeps the closed control compact and removes disclosure motion", () => {
    expect(stylesheet).toContain('.nidarr-card .case-study__dropdown[data-state="closed"] { display:none; }');
    expect(stylesheet).toContain(".nidarr-card .case-study-accordion { align-self:flex-start; width:min(100%,390px); margin-top:18px; padding:0;");
    expect(stylesheet).toContain(".nidarr-card .case-study__dropdown { display:block; margin-top:14px; overflow:visible; transition:none !important; animation:none !important; }");
  });
});
