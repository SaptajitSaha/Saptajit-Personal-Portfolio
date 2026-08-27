export const PROCEDURAL_LAMP_PARTS = [
  { id: "base", label: "Low rounded base" },
  { id: "base-pedestal", label: "Blue base pedestal" },
  { id: "base-pivot", label: "Base pivot" },
  { id: "lower-link", label: "Lower structural link" },
  { id: "elbow-pivot", label: "Elbow pivot" },
  { id: "upper-link", label: "Upper structural link" },
  { id: "shade-pivot", label: "Shade pivot" },
  { id: "shade-neck", label: "Shade neck" },
  { id: "shade-shell", label: "Flared shade shell" },
  { id: "shade-rim", label: "Shade rim" },
  { id: "shade-interior", label: "Shade interior" },
  { id: "power-cable", label: "Power cable" },
] as const;

export type ProceduralLampPartId = (typeof PROCEDURAL_LAMP_PARTS)[number]["id"];

export const PROCEDURAL_LAMP_PART_LABELS = Object.fromEntries(
  PROCEDURAL_LAMP_PARTS.map((part) => [part.id, part.label]),
) as Record<ProceduralLampPartId, string>;
