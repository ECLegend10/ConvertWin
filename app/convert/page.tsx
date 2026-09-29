import type { Metadata } from "next";
import { ArrowRight, FileImage, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONVERTERS } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "Convert Images Online | ConvertWin",
  description: "Change image formats directly in your browser. Start with WEBP to PNG conversion.",
};

export default function ConvertPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-[0.09em] text-muted-foreground"><LockKeyhole className="size-3.5 text-cyan-600" /> Local conversion</div>
        <h1 className="text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Convert Image</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground">Change your image to another format directly in your browser.</p>
      </section>

      <section className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Available converters">
        {CONVERTERS.map((tool) => (
          <article key={tool.id} className={tool.available ? "rounded-2xl border border-primary/25 bg-card p-5 shadow-[0_18px_50px_rgba(48,71,216,0.10)]" : "rounded-2xl border bg-card/60 p-5 opacity-70"}>
            <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><FileImage className="size-4" /></span>{!tool.available && <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">Coming soon</span>}</div>
            <div className="mt-7 flex items-center gap-2 font-mono text-sm font-bold"><span>{tool.input}</span><ArrowRight className="size-4 text-primary" /><span>{tool.output}</span></div>
            <h2 className="mt-4 text-lg font-bold">{tool.title}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{tool.description}</p>
            {tool.available ? <Button asChild className="mt-5 w-full rounded-xl"><a href={tool.href}>Open Converter</a></Button> : <Button disabled variant="outline" className="mt-5 w-full rounded-xl">Coming soon</Button>}
          </article>
        ))}
      </section>
    </main>
  );
}
