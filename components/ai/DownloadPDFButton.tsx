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

    // Add header with logo (if available)
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("SyncRank - Laporan AI", 20, 20);

    // Add session info
    doc.setFontSize(12);
    doc.setTextColor(52, 73, 94);
    doc.text(`Judul Sesi: ${sessionTitle}`, 20, 35);
    doc.text(
      `Tanggal: ${new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      20,
      42
    );

    let yPos = 55;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const textWidth = pageWidth - 2 * margin;

    messages.forEach((msg) => {
      // Add role header
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);
      doc.text(
        msg.role === "assistant" ? "AI Assistant" : "Pengguna",
        margin,
        yPos
      );

      // Add timestamp
      doc.setFontSize(9);
      doc.setTextColor(127, 140, 141);
      doc.text(
        new Date(msg.createdAt).toLocaleString("id-ID"),
        pageWidth - margin - 40,
        yPos,
        { align: "right" }
      );

      yPos += 7;

      // Add message content with proper formatting
      doc.setFontSize(10);
      doc.setTextColor(52, 73, 94);

      // Split content into lines
      const lines = doc.splitTextToSize(msg.content, textWidth);

      // Add background for AI messages
      if (msg.role === "assistant") {
        doc.setFillColor(244, 246, 248);
        doc.rect(
          margin - 5,
          yPos - 5,
          pageWidth - 2 * (margin - 5),
          lines.length * 7 + 10,
          "F"
        );
      }

      // Add text lines
      lines.forEach((line: string) => {
        doc.text(line, margin, yPos);
        yPos += 7;
      });

      // Add spacing between messages
      yPos += 10;

      // Check if we need a new page
      if (yPos > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Add footer
    const pageCount = doc.internal.pages.length - 1;
    doc.setFontSize(8);
    doc.setTextColor(127, 140, 141);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    doc.save(`syncrank-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

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
