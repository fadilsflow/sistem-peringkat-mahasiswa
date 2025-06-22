import { cn } from "@/lib/utils";
import {
  Users,
  Calendar,
  Calculator,
  BarChart3,
  Trophy,
  Shield,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Manajemen Data Mahasiswa",
      description:
        "Input dan kelola data mahasiswa termasuk NIM, nama, dan nilai kriteria penilaian seperti nilai akademik, kehadiran, prestasi, perilaku, dan keaktifan organisasi.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Manajemen Periode",
      description:
        "Kelola periode penilaian, atur bobot kriteria, dan pantau daftar periode yang tersedia dengan mudah.",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      title: "Perhitungan SAW",
      description:
        "Sistem akan melakukan normalisasi nilai kriteria dan menghitung nilai akhir berdasarkan bobot untuk menentukan peringkat mahasiswa.",
      icon: <Calculator className="w-6 h-6" />,
    },
    {
      title: "Dashboard & Statistik",
      description:
        "Tampilan ringkasan data periode aktif, statistik jumlah mahasiswa, dan akses cepat ke fitur utama.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: "Hasil Peringkat",
      description:
        "Lihat peringkat mahasiswa, detail perhitungan, dan filter berdasarkan periode dengan visualisasi yang jelas.",
      icon: <Trophy className="w-6 h-6" />,
    },
    {
      title: "Autentikasi Dosen",
      description: "Autentikasi Dosen atau Guru sebagai pengelola data dengan keamanan yang terjamin.",
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
      <div className="mb-4 relative z-10 px-10 text-muted-foreground">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-border group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
}; 