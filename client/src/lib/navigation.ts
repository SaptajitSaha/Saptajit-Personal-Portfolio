export const primaryNavigation = [
  { id: "top", label: "Home" },
  { id: "work", label: "Work" },
  { id: "learning", label: "Learning" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export type PrimaryNavigationId = (typeof primaryNavigation)[number]["id"];

export function isPrimaryNavigationId(value: string): value is PrimaryNavigationId {
  return primaryNavigation.some(item => item.id === value);
}
