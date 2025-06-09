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

    // Get periode data for weights
    const periode = await prisma.periode.findUnique({
      where: { id_periode: periodeId },
    });

    if (!periode) {
      return NextResponse.json({ error: "Periode not found" }, { status: 404 });
    }

    // Get mahasiswa data
    const mahasiswa = await prisma.mahasiswa.findMany({
      where: { periodeId_periode: periodeId },
    });

    if (mahasiswa.length === 0) {
      return NextResponse.json([]);
    }
    const totalWeight =
      periode.w1_nilai_akademik +
      periode.w2_kehadiran +
      periode.w3_prestasi_akademik +
      periode.w4_prestasi_nonakademik +
      periode.w5_perilaku +
      periode.w6_keaktifan_organisasi;
    const weights = {
      nilai_akademik: periode.w1_nilai_akademik / totalWeight,
      kehadiran: periode.w2_kehadiran / totalWeight,
      prestasi_akademik: periode.w3_prestasi_akademik / totalWeight,
      prestasi_nonakademik: periode.w4_prestasi_nonakademik / totalWeight,
      perilaku: periode.w5_perilaku / totalWeight,
      keaktifan_organisasi: periode.w6_keaktifan_organisasi / totalWeight,
    };

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
        normalized.nilai_akademik * weights.nilai_akademik +
        normalized.kehadiran * weights.kehadiran +
        normalized.prestasi_akademik * weights.prestasi_akademik +
        normalized.prestasi_nonakademik * weights.prestasi_nonakademik +
        normalized.perilaku * weights.perilaku +
        normalized.keaktifan_organisasi * weights.keaktifan_organisasi;
      console.log(final_score);
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
