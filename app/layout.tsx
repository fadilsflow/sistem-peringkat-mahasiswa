import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Providers } from "./providers";
import Footer from "@/components/footer";

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto py-6 px-4 sm:px-10 ">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
