export type CompressionPresetId = "light" | "balanced" | "strong" | "maximum" | "custom";

export type CompressionPreset = {
  id: Exclude<CompressionPresetId, "custom">;
  label: string;
  description: string;
  quality: number;
  qualityDots: number;
  recommended?: boolean;
};

export const COMPRESSION_PRESETS: CompressionPreset[] = [
  { id: "light", label: "Light", description: "Best quality", quality: 0.9, qualityDots: 4 },
  { id: "balanced", label: "Balanced", description: "Quality and size", quality: 0.78, qualityDots: 3, recommended: true },
  { id: "strong", label: "Strong", description: "Smaller file", quality: 0.6, qualityDots: 2 },
  { id: "maximum", label: "Maximum", description: "Smallest practical", quality: 0.4, qualityDots: 1 },
];

export function qualityForPreset(id: CompressionPresetId, customQuality: number): number {
  if (id === "custom") return Math.min(1, Math.max(0.2, customQuality));
  return COMPRESSION_PRESETS.find((preset) => preset.id === id)?.quality ?? 0.78;
}
