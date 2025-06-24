import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export function ChatBubble({ role, content, createdAt }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-2 p-4",
        role === "assistant" ? "bg-muted/50" : "bg-background"
      )}
    >
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {role === "assistant" ? "AI Assistant" : "You"}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleTimeString()}
          </span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
