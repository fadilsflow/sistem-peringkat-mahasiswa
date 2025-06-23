"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMahasiswaBulk } from "@/lib/actions/mahasiswa";
import {
  parseExcelFile,
  validateExcelData,
  generateExcelTemplate,
} from "@/lib/utils/excel";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Loader2 } from "lucide-react";

interface ExcelImportProps {
  periodeId: string;
  onSuccess?: () => void;
}

export default function ExcelImport({
  periodeId,
  onSuccess,
}: ExcelImportProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadTemplate = () => {
    try {
      const workbook = generateExcelTemplate();
      XLSX.writeFile(workbook, "template-mahasiswa.xlsx");
      toast.success("Template berhasil diunduh");
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Gagal mengunduh template");
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setIsLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.name.endsWith(".xlsx")) {
        toast.error("File harus berformat .xlsx");
        return;
      }

      // Parse Excel file
      const data = await parseExcelFile(file);

      // Validate data
      const validation = validateExcelData(data);
      if (!validation.isValid) {
        toast.error(
          <div className="mt-2">
            {validation.errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        );
        return;
      }

      // Prepare data for bulk import
      const bulkData = data.map((student) => ({
        ...student,
        periodeId_periode: periodeId,
      }));

      // Save data in bulk
      await createMahasiswaBulk(bulkData);

      toast.success("Data mahasiswa berhasil diimpor");
      onSuccess?.();

      // Reset file input
      event.target.value = "";
    } catch (error) {
      console.error("Error importing data:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengimpor data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="file">File Excel</Label>
          <Input
            id="file"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="cursor-pointer"
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadTemplate}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Download Template"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
