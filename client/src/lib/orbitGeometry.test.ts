import { describe, expect, it } from "vitest";
import { ellipseEquationValue, normalizeAngle, pointOnEllipse, TAU } from "./orbitGeometry";

const ellipse = { centerX: 240, centerY: 180, radiusX: 132, radiusY: 98, rotation: -0.22 };

describe("orbitGeometry", () => {
  it("keeps parametric card positions on the exact rotated ellipse", () => {
    for (const angle of [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (5 * Math.PI) / 3]) {
      expect(ellipseEquationValue(ellipse, pointOnEllipse(ellipse, angle))).toBeCloseTo(1, 10);
    }
  });

  it("repeats seamlessly after a complete revolution", () => {
    const initial = pointOnEllipse(ellipse, 0.63);
    const completed = pointOnEllipse(ellipse, 0.63 + TAU);
    expect(completed.x).toBeCloseTo(initial.x, 10);
    expect(completed.y).toBeCloseTo(initial.y, 10);
    expect(normalizeAngle(-Math.PI / 2)).toBeCloseTo((3 * Math.PI) / 2, 10);
  });
});
