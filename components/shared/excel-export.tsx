"use client";

import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/utils/excel";
import { Mahasiswa } from "@prisma/client";

interface ExcelExportProps {
  data: {
    nim: string;
    nama: string;
    nilai_akademik: number;
    kehadiran: number;
    prestasi_akademik: number;
    prestasi_nonakademik: number;
    perilaku: number;
    keaktifan_organisasi: number;
    periodeId_periode: string;
  }[];
}

export default function ExcelExport({ data }: ExcelExportProps) {
  const handleExport = () => {
    const formattedData = data.map((item) => ({
      NIM: item.nim,
      Nama: item.nama,
      "Nilai Akademik": item.nilai_akademik,
      Kehadiran: item.kehadiran,
      "Prestasi Akademik": item.prestasi_akademik,
      "Prestasi Non-Akademik": item.prestasi_nonakademik,
      Perilaku: item.perilaku,
      "Keaktifan Organisasi": item.keaktifan_organisasi,
      "ID Periode": item.periodeId_periode,
    }));

    exportToExcel(
      formattedData as unknown as Mahasiswa[],
      "data-mahasiswa.xlsx"
    );
  };

  return (
    <Button onClick={handleExport} variant="outline">
      Export Excel
    </Button>
  );
}
