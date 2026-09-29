export type ImageDimensions = { width: number; height: number };

export type LoadedImage = ImageDimensions & {
  source: CanvasImageSource;
  cleanup: () => void;
};

export async function loadImage(file: File): Promise<LoadedImage> {
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      cleanup: () => bitmap.close(),
    };
  }
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  image.src = url;
  await image.decode();
  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    cleanup: () => URL.revokeObjectURL(url),
  };
}

export async function readImageDimensions(file: File): Promise<ImageDimensions> {
  let loaded: LoadedImage | null = null;
  try {
    loaded = await loadImage(file);
    return { width: loaded.width, height: loaded.height };
  } finally {
    loaded?.cleanup();
  }
}

export async function convertWebpToPng(file: File): Promise<Blob> {
  let loaded: LoadedImage | null = null;
  try {
    loaded = await loadImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = loaded.width;
    canvas.height = loaded.height;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Canvas is unavailable");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(loaded.source, 0, 0);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("PNG encoding failed"))),
        "image/png",
      );
    });
  } finally {
    loaded?.cleanup();
  }
}
