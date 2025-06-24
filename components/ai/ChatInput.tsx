"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import { ChatTemplates } from "./ChatTemplates";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);

    // Auto-expand textarea
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  };

  const handleSelectTemplate = (prompt: string) => {
    setMessage(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  };

  return (
    <div className="relative ">
      <ChatTemplates onSelectTemplate={handleSelectTemplate} />
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2  bg-card text-foreground rounded-lg"
      >
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan tentang data mahasiswa... (Enter untuk kirim, Shift+Enter untuk baris baru)"
          className="min-h-[52px] max-h-[200px] resize-none py-3 pr-12 text-foreground placeholder:text-foreground/50"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading}
          className="absolute bottom-1.5 right-1.5"
        >
          <SendHorizontal className="h-5 w-5" />
          <span className="sr-only">Kirim pesan</span>
        </Button>
      </form>
    </div>
  );
}
