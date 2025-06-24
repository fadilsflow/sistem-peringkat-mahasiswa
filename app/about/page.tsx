import Link from "next/link";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { JsonLd } from "@/components/shared/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SyncRank",
  description:
    "Pelajari lebih lanjut tentang SyncRank, sistem peringkat mahasiswa yang menggunakan metode SAW untuk evaluasi yang akurat dan transparan.",
  openGraph: {
    title: "About SyncRank",
    description:
      "Pelajari lebih lanjut tentang SyncRank, sistem peringkat mahasiswa yang menggunakan metode SAW untuk evaluasi yang akurat dan transparan.",
  },
};

export default function About() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About SyncRank",
          description: "Informasi tentang SyncRank dan tim pengembang",
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
              <h1 className="text-4xl font-bold mb-6">About SyncRank</h1>
              <p className="text-primary-50 leading-relaxed">
                SYNCRANK adalah platform inovatif yang dirancang untuk membantu
                institusi pendidikan dalam mengelola dan mengevaluasi prestasi
                akademik mahasiswa. Menggunakan metode SAW (Simple Additive
                Weighting), kami menyediakan sistem penilaian yang objektif dan
                transparan.
              </p>

              <h2 className="text-2xl mt-8 mb-4">Our Mission</h2>
              <p className="text-primary-50 leading-relaxed">
                Misi kami adalah menyederhanakan proses evaluasi akademik sambil
                memastikan keadilan dan transparansi dalam penilaian. Dengan
                menggunakan teknologi terkini dan metode yang terpercaya, kami
                membantu institusi pendidikan membuat keputusan yang lebih baik
                dalam pengembangan akademik mahasiswa.
              </p>

              <p className="text-primary-50 leading-relaxed">
                Kami berkomitmen untuk terus mengembangkan dan meningkatkan
                platform ini sesuai dengan kebutuhan pengguna. Dengan fokus pada
                keamanan data dan kemudahan penggunaan, SYNCRANK bertujuan
                menjadi solusi terpercaya untuk manajemen peringkat akademik di
                institusi pendidikan tinggi.
              </p>

              <h2 className="text-2xl mt-8 mb-4">Contact</h2>
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
