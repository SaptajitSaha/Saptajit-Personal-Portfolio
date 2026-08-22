export type EllipseGeometry = {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
};

export type OrbitPoint = { x: number; y: number };

export const TAU = Math.PI * 2;

export function normalizeAngle(angle: number) {
  return ((angle % TAU) + TAU) % TAU;
}

export function pointOnEllipse(geometry: EllipseGeometry, angle: number): OrbitPoint {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const rotationCosine = Math.cos(geometry.rotation);
  const rotationSine = Math.sin(geometry.rotation);

  return {
    x: geometry.centerX + geometry.radiusX * cosine * rotationCosine - geometry.radiusY * sine * rotationSine,
    y: geometry.centerY + geometry.radiusX * cosine * rotationSine + geometry.radiusY * sine * rotationCosine,
  };
}

export function ellipseEquationValue(geometry: EllipseGeometry, point: OrbitPoint) {
  const dx = point.x - geometry.centerX;
  const dy = point.y - geometry.centerY;
  const cosine = Math.cos(geometry.rotation);
  const sine = Math.sin(geometry.rotation);
  const localX = dx * cosine + dy * sine;
  const localY = -dx * sine + dy * cosine;

  return (localX / geometry.radiusX) ** 2 + (localY / geometry.radiusY) ** 2;
}
