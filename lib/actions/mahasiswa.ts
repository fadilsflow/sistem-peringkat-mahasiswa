// mahasiswa.ts
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function getMahasiswaList(periodeId?: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (periodeId) {
    // Verify the periode belongs to the current user
    const periode = await prisma.periode.findFirst({
      where: {
        id_periode: periodeId,
        userId: userId,
      },
    });

    if (!periode) {
      throw new Error("Periode not found or access denied");
    }
  }

  return await prisma.mahasiswa.findMany({
    where: periodeId
      ? {
          periodeId_periode: periodeId,
          periode: {
            userId: userId,
          },
        }
      : {
          periode: {
            userId: userId,
          },
        },
    include: { periode: true },
    orderBy: { nim: "asc" },
  });
}

export async function getMahasiswaById(nim: string, periodeId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.mahasiswa.findFirst({
    where: {
      nim,
      periodeId_periode: periodeId,
      periode: {
        userId: userId,
      },
    },
    include: { periode: true },
  });
}

interface CreateMahasiswaData {
  nim: string;
  nama: string;
  nilai_akademik: number;
  kehadiran: number;
  prestasi_akademik: number;
  prestasi_nonakademik: number;
  perilaku: number;
  keaktifan_organisasi: number;
  periodeId_periode: string;
}

export async function createMahasiswa(data: CreateMahasiswaData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if periode exists and belongs to the current user
    const periode = await prisma.periode.findFirst({
      where: {
        id_periode: data.periodeId_periode,
        userId: userId,
      },
    });

    if (!periode) {
      throw new Error(
        `Periode dengan ID ${data.periodeId_periode} tidak ditemukan atau akses ditolak`
      );
    }

    // Check if mahasiswa already exists in this period
    const existingMahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        nim: data.nim,
        periodeId_periode: data.periodeId_periode,
      },
    });

    if (existingMahasiswa) {
      throw new Error(
        `Mahasiswa dengan NIM ${data.nim} sudah ada di periode ini`
      );
    }

    // Create new mahasiswa
    await prisma.mahasiswa.create({
      data: {
        nim: data.nim,
        nama: data.nama,
        nilai_akademik: data.nilai_akademik,
        kehadiran: data.kehadiran,
        prestasi_akademik: data.prestasi_akademik,
        prestasi_nonakademik: data.prestasi_nonakademik,
        perilaku: data.perilaku,
        keaktifan_organisasi: data.keaktifan_organisasi,
        tanggal_input: new Date(),
        periode: {
          connect: {
            id_periode_userId: {
              id_periode: data.periodeId_periode,
              userId: userId,
            },
          },
        },
      },
    });

    revalidatePath("/mahasiswa");
    revalidatePath("/hasil-saw");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error creating mahasiswa:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Gagal menyimpan data mahasiswa");
  }
}

export async function updateMahasiswa(
  nim: string,
  periodeId: string,
  data: {
    nama: string;
    periodeId_periode: string;
    nilai_akademik: number;
    kehadiran: number;
    prestasi_akademik: number;
    prestasi_nonakademik: number;
    perilaku: number;
    keaktifan_organisasi: number;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify the periode belongs to the current user
  const periode = await prisma.periode.findFirst({
    where: {
      id_periode: data.periodeId_periode,
      userId: userId,
    },
  });

  if (!periode) {
    throw new Error("Periode not found or access denied");
  }

  const { ...updateData } = data;
  await prisma.mahasiswa.updateMany({
    where: {
      nim,
      periodeId_periode: periodeId,
      periode: {
        userId: userId,
      },
    },
    data: {
      ...updateData,
      tanggal_input: new Date(),
    },
  });
  revalidatePath("/mahasiswa");
  revalidatePath("/hasil-saw");
  revalidatePath("/dashboard");
}

export async function deleteMahasiswa(nim: string, periodeId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    await prisma.mahasiswa.deleteMany({
      where: {
        nim,
        periodeId_periode: periodeId,
        periode: {
          userId: userId,
        },
      },
    });

    revalidatePath("/mahasiswa");
    revalidatePath("/hasil-saw");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting mahasiswa:", error);
    throw new Error("Gagal menghapus data mahasiswa");
  }
}

export async function createMahasiswaBulk(data: CreateMahasiswaData[]) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if periode exists and belongs to the current user
    const periodeId = data[0]?.periodeId_periode;
    if (!periodeId) {
      throw new Error("Periode ID tidak valid");
    }

    const periode = await prisma.periode.findFirst({
      where: {
        id_periode: periodeId,
        userId: userId,
      },
    });

    if (!periode) {
      throw new Error("Periode tidak ditemukan atau akses ditolak");
    }

    // Check for existing mahasiswa in this period
    const nims = data.map((item) => item.nim);
    const existingMahasiswa = await prisma.mahasiswa.findMany({
      where: {
        AND: [
          { nim: { in: nims } },
          { periodeId_periode: periodeId },
          {
            periode: {
              userId: userId,
            },
          },
        ],
      },
      select: {
        nim: true,
      },
    });

    if (existingMahasiswa.length > 0) {
      throw new Error(
        `Beberapa NIM sudah terdaftar di periode ini: ${existingMahasiswa
          .map((m) => m.nim)
          .join(", ")}`
      );
    }

    // Create all mahasiswa records in a single transaction
    await prisma.$transaction(async (tx) => {
      for (const item of data) {
        await tx.mahasiswa.create({
          data: {
            nim: item.nim,
            nama: item.nama,
            nilai_akademik: item.nilai_akademik,
            kehadiran: item.kehadiran,
            prestasi_akademik: item.prestasi_akademik,
            prestasi_nonakademik: item.prestasi_nonakademik,
            perilaku: item.perilaku,
            keaktifan_organisasi: item.keaktifan_organisasi,
            tanggal_input: new Date(),
            periode: {
              connect: {
                id_periode_userId: {
                  id_periode: item.periodeId_periode,
                  userId: userId,
                },
              },
            },
          },
        });
      }
    });

    revalidatePath("/mahasiswa");
    revalidatePath("/hasil-saw");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error creating mahasiswa bulk:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Gagal menyimpan data mahasiswa");
  }
}
