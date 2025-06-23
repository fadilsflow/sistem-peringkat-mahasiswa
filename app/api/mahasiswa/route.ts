import { prisma } from "@/lib/db";
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
