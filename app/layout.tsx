import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SPK Peringkat Mahasiswa",
  description:
    "Sistem Pendukung Keputusan Peringkat Mahasiswa menggunakan Metode SAW",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="min-h-screen bg-background">
              <Header />
              <main className="container mx-auto py-6 px-4">{children}</main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
