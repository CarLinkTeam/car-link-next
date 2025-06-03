import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PDFOptions {
  filename: string;
  title: string;
  margin?: number;
  format?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
}

export class PDFGenerator {
  private pdf: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number;

  constructor(options: Partial<PDFOptions> = {}) {
    this.margin = options.margin || 20;
    this.pdf = new jsPDF({
      orientation: options.orientation || "portrait",
      unit: "mm",
      format: options.format || "a4",
    });

    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
  }

  // Agregar título al PDF
  addTitle(title: string): void {
    this.pdf.setFontSize(20);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(title, this.margin, this.margin + 10);
  }

  // Agregar subtítulo
  addSubtitle(subtitle: string, yPosition: number): number {
    this.pdf.setFontSize(14);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(subtitle, this.margin, yPosition);
    return yPosition + 10;
  }

  // Agregar texto normal
  addText(
    text: string,
    yPosition: number,
    options?: { bold?: boolean; size?: number }
  ): number {
    this.pdf.setFontSize(options?.size || 12);
    this.pdf.setFont("helvetica", options?.bold ? "bold" : "normal");
    const lines = this.pdf.splitTextToSize(
      text,
      this.pageWidth - 2 * this.margin
    );
    this.pdf.text(lines, this.margin, yPosition);
    return yPosition + lines.length * 5;
  }

  // Agregar tabla simple
  addTable(headers: string[], rows: string[][], yPosition: number): number {
    const tableWidth = this.pageWidth - 2 * this.margin;
    const colWidth = tableWidth / headers.length;
    let currentY = yPosition;

    // Headers
    this.pdf.setFillColor(240, 240, 240);
    this.pdf.rect(this.margin, currentY - 5, tableWidth, 10, "F");
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(10);

    headers.forEach((header, index) => {
      this.pdf.text(header, this.margin + index * colWidth + 2, currentY);
    });

    currentY += 10;

    // Rows
    this.pdf.setFont("helvetica", "normal");
    rows.forEach((row) => {
      if (currentY > this.pageHeight - 30) {
        this.pdf.addPage();
        currentY = this.margin + 10;
      }

      row.forEach((cell, index) => {
        this.pdf.text(cell, this.margin + index * colWidth + 2, currentY);
      });
      currentY += 8;
    });

    return currentY + 10;
  }

  // Agregar línea separadora
  addSeparator(yPosition: number): number {
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(
      this.margin,
      yPosition,
      this.pageWidth - this.margin,
      yPosition
    );
    return yPosition + 10;
  }

  // Agregar footer con fecha y número de página
  addFooter(): void {
    const pageCount = this.pdf.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.pdf.setFontSize(8);
      this.pdf.setFont("helvetica", "normal");
      this.pdf.setTextColor(128, 128, 128);

      // Fecha
      const date = new Date().toLocaleDateString("es-ES");
      this.pdf.text(`Generado el: ${date}`, this.margin, this.pageHeight - 10);

      // Número de página
      this.pdf.text(
        `Página ${i} de ${pageCount}`,
        this.pageWidth - this.margin - 30,
        this.pageHeight - 10
      );
    }
  }

  // Generar y descargar PDF
  download(filename: string): void {
    this.addFooter();
    this.pdf.save(filename);
  }

  // Generar PDF desde elemento HTML
  static async fromElement(
    element: HTMLElement,
    options: PDFOptions
  ): Promise<void> {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: options.orientation || "portrait",
      unit: "mm",
      format: options.format || "a4",
    });

    const imgWidth =
      pdf.internal.pageSize.getWidth() - 2 * (options.margin || 20);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      options.margin || 20,
      options.margin || 20,
      imgWidth,
      imgHeight
    );
    pdf.save(options.filename);
  }
}

// Utilidades específicas para reportes
export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(num);
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-ES");
};

export const formatDateRange = (
  startDate: string | Date,
  endDate: string | Date
): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};
