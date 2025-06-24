"use client";

import { useEffect, useRef } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatContainer({
  messages,
  isLoading,
  onSendMessage,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-full flex-col relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-medium text-primary text-center">
                Analisa data mahasiswa dengan AI
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatBubble
                key={message.id}
                role={message.role}
                content={message.content}
                createdAt={message.createdAt}
              />
            ))
          )}
          {isLoading && (
            <ChatBubble
              role="assistant"
              content="Sedang mengetik..."
              createdAt={new Date()}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <div className="mx-auto max-w-4xl">
          <ChatInput onSend={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
