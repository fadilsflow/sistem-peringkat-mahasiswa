"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ChatContainer } from "@/components/ai/ChatContainer";
import { DownloadPDFButton } from "@/components/ai/DownloadPDFButton";
import { SessionDialog } from "@/components/ai/SessionDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { Loader } from "lucide-react";

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
  createdAt: Date;
}

interface Period {
  id: string;
  kode_periode: string;
  tahun: string;
  semester: number;
  _count?: {
    mahasiswa: number;
  };
}

export default function AIReportPage() {
  const { userId } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [isPeriodLoading, setIsPeriodLoading] = useState(true);
  const [isPeriodError, setIsPeriodError] = useState(false);
  const [noStudentsError, setNoStudentsError] = useState<string | null>(null);

  // Fetch sessions and periods on mount
  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      setIsPeriodLoading(true);
      setIsPeriodError(false);
      try {
        // Fetch periods with student count
        const periodsResponse = await fetch("/api/periode?includeCount=true");
        if (!periodsResponse.ok) throw new Error("Failed to fetch periods");
        const periodsData = await periodsResponse.json();
        setPeriods(periodsData);
        if (periodsData.length > 0) {
          setSelectedPeriod(periodsData[0].id);
        }

        // Fetch sessions
        const sessionsResponse = await fetch("/api/ai-report");
        if (!sessionsResponse.ok) throw new Error("Failed to fetch sessions");
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData.sessions);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsPeriodError(true);
      } finally {
        setIsPeriodLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  // Check if selected period has students
  useEffect(() => {
    if (selectedPeriod) {
      const period = periods.find((p) => p.id === selectedPeriod);
      if (period && period._count?.mahasiswa === 0) {
        setNoStudentsError(
          `Periode ${period.kode_periode} belum memiliki data mahasiswa`
        );
      } else {
        setNoStudentsError(null);
      }
    }
  }, [selectedPeriod, periods]);

  // Handle loading state
  if (isPeriodLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-lg text-muted-foreground  flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin" />
          Memuat data...
        </p>
      </div>
    );
  }

  // Handle error state
  if (isPeriodError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-destructive sm:text-4xl">
          Terjadi Kesalahan
        </h1>
        <p className="text-lg text-muted-foreground">
          Gagal memuat data periode. Silakan coba lagi nanti.
        </p>
        <Button onClick={() => window.location.reload()}>Muat Ulang</Button>
      </div>
    );
  }

  // Handle no periods state
  if (periods.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-5xl">
          Selamat Datang di SyncRank!
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          Anda belum memiliki periode yang aktif. Silakan tambahkan periode
          untuk memulai.
        </p>
        <Button asChild>
          <Link href="/manage">Tambah Periode</Link>
        </Button>
      </div>
    );
  }

  const handleSendMessage = async (message: string) => {
    if (!userId || isLoading || !selectedPeriod) return;

    // Check if selected period has students
    const period = periods.find((p) => p.id === selectedPeriod);
    if (period && period._count?.mahasiswa === 0) {
      toast.error(
        <div className="flex flex-col gap-2">
          <p>Periode ini belum memiliki data mahasiswa</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/manage">Tambah Data Mahasiswa</Link>
          </Button>
        </div>
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sessionId: currentSession?.id,
          periodeId: selectedPeriod,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      if (!currentSession) {
        const newSession = {
          id: data.sessionId,
          title: message.slice(0, 50) + "...",
          messages: data.messages,
          createdAt: new Date(),
        };
        setCurrentSession(newSession);
        setSessions([newSession, ...sessions]);
      } else {
        const updatedSession = {
          ...currentSession,
          messages: [...currentSession.messages, ...data.messages],
        };
        setCurrentSession(updatedSession);
        setSessions(
          sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s))
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  const handleNewSession = () => {
    setCurrentSession(null);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/ai-report?sessionId=${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      // Remove session from state
      setSessions(sessions.filter((s) => s.id !== sessionId));

      // If current session is deleted, clear it
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Gagal menghapus sesi. Silakan coba lagi.");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background pt-16">
      {/* Header */}
      <div className="flex items-center max-w-7xl mx-auto ">
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[250px] max-w-full">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem
                  key={period.id}
                  value={period.id}
                  disabled={period._count?.mahasiswa === 0}
                >
                  {`Periode ${period.kode_periode} - Tahun ${period.tahun}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SessionDialog
            sessions={sessions}
            currentSessionId={currentSession?.id}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
          />
          {currentSession && (
            <DownloadPDFButton
              messages={currentSession.messages}
              sessionTitle={currentSession.title}
            />
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        {noStudentsError ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-semibold text-destructive">
              {noStudentsError}
            </h2>
            <p className="text-center text-muted-foreground">
              Silakan tambahkan data mahasiswa terlebih dahulu untuk menggunakan
              fitur AI Report
            </p>
            <Button asChild>
              <Link href="/manage">Tambah Data Mahasiswa</Link>
            </Button>
          </div>
        ) : (
          <ChatContainer
            messages={currentSession?.messages || []}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
}
