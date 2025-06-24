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

    // Get periode data for weights and verify ownership
    const periode = await prisma.periode.findFirst({
      where: {
        id_periode: periodeId,
        userId: userId,
      },
    });

    if (!periode) {
      return NextResponse.json(
        { error: "Periode not found or access denied" },
        { status: 404 }
      );
    }

    // Get mahasiswa data with userId filter
    const mahasiswa = await prisma.mahasiswa.findMany({
      where: {
        periodeId_periode: periodeId,
        userId: userId,
      },
    });

    if (mahasiswa.length === 0) {
      return NextResponse.json([]);
    }

    // Get max values for normalization (ensure non-zero values)
    const maxValues = {
      nilai_akademik: Math.max(
        1,
        ...mahasiswa.map((m: Mahasiswa) => m.nilai_akademik || 0)
      ),
      kehadiran: Math.max(
        1,
        ...mahasiswa.map((m: Mahasiswa) => m.kehadiran || 0)
      ),
      prestasi_akademik: Math.max(
        1,
        ...mahasiswa.map((m: Mahasiswa) => m.prestasi_akademik || 0)
      ),
      prestasi_nonakademik: Math.max(
        1,
        ...mahasiswa.map((m: Mahasiswa) => m.prestasi_nonakademik || 0)
      ),
      perilaku: Math.max(
        1,
        ...mahasiswa.map((m: Mahasiswa) => m.perilaku || 0)
      ),
      keaktifan_organisasi: Math.max(
        1,
        ...mahasiswa.map((m: Mahasiswa) => m.keaktifan_organisasi || 0)
      ),
    };

    // Calculate normalized values and final scores
    const results = mahasiswa.map((m: Mahasiswa) => {
      // Normalize values (value / max_value) with null checks
      const normalized = {
        nilai_akademik: (m.nilai_akademik || 0) / maxValues.nilai_akademik,
        kehadiran: (m.kehadiran || 0) / maxValues.kehadiran,
        prestasi_akademik:
          (m.prestasi_akademik || 0) / maxValues.prestasi_akademik,
        prestasi_nonakademik:
          (m.prestasi_nonakademik || 0) / maxValues.prestasi_nonakademik,
        perilaku: (m.perilaku || 0) / maxValues.perilaku,
        keaktifan_organisasi:
          (m.keaktifan_organisasi || 0) / maxValues.keaktifan_organisasi,
      };

      // Calculate final score
      const final_score =
        normalized.nilai_akademik * (periode?.w1_nilai_akademik || 0) +
        normalized.kehadiran * (periode?.w2_kehadiran || 0) +
        normalized.prestasi_akademik * (periode?.w3_prestasi_akademik || 0) +
        normalized.prestasi_nonakademik *
          (periode?.w4_prestasi_nonakademik || 0) +
        normalized.perilaku * (periode?.w5_perilaku || 0) +
        normalized.keaktifan_organisasi *
          (periode?.w6_keaktifan_organisasi || 0);

      return {
        ...m,
        final_score: final_score || 0,
      };
    });

    // Sort by final score and add rank
    const sortedResults = results
      .sort((a, b) => (b.final_score || 0) - (a.final_score || 0))
      .map((result, index) => ({
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
