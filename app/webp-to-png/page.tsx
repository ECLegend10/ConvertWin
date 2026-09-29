import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { ConverterPage } from "@/components/converter-page";

export const metadata: Metadata = {
  title: "WEBP to PNG Converter | ConvertWin",
  description: "Convert WEBP images to high-quality PNG files directly in your browser without unnecessary uploads.",
};

export default function WebpToPngPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <section className="mx-auto max-w-3xl">
        <div className="text-center"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.09em] text-primary"><LockKeyhole className="size-3.5" />Private by design</div><h1 className="text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">WEBP to PNG Converter</h1><p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground">Convert WEBP images to PNG instantly. Your image never leaves your browser.</p></div>
        <div className="mt-8"><ConverterPage /></div>
      </section>
      <section className="mx-auto mt-20 grid max-w-5xl gap-5 md:grid-cols-3">
        {[["01", "Choose your WEBP", "Drop an image into the converter or choose one from your device."], ["02", "Convert locally", "Your browser preserves dimensions and transparency while creating the PNG."], ["03", "Download the PNG", "Preview the result and save it with the original filename preserved."]].map(([number, title, copy]) => <article key={number} className="rounded-2xl border bg-card p-6"><span className="font-mono text-xs font-bold text-primary">{number}</span><h2 className="mt-5 text-lg font-bold">{title}</h2><p className="mt-2 leading-7 text-muted-foreground">{copy}</p></article>)}
      </section>
    </main>
  );
}
