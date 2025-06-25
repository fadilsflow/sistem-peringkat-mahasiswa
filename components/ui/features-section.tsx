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
        "Kombinasikan keadilan metode SAW dengan kecerdasan AI. Dapatkan peringkat objektif dan rekomendasi personal untuk memaksimalkan potensi setiap mahasiswa.",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      title: "Manajemen Data Efisien",
      description:
        "Kelola data mahasiswa dan kriteria dengan mudah. Dukungan impor & ekspor Excel mempercepat alur kerja Anda, membebaskan waktu dari entri data manual.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Periode Penilaian Fleksibel",
      description:
        "Atur bobot dan kriteria penilaian yang berbeda untuk setiap periode. Fleksibilitas penuh untuk beradaptasi dengan kebutuhan akademik tanpa mengubah data inti.",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      title: "Peringkat Real-time",
      description:
        "Tinggalkan spreadsheet dan perhitungan manual. SyncRank mengolah data secara otomatis untuk menyajikan peringkat mahasiswa yang selalu ter-update secara instan.",
      icon: <Calculator className="w-6 h-6" />,
    },
    {
      title: "Dashboard Interaktif",
      description:
        "Pantau tren performa, visualisasikan data, dan temukan mahasiswa berprestasi dengan cepat melalui dashboard interaktif yang dirancang untuk kemudahan analisis.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: "Aman dan Terpercaya",
      description:
        "Keamanan data Anda adalah prioritas. Kami menggunakan sistem autentikasi modern dan standar keamanan terdepan untuk melindungi informasi akademik institusi Anda.",
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
