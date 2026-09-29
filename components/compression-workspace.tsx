"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, ImageIcon, RefreshCw, Replace, RotateCcw, ShieldCheck, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { FileDropzone } from "@/components/file-dropzone";
import { compressImage, type CompressionResult } from "@/lib/compress-image";
import { COMPRESSION_PRESETS, qualityForPreset, type CompressionPresetId } from "@/lib/compression-presets";
import { validateCompressibleImage, type SupportedImageFormat } from "@/lib/file-validation";
import { readImageDimensions, type ImageDimensions } from "@/lib/image-converter";
import { formatBytes } from "@/lib/file-utils";
import { cn } from "@/lib/utils";

type Stage = "empty" | "ready" | "processing" | "result" | "no-gain";
type SelectedImage = {
  file: File;
  format: SupportedImageFormat;
  dimensions: ImageDimensions;
  previewUrl: string;
  warning?: string;
};

function formatLabel(format: SupportedImageFormat) {
  return format === "jpeg" ? "JPG" : format.toUpperCase();
}

export function CompressionWorkspace() {
  const [stage, setStage] = useState<Stage>("empty");
  const [selected, setSelected] = useState<SelectedImage | null>(null);
  const [result, setResult] = useState<(CompressionResult & { previewUrl: string }) | null>(null);
  const [preset, setPreset] = useState<CompressionPresetId>("balanced");
  const [customQuality, setCustomQuality] = useState(70);
  const [error, setError] = useState<string | null>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<SelectedImage | null>(null);
  const resultRef = useRef<(CompressionResult & { previewUrl: string }) | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("convertwin-compression-level") as CompressionPresetId | null;
    if (saved && ["light", "balanced", "strong", "maximum", "custom"].includes(saved)) setPreset(saved);
  }, []);
  useEffect(() => { selectedRef.current = selected; }, [selected]);
  useEffect(() => { resultRef.current = result; }, [result]);
  useEffect(() => () => {
    if (selectedRef.current) URL.revokeObjectURL(selectedRef.current.previewUrl);
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.previewUrl);
  }, []);

  const resetResult = () => {
    setResult((current) => {
      if (current) URL.revokeObjectURL(current.previewUrl);
      return null;
    });
  };

  const clear = () => {
    if (selected) URL.revokeObjectURL(selected.previewUrl);
    resetResult();
    setSelected(null);
    setError(null);
    setStage("empty");
  };

  const chooseFile = async (file: File) => {
    setError(null);
    const validation = await validateCompressibleImage(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    try {
      const dimensions = await readImageDimensions(file);
      if (dimensions.width * dimensions.height > 60_000_000) {
        setError("This image may be too large for your browser to process safely.");
        return;
      }
      if (selected) URL.revokeObjectURL(selected.previewUrl);
      resetResult();
      setSelected({ file, format: validation.format, dimensions, previewUrl: URL.createObjectURL(file), warning: validation.warning });
      setStage("ready");
    } catch {
      setError("We couldn’t read this image. The file may be damaged.");
    }
  };

  const choosePreset = (next: CompressionPresetId) => {
    setPreset(next);
    localStorage.setItem("convertwin-compression-level", next);
  };

  const processImage = async () => {
    if (!selected || stage === "processing") return;
    setError(null);
    resetResult();
    setStage("processing");
    try {
      const compressed = await compressImage({
        file: selected.file,
        format: selected.format,
        quality: qualityForPreset(preset, customQuality / 100),
        preserveDimensions: true,
      });
      if (compressed.compressedSize >= compressed.originalSize) {
        setStage("no-gain");
        return;
      }
      setResult({ ...compressed, previewUrl: URL.createObjectURL(compressed.blob) });
      setStage("result");
    } catch {
      setError("Something went wrong while processing this image. Try another file or a different compression level.");
      setStage("ready");
    }
  };

  const download = () => {
    if (!result) return;
    const anchor = document.createElement("a");
    anchor.href = result.previewUrl;
    anchor.download = result.filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  if (stage === "empty") {
    return (
      <div>
        <FileDropzone
          onFile={chooseFile}
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          title="Drop your image here"
          formats="JPG · PNG · WEBP"
          maxSize="40 MB"
        />
        {error && <ErrorMessage message={error} />}
      </div>
    );
  }

  if (!selected) return null;

  if (stage === "result" && result) {
    return (
      <div className="p-1 sm:p-2">
        <div className="flex flex-col items-center pb-6 pt-4 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.28)]"><Check className="size-7" aria-hidden="true" /></span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Compression complete</h2>
          <p className="mt-1 text-muted-foreground">{Math.round(result.reduction)}% smaller with the original dimensions preserved.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { label: "Original", url: selected.previewUrl, size: result.originalSize },
            { label: "Compressed", url: result.previewUrl, size: result.compressedSize },
          ].map((item) => (
            <article key={item.label} className="overflow-hidden rounded-2xl border bg-muted/30">
              <div className="flex items-center justify-between border-b bg-card px-4 py-3"><span className="font-bold">{item.label}</span><span className="text-sm font-semibold text-muted-foreground">{formatBytes(item.size)}</span></div>
              <div className="flex aspect-[4/3] items-center justify-center p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={`${item.label} image preview`} className="max-h-full max-w-full object-contain" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border bg-muted/25 p-3 text-center text-sm sm:gap-4">
          <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Format</p><p className="mt-1 font-bold">{formatLabel(result.format)}</p></div>
          <div className="border-x"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dimensions</p><p className="mt-1 font-bold">{result.width} × {result.height}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Saved</p><p className="mt-1 font-bold text-emerald-600 dark:text-emerald-400">{formatBytes(result.originalSize - result.compressedSize)}</p></div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button onClick={download} size="lg" className="h-13 flex-1 rounded-xl text-base font-bold"><Download className="size-5" />Download Compressed Image</Button>
          <Button onClick={() => { resetResult(); setStage("ready"); }} variant="outline" size="lg" className="h-13 rounded-xl"><RotateCcw />Try another strength</Button>
          <Button onClick={clear} variant="ghost" size="lg" className="h-13 rounded-xl"><RefreshCw />Another image</Button>
        </div>
        <p className="sr-only" aria-live="polite">Compression complete. {Math.round(result.reduction)} percent smaller.</p>
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-2">
      <div className="flex items-start gap-4 rounded-2xl border bg-muted/30 p-4 sm:items-center">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border bg-card sm:size-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selected.previewUrl} alt="Selected image preview" className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold sm:text-lg">{selected.file.name}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{formatLabel(selected.format)} · {formatBytes(selected.file.size)} · {selected.dimensions.width} × {selected.dimensions.height}</p>
          {selected.warning && <p className="mt-1 text-sm font-medium text-amber-700 dark:text-amber-300">{selected.warning}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Replace image" onClick={() => replaceInput.current?.click()}><Replace /></Button>
          <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Remove image" onClick={clear}><Trash2 /></Button>
        </div>
        <input ref={replaceInput} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void chooseFile(file); event.currentTarget.value = ""; }} />
      </div>

      {stage === "no-gain" ? (
        <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/35 dark:text-amber-100">
          <h2 className="font-bold">This image is already efficiently compressed.</h2>
          <p className="mt-1 text-sm leading-6 opacity-80">No size reduction was found, so ConvertWin kept your original instead of giving you a larger file.</p>
          <div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => setStage("ready")} size="sm" className="rounded-lg">Try stronger compression</Button>{selected.format === "png" && <Button asChild variant="outline" size="sm" className="rounded-lg"><a href="/convert">Convert format</a></Button>}</div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-end justify-between gap-3"><div><h2 className="text-lg font-bold">Compression strength</h2><p className="mt-1 text-sm text-muted-foreground">Choose quality or prioritize a smaller file.</p></div><span className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground sm:block">Quality ↔ File size</span></div>
          <div className="mt-4" role="radiogroup" aria-label="Compression strength">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COMPRESSION_PRESETS.map((option) => (
              <button key={option.id} type="button" role="radio" aria-checked={preset === option.id} onClick={() => choosePreset(option.id)} className={cn("relative rounded-xl border p-4 text-left outline-none transition-all focus-visible:ring-4 focus-visible:ring-ring/25", preset === option.id ? "border-primary bg-primary/[0.07] shadow-sm" : "bg-card hover:border-primary/50")}>
                {option.recommended && <span className="absolute right-2 top-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">Recommended</span>}
                <span className="block font-bold">{option.label}</span><span className="mt-1 block text-xs text-muted-foreground">{option.description}</span><span className="mt-3 block text-sm tracking-[0.12em] text-primary" aria-label={`${option.qualityDots} of 4 quality points`}>{"●".repeat(option.qualityDots)}<span className="text-border">{"●".repeat(4 - option.qualityDots)}</span></span>
              </button>
            ))}
            </div>
            <button type="button" role="radio" aria-checked={preset === "custom"} onClick={() => choosePreset("custom")} className={cn("mt-3 flex w-full items-center justify-between rounded-xl border p-4 text-left outline-none transition-all focus-visible:ring-4 focus-visible:ring-ring/25", preset === "custom" ? "border-primary bg-primary/[0.07]" : "bg-card hover:border-primary/50")}><span><span className="font-bold">Custom</span><span className="ml-2 text-sm text-muted-foreground">Choose an exact quality level</span></span><span className="font-bold text-primary">{customQuality}%</span></button>
            {preset === "custom" && (
            <div className="mt-3 rounded-xl border bg-muted/30 p-5">
              <label htmlFor="quality-slider" className="flex items-center justify-between text-sm font-semibold"><span>Lower quality · smaller file</span><span>Higher quality · larger file</span></label>
              <Slider id="quality-slider" min={20} max={95} step={1} value={[customQuality]} onValueChange={(value) => setCustomQuality(value[0] ?? 70)} className="mt-5" aria-label="Image quality percentage" />
            </div>
            )}
          </div>
          {selected.format === "png" && (preset === "strong" || preset === "maximum" || (preset === "custom" && customQuality < 70)) && <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">Stronger PNG compression reduces the color palette, so subtle color detail may change.</p>}

          {stage === "processing" ? (
            <div className="mt-6 flex h-14 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground" role="status"><RefreshCw className="size-4 animate-spin" />Compressing image…</div>
          ) : (
            <Button onClick={processImage} size="lg" className="mt-6 h-14 w-full rounded-xl text-base font-bold"><ImageIcon className="size-5" />Compress Image</Button>
          )}
          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4 text-cyan-600 dark:text-cyan-400" />Your image stays on your device.</p>
        </div>
      )}
      {error && <ErrorMessage message={error} />}
      <div className="sr-only" aria-live="polite">{stage === "processing" ? "Compressing image." : stage === "no-gain" ? "No size reduction found." : ""}</div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200" role="alert"><XCircle className="mt-0.5 size-4 shrink-0" /><span>{message}</span></div>;
}
