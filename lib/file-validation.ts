export const MAX_FILE_SIZE = 25 * 1024 * 1024;
export const LARGE_FILE_SIZE = 15 * 1024 * 1024;
export const MAX_COMPRESSION_FILE_SIZE = 40 * 1024 * 1024;

export type SupportedImageFormat = "jpeg" | "png" | "webp";

export type ValidationResult =
  | { valid: true; warning?: string }
  | { valid: false; error: string };

export async function validateWebp(file: File): Promise<ValidationResult> {
  const hasWebpExtension = /\.webp$/i.test(file.name);
  const hasWebpMime = file.type === "image/webp" || file.type === "";

  if (!hasWebpExtension || !hasWebpMime) {
    return { valid: false, error: "That doesn’t look like a WEBP image. Please choose a .webp file." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "This file is over 25 MB. Please choose a smaller WEBP image." };
  }

  try {
    const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const signature = String.fromCharCode(...header);
    if (header.length < 12 || !signature.startsWith("RIFF") || signature.slice(8, 12) !== "WEBP") {
      return { valid: false, error: "We couldn’t read this image. The file may be damaged." };
    }
  } catch {
    return { valid: false, error: "We couldn’t read this image. The file may be damaged." };
  }

  return file.size > LARGE_FILE_SIZE
    ? { valid: true, warning: "This image is quite large and may take longer to process." }
    : { valid: true };
}

function extensionFormat(name: string): SupportedImageFormat | null {
  const extension = name.split(".").pop()?.toLowerCase();
  if (extension === "jpg" || extension === "jpeg") return "jpeg";
  if (extension === "png") return "png";
  if (extension === "webp") return "webp";
  return null;
}

function signatureFormat(header: Uint8Array): SupportedImageFormat | null {
  if (header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) return "jpeg";
  if (header.length >= 8 && header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47 && header[4] === 0x0d && header[5] === 0x0a && header[6] === 0x1a && header[7] === 0x0a) return "png";
  if (header.length >= 12) {
    const text = String.fromCharCode(...header.slice(0, 12));
    if (text.startsWith("RIFF") && text.slice(8, 12) === "WEBP") return "webp";
  }
  return null;
}

export async function validateCompressibleImage(file: File): Promise<
  | { valid: true; format: SupportedImageFormat; warning?: string }
  | { valid: false; error: string }
> {
  const extension = extensionFormat(file.name);
  if (!extension) return { valid: false, error: "This format isn’t supported for compression yet. Try JPG, PNG or WEBP." };
  if (file.size > MAX_COMPRESSION_FILE_SIZE) return { valid: false, error: "This image may be too large for your browser to process safely." };

  const expectedMime = extension === "jpeg" ? ["image/jpeg", ""] : [`image/${extension}`, ""];
  if (!expectedMime.includes(file.type)) return { valid: false, error: "This file type isn’t supported yet." };

  try {
    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const detected = signatureFormat(header);
    if (!detected || detected !== extension) return { valid: false, error: "We couldn’t read this image. The file may be damaged." };
  } catch {
    return { valid: false, error: "We couldn’t read this image. The file may be damaged." };
  }

  return file.size > LARGE_FILE_SIZE
    ? { valid: true, format: extension, warning: "This is a large image and may take a little longer to process." }
    : { valid: true, format: extension };
}
