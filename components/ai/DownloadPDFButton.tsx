"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Message {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface DownloadPDFButtonProps {
  messages: Message[];
  sessionTitle: string;
}

export function DownloadPDFButton({
  messages,
  sessionTitle,
}: DownloadPDFButtonProps) {
  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const textWidth = pageWidth - 2 * margin;

    // Add header with logo and title
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text("SyncRank", 20, 20);

    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("Laporan Analisis Akademik", 20, 30);

    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, pageWidth - 20, 35);

    // Add report metadata
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text("Informasi Laporan:", 20, 45);
    doc.setFontSize(10);
    doc.text(`Judul Analisis: ${sessionTitle.replace("...", "")}`, 20, 55);
    doc.text(
      `Tanggal: ${new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      20,
      65
    );

    let yPos = 85;
    let currentQuestion = "";
    let analysisPoints: string[] = [];

    messages.forEach((msg, index) => {
      if (msg.role === "user") {
        // If there are previous analysis points, add them before starting new question
        if (analysisPoints.length > 0) {
          yPos = addAnalysisPoints(doc, analysisPoints, yPos);
          analysisPoints = [];
        }

        // Add question header
        if (yPos > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        currentQuestion = msg.content;
        doc.text("Pertanyaan:", margin, yPos);
        yPos += 7;

        const questionLines = doc.splitTextToSize(currentQuestion, textWidth);
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        questionLines.forEach((line: string) => {
          doc.text(line, margin, yPos);
          yPos += 7;
        });
        yPos += 5;
      } else {
        // Process AI response
        const content = msg.content.replace(/\*\*/g, ""); // Remove markdown bold

        // Split content into sections (if it contains bullet points)
        const sections = content.split("\n");

        sections.forEach((section) => {
          if (
            section.trim().startsWith("-") ||
            section.trim().startsWith("•")
          ) {
            // Collect bullet points for later formatting
            analysisPoints.push(section.trim().replace(/^[-•]\s*/, ""));
          } else if (section.trim()) {
            // Regular paragraph
            if (yPos > doc.internal.pageSize.getHeight() - 40) {
              doc.addPage();
              yPos = 20;
            }

            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            const lines = doc.splitTextToSize(section, textWidth);
            lines.forEach((line: string) => {
              doc.text(line, margin, yPos);
              yPos += 7;
            });
            yPos += 3;
          }
        });

        // Add analysis points if this is the last message or next message is a new question
        if (
          index === messages.length - 1 ||
          messages[index + 1]?.role === "user"
        ) {
          yPos = addAnalysisPoints(doc, analysisPoints, yPos);
          analysisPoints = [];
          yPos += 10; // Add extra space between QA sections
        }
      }
    });

    // Add footer with page numbers
    const pageCount = doc.internal.pages.length - 1;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    doc.save(`syncrank-analisis-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Helper function to add analysis points
  function addAnalysisPoints(
    doc: jsPDF,
    points: string[],
    startY: number
  ): number {
    let yPos = startY;

    if (points.length > 0) {
      if (yPos > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text("Analisis:", 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      points.forEach((point) => {
        if (yPos > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPos = 20;
        }

        const bulletPoint = "• " + point;
        const lines = doc.splitTextToSize(
          bulletPoint,
          doc.internal.pageSize.getWidth() - 45
        );
        lines.forEach((line: string, index: number) => {
          doc.text(line, index === 0 ? 25 : 27, yPos);
          yPos += 7;
        });
        yPos += 3;
      });
    }

    return yPos;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDownload}
      title="Unduh PDF"
    >
      <Download className="h-5 w-5" />
      <span className="sr-only">Unduh PDF</span>
    </Button>
  );
}
