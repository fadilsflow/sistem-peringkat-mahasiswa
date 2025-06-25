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
import { History, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

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
  onDeleteSession: (sessionId: string) => void;
}

export function SessionDialog({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}: SessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  const handleSelectSession = (sessionId: string) => {
    onSelectSession(sessionId);
    setOpen(false);
  };

  const handleNewSession = () => {
    onNewSession();
    setOpen(false);
  };

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteSessionId(sessionId);
  };

  const handleConfirmDelete = () => {
    if (deleteSessionId) {
      onDeleteSession(deleteSessionId);
      setDeleteSessionId(null);
    }
  };

  return (
    <>
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
                  <div
                    key={session.id}
                    className="group relative flex items-center gap-2"
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex w-full flex-col items-start gap-1 p-3",
                        currentSessionId === session.id
                          ? "border border-primary bg-primary text-primary-foreground "
                          : "bg-background text-foreground border border-primary"
                      )}
                      onClick={() => handleSelectSession(session.id)}
                    >
                      <span className="line-clamp-1 text-left font-medium">
                        {session.title}
                      </span>
                      <span className="text-xs ">
                        {new Date(session.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteClick(session.id, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteSessionId !== null}
        onOpenChange={() => setDeleteSessionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Sesi Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus sesi chat ini? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
