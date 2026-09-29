import { loadImage } from "@/lib/image-converter";
import { compressedFileName } from "@/lib/file-utils";
import type { SupportedImageFormat } from "@/lib/file-validation";

export type CompressImageOptions = {
  file: File;
  format: SupportedImageFormat;
  quality: number;
  preserveDimensions?: true;
};

export type CompressionResult = {
  blob: Blob;
  filename: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  format: SupportedImageFormat;
  reduction: number;
};

const MIME_BY_FORMAT: Record<SupportedImageFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function quantizePng(context: CanvasRenderingContext2D, width: number, height: number, quality: number) {
  const step = quality >= 0.88 ? 1 : Math.max(2, Math.round((1 - quality) * 30));
  if (step === 1) return;
  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  for (let index = 0; index < pixels.length; index += 4) {
    pixels[index] = Math.round(pixels[index] / step) * step;
    pixels[index + 1] = Math.round(pixels[index + 1] / step) * step;
    pixels[index + 2] = Math.round(pixels[index + 2] / step) * step;
  }
  context.putImageData(imageData, 0, 0);
}

export async function compressImage({ file, format, quality }: CompressImageOptions): Promise<CompressionResult> {
  const loaded = await loadImage(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = loaded.width;
    canvas.height = loaded.height;
    const context = canvas.getContext("2d", { alpha: format !== "jpeg" });
    if (!context) throw new Error("Canvas unavailable");
    if (format === "jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(loaded.source, 0, 0);
    if (format === "png") quantizePng(context, canvas.width, canvas.height, quality);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Encoding failed")), MIME_BY_FORMAT[format], format === "png" ? undefined : quality);
    });
    const extension = format === "jpeg" ? (file.name.toLowerCase().endsWith(".jpeg") ? "jpeg" : "jpg") : format;
    const reduction = Math.max(0, ((file.size - blob.size) / file.size) * 100);
    return {
      blob,
      filename: compressedFileName(file.name, extension),
      originalSize: file.size,
      compressedSize: blob.size,
      width: loaded.width,
      height: loaded.height,
      format,
      reduction,
    };
  } finally {
    loaded.cleanup();
  }
}
