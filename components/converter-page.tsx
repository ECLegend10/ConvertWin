"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, RefreshCw, ShieldCheck, Sparkles, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/file-dropzone";
import { convertWebpToPng, readImageDimensions, type ImageDimensions } from "@/lib/image-converter";
import { validateWebp } from "@/lib/file-validation";
import { formatBytes, outputFileName } from "@/lib/file-utils";

type Stage = "empty" | "ready" | "converting" | "complete";
type SelectedImage = { file: File; dimensions: ImageDimensions; previewUrl: string; warning?: string };
type ConvertedImage = { blob: Blob; previewUrl: string; filename: string };

export function ConverterPage() {
  const [stage, setStage] = useState<Stage>("empty");
  const [selected, setSelected] = useState<SelectedImage | null>(null);
  const [converted, setConverted] = useState<ConvertedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selectedRef = useRef<SelectedImage | null>(null);
  const convertedRef = useRef<ConvertedImage | null>(null);

  useEffect(() => { selectedRef.current = selected; }, [selected]);
  useEffect(() => { convertedRef.current = converted; }, [converted]);
  useEffect(() => () => {
    if (selectedRef.current) URL.revokeObjectURL(selectedRef.current.previewUrl);
    if (convertedRef.current) URL.revokeObjectURL(convertedRef.current.previewUrl);
  }, []);

  const clearFile = () => {
    if (selected) URL.revokeObjectURL(selected.previewUrl);
    if (converted) URL.revokeObjectURL(converted.previewUrl);
    setSelected(null);
    setConverted(null);
    setError(null);
    setStage("empty");
  };

  const chooseFile = async (file: File) => {
    setError(null);
    const validation = await validateWebp(file);
    if (!validation.valid) { setError(validation.error); return; }
    try {
      const dimensions = await readImageDimensions(file);
      if (selected) URL.revokeObjectURL(selected.previewUrl);
      if (converted) URL.revokeObjectURL(converted.previewUrl);
      setConverted(null);
      setSelected({ file, dimensions, previewUrl: URL.createObjectURL(file), warning: validation.warning });
      setStage("ready");
    } catch {
      setError("We couldn’t read this image. The file may be damaged.");
    }
  };

  const convert = async () => {
    if (!selected || stage === "converting") return;
    setError(null);
    setStage("converting");
    try {
      const blob = await convertWebpToPng(selected.file);
      if (converted) URL.revokeObjectURL(converted.previewUrl);
      setConverted({ blob, previewUrl: URL.createObjectURL(blob), filename: outputFileName(selected.file.name, "png") });
      setStage("complete");
    } catch {
      setError("We couldn’t convert this image. Try another WEBP file.");
      setStage("ready");
    }
  };

  const download = () => {
    if (!converted) return;
    const link = document.createElement("a");
    link.href = converted.previewUrl;
    link.download = converted.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div>
      <div className="rounded-[1.75rem] border border-border/90 bg-card p-3 shadow-[0_24px_70px_rgba(26,38,77,0.10)] sm:p-5 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        {stage === "empty" && <FileDropzone onFile={chooseFile} />}
        {selected && stage !== "empty" && (
          <div className="p-1 sm:p-2">
            {stage === "complete" && converted ? (
              <div>
                <div className="flex flex-col items-center pb-6 pt-4 text-center"><span className="grid size-14 place-items-center rounded-full bg-cyan-500 text-white"><Check className="size-7" /></span><h2 className="mt-4 text-2xl font-extrabold">Conversion complete</h2><p className="mt-1 text-muted-foreground">Your PNG is ready to download.</p></div>
                <div className="grid gap-5 rounded-2xl border bg-muted/30 p-4 sm:grid-cols-[190px_1fr] sm:p-5">
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border bg-card">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={converted.previewUrl} alt="Converted PNG preview" className="h-full w-full object-contain" /></div>
                  <div className="flex min-w-0 flex-col justify-center"><p className="truncate text-lg font-bold">{converted.filename}</p><p className="mt-1 text-sm text-muted-foreground">PNG · {formatBytes(converted.blob.size)} · {selected.dimensions.width} × {selected.dimensions.height}</p><div className="mt-5 grid grid-cols-2 rounded-xl border bg-card p-3 text-sm"><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Original</p><p className="mt-1 font-semibold">{formatBytes(selected.file.size)} WEBP</p></div><div className="border-l pl-3"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Converted</p><p className="mt-1 font-semibold">{formatBytes(converted.blob.size)} PNG</p></div></div></div>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row"><Button onClick={download} size="lg" className="h-13 flex-1 rounded-xl text-base font-bold"><Download />Download PNG</Button><Button onClick={clearFile} variant="outline" size="lg" className="h-13 rounded-xl"><RefreshCw />Convert another</Button></div>
              </div>
            ) : (
              <div>
                <div className="flex items-start gap-4 rounded-2xl border bg-muted/30 p-4 sm:items-center"><div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border bg-card sm:size-24">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={selected.previewUrl} alt="Selected WEBP preview" className="h-full w-full object-contain" /></div><div className="min-w-0 flex-1"><p className="truncate text-base font-bold sm:text-lg">{selected.file.name}</p><p className="mt-1 text-sm text-muted-foreground">WEBP · {formatBytes(selected.file.size)} · {selected.dimensions.width} × {selected.dimensions.height}</p>{selected.warning && <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{selected.warning}</p>}</div><Button onClick={clearFile} variant="ghost" size="icon" className="rounded-xl" aria-label="Remove image"><Trash2 /></Button></div>
                <div className="my-6 flex items-center justify-center gap-3 text-sm font-bold text-muted-foreground"><span className="rounded-lg border bg-card px-3 py-2">WEBP</span><span className="h-px w-10 bg-border" /><Sparkles className="size-4 text-primary" /><span className="h-px w-10 bg-border" /><span className="rounded-lg border bg-card px-3 py-2">PNG</span></div>
                {stage === "converting" ? <div className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground" role="status"><RefreshCw className="size-4 animate-spin" />Converting…</div> : <Button onClick={convert} size="lg" className="h-14 w-full rounded-xl text-base font-bold"><Sparkles className="size-5" />Convert to PNG</Button>}
                <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4 text-cyan-600 dark:text-cyan-400" />Conversion happens locally in your browser.</p>
              </div>
            )}
            <div className="sr-only" aria-live="polite">{stage === "converting" ? "Converting WEBP image to PNG." : stage === "complete" ? "PNG is ready to download." : ""}</div>
          </div>
        )}
      </div>
      {error && <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200" role="alert"><XCircle className="mt-0.5 size-4 shrink-0" /><span>{error}</span></div>}
    </div>
  );
}
