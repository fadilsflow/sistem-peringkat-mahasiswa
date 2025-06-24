"use client";

import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/utils/excel";
import { Download } from "lucide-react";
import { Mahasiswa } from "@prisma/client";

interface ExcelExportProps {
  data: Mahasiswa[];
  filename: string;
}

export default function ExcelExport({ data, filename }: ExcelExportProps) {
  const handleExport = () => {
    exportToExcel(data, `${filename}.xlsx`);
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      disabled={data.length === 0}
    >
      <Download className="mr-2 h-4 w-4" />
      Export Excel
    </Button>
  );
}
