import { FileInput, BarChart, BrainCircuit } from "lucide-react";

const steps = [
  {
    icon: <FileInput className="h-10 w-10" />,
    title: "1. Input Data",
    description:
      "Impor data mahasiswa dan kriteria penilaian Anda dengan mudah untuk setiap periode akademik.",
  },
  {
    icon: <BarChart className="h-10 w-10" />,
    title: "2. Proses Peringkat",
    description:
      "Sistem secara otomatis menghitung peringkat menggunakan metode SAW yang telah teruji secara objektif.",
  },
  {
    icon: <BrainCircuit className="h-10 w-10" />,
    title: "3. Dapatkan Wawasan AI",
    description:
      "Lihat hasil di dashboard interaktif dan gunakan AI untuk mendapatkan rekomendasi pengembangan bagi mahasiswa.",
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-background py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          <h2 className="text-3xl font-light text-primary sm:text-4xl">
            Bagaimana SyncRank Bekerja?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary">
            Hanya dalam tiga langkah sederhana, Anda dapat mengubah data mentah
            menjadi wawasan berharga.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-background">
                {step.icon}
              </div>
              <h3 className="mt-6 text-xl font-light text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-base text-primary">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
