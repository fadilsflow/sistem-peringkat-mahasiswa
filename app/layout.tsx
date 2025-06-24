import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Providers } from "@/app/providers";
import Footer from "@/components/layout/footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://syncrank.bulba.cloud/"),
  title: {
    default: "SyncRank - Sistem Peringkat Mahasiswa",
    template: "%s | SyncRank",
  },
  description:
    "Sistem Pendukung Keputusan Peringkat Mahasiswa menggunakan Metode SAW (Simple Additive Weighting). Platform lengkap untuk mengelola dan mengevaluasi prestasi akademik mahasiswa.",
  keywords: [
    "sistem peringkat mahasiswa",
    "SAW",
    "simple additive weighting",
    "akademik",
    "mahasiswa",
    "peringkat",
    "prestasi",
  ],
  authors: [{ name: "Fadil", url: "https://fadils.xyz" }],
  creator: "Fadil",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://syncrank.bulba.cloud/",
    title: "SyncRank - Sistem Peringkat Mahasiswa",
    description:
      "Sistem Pendukung Keputusan Peringkat Mahasiswa menggunakan Metode SAW (Simple Additive Weighting). Platform lengkap untuk mengelola dan mengevaluasi prestasi akademik mahasiswa.",
    siteName: "SyncRank",
  },
  twitter: {
    card: "summary_large_image",
    title: "SyncRank - Sistem Peringkat Mahasiswa",
    description:
      "Sistem Pendukung Keputusan Peringkat Mahasiswa menggunakan Metode SAW",
    creator: "@fadilsdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://syncrank.bulba.cloud/",
  },
  applicationName: "SyncRank",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background text-primary">
            <Header />
            <main className="container mx-auto py-6 px-4 sm:px-10">
              {children}
            </main>
            <Footer />
            <Toaster richColors position="top-center" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
