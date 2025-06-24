import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeCount = searchParams.get("includeCount") === "true";

    const periods = await prisma.periode.findMany({
      where: {
        userId: userId,
      },
      orderBy: [{ tahun: "desc" }, { semester: "desc" }],
      ...(includeCount && {
        include: {
          _count: {
            select: {
              mahasiswa: true,
            },
          },
        },
      }),
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
