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
      title: "Analisis SAW & AI",
      description:
        "Dapatkan hasil peringkat yang adil dengan metode SAW dan manfaatkan rekomendasi cerdas dari AI untuk pengembangan potensi setiap mahasiswa.",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      title: "Data Terpusat & Intuitif",
      description:
        "Kumpulkan semua data penting—mulai dari nilai, kehadiran, hingga prestasi—dalam satu platform yang dirancang untuk kemudahan akses dan pengelolaan.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Periode Penilaian Fleksibel",
      description:
        "Sesuaikan bobot dan kriteria penilaian untuk setiap semester atau tahun ajaran. Atur dengan mudah tanpa mengubah struktur data utama.",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      title: "Peringkat Real-time",
      description:
        "Lupakan spreadsheet dan perhitungan manual. SyncRank mengolah data secara otomatis dan menyajikan peringkat mahasiswa secara instan.",
      icon: <Calculator className="w-6 h-6" />,
    },
    {
      title: "Dashboard Interaktif",
      description:
        "Visualisasikan data, pantau tren performa, dan identifikasi mahasiswa berprestasi melalui dashboard yang informatif dan mudah digunakan.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: "Aman dan Terpercaya",
      description:
        "Dibangun dengan standar keamanan terdepan dan sistem autentikasi modern untuk memastikan data akademik institusi Anda selalu terjaga.",
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
