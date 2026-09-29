import type { Metadata } from "next";
import { ArrowRight, FileImage, LockKeyhole, Minimize2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "ConvertWin — Compress & Convert Images Online",
  description: "Convert and compress images without unnecessary uploads. Fast, private file tools that work directly in your browser.",
};

export default function Home() {
  const features = [
    { Icon: ShieldCheck, title: "Private by default", copy: "Normal image processing happens on your device, not on a ConvertWin server." },
    { Icon: Zap, title: "Built for speed", copy: "Open a tool, drop your file, choose your settings and download the result." },
    { Icon: LockKeyhole, title: "No account needed", copy: "No sign-up, storage, image history or unnecessary steps between you and the result." },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.09em] text-primary"><Zap className="size-3.5" aria-hidden="true" /> Convert. Compress. Done.</div>
        <h1 className="text-balance text-4xl font-extrabold tracking-[-0.05em] sm:text-6xl">ConvertWin</h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">Convert and compress images without unnecessary uploads. Fast, private file tools that work directly in your browser.</p>
      </section>

      <section className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2" aria-label="Image tools">
        {TOOLS.map((tool) => {
          const Icon = tool.category === "compress" ? Minimize2 : FileImage;
          return (
            <article key={tool.id} className={tool.featured ? "group relative overflow-hidden rounded-[1.75rem] border border-primary/25 bg-card p-7 shadow-[0_22px_65px_rgba(48,71,216,0.13)] sm:p-9" : "group relative overflow-hidden rounded-[1.75rem] border bg-card p-7 shadow-sm sm:p-9"}>
              {tool.featured && <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">New</span>}
              <span className={tool.featured ? "grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-cyan-500 text-white shadow-lg" : "grid size-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground"}><Icon className="size-6" aria-hidden="true" /></span>
              <h2 className="mt-7 text-2xl font-extrabold tracking-[-0.035em]">{tool.title}</h2>
              <p className="mt-3 min-h-14 leading-7 text-muted-foreground">{tool.description}</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">{tool.formats}</p>
              <Button asChild size="lg" variant={tool.featured ? "default" : "outline"} className="mt-7 h-12 w-full rounded-xl text-base font-bold"><a href={tool.href}>{tool.title}<ArrowRight aria-hidden="true" /></a></Button>
            </article>
          );
        })}
      </section>

      <section id="about" className="mx-auto mt-20 grid max-w-5xl gap-5 md:grid-cols-3">
        {features.map(({ Icon, title, copy }) => (
          <article key={title} className="rounded-2xl border bg-card p-6"><Icon className="size-5 text-primary" aria-hidden="true" /><h2 className="mt-5 text-lg font-bold">{title}</h2><p className="mt-2 leading-7 text-muted-foreground">{copy}</p></article>
        ))}
      </section>

      <section id="privacy" className="mx-auto mt-16 max-w-5xl rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] p-6 sm:p-8">
        <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cyan-500 text-white"><LockKeyhole aria-hidden="true" /></span><div><h2 className="text-xl font-bold">Your files stay on your device.</h2><p className="mt-2 leading-7 text-muted-foreground">Images are processed locally in your browser whenever possible. ConvertWin does not need to upload your normal images to perform basic compression or conversion.</p></div></div>
      </section>
    </main>
  );
}
