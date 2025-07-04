
import jsPDF from 'jspdf';

export class PdfGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageHeight: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
  }

  addTitle(title: string) {
    this.doc.setFontSize(16);
    this.doc.text(title, 20, this.currentY);
    this.currentY += 20;
  }

  addSectionHeader(header: string) {
    this.checkPageBreak(15);
    this.doc.setFontSize(14);
    this.doc.text(header, 20, this.currentY);
    this.currentY += 15;
  }

  addLabelValue(label: string, value: string) {
    this.checkPageBreak(8);
    this.doc.setFontSize(10);
    this.doc.text(`${label}: ${value}`, 20, this.currentY);
    this.currentY += 8;
  }

  addText(text: string) {
    this.checkPageBreak(8);
    this.doc.setFontSize(10);
    this.doc.text(text, 20, this.currentY);
    this.currentY += 8;
  }

  addSpace() {
    this.currentY += 10;
  }

  formatBiomarkers(biomarkers: Array<{name: string, value: any, unit: string, normalRange: string, status: string}>) {
    this.addSectionHeader('CHI TIET CHI SO SINH HOC:');
    
    biomarkers.forEach(marker => {
      this.checkPageBreak(6);
      this.doc.setFontSize(9);
      this.doc.text(`- ${marker.name}: ${marker.value} (BT: ${marker.normalRange}) - ${marker.status}`, 20, this.currentY);
      this.currentY += 6;
    });
  }

  private checkPageBreak(height: number) {
    if (this.currentY + height > this.pageHeight - 20) {
      this.doc.addPage();
      this.currentY = 20;
    }
  }

  async downloadPdf(filename: string) {
    this.doc.save(filename);
  }
}

export const sanitizeVietnameseText = (text: string): string => {
  return text.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
             .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
             .replace(/[ìíịỉĩ]/g, 'i')
             .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
             .replace(/[ùúụủũưừứựửữ]/g, 'u')
             .replace(/[ỳýỵỷỹ]/g, 'y')
             .replace(/đ/g, 'd')
             .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
             .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
             .replace(/[ÌÍỊỈĨ]/g, 'I')
             .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
             .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
             .replace(/[ỲÝỴỶỸ]/g, 'Y')
             .replace(/Đ/g, 'D');
};

export const formatBiomarkers = (biomarkers: any) => {
  return Object.entries(biomarkers).map(([key, marker]: [string, any]) => ({
    name: key.toUpperCase(),
    value: marker.value,
    unit: '',
    normalRange: marker.normal,
    status: marker.status === 'high' ? 'Cao' : 
            marker.status === 'low' ? 'Thấp' : 'Bình thường'
  }));
};
