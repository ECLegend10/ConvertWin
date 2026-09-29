"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FileImage, Gauge, Menu, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/compress", label: "Compress", icon: Minimize2 },
  { href: "/convert", label: "Convert", icon: FileImage },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("convertwin-theme");
    const legacy = localStorage.getItem("convertly-theme");
    const preference = saved ?? legacy;
    const initialDark = preference
      ? preference === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
  }, []);

  const changeTheme = (nextDark: boolean) => {
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("convertwin-theme", nextDark ? "dark" : "light");
  };

  return (
    <header className="relative z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-cyan-500 text-white shadow-[0_7px_20px_color-mix(in_srgb,var(--primary)_24%,transparent)] transition-transform group-hover:-rotate-3">
            <Gauge className="size-[19px]" aria-hidden="true" />
          </span>
          <span className="text-[1.05rem] font-extrabold tracking-[-0.04em]">ConvertWin</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map(({ href, label }) => {
            const active = pathname === href || (href === "/convert" && pathname === "/webp-to-png");
            return (
              <Button key={href} asChild variant="ghost" className={cn("h-10 rounded-xl px-4 text-[0.9rem]", active && "bg-accent text-accent-foreground")}>
                <a href={href} aria-current={active ? "page" : undefined}>{label}</a>
              </Button>
            );
          })}
          <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          <ThemeToggle dark={dark} onChange={changeTheme} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle dark={dark} onChange={changeTheme} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="size-10 rounded-xl" aria-label="Open menu"><Menu aria-hidden="true" /></Button>
            </SheetTrigger>
            <SheetContent className="w-[min(22rem,88vw)] p-4">
              <SheetHeader className="px-1 pt-7 text-left">
                <SheetTitle className="text-xl">ConvertWin</SheetTitle>
                <SheetDescription>Convert. Compress. Done.</SheetDescription>
              </SheetHeader>
              <nav className="mt-4 grid gap-2" aria-label="Mobile navigation">
                {links.map(({ href, label, icon: Icon }) => (
                  <SheetClose asChild key={href}>
                    <a href={href} className="flex min-h-12 items-center gap-3 rounded-xl border bg-card px-4 font-semibold hover:bg-accent">
                      <Icon className="size-4 text-primary" aria-hidden="true" />{label} Image
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a href="/webp-to-png" className="flex min-h-12 items-center gap-3 rounded-xl border bg-card px-4 font-semibold hover:bg-accent">
                    <FileImage className="size-4 text-primary" aria-hidden="true" />WEBP to PNG
                  </a>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="absolute inset-x-0 top-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
    </header>
  );
}
