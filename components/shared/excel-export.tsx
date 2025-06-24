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
    exportToExcel(data, "data-mahasiswa.xlsx");
  };

  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Export Excel
    </Button>
  );
}
