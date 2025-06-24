import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "Halaman yang Anda cari tidak ditemukan.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan kembali ke
        halaman utama.
      </p>
      <Link
        href="/"
        className="text-primary underline hover:text-primary/80 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
