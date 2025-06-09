import { Mahasiswa, Periode } from "@prisma/client";

export type NormalizedValues = {
  nilai_akademik: number;
  kehadiran: number;
  prestasi_akademik: number;
  prestasi_nonakademik: number;
  perilaku: number;
  keaktifan_organisasi: number;
};

export type WeightedValues = {
  nilai_akademik: number;
  kehadiran: number;
  prestasi_akademik: number;
  prestasi_nonakademik: number;
  perilaku: number;
  keaktifan_organisasi: number;
};

// Normalize values using benefit criteria (larger is better)
export function normalizeValues(mahasiswa: Mahasiswa[]): NormalizedValues[] {
  const maxValues = {
    nilai_akademik: Math.max(...mahasiswa.map((m) => m.nilai_akademik)),
    kehadiran: Math.max(...mahasiswa.map((m) => m.kehadiran)),
    prestasi_akademik: Math.max(...mahasiswa.map((m) => m.prestasi_akademik)),
    prestasi_nonakademik: Math.max(
      ...mahasiswa.map((m) => m.prestasi_nonakademik)
    ),
    perilaku: Math.max(...mahasiswa.map((m) => m.perilaku)),
    keaktifan_organisasi: Math.max(
      ...mahasiswa.map((m) => m.keaktifan_organisasi)
    ),
  };

  return mahasiswa.map((m) => ({
    nilai_akademik: m.nilai_akademik / maxValues.nilai_akademik,
    kehadiran: m.kehadiran / maxValues.kehadiran,
    prestasi_akademik: m.prestasi_akademik / maxValues.prestasi_akademik,
    prestasi_nonakademik:
      m.prestasi_nonakademik / maxValues.prestasi_nonakademik,
    perilaku: m.perilaku / maxValues.perilaku,
    keaktifan_organisasi:
      m.keaktifan_organisasi / maxValues.keaktifan_organisasi,
  }));
}

// Calculate weighted values
export function calculateWeightedValues(
  normalizedValues: NormalizedValues[],
  periode: Periode
): WeightedValues[] {
  return normalizedValues.map((values) => ({
    nilai_akademik: values.nilai_akademik * periode.w1_nilai_akademik,
    kehadiran: values.kehadiran * periode.w2_kehadiran,
    prestasi_akademik: values.prestasi_akademik * periode.w3_prestasi_akademik,
    prestasi_nonakademik:
      values.prestasi_nonakademik * periode.w4_prestasi_nonakademik,
    perilaku: values.perilaku * periode.w5_perilaku,
    keaktifan_organisasi:
      values.keaktifan_organisasi * periode.w6_keaktifan_organisasi,
  }));
}

// Calculate final scores
export function calculateFinalScores(
  weightedValues: WeightedValues[]
): number[] {
  return weightedValues.map((values) =>
    Object.values(values).reduce((sum, value) => sum + value, 0)
  );
}

// Get ranking with mahasiswa data
export function getRanking(mahasiswa: Mahasiswa[], periode: Periode) {
  const normalizedValues = normalizeValues(mahasiswa);
  const weightedValues = calculateWeightedValues(normalizedValues, periode);
  const finalScores = calculateFinalScores(weightedValues);

  return mahasiswa
    .map((m, index) => ({
      ...m,
      normalizedValues: normalizedValues[index],
      weightedValues: weightedValues[index],
      finalScore: finalScores[index],
    }))
    .sort((a, b) => b.finalScore - a.finalScore);
}
