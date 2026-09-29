export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
}

export function outputFileName(name: string, extension: string): string {
  const withoutLastExtension = name.replace(/\.[^/.]+$/, "");
  return `${withoutLastExtension || "converted-image"}.${extension}`;
}

export function compressedFileName(name: string, extension: string): string {
  const withoutLastExtension = name.replace(/\.[^/.]+$/, "");
  return `${withoutLastExtension || "image"}-compressed.${extension}`;
}
