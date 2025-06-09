"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMahasiswa } from "@/lib/actions/mahasiswa";
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
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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

      // Save data
      for (const student of data) {
        await createMahasiswa({
          ...student,
          periodeId_periode: periodeId,
        });
      }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("periodeId", periodeId);

      const response = await fetch("/api/mahasiswa/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to import data");
      }

      toast.success("Data berhasil diimpor");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengimpor data");
    } finally {
      setIsLoading(false);
      setFile(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="file">File Excel</Label>
          <Input
            id="file"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadTemplate}
            disabled={isLoading}
          >
            Download Template
          </Button>
          <Button type="submit" disabled={!file || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import
          </Button>
        </div>
      </form>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data Mahasiswa</DialogTitle>
            <DialogDescription>
              Upload file Excel dengan format yang sesuai template
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="excel">File Excel</Label>
            <Input
              id="excel"
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button onClick={handleDownloadTemplate} disabled={isLoading}>
              Download Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
