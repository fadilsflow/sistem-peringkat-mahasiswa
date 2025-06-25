"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { User, Bot } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export function ChatBubble({ role, content, createdAt }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-4 rounded-lg p-4",
        role === "assistant" ? "bg-muted/50" : "bg-background"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
          role === "assistant"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {role === "assistant" ? (
          <Bot className="h-5 w-5" />
        ) : (
          <User className="h-5 w-5" />
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {role === "assistant" ? "AI Assistant" : "Anda"}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
