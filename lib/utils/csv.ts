import { Mahasiswa } from "@prisma/client";
import Papa from "papaparse";

export const CSV_HEADERS = [
  "nim",
  "nama",
  "nilai_akademik",
  "kehadiran",
  "prestasi_akademik",
  "prestasi_nonakademik",
  "perilaku",
  "keaktifan_organisasi",
];

export const CSV_TEMPLATE_ROWS = [
  CSV_HEADERS.join(","),
  "12345,John Doe,85.5,90,2,1,4,3",
];

export function generateCsvTemplate(): string {
  return CSV_TEMPLATE_ROWS.join("\n");
}

export interface CsvMahasiswa {
  nim: string;
  nama: string;
  nilai_akademik: string;
  kehadiran: string;
  prestasi_akademik: string;
  prestasi_nonakademik: string;
  perilaku: string;
  keaktifan_organisasi: string;
}

export function validateCsvData(data: CsvMahasiswa[]): {
  isValid: boolean;
  errors: string[];
  validData: Omit<
    Mahasiswa,
    "id_periode" | "periodeId_periode" | "tanggal_input" | "Periode"
  >[];
} {
  const errors: string[] = [];
  const validData: Omit<
    Mahasiswa,
    "id_periode" | "periodeId_periode" | "tanggal_input" | "Periode"
  >[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because of header row and 0-based index
    const rowErrors: string[] = [];

    // Validate required fields
    if (!row.nim) rowErrors.push("NIM tidak boleh kosong");
    if (!row.nama) rowErrors.push("Nama tidak boleh kosong");

    // Validate numeric fields
    const nilai_akademik = parseFloat(row.nilai_akademik);
    if (isNaN(nilai_akademik) || nilai_akademik < 0 || nilai_akademik > 100) {
      rowErrors.push("Nilai akademik harus berupa angka antara 0-100");
    }

    const kehadiran = parseFloat(row.kehadiran);
    if (isNaN(kehadiran) || kehadiran < 0 || kehadiran > 100) {
      rowErrors.push("Kehadiran harus berupa angka antara 0-100");
    }

    const prestasi_akademik = parseInt(row.prestasi_akademik);
    if (
      isNaN(prestasi_akademik) ||
      prestasi_akademik < 0 ||
      prestasi_akademik > 5
    ) {
      rowErrors.push("Prestasi akademik harus berupa angka antara 0-5");
    }

    const prestasi_nonakademik = parseInt(row.prestasi_nonakademik);
    if (
      isNaN(prestasi_nonakademik) ||
      prestasi_nonakademik < 0 ||
      prestasi_nonakademik > 5
    ) {
      rowErrors.push("Prestasi non-akademik harus berupa angka antara 0-5");
    }

    const perilaku = parseInt(row.perilaku);
    if (isNaN(perilaku) || perilaku < 1 || perilaku > 5) {
      rowErrors.push("Perilaku harus berupa angka antara 1-5");
    }

    const keaktifan_organisasi = parseInt(row.keaktifan_organisasi);
    if (
      isNaN(keaktifan_organisasi) ||
      keaktifan_organisasi < 1 ||
      keaktifan_organisasi > 5
    ) {
      rowErrors.push("Keaktifan organisasi harus berupa angka antara 1-5");
    }

    if (rowErrors.length > 0) {
      errors.push(`Baris ${rowNumber}: ${rowErrors.join(", ")}`);
    } else {
      validData.push({
        nim: row.nim,
        nama: row.nama,
        nilai_akademik,
        kehadiran,
        prestasi_akademik,
        prestasi_nonakademik,
        perilaku,
        keaktifan_organisasi,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validData,
  };
}

export function parseCsvFile(file: File): Promise<CsvMahasiswa[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as CsvMahasiswa[]);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function exportToCsv(data: Mahasiswa[]): string {
  const rows = data.map((item) => ({
    nim: item.nim,
    nama: item.nama,
    nilai_akademik: item.nilai_akademik,
    kehadiran: item.kehadiran,
    prestasi_akademik: item.prestasi_akademik,
    prestasi_nonakademik: item.prestasi_nonakademik,
    perilaku: item.perilaku,
    keaktifan_organisasi: item.keaktifan_organisasi,
  }));

  return Papa.unparse(rows, {
    header: true,
    delimiter: ",",
  });
}
