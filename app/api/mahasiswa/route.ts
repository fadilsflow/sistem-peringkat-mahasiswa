import { prisma } from "@/lib/db";
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
      orderBy: {
        nim: "asc",
      },
    });

    return NextResponse.json(mahasiswa);
  } catch (error) {
    console.error("Error fetching mahasiswa:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
