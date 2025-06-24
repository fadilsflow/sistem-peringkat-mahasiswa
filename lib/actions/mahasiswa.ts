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
        id: periodeId,
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
          periodeId: periodeId,
          userId: userId,
        }
      : {
          userId: userId,
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
      periodeId: periodeId,
      userId: userId,
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
  periodeId: string;
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
        id: data.periodeId,
        userId: userId,
      },
    });

    if (!periode) {
      throw new Error(
        `Periode dengan ID ${data.periodeId} tidak ditemukan atau akses ditolak`
      );
    }

    // Check if mahasiswa already exists in this period
    const existingMahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        nim: data.nim,
        periodeId: data.periodeId,
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
        periodeId: data.periodeId,
        userId: userId,
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
    periodeId: string;
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
      id: data.periodeId,
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
      periodeId: periodeId,
      userId: userId,
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
        periodeId: periodeId,
        userId: userId,
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

    if (data.length === 0) {
      throw new Error("File Excel tidak berisi data mahasiswa.");
    }

    // All data should belong to the same period, taken from the first row.
    const periodeId = data[0]?.periodeId;
    if (!periodeId) {
      throw new Error("Data tidak valid: Periode ID tidak ditemukan.");
    }

    // Verify the period exists and belongs to the user.
    const periode = await prisma.periode.findUnique({
      where: { id: periodeId, userId },
    });

    if (!periode) {
      throw new Error("Periode tidak ditemukan atau akses ditolak.");
    }

    const nims = data.map((item) => item.nim);

    // Check for all duplicates in a single efficient query.
    const existingMahasiswas = await prisma.mahasiswa.findMany({
      where: {
        periodeId: periodeId,
        nim: { in: nims },
      },
      select: { nim: true },
    });

    if (existingMahasiswas.length > 0) {
      const existingNims = existingMahasiswas.map((m) => m.nim).join(", ");
      throw new Error(
        `Mahasiswa dengan NIM berikut sudah ada di periode ini: ${existingNims}`
      );
    }

    // A single createMany call is the most efficient way to bulk insert.
    // It's treated as a single transaction by the database and avoids Accelerate's timeout.
    await prisma.mahasiswa.createMany({
      data: data.map((item) => ({
        ...item,
        userId: userId,
        tanggal_input: new Date(),
        // Ensure all items are assigned to the correct period from the context
        periodeId: periodeId,
      })),
      skipDuplicates: true, // Use the @@unique constraint for safety
    });

    revalidatePath("/mahasiswa");
    revalidatePath("/hasil-saw");
    revalidatePath("/dashboard");
    revalidatePath("/manage");
  } catch (error) {
    console.error("Error creating mahasiswa bulk:", error);
    // Re-throw to be handled by the calling component
    throw error;
  }
}
