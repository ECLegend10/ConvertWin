import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConvertWin — Compress & Convert Images Online",
  description:
    "Compress and convert images directly in your browser with simple, private file tools.",
  openGraph: {
    title: "ConvertWin — Compress & Convert Images Online",
    description: "Simple file tools that work right in your browser.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><AppShell>{children}</AppShell></body>
    </html>
  );
}
