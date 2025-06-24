import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";

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

    // Add title
    doc.setFontSize(16);
    doc.text("AI Report Assistant - " + sessionTitle, 20, 20);

    // Add timestamp
    doc.setFontSize(10);
    doc.text("Generated: " + new Date().toLocaleString(), 20, 30);

    let yPos = 40;
    const pageHeight = doc.internal.pageSize.height;

    messages.forEach((msg) => {
      // Add role header
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(msg.role === "assistant" ? "AI Assistant:" : "You:", 20, yPos);
      yPos += 7;

      // Add message content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      // Split long messages into lines
      const lines = doc.splitTextToSize(msg.content, 170);

      // Check if we need a new page
      if (yPos + lines.length * 7 > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(lines, 20, yPos);
      yPos += lines.length * 7 + 10;
    });

    // Save the PDF
    doc.save(
      `ai-report-${sessionTitle}-${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Download PDF
    </Button>
  );
}
