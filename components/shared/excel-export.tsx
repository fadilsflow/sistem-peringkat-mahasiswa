"use client";

import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/utils/excel";
import { Download } from "lucide-react";
import { Mahasiswa } from "@prisma/client";

interface ExcelExportProps {
  data: Mahasiswa[];
}

export default function ExcelExport({ data }: ExcelExportProps) {
  const handleExport = () => {
    const formattedData = data.map((item) => ({
      nim: item.nim,
      nama: item.nama,
      nilai_akademik: item.nilai_akademik,
      kehadiran: item.kehadiran,
      prestasi_akademik: item.prestasi_akademik,
      prestasi_nonakademik: item.prestasi_nonakademik,
      perilaku: item.perilaku,
      keaktifan_organisasi: item.keaktifan_organisasi,
      periodeId_periode: item.periodeId_periode,
      tanggal_input: item.tanggal_input,
    }));

    exportToExcel(formattedData, "data-mahasiswa.xlsx");
  };

  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Export Excel
    </Button>
  );
}
