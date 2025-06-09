"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getMahasiswaList(periodeId?: string) {
  return await prisma.mahasiswa.findMany({
    where: periodeId ? { periodeId_periode: periodeId } : undefined,
    include: { periode: true },
    orderBy: { nim: "asc" },
  });
}

export async function getMahasiswaById(nim: string) {
  return await prisma.mahasiswa.findUnique({
    where: { nim },
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
    // Check if mahasiswa already exists
    const existingMahasiswa = await prisma.mahasiswa.findUnique({
      where: {
        nim: data.nim,
      },
    });

    if (existingMahasiswa) {
      throw new Error(`Mahasiswa dengan NIM ${data.nim} sudah ada`);
    }

    // Check if periode exists
    const periode = await prisma.periode.findUnique({
      where: {
        id_periode: data.periodeId_periode,
      },
    });

    if (!periode) {
      throw new Error(
        `Periode dengan ID ${data.periodeId_periode} tidak ditemukan`
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
        periodeId_periode: data.periodeId_periode,
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
  await prisma.mahasiswa.update({
    where: { nim },
    data: {
      ...data,
      tanggal_input: new Date(),
    },
  });
  revalidatePath("/mahasiswa");
  revalidatePath("/hasil-saw");
  revalidatePath("/dashboard");
}

export async function deleteMahasiswa(nim: string) {
  try {
    await prisma.mahasiswa.delete({
      where: {
        nim,
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
