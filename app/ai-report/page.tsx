"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { ChatBubble } from "@/components/ai/ChatBubble";
import { ChatInput } from "@/components/ai/ChatInput";
import { DownloadPDFButton } from "@/components/ai/DownloadPDFButton";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface Session {
  id: string;
  title: string;
  messages: Message[];
}

export default function AIReportPage() {
  const { userId } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      fetchSessions();
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/ai-report");
      const data = await response.json();
      setSessions(data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sessionId: currentSession?.id,
        }),
      });

      const data = await response.json();

      if (!currentSession) {
        // New session created
        await fetchSessions();
        const newSession = {
          id: data.sessionId,
          title: message.slice(0, 50) + "...",
          messages: data.messages,
        };
        setCurrentSession(newSession);
      } else {
        // Update existing session
        setCurrentSession({
          ...currentSession,
          messages: [...currentSession.messages, ...data.messages],
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          AI Report Assistant
        </h1>
        <p className="text-muted-foreground mt-2">
          Ask questions about student performance and get AI-powered insights
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Sessions List */}
        <Card className="p-4 h-[600px] overflow-y-auto">
          <div className="font-medium mb-4">Chat History</div>
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setCurrentSession(session)}
                className={`w-full text-left p-2 rounded hover:bg-accent truncate ${
                  currentSession?.id === session.id ? "bg-accent" : ""
                }`}
              >
                {session.title}
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4">
            {currentSession?.messages.map((message) => (
              <ChatBubble key={message.id} {...message} />
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                {isLoading ? "AI is thinking..." : "Ask a question"}
              </div>
              {currentSession && (
                <DownloadPDFButton
                  messages={currentSession.messages}
                  sessionTitle={currentSession.title}
                />
              )}
            </div>
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        </Card>
      </div>
    </div>
  );
}
