import type { Metadata } from "next";
import Hero from "@/components/ui/hero";
import FeaturesSection from "@/components/ui/features-section";
import HowItWorks from "@/components/ui/how-it-works";
import Cta from "@/components/ui/cta";
import { JsonLd } from "@/components/shared/json-ld";
import ManageDataPreview from "@/components/ui/manage-data-preview";
import AiReportPreview from "@/components/ui/ai-report-preview";

export const metadata: Metadata = {
  title: "SyncRank - Sistem Peringkat Mahasiswa dengan AI",
  description:
    "Platform modern untuk mengelola dan mengevaluasi prestasi akademik mahasiswa menggunakan kecerdasan buatan dan metode SAW. Dapatkan insight mendalam dan rekomendasi yang akurat untuk setiap mahasiswa!",
  openGraph: {
    title: "SyncRank - Sistem Peringkat Mahasiswa dengan AI",
    description:
      "Platform modern untuk mengelola dan mengevaluasi prestasi akademik mahasiswa menggunakan kecerdasan buatan dan metode SAW. Optimalkan penilaian akademik dengan AI!",
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
            "Sistem Pendukung Keputusan Peringkat Mahasiswa Modern dengan AI dan Metode SAW",
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
        <Hero />

        {/* Features Section */}
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-primary mb-4">
              Fitur Unggulan
            </h2>
            <p className="max-w-2xl mx-auto text-primary">
              Optimalkan penilaian akademik dengan bantuan kecerdasan buatan dan
              metode SAW yang akurat. Dapatkan insight mendalam dan rekomendasi
              yang tepat untuk setiap mahasiswa.
            </p>
          </div>
          <FeaturesSection />
        </div>
        <ManageDataPreview />
        <AiReportPreview />
        <HowItWorks />
        <Cta />
      </div>
    </>
  );
}
