import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import "./globals.css";

export const metadata: Metadata = {
  title: "gRPC <3",
  description: "Type-safe Go + React",
};

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetBrainsMono.className}>
      <body className="h-dvh bg-neutral-950 text-xs text-neutral-50">
        {children}
      </body>
    </html>
  );
}
