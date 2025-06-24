import { Mahasiswa } from "@prisma/client";
import * as XLSX from "xlsx";

export const EXCEL_HEADERS = [
  [
    "NIM",
    "Nama",
    "Nilai Akademik",
    "Kehadiran (%)",
    "Prestasi Akademik (0-5)",
    "Prestasi Non-akademik (0-5)",
    "Perilaku (1-5)",
    "Keaktifan Organisasi (1-5)",
  ],
];

interface StudentData {
  nim: string;
  nama: string;
  nilai_akademik: number;
  kehadiran: number;
  prestasi_akademik: number;
  prestasi_nonakademik: number;
  perilaku: number;
  keaktifan_organisasi: number;
}

export function generateExcelTemplate() {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Define headers with validation rules
  const headers = [
    ["Data Mahasiswa - Template Import"],
    ["Catatan:"],
    ["- Kolom dengan tanda * wajib diisi"],
    ["- Nilai Akademik: 0-100"],
    ["- Kehadiran: 0-100"],
    ["- Prestasi Akademik: 0-5"],
    ["- Prestasi Non-Akademik: 0-5"],
    ["- Perilaku: 1-5"],
    ["- Keaktifan Organisasi: 1-5"],
    [],
    [
      "NIM*",
      "Nama*",
      "Nilai Akademik*",
      "Kehadiran*",
      "Prestasi Akademik*",
      "Prestasi Non-Akademik*",
      "Perilaku*",
      "Keaktifan Organisasi*",
      "ID Periode*",
    ],
    ["12345", "John Doe", "85", "90", "3", "2", "4", "3", "P20241"],
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(headers);

  // Set column widths
  const colWidths = [15, 30, 15, 15, 20, 25, 15, 20, 15];
  worksheet["!cols"] = colWidths.map((width) => ({ width }));

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

  return workbook;
}

export function parseExcelFile(file: File): Promise<StudentData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Skip header rows and get data starting from row 11 (0-based index 10)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          range: 10,
        }) as Record<string, unknown>[];

        const parsedData: StudentData[] = jsonData.map((row) => ({
          nim: String(row["NIM*"] || ""),
          nama: String(row["Nama*"] || ""),
          nilai_akademik: Number(row["Nilai Akademik*"] || 0),
          kehadiran: Number(row["Kehadiran*"] || 0),
          prestasi_akademik: Number(row["Prestasi Akademik*"] || 0),
          prestasi_nonakademik: Number(row["Prestasi Non-Akademik*"] || 0),
          perilaku: Number(row["Perilaku*"] || 0),
          keaktifan_organisasi: Number(row["Keaktifan Organisasi*"] || 0),
        }));

        resolve(parsedData);
      } catch {
        reject(new Error("Gagal membaca file Excel"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Gagal membaca file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

export function validateExcelData(data: StudentData[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  data.forEach((student, index) => {
    const rowNumber = index + 2; // Adding 2 because Excel rows start at 1 and we have a header row

    if (!student.nim) {
      errors.push(`Baris ${rowNumber}: NIM wajib diisi`);
    }

    if (!student.nama) {
      errors.push(`Baris ${rowNumber}: Nama wajib diisi`);
    }

    if (student.nilai_akademik < 0 || student.nilai_akademik > 100) {
      errors.push(`Baris ${rowNumber}: Nilai Akademik harus antara 0-100`);
    }

    if (student.kehadiran < 0 || student.kehadiran > 100) {
      errors.push(`Baris ${rowNumber}: Kehadiran harus antara 0-100`);
    }

    if (student.prestasi_akademik < 0 || student.prestasi_akademik > 5) {
      errors.push(`Baris ${rowNumber}: Prestasi Akademik harus antara 0-5`);
    }

    if (student.prestasi_nonakademik < 0 || student.prestasi_nonakademik > 5) {
      errors.push(`Baris ${rowNumber}: Prestasi Non-Akademik harus antara 0-5`);
    }

    if (student.perilaku < 1 || student.perilaku > 5) {
      errors.push(`Baris ${rowNumber}: Perilaku harus antara 1-5`);
    }

    if (student.keaktifan_organisasi < 1 || student.keaktifan_organisasi > 5) {
      errors.push(`Baris ${rowNumber}: Keaktifan Organisasi harus antara 1-5`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function exportToExcel(data: Mahasiswa[], filename: string) {
  // Format data for export
  const formattedData = data.map((item) => ({
    NIM: item.nim,
    Nama: item.nama,
    "Nilai Akademik": item.nilai_akademik,
    "Kehadiran (%)": item.kehadiran,
    "Prestasi Akademik": item.prestasi_akademik,
    "Prestasi Non-akademik": item.prestasi_nonakademik,
    Perilaku: item.perilaku,
    "Keaktifan Organisasi": item.keaktifan_organisasi,
    "Tanggal Input": item.tanggal_input.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    "ID Periode": item.periodeId,
  }));

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData, {
    header: [
      "NIM",
      "Nama",
      "Nilai Akademik",
      "Kehadiran (%)",
      "Prestasi Akademik",
      "Prestasi Non-akademik",
      "Perilaku",
      "Keaktifan Organisasi",
      "Tanggal Input",
      "ID Periode",
    ],
  });

  // Set column widths
  const colWidths = [15, 30, 15, 15, 20, 25, 15, 20, 25, 15];
  worksheet["!cols"] = colWidths.map((width) => ({ width }));

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Mahasiswa");

  // Write to file
  XLSX.writeFile(workbook, filename);
}
