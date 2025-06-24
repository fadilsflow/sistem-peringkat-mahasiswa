import { prisma } from "@/lib/db";
import { Mahasiswa } from "@prisma/client";

interface SAWData extends Mahasiswa {}

interface NormalizedSAWResult {
  mahasiswa: SAWData;
  normalizedValues: {
    nilai_akademik: number;
    kehadiran: number;
    prestasi_akademik: number;
    prestasi_nonakademik: number;
    perilaku: number;
    keaktifan_organisasi: number;
  };
  weightedValues: {
    nilai_akademik: number;
    kehadiran: number;
    prestasi_akademik: number;
    prestasi_nonakademik: number;
    perilaku: number;
    keaktifan_organisasi: number;
  };
  finalScore: number;
  rank: number;
}

export async function getNormalizedSAWData(
  periodeId?: string,
  userId?: string
) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Get latest periode if not specified
    if (!periodeId) {
      const latestPeriode = await prisma.periode.findFirst({
        where: { userId },
        orderBy: { tahun: "desc" },
      });
      if (!latestPeriode) {
        throw new Error("No periode found");
      }
      periodeId = latestPeriode.id_periode;
    }

    // Get periode data with weights
    const periode = await prisma.periode.findUnique({
      where: {
        id_periode_userId: {
          id_periode: periodeId,
          userId: userId,
        },
      },
      include: {
        mahasiswa: {
          orderBy: { nim: "asc" },
        },
      },
    });

    if (!periode || !periode.mahasiswa.length) {
      throw new Error("No data found for the specified periode");
    }

    // Calculate normalized and weighted values
    const results: NormalizedSAWResult[] = [];

    // Find max values for benefit criteria (ensure non-zero values)
    const maxValues = {
      nilai_akademik: Math.max(
        1,
        ...periode.mahasiswa.map((m) => m.nilai_akademik || 0)
      ),
      kehadiran: Math.max(1, ...periode.mahasiswa.map((m) => m.kehadiran || 0)),
      prestasi_akademik: Math.max(
        1,
        ...periode.mahasiswa.map((m) => m.prestasi_akademik || 0)
      ),
      prestasi_nonakademik: Math.max(
        1,
        ...periode.mahasiswa.map((m) => m.prestasi_nonakademik || 0)
      ),
      perilaku: Math.max(1, ...periode.mahasiswa.map((m) => m.perilaku || 0)),
      keaktifan_organisasi: Math.max(
        1,
        ...periode.mahasiswa.map((m) => m.keaktifan_organisasi || 0)
      ),
    };

    // Calculate normalized and weighted values for each student
    periode.mahasiswa.forEach((mahasiswa) => {
      const normalizedValues = {
        nilai_akademik:
          (mahasiswa.nilai_akademik || 0) / maxValues.nilai_akademik,
        kehadiran: (mahasiswa.kehadiran || 0) / maxValues.kehadiran,
        prestasi_akademik:
          (mahasiswa.prestasi_akademik || 0) / maxValues.prestasi_akademik,
        prestasi_nonakademik:
          (mahasiswa.prestasi_nonakademik || 0) /
          maxValues.prestasi_nonakademik,
        perilaku: (mahasiswa.perilaku || 0) / maxValues.perilaku,
        keaktifan_organisasi:
          (mahasiswa.keaktifan_organisasi || 0) /
          maxValues.keaktifan_organisasi,
      };

      const weightedValues = {
        nilai_akademik:
          normalizedValues.nilai_akademik * (periode.w1_nilai_akademik || 0),
        kehadiran: normalizedValues.kehadiran * (periode.w2_kehadiran || 0),
        prestasi_akademik:
          normalizedValues.prestasi_akademik *
          (periode.w3_prestasi_akademik || 0),
        prestasi_nonakademik:
          normalizedValues.prestasi_nonakademik *
          (periode.w4_prestasi_nonakademik || 0),
        perilaku: normalizedValues.perilaku * (periode.w5_perilaku || 0),
        keaktifan_organisasi:
          normalizedValues.keaktifan_organisasi *
          (periode.w6_keaktifan_organisasi || 0),
      };

      const finalScore = Object.values(weightedValues).reduce(
        (a, b) => a + b,
        0
      );

      results.push({
        mahasiswa,
        normalizedValues,
        weightedValues,
        finalScore,
        rank: 0, // Will be set after sorting
      });
    });

    // Sort by final score and assign ranks
    results.sort((a, b) => b.finalScore - a.finalScore);
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    return results;
  } catch (error) {
    console.error("Error calculating SAW data:", error);
    throw error;
  }
}

export function formatSAWDataForAI(data: NormalizedSAWResult[]): string {
  if (!data.length) {
    return "# Tidak ada data mahasiswa untuk periode ini\n";
  }

  let markdown = "# Data Peringkat Mahasiswa (Metode SAW)\n\n";

  markdown += "## Informasi Periode\n";
  markdown += `- Total Mahasiswa: ${data.length}\n`;
  markdown += `- Periode: ${data[0]?.mahasiswa.periodeId_periode}\n\n`;

  markdown += "## Peringkat Mahasiswa\n\n";
  markdown +=
    "| Rank | NIM | Nama | Nilai Akhir | Nilai Akademik | Kehadiran | Prestasi Akademik | Prestasi Non-akademik | Perilaku | Keaktifan Organisasi |\n";
  markdown +=
    "|------|-----|------|-------------|----------------|-----------|------------------|---------------------|----------|---------------------|\n";

  data.forEach((result) => {
    markdown += `| ${result.rank} | ${result.mahasiswa.nim} | ${result.mahasiswa.nama} | ${result.finalScore.toFixed(4)} | ${result.mahasiswa.nilai_akademik.toFixed(2)} | ${result.mahasiswa.kehadiran.toFixed(2)}% | ${result.mahasiswa.prestasi_akademik} | ${result.mahasiswa.prestasi_nonakademik} | ${result.mahasiswa.perilaku} | ${result.mahasiswa.keaktifan_organisasi} |\n`;
  });

  markdown += "\n## Catatan Interpretasi\n";
  markdown +=
    "- Nilai Akhir: Hasil perhitungan SAW (semakin tinggi semakin baik)\n";
  markdown += "- Nilai Akademik: Skala 0-100\n";
  markdown += "- Kehadiran: Persentase (0-100%)\n";
  markdown += "- Prestasi Akademik & Non-akademik: Skala 0-5\n";
  markdown += "- Perilaku & Keaktifan Organisasi: Skala 1-5\n";

  return markdown;
}
