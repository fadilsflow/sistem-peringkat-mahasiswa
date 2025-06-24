// periode.ts
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
      id: id,
      userId: userId,
    },
  });
}

export interface PeriodeData {
  kode_periode: string;
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

export async function createPeriode(data: PeriodeData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingPeriode = await prisma.periode.findFirst({
    where: {
      kode_periode: data.kode_periode,
      userId: userId,
    },
  });

  if (existingPeriode) {
    throw new Error(`Periode dengan kode ${data.kode_periode} sudah ada.`);
  }

  try {
    await prisma.periode.create({
      data: {
        ...data,
        userId: userId,
      },
    });
    revalidatePath("/periode");
    revalidatePath("/dashboard");
  } catch (error: Error | unknown) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      throw new Error("Periode dengan ID tersebut sudah ada untuk user ini");
    }
    throw error;
  }
}

export async function updatePeriode(id: string, data: Partial<PeriodeData>) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const periodeToUpdate = await prisma.periode.findFirst({
    where: { id, userId },
  });

  if (!periodeToUpdate) {
    throw new Error("Periode tidak ditemukan atau akses ditolak.");
  }

  if (data.kode_periode) {
    const existing = await prisma.periode.findFirst({
      where: {
        kode_periode: data.kode_periode,
        userId,
        id: { not: id }, // exclude current one
      },
    });
    if (existing) {
      throw new Error(`Periode dengan kode ${data.kode_periode} sudah ada.`);
    }
  }

  try {
    await prisma.periode.update({
      where: {
        id: id,
      },
      data: data,
    });
  } catch (error: Error | unknown) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      throw new Error("Periode dengan ID tersebut sudah ada untuk user ini");
    }
    throw error;
  }

  // Pastikan tetap revalidate path setelah update
  revalidatePath("/periode");
  revalidatePath("/dashboard");
  revalidatePath("/mahasiswa");
  revalidatePath("/hasil-saw");
}

export async function deletePeriode(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const periodeToDelete = await prisma.periode.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (!periodeToDelete) {
    throw new Error("Periode tidak ditemukan atau akses ditolak");
  }

  const mahasiswaCount = await prisma.mahasiswa.count({
    where: { periodeId: id },
  });

  if (mahasiswaCount > 0) {
    throw new Error(
      "Tidak dapat menghapus periode karena masih ada data mahasiswa terkait. Hapus data mahasiswa terlebih dahulu."
    );
  }

  try {
    // Delete the periode
    await prisma.periode.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/periode");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting periode:", error);
    throw new Error("Gagal menghapus periode");
  }
}

export async function getLatestPeriode() {
  const { userId } = await auth();
  if (!userId) return null;

  return await prisma.periode.findFirst({
    where: { userId },
    orderBy: [{ tahun: "desc" }, { semester: "desc" }],
  });
}
