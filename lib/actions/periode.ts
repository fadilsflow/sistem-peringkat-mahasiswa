"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";

export async function getPeriodeList() {
  return await prisma.periode.findMany({
    orderBy: [{ tahun: "desc" }, { semester: "desc" }],
  });
}

export async function getPeriodeById(id: string) {
  return await prisma.periode.findUnique({
    where: { id_periode: id },
  });
}

export async function createPeriode(data: {
  id_periode: string;
  tahun: string;
  semester: number;
  w1_nilai_akademik: number;
  w2_kehadiran: number;
  w3_prestasi_akademik: number;
  w4_prestasi_nonakademik: number;
  w5_perilaku: number;
  w6_keaktifan_organisasi: number;
  deskripsi: string;
}) {
  await prisma.periode.create({ data });
  revalidatePath("/periode");
  revalidatePath("/dashboard");
}

export async function updatePeriode(
  id: string,
  data: {
    tahun: string;
    semester: number;
    w1_nilai_akademik: number;
    w2_kehadiran: number;
    w3_prestasi_akademik: number;
    w4_prestasi_nonakademik: number;
    w5_perilaku: number;
    w6_keaktifan_organisasi: number;
    deskripsi: string;
  }
) {
  await prisma.periode.update({
    where: { id_periode: id },
    data,
  });
  revalidatePath("/periode");
  revalidatePath("/dashboard");
}

export async function deletePeriode(id: string) {
  // Delete all mahasiswa records associated with this periode first
  await prisma.mahasiswa.deleteMany({
    where: {
      periodeId_periode: id,
    },
  });

  // Then delete the periode
  await prisma.periode.delete({
    where: { id_periode: id },
  });

  revalidatePath("/periode");
  revalidatePath("/dashboard");
}
