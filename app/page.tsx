import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import HeroSectionOne from "@/components/ui/hero";
import FeaturesSection from "@/components/ui/features-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSectionOne />

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-foreground mb-4">
            Fitur Utama
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Platform lengkap untuk mengelola dan mengevaluasi prestasi akademik mahasiswa
            dengan metode SAW yang akurat dan terpercaya.
          </p>
        </div>

        <FeaturesSection />

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            <span>
              You can help us by contributing to the project or reporting issues
              on{" "}
            </span>
            <a
              href="https://github.com/fadilsflow/sistem-peringkat-mahasiswa"
              className="link flex items-center gap-2"
              target="_blank"
            >
              GitHub <ArrowUpRight className="w-4 h-4" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
