export type ToolCategory = "compress" | "convert";

export type ToolDefinition = {
  id: string;
  category: ToolCategory;
  title: string;
  description: string;
  href: string;
  available: boolean;
  formats: string;
  featured?: boolean;
};

export const TOOLS: ToolDefinition[] = [
  {
    id: "compress-image",
    category: "compress",
    title: "Compress Image",
    description: "Reduce image file size while controlling how much quality you keep.",
    href: "/compress",
    available: true,
    formats: "JPG · PNG · WEBP",
    featured: true,
  },
  {
    id: "convert-image",
    category: "convert",
    title: "Convert Image",
    description: "Convert images between popular file formats in seconds.",
    href: "/convert",
    available: true,
    formats: "WEBP → PNG",
  },
];

export const CONVERTERS = [
  { id: "webp-to-png", title: "WEBP to PNG", description: "Convert WEBP images into high-quality PNG files.", href: "/webp-to-png", available: true, input: "WEBP", output: "PNG" },
  { id: "png-to-webp", title: "PNG to WEBP", description: "Smaller web-ready images.", href: "#", available: false, input: "PNG", output: "WEBP" },
  { id: "jpg-to-png", title: "JPG to PNG", description: "Create lossless PNG copies.", href: "#", available: false, input: "JPG", output: "PNG" },
  { id: "png-to-jpg", title: "PNG to JPG", description: "Create compact JPG images.", href: "#", available: false, input: "PNG", output: "JPG" },
] as const;
