"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="space-y-12">
        <div className="space-y-16">
          <h1 className="text-5xl text-center text-primary uppercase font-light">
            Tentang
            <br />
            <span className="font-light underline">SYNCRANK</span>
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-md text-primary-50 leading-relaxed">
              Sistem Peringkat Mahasiswa (SYNCRANK) adalah platform yang
              dirancang untuk membantu institusi pendidikan dalam mengelola dan
              memantau prestasi akademik mahasiswa. Dengan fokus pada
              transparansi dan efisiensi, kami bertujuan untuk memberikan solusi
              yang memudahkan proses penilaian dan perangkingan mahasiswa.
            </p>

            <h2 className="text-2xl mt-8 mb-4">Pendekatan Kami</h2>
            <p className="text-md text-primary-50 leading-relaxed">
              Kami memahami pentingnya sistem penilaian yang akurat dan
              transparan dalam lingkungan akademik. SYNCRANK dikembangkan dengan
              mempertimbangkan kebutuhan berbagai pemangku kepentingan dalam
              institusi pendidikan, mulai dari staf akademik hingga mahasiswa.
              Platform ini menyediakan antarmuka yang intuitif dan fitur-fitur
              yang komprehensif untuk manajemen data akademik.
            </p>

            <h2 className="text-2xl mt-8 mb-4">Komitmen Kami</h2>
            <p className="text-primary-50 leading-relaxed">
              Kami berkomitmen untuk terus mengembangkan dan meningkatkan
              platform ini sesuai dengan kebutuhan pengguna. Dengan fokus pada
              keamanan data dan kemudahan penggunaan, SYNCRANK bertujuan menjadi
              solusi terpercaya untuk manajemen peringkat akademik di institusi
              pendidikan tinggi.
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
  );
}
