import type { Metadata } from "next";
import HeroSectionOne from "@/components/ui/hero";
import FeaturesSection from "@/components/ui/features-section";
import CTA from "@/components/shared/cta";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "SyncRank - Sistem Peringkat Mahasiswa Terpercaya",
  description:
    "Platform lengkap untuk mengelola dan mengevaluasi prestasi akademik mahasiswa dengan metode SAW yang akurat dan terpercaya. Optimalkan penilaian akademik Anda sekarang!",
  openGraph: {
    title: "SyncRank - Sistem Peringkat Mahasiswa Terpercaya",
    description:
      "Platform lengkap untuk mengelola dan mengevaluasi prestasi akademik mahasiswa dengan metode SAW yang akurat dan terpercaya.",
  },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "SyncRank",
          applicationCategory: "Education",
          description:
            "Sistem Pendukung Keputusan Peringkat Mahasiswa menggunakan Metode SAW",
          operatingSystem: "Any",
          author: {
            "@type": "Person",
            name: "Fadil",
            url: "https://fadils.xyz",
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "IDR",
          },
        }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSectionOne />

        {/* Features Section */}
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-primary mb-4">
              Fitur Utama
            </h2>
            <p className=" max-w-2xl mx-auto text-primary">
              Platform lengkap untuk mengelola dan mengevaluasi prestasi
              akademik mahasiswa dengan metode SAW yang akurat dan terpercaya.
            </p>
          </div>
          <FeaturesSection />
        </div>
        <CTA />
      </div>
    </>
  );
}
