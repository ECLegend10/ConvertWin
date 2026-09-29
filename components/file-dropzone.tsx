"use client";

import { useRef, useState } from "react";
import { ImageUp, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  disabled?: boolean;
  onFile: (file: File) => void;
  accept?: string;
  title?: string;
  formats?: string;
  maxSize?: string;
};

export function FileDropzone({
  disabled,
  onFile,
  accept = "image/webp,.webp",
  title = "Drop your WEBP here",
  formats = "WEBP",
  maxSize = "25 MB",
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file && !disabled) onFile(file);
        }}
        className={cn(
          "group relative flex min-h-64 w-full flex-col items-center justify-center overflow-hidden rounded-[1.35rem] border-2 border-dashed px-6 py-10 text-center outline-none transition-all duration-200 focus-visible:ring-4 focus-visible:ring-ring/25 sm:min-h-72",
          dragging
            ? "scale-[1.008] border-primary bg-primary/[0.07] shadow-[0_18px_50px_color-mix(in_srgb,var(--primary)_15%,transparent)]"
            : "border-input bg-muted/35 hover:border-primary/65 hover:bg-primary/[0.035]",
        )}
      >
        <span className="mb-5 grid size-16 place-items-center rounded-2xl border border-border bg-card text-primary shadow-sm transition-transform duration-200 group-hover:-translate-y-1">
          <ImageUp className="size-7" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="text-xl font-bold tracking-[-0.025em] sm:text-2xl">{title}</span>
        <span className="mt-2 text-base text-muted-foreground">or click to browse</span>
        <span className="mt-5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {formats} · Max {maxSize}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        aria-label={`Choose an image (${formats})`}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.currentTarget.value = "";
        }}
      />
      <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
        <ShieldCheck className="size-4 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
        Your files stay on your device.
      </p>
    </div>
  );
}
