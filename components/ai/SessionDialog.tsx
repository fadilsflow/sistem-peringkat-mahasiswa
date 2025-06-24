"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Plus } from "lucide-react";
import { useState } from "react";

interface Session {
  id: string;
  title: string;
  createdAt: Date;
}

interface SessionDialogProps {
  sessions: Session[];
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

export function SessionDialog({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
}: SessionDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSelectSession = (sessionId: string) => {
    onSelectSession(sessionId);
    setOpen(false);
  };

  const handleNewSession = () => {
    onNewSession();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <History className="h-5 w-5" />
          <span className="sr-only">Riwayat Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Riwayat Chat</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleNewSession}
          >
            <Plus className="h-4 w-4" />
            Mulai Chat Baru
          </Button>
          <ScrollArea className="h-[400px]">
            <div className="flex flex-col gap-2 pr-4">
              {sessions.map((session) => (
                <Button
                  key={session.id}
                  variant={
                    currentSessionId === session.id ? "default" : "ghost"
                  }
                  className="flex w-full flex-col items-start gap-1 p-3"
                  onClick={() => handleSelectSession(session.id)}
                >
                  <span className="line-clamp-1 text-left font-medium">
                    {session.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(session.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
