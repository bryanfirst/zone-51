import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Congo IA",
  description: "Assistant IA moderne pour le Congo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-[#05070d] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
