import Link from "next/link";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { JsonLd } from "@/components/shared/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang SyncRank",
  description:
    "Cerita di balik SyncRank, platform evaluasi mahasiswa yang mentransformasi data menjadi wawasan untuk pengembangan akademik.",
  openGraph: {
    title: "Tentang SyncRank",
    description:
      "Cerita di balik SyncRank, platform evaluasi mahasiswa yang mentransformasi data menjadi wawasan untuk pengembangan akademik.",
  },
};

export default function About() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Tentang SyncRank",
          description:
            "Cerita di balik SyncRank dan misinya untuk evaluasi akademik yang lebih baik.",
          publisher: {
            "@type": "Organization",
            name: "SyncRank",
            url: "https://syncrank.bulba.cloud/",
          },
        }}
      />
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-zinc dark:prose-invert">
              <h1 className="text-4xl font-medium text-center mb-6">
                Cerita di Balik SyncRank
              </h1>
              <p className="text-primary-50 leading-relaxed text-justify">
                SyncRank lahir dari sebuah gagasan sederhana: bagaimana jika
                evaluasi prestasi mahasiswa tidak hanya berhenti pada angka,
                tetapi menjadi awal dari pengembangan potensi mereka? Kami
                percaya bahwa setiap data akademik memiliki cerita dan wawasan
                berharga jika diolah dengan benar.
              </p>

              <h2 className="text-2xl font-medium text-center mt-8 mb-4">
                Misi Kami
              </h2>
              <p className="text-primary-50 leading-relaxed text-justify">
                Misi kami adalah memberdayakan institusi pendidikan dengan alat
                yang adil, transparan, dan cerdas. Kami menggabungkan metode SAW
                (Simple Additive Weighting) yang telah teruji dengan kekuatan
                analisis AI untuk menyajikan peringkat yang objektif dan
                rekomendasi yang dapat ditindaklanjuti.
              </p>

              <p className="text-primary-50 leading-relaxed text-justify">
                Kami berkomitmen pada kemudahan penggunaan dan keamanan data.
                SyncRank dirancang untuk menjadi partner Anda dalam membuat
                keputusan berbasis data, membantu setiap mahasiswa mencapai
                potensi terbaiknya.
              </p>

              <h2 className="text-2xl mt-8 mb-4">Kontak</h2>
              <div className="flex items-center gap-4 mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="https://fadils.xyz" target="_blank">
                    <Globe className="h-4 w-4 mr-2" />
                    fadils.xyz
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="https://github.com/fadilsflow" target="_blank">
                    <Image
                      src={"/github.svg"}
                      alt="GitHub"
                      width={20}
                      height={20}
                      className="h-4 w-4 mr-2"
                    />
                    GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
