import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getGeminiResponse } from "@/lib/ai/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, sessionId, periodeId } = await req.json();

    // Get or create chat session
    let session;
    if (sessionId) {
      session = await prisma.aIChatSession.findUnique({
        where: { id: sessionId },
        include: { messages: true },
      });

      if (!session || session.userId !== userId) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }
    } else {
      session = await prisma.aIChatSession.create({
        data: {
          userId,
          title: message.slice(0, 50) + "...",
        },
        include: { messages: true },
      });
    }

    // Save user message
    const userMessage = await prisma.aIChatMessage.create({
      data: {
        sessionId: session.id,
        role: "user",
        content: message,
      },
    });

    // Get AI response with SAW data from specified period
    const aiResponse = await getGeminiResponse(
      session.messages.concat(userMessage).map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
      periodeId,
      userId
    );

    if (!aiResponse) {
      throw new Error("Failed to get AI response");
    }

    // Save AI response
    const assistantMessage = await prisma.aIChatMessage.create({
      data: {
        sessionId: session.id,
        role: "assistant",
        content: aiResponse,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      messages: [userMessage, assistantMessage],
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      // Return all sessions for the user
      const sessions = await prisma.aIChatSession.findMany({
        where: { userId },
        include: { messages: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ sessions });
    }

    // Return specific session with messages
    const session = await prisma.aIChatSession.findUnique({
      where: { id: sessionId },
      include: { messages: true },
    });

    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
