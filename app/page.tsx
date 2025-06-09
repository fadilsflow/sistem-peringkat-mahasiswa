import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";

import Link from "next/link";
export default function Home() {
  const Timeline = [
    {
      title: "Manajemen Data Mahasiswa",
      description:
        "Input dan kelola data mahasiswa termasuk NIM, nama, dan nilai kriteria penilaian seperti nilai akademik, kehadiran, prestasi, perilaku, dan keaktifan organisasi.",
      isSuccess: true,
    },
    {
      title: "Manajemen Periode",
      description:
        "Kelola periode penilaian, atur bobot kriteria, dan pantau daftar periode yang tersedia.",
      isSuccess: true,
    },
    {
      title: "Perhitungan SAW",
      description:
        "Sistem akan melakukan normalisasi nilai kriteria dan menghitung nilai akhir berdasarkan bobot untuk menentukan peringkat mahasiswa.",
      isSuccess: true,
    },
    {
      title: "Dashboard & Statistik",
      description:
        "Tampilan ringkasan data periode aktif, statistik jumlah mahasiswa, dan akses cepat ke fitur utama.",
      isSuccess: true,
    },
    {
      title: "Hasil Peringkat",
      description:
        "Lihat peringkat mahasiswa, detail perhitungan, dan filter berdasarkan periode.",
      isSuccess: true,
    },
    {
      title: "Autentikasi Dosen",
      description: "Autentikasi Dosen atau Guru sebagai pengelola data",
      isSuccess: false,
    },
  ];
  return (
    <div className="container max-w-3xl px-4 py-12 mx-auto">
      <h1 className="text-5xl  text-primary uppercase font-light">
        <span className="font-light">Sync</span>{" "}
        <span className="font-medium">Rank</span>
      </h1>
      <p className="text-muted-foreground  text-sm ">
        Sistem Peringkat Mahasiswa (SyncRank) adalah platform yang dirancang
        untuk membantu institusi pendidikan dalam mengelola dan memantau
        prestasi akademik mahasiswa.
      </p>
      <div className="flex  mt-4 mb-8">
        <Button>
          <Link href="/dashboard">
            <span className="font-medium">Get Started</span>
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-light">Fitur Utama: </h2>
        {Timeline.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 bg-card p-4 rounded-md"
          >
            <div className="flex items-center gap-2">
              {item.isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <h2 className="text-xl font-light">{item.title}</h2>
            </div>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-sm mt-4 text-left flex gap-2 relative">
        <span className="absolute -left-3 top-0">*</span>
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
  );
}
