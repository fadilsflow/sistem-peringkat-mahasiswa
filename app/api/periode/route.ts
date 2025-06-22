import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const periodes = await prisma.periode.findMany({
      where: {
        userId: userId,
      },
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
