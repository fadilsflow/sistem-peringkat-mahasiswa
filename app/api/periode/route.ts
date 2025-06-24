import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const periods = await prisma.periode.findMany({
      where: {
        userId: userId,
      },
      orderBy: [{ tahun: "desc" }, { semester: "desc" }],
    });

    return NextResponse.json(periods);
  } catch (error) {
    console.error("Error fetching periods:", error);
    return NextResponse.json(
      { error: "Failed to fetch periods" },
      { status: 500 }
    );
  }
}
