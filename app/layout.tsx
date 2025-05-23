import "@/app/globals.css";
import type { Metadata } from "next";
import { comfortaa } from "@/app/fonts";

export const metadata: Metadata = {
  title: "Jet Lag Poznań – Hide & Seek Game Assistant",
  description:
    "Play Jet Lag–style hide and seek across Poznań with timers, curses, and questions — all in one app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={comfortaa.className}>{children}</body>
    </html>
  );
}
