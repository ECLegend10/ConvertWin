import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { CompressionWorkspace } from "@/components/compression-workspace";

export const metadata: Metadata = {
  title: "Compress Images Online | ConvertWin",
  description: "Compress JPG, PNG and WEBP images directly in your browser. Choose your compression strength and download smaller images without unnecessary uploads.",
};

export default function CompressPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <section className="mx-auto max-w-3xl" aria-labelledby="compress-title">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.09em] text-primary"><LockKeyhole className="size-3.5" /> Private by design</div>
          <h1 id="compress-title" className="text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Compress Image</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground">Reduce image size without making things complicated. Choose how strongly you want ConvertWin to compress your image.</p>
        </div>
        <div className="mt-8 rounded-[1.75rem] border border-border/90 bg-card p-3 shadow-[0_24px_70px_rgba(26,38,77,0.10)] sm:p-5 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]"><CompressionWorkspace /></div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border bg-card p-6"><p className="text-sm font-bold uppercase tracking-wider text-primary">How it works</p><h2 className="mt-3 text-2xl font-extrabold tracking-tight">Four steps. No detours.</h2><ol className="mt-5 grid gap-3 text-muted-foreground"><li><b className="text-foreground">1.</b> Upload your JPG, PNG or WEBP.</li><li><b className="text-foreground">2.</b> Choose a compression level.</li><li><b className="text-foreground">3.</b> Click Compress Image.</li><li><b className="text-foreground">4.</b> Preview and download the result.</li></ol></article>
          <article className="rounded-2xl border bg-card p-6"><p className="text-sm font-bold uppercase tracking-wider text-primary">Which level?</p><div className="mt-4 grid gap-3 text-sm"><p><b>Light</b> — when image quality matters most.</p><p><b>Balanced</b> — the best choice for most images.</p><p><b>Strong</b> — when a smaller file matters more.</p><p><b>Maximum</b> — when size matters much more than fidelity.</p></div></article>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border bg-card p-6"><h2 className="text-lg font-bold">Are my images uploaded?</h2><p className="mt-2 leading-7 text-muted-foreground">No. Compression runs locally inside your browser. ConvertWin does not store your image, filename or metadata.</p></article>
          <article className="rounded-2xl border bg-card p-6"><h2 className="text-lg font-bold">Does compression resize my image?</h2><p className="mt-2 leading-7 text-muted-foreground">No. Version 2 preserves the original pixel dimensions. Resizing will remain a separate future tool.</p></article>
        </div>
      </section>
    </main>
  );
}
