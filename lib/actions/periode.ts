"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";
import { auth } from "@clerk/nextjs/server";

export async function getPeriodeList() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.periode.findMany({
    where: {
      userId: userId,
    },
    orderBy: [{ tahun: "desc" }, { semester: "desc" }],
  });
}

export async function getPeriodeById(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.periode.findFirst({
    where: {
      id_periode: id,
      userId: userId,
    },
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
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.periode.create({
    data: {
      ...data,
      userId: userId,
    }
  });
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
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.periode.update({
    where: {
      id_periode: id,
      userId: userId,
    },
    data,
  });
  revalidatePath("/periode");
  revalidatePath("/dashboard");
}

export async function deletePeriode(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Delete all mahasiswa records associated with this periode first
  await prisma.mahasiswa.deleteMany({
    where: {
      periodeId_periode: id,
    },
  });

  // Then delete the periode
  await prisma.periode.delete({
    where: {
      id_periode: id,
      userId: userId,
    },
  });

  revalidatePath("/periode");
  revalidatePath("/dashboard");
}
