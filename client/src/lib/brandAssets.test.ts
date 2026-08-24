import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { iitmBrandAssetUrl } from "./brandAssets";

describe("IIT Madras branding asset delivery", () => {
  it("uses a public image source rather than the Manus preview storage route", () => {
    expect(iitmBrandAssetUrl).toMatch(/^https:\/\/files\.manuscdn\.com\//);
    expect(iitmBrandAssetUrl).not.toContain("/manus-storage/");
  });

  it("uses the same public PNG source for the document favicon", () => {
    const indexHtml = readFileSync(new URL("../../index.html", import.meta.url), "utf8");

    expect(indexHtml).toContain(`type="image/png" href="${iitmBrandAssetUrl}"`);
  });
});
