import { DashboardContent } from "@/components/dashboard-content";
import { MahasiswaContent } from "@/components/mahasiswa-content";
import { PeriodeContent } from "@/components/periode-content";

export default function Home() {
  return (
    <div className="flex flex-col">
      <DashboardContent />
      <MahasiswaContent />
      <PeriodeContent />
    </div>
  );
}
