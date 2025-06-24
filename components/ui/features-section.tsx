import { cn } from "@/lib/utils";
import {
  Users,
  Calendar,
  Calculator,
  BarChart3,
  Shield,
  Brain,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Analisis dengan SAW & AI",
      description:
        "Kombinasi metode SAW (Simple Additive Weighting) dengan AI untuk hasil yang lebih akurat. Dapatkan rekomendasi yang tepat sasaran untuk pengembangan akademik mahasiswa.",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      title: "Manajemen Data Modern",
      description:
        "Kelola data akademik dengan gaya yang kekinian. Nilai, kehadiran, prestasi, dan aktivitas organisasi - semuanya terintegrasi dalam satu dashboard yang keren.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Periode Super Fleksibel",
      description:
        "Atur periode sesuka hati! Sesuaikan bobot penilaian dan kriteria dengan mudah untuk setiap semester. Dijamin gak ribet dan bikin happy para dosen.",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      title: "Perhitungan Otomatis",
      description:
        "Gak perlu pusing hitung manual! Sistem langsung menghitung peringkat pakai metode SAW yang akurat. Tinggal klik, hasilnya langsung keluar.",
      icon: <Calculator className="w-6 h-6" />,
    },
    {
      title: "Dashboard Keren",
      description:
        "Interface modern yang bikin mata happy! Lihat semua data penting dalam sekali pandang dengan tampilan yang fresh dan mudah dipahami.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: "Keamanan Maksimal",
      description:
        "Data aman? Pasti dong! Dilengkapi sistem autentikasi canggih dan enkripsi data. Privasi dan keamanan informasi akademik jadi prioritas utama.",
      icon: <Shield className="w-6 h-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 py-10 max-w-7xl mx-auto px-4">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-border",
        (index === 0 || index === 3) && "lg:border-l border-border",
        index < 3 && "lg:border-b border-border"
      )}
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-muted to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-muted to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-primary">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-border group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-primary">
          {title}
        </span>
      </div>
      <p className="text-sm text-primary max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
