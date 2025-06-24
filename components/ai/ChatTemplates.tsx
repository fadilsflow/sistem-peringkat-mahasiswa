"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Template {
  title: string;
  description: string;
  prompt: string;
}

const templates: Template[] = [
  {
    title: "Top 3 Mahasiswa",
    description: "Lihat mahasiswa dengan nilai tertinggi",
    prompt:
      "Siapa 3 mahasiswa dengan nilai tertinggi? Berikan detail nilai mereka.",
  },
  {
    title: "Analisis Akademik vs Non-akademik",
    description: "Bandingkan prestasi akademik dan non-akademik",
    prompt:
      "Bagaimana perbandingan nilai akademik dan non-akademik mahasiswa? Berikan statistik singkat.",
  },
  {
    title: "Ringkasan Kinerja",
    description: "Laporan singkat kinerja keseluruhan",
    prompt:
      "Buatkan ringkasan singkat kinerja mahasiswa secara keseluruhan dengan statistik penting.",
  },
  {
    title: "Area Peningkatan",
    description: "Identifikasi area yang perlu ditingkatkan",
    prompt:
      "Identifikasi area yang perlu ditingkatkan berdasarkan data SAW. Berikan rekomendasi singkat.",
  },
];

interface ChatTemplatesProps {
  onSelectTemplate: (prompt: string) => void;
}

export function ChatTemplates({ onSelectTemplate }: ChatTemplatesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative w-full">
      <Button
        variant="ghost"
        size="sm"
        className="absolute -top-8 right-0 text-xs text-muted-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <>
            <ChevronDown className="h-4 w-4 mr-1" />
            Sembunyikan Template
          </>
        ) : (
          <>
            <ChevronUp className="h-4 w-4 mr-1" />
            Tampilkan Template
          </>
        )}
      </Button>

      {isExpanded && (
        <div className="w-full rounded-lg border bg-card p-2 shadow-sm">
          <ScrollArea className="w-full" type="always">
            <div className="flex  gap-3 pb-2">
              {templates.map((template) => (
                <Card
                  key={template.title}
                  className="w-[250px] cursor-pointer shrink-0 transition-colors hover:bg-muted/50"
                  onClick={() => {
                    onSelectTemplate(template.prompt);
                    setIsExpanded(false);
                  }}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">{template.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
