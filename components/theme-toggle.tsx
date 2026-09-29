"use client";

import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

type ThemeToggleProps = {
  dark: boolean;
  onChange: (dark: boolean) => void;
};

export function ThemeToggle({ dark, onChange }: ThemeToggleProps) {
  return (
    <Toggle
      pressed={dark}
      onPressedChange={onChange}
      variant="outline"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="size-10 rounded-xl border-border/80 bg-card/80 hover:bg-accent"
    >
      {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Toggle>
  );
}
