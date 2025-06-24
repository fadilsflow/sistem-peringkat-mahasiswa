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

  // Jika id_periode diubah, lakukan migrasi data mahasiswa ke periode baru
  if (data.id_periode && data.id_periode !== id) {
    try {
      // --- OPTIMISASI: Query berat dipindah ke luar transaksi ---
      // Ambil semua mahasiswa pada periode lama
      const mahasiswaList = await prisma.mahasiswa.findMany({
        where: {
          periodeId_periode: id,
        },
      });

      // Cek NIM yang sudah ada di periode target
      const existingNims =
        data.id_periode && mahasiswaList.length > 0
          ? await prisma.mahasiswa.findMany({
              where: {
                periodeId_periode: data.id_periode,
                nim: {
                  in: mahasiswaList.map((m) => m.nim),
                },
              },
              select: { nim: true },
            })
          : [];

      if (existingNims.length > 0) {
        throw new Error(
          `Beberapa mahasiswa sudah terdaftar di periode target: ${existingNims
            .map((e) => e.nim)
            .join(", ")}`
        );
      }

      // --- Transaksi hanya untuk operasi tulis ---
      return await prisma.$transaction(async (tx) => {
        // Hapus semua mahasiswa di periode lama
        await tx.mahasiswa.deleteMany({
          where: {
            periodeId_periode: id,
          },
        });

        // Update data periode (termasuk id_periode jika berubah)
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

        // Masukkan kembali mahasiswa ke periode baru (jika ada)
        if (mahasiswaList.length > 0) {
          // Gunakan createMany untuk batch insert
          await tx.mahasiswa.createMany({
            data: mahasiswaList.map((mahasiswa) => ({
              nim: mahasiswa.nim,
              nama: mahasiswa.nama,
              nilai_akademik: mahasiswa.nilai_akademik,
              kehadiran: mahasiswa.kehadiran,
              prestasi_akademik: mahasiswa.prestasi_akademik,
              prestasi_nonakademik: mahasiswa.prestasi_nonakademik,
              perilaku: mahasiswa.perilaku,
              keaktifan_organisasi: mahasiswa.keaktifan_organisasi,
              tanggal_input: mahasiswa.tanggal_input,
              periodeId_periode: data.id_periode!,
            })),
          });
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
    // Jika id_periode tidak berubah, update biasa
    const { ...updateData } = data;
    await prisma.periode.update({
      where: {
        id_periode: id,
        userId: userId,
      },
      data: updateData,
    });
  }

  // Pastikan tetap revalidate path setelah update
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
