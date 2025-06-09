import { prisma } from "@/lib/db";
import { Mahasiswa } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodeId = searchParams.get("periode");

    if (!periodeId) {
      return NextResponse.json(
        { error: "Periode ID is required" },
        { status: 400 }
      );
    }

    const mahasiswa = await prisma.mahasiswa.findMany({
      where: {
        periodeId_periode: periodeId,
      },
    });

    const totalMahasiswa = mahasiswa.length;

    const avgNilaiAkademik =
      mahasiswa.reduce(
        (sum: number, m: Mahasiswa) => sum + m.nilai_akademik,
        0
      ) / totalMahasiswa || 0;

    const avgKehadiran =
      mahasiswa.reduce((sum: number, m: Mahasiswa) => sum + m.kehadiran, 0) /
        totalMahasiswa || 0;

    const avgPrestasi =
      mahasiswa.reduce(
        (sum: number, m: Mahasiswa) =>
          sum + (m.prestasi_akademik + m.prestasi_nonakademik) / 2,
        0
      ) / totalMahasiswa || 0;

    return NextResponse.json({
      totalMahasiswa,
      avgNilaiAkademik,
      avgKehadiran,
      avgPrestasi,
    });
  } catch (error) {
    console.error("Error in dashboard API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
