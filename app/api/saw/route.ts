import { prisma } from "@/lib/db";
import { Mahasiswa } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const periodeId = searchParams.get("periode");

    if (!periodeId) {
      return NextResponse.json(
        { error: "Periode ID is required" },
        { status: 400 }
      );
    }

    // Get periode data for weights and verify ownership
    const periode = await prisma.periode.findFirst({
      where: {
        id_periode: periodeId,
        userId: userId,
      },
    });

    if (!periode) {
      return NextResponse.json({ error: "Periode not found or access denied" }, { status: 404 });
    }

    // Get mahasiswa data
    const mahasiswa = await prisma.mahasiswa.findMany({
      where: { periodeId_periode: periodeId },
    });

    if (mahasiswa.length === 0) {
      return NextResponse.json([]);
    }

    // Get max values for normalization
    const maxValues = {
      nilai_akademik: Math.max(
        ...mahasiswa.map((m: Mahasiswa) => m.nilai_akademik)
      ),
      kehadiran: Math.max(...mahasiswa.map((m: Mahasiswa) => m.kehadiran)),
      prestasi_akademik: Math.max(
        ...mahasiswa.map((m: Mahasiswa) => m.prestasi_akademik)
      ),
      prestasi_nonakademik: Math.max(
        ...mahasiswa.map((m: Mahasiswa) => m.prestasi_nonakademik)
      ),
      perilaku: Math.max(...mahasiswa.map((m: Mahasiswa) => m.perilaku)),
      keaktifan_organisasi: Math.max(
        ...mahasiswa.map((m: Mahasiswa) => m.keaktifan_organisasi)
      ),
    };

    // Calculate normalized values and final scores
    const results = mahasiswa.map((m: Mahasiswa) => {
      // Normalize values (value / max_value)
      const normalized = {
        nilai_akademik: m.nilai_akademik / maxValues.nilai_akademik,
        kehadiran: m.kehadiran / maxValues.kehadiran,
        prestasi_akademik: m.prestasi_akademik / maxValues.prestasi_akademik,
        prestasi_nonakademik:
          m.prestasi_nonakademik / maxValues.prestasi_nonakademik,
        perilaku: m.perilaku / maxValues.perilaku,
        keaktifan_organisasi:
          m.keaktifan_organisasi / maxValues.keaktifan_organisasi,
      };

      // Calculate final score
      const final_score =
        normalized.nilai_akademik * periode.w1_nilai_akademik +
        normalized.kehadiran * periode.w2_kehadiran +
        normalized.prestasi_akademik * periode.w3_prestasi_akademik +
        normalized.prestasi_nonakademik * periode.w4_prestasi_nonakademik +
        normalized.perilaku * periode.w5_perilaku +
        normalized.keaktifan_organisasi * periode.w6_keaktifan_organisasi;

      return {
        ...m,
        final_score,
      };
    });

    // Sort by final score and add rank
    const sortedResults = results
      .sort(
        (a: { final_score: number }, b: { final_score: number }) =>
          b.final_score - a.final_score
      )
      .map((result: { final_score: number }, index: number) => ({
        ...result,
        rank: index + 1,
      }));

    return NextResponse.json(sortedResults);
  } catch (error) {
    console.error("Error in SAW calculation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
