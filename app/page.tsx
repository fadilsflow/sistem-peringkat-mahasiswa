import HeroSectionOne from "@/components/ui/hero";
import FeaturesSection from "@/components/ui/features-section";
import CTA from "@/components/shared/cta";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSectionOne />

      {/* Features Section */}
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-primary mb-4">Fitur Utama</h2>
          <p className=" max-w-2xl mx-auto text-primary">
            Platform lengkap untuk mengelola dan mengevaluasi prestasi akademik
            mahasiswa dengan metode SAW yang akurat dan terpercaya.
          </p>
        </div>
        <FeaturesSection />
      </div>
      <CTA />
    </div>
  );
}
