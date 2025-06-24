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
    },
  });
  revalidatePath("/periode");
  revalidatePath("/dashboard");
}

export async function updatePeriode(
  id: string,
  data: {
    id_periode?: string;
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

  // If id_periode is being changed, we need to update all related records
  if (data.id_periode && data.id_periode !== id) {
    try {
      return await prisma.$transaction(async (tx) => {
        // First, get all mahasiswa records for this period
        const mahasiswaList = await tx.mahasiswa.findMany({
          where: {
            periodeId_periode: id,
          },
        });

        // Check for conflicts in target period
        const existingNims = await tx.mahasiswa.findMany({
          where: {
            periodeId_periode: data.id_periode,
            nim: {
              in: mahasiswaList.map((m) => m.nim),
            },
          },
          select: {
            nim: true,
          },
        });

        if (existingNims.length > 0) {
          throw new Error(
            `Beberapa mahasiswa sudah terdaftar di periode target: ${existingNims.map((e) => e.nim).join(", ")}`
          );
        }

        // Delete all existing mahasiswa records for this period
        await tx.mahasiswa.deleteMany({
          where: {
            periodeId_periode: id,
          },
        });

        // Update the periode
        const updatedPeriode = await tx.periode.update({
          where: {
            id_periode: id,
            userId: userId,
          },
          data: {
            ...data,
            id_periode: data.id_periode,
          },
        });

        // Create new mahasiswa records one by one to avoid batch issues
        if (mahasiswaList.length > 0) {
          for (const mahasiswa of mahasiswaList) {
            await tx.mahasiswa.create({
              data: {
                nim: mahasiswa.nim,
                nama: mahasiswa.nama,
                nilai_akademik: mahasiswa.nilai_akademik,
                kehadiran: mahasiswa.kehadiran,
                prestasi_akademik: mahasiswa.prestasi_akademik,
                prestasi_nonakademik: mahasiswa.prestasi_nonakademik,
                perilaku: mahasiswa.perilaku,
                keaktifan_organisasi: mahasiswa.keaktifan_organisasi,
                tanggal_input: mahasiswa.tanggal_input,
                periodeId_periode: updatedPeriode.id_periode,
              },
            });
          }
        }

        return updatedPeriode;
      });
    } catch (error) {
      console.error("Error updating periode:", error);
      if (error instanceof Error) {
        throw new Error(`Gagal mengupdate periode: ${error.message}`);
      }
      throw new Error("Gagal mengupdate periode");
    }
  } else {
    // If not changing ID, just update normally
    const { ...updateData } = data;
    await prisma.periode.update({
      where: {
        id_periode: id,
        userId: userId,
      },
      data: updateData,
    });
  }

  revalidatePath("/periode");
  revalidatePath("/dashboard");
  revalidatePath("/mahasiswa");
}

export async function deletePeriode(id: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // First check if the periode exists and belongs to the user
    const periode = await prisma.periode.findFirst({
      where: {
        id_periode: id,
        userId: userId,
      },
    });

    if (!periode) {
      throw new Error("Periode tidak ditemukan atau akses ditolak");
    }

    // Delete all mahasiswa records associated with this periode first
    await prisma.$transaction(async (tx) => {
      // Delete mahasiswa records
      await tx.mahasiswa.deleteMany({
        where: {
          periodeId_periode: id,
        },
      });

      // Delete the periode
      await tx.periode.delete({
        where: {
          id_periode: id,
          userId: userId,
        },
      });
    });

    revalidatePath("/periode");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting periode:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Gagal menghapus periode");
  }
}
