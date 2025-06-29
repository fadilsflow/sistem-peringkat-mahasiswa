import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const periode = await prisma.periode.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!periode) {
      return NextResponse.json({ error: "Periode not found" }, { status: 404 });
    }

    return NextResponse.json(periode);
  } catch (error) {
    console.error("Error fetching periode:", error);
    return NextResponse.json(
      { error: "Failed to fetch periode" },
      { status: 500 }
    );
  }
}
