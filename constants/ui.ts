// constants/ui.ts
export const SPINNER_SIZES = {
  thumbnail: "w-6 h-6",
  card: "w-8 h-8",
  overlay: "w-12 h-12",
} as const;

export const PLACEHOLDER_ICONS = {
  game: "👾",
  console: "🖥️",
  accessory: "🎮",
} as const;

export type SpinnerSize = keyof typeof SPINNER_SIZES;
export type PlaceholderType = keyof typeof PLACEHOLDER_ICONS;
