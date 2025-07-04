import { prisma } from "@/lib/db";
import { Mahasiswa } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const periodeId = searchParams.get("periode");

    if (!periodeId) {
      return NextResponse.json(
        { error: "Periode ID is required" },
        { status: 400 }
      );
    }

    // Verify the periode belongs to the current user
    const periode = await prisma.periode.findFirst({
      where: {
        id: periodeId,
        userId: userId,
      },
    });

    if (!periode) {
      return NextResponse.json(
        { error: "Periode not found or access denied" },
        { status: 404 }
      );
    }

    const mahasiswa = await prisma.mahasiswa.findMany({
      where: {
        periodeId: periodeId,
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
