import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const periodes = await prisma.periode.findMany({
      orderBy: [{ tahun: "desc" }, { semester: "desc" }],
    });

    return NextResponse.json(periodes);
  } catch (error) {
    console.error("Error fetching periodes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
