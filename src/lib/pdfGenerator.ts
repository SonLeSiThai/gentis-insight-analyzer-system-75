
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface BiomarkerResult {
  name: string;
  value: number;
  unit: string;
  status: string;
  normalRange: string;
}

export interface PatientInfo {
  sampleId: string;
  patientName: string;
  birthDate: string;
  phone: string;
  branch: string;
  testDate: string;
  analysisDate: string;
}

// Enhanced PDF generator with Vietnamese font support using html2canvas
export class PdfGenerator {
  private content: string[];

  constructor() {
    this.content = [];
  }

  // Clear content array
  private clearContent(): void {
    this.content = [];
  }

  // Add title
  addTitle(title: string): void {
    this.content.push(`
      <div style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #1a1a1a;">
        ${title}
      </div>
    `);
  }

  // Add section header
  addSectionHeader(header: string): void {
    this.content.push(`
      <div style="font-size: 14px; font-weight: bold; margin: 15px 0 8px 0; color: #2d3748; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
        ${header}
      </div>
    `);
  }

  // Add normal text
  addText(text: string): void {
    this.content.push(`
      <div style="font-size: 11px; margin: 4px 0; color: #4a5568; line-height: 1.4;">
        ${text}
      </div>
    `);
  }

  // Add text with label
  addLabelValue(label: string, value: string): void {
    this.content.push(`
      <div style="font-size: 11px; margin: 3px 0; color: #2d3748;">
        <span style="font-weight: 500;">${label}:</span> <span style="color: #4a5568;">${value}</span>
      </div>
    `);
  }

  // Add space
  addSpace(): void {
    this.content.push(`<div style="margin: 10px 0;"></div>`);
  }

  // Format patient information for PDF
  formatPatientInfo(patientInfo: PatientInfo): void {
    this.addSectionHeader('THÔNG TIN XÉT NGHIỆM:');
    this.addLabelValue('Mã số mẫu', patientInfo.sampleId);
    this.addLabelValue('Họ tên', patientInfo.patientName);
    this.addLabelValue('Ngày sinh', patientInfo.birthDate);
    this.addLabelValue('Số điện thoại', patientInfo.phone);
    this.addLabelValue('Chi nhánh', patientInfo.branch);
    this.addLabelValue('Ngày xét nghiệm', patientInfo.testDate);
    this.addLabelValue('Ngày phân tích', patientInfo.analysisDate);
    this.addSpace();
  }

  // Format biomarkers with nice table
  formatBiomarkers(biomarkers: BiomarkerResult[]): void {
    this.addSectionHeader('CHỈ SỐ SINH HÓC:');
    
    let tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);">
            <th style="border: 1px solid #dee2e6; padding: 12px 8px; text-align: left; font-weight: 700; color: #495057; font-size: 13px;">Chỉ số</th>
            <th style="border: 1px solid #dee2e6; padding: 12px 8px; text-align: center; font-weight: 700; color: #495057; font-size: 13px;">Giá trị</th>
            <th style="border: 1px solid #dee2e6; padding: 12px 8px; text-align: center; font-weight: 700; color: #495057; font-size: 13px;">Đơn vị</th>
            <th style="border: 1px solid #dee2e6; padding: 12px 8px; text-align: center; font-weight: 700; color: #495057; font-size: 13px;">Khoảng tham chiếu</th>
            <th style="border: 1px solid #dee2e6; padding: 12px 8px; text-align: center; font-weight: 700; color: #495057; font-size: 13px;">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
    `;

    biomarkers.forEach((biomarker, index) => {
      const statusColor = 
        biomarker.status.toLowerCase().includes('cao') ? '#dc3545' :
        biomarker.status.toLowerCase().includes('thấp') ? '#007bff' :
        '#28a745';
      
      const backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
      
      tableHtml += `
        <tr style="background-color: ${backgroundColor};">
          <td style="border: 1px solid #dee2e6; padding: 10px 8px; color: #495057; font-weight: 500;">${biomarker.name}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px 8px; text-align: center; color: #495057; font-weight: 600; font-size: 13px;">${biomarker.value}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px 8px; text-align: center; color: #6c757d; font-style: italic;">${biomarker.unit}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px 8px; text-align: center; color: #6c757d;">${biomarker.normalRange}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px 8px; text-align: center; color: ${statusColor}; font-weight: 600; text-transform: uppercase; font-size: 11px;">${biomarker.status}</td>
        </tr>
      `;
    });

    tableHtml += `
        </tbody>
      </table>
    `;

    this.content.push(tableHtml);
  }

  // Generate and download PDF using html2canvas - simplified approach
  async downloadPdf(filename: string): Promise<void> {
    const htmlContent = this.generateHtmlContent();
    
    // Create temporary div with fixed dimensions - completely isolated
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.cssText = `
      position: fixed;
      left: -9999px;
      top: -9999px;
      width: 800px;
      padding: 40px;
      background-color: white;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      z-index: -1000;
      overflow: hidden;
      box-sizing: border-box;
    `;
    
    // Create isolated container
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: -10000px;
      top: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
      z-index: -1001;
    `;
    
    container.appendChild(tempDiv);
    document.body.appendChild(container);

    try {
      // Wait a bit for fonts to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Convert to canvas with simpler options
      const canvas = await html2canvas(tempDiv, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 0.95);
      
            // Calculate dimensions to fit A4 with footer space
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image centered with margins
      const x = 10; // 10mm left margin
      const y = 10; // 10mm top margin
      const availableHeight = pdfHeight - 50; // Reserve 50mm for footer

      if (imgHeight <= availableHeight) {
        // Fits on one page
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      } else {
        // Multiple pages needed - split content intelligently
        const pageContentHeight = availableHeight; // Height available for content per page
        let currentY = 0;
        let pageNumber = 1;

        while (currentY < imgHeight) {
          if (pageNumber > 1) {
            pdf.addPage();
          }

          // Calculate slice height for this page
          const remainingHeight = imgHeight - currentY;
          const sliceHeight = Math.min(pageContentHeight, remainingHeight);
          
          // Create a slice of the image for this page
          const sliceCanvas = document.createElement('canvas');
          const sliceCtx = sliceCanvas.getContext('2d');
          
          if (sliceCtx) {
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = (sliceHeight / imgHeight) * canvas.height;
            
            // Draw the slice
            sliceCtx.drawImage(
              canvas,
              0, (currentY / imgHeight) * canvas.height, // Source x, y
              canvas.width, sliceCanvas.height, // Source width, height
              0, 0, // Destination x, y
              canvas.width, sliceCanvas.height // Destination width, height
            );
            
            const sliceImgData = sliceCanvas.toDataURL('image/png', 0.95);
            pdf.addImage(sliceImgData, 'PNG', x, y, imgWidth, sliceHeight);
          }
          
          currentY += pageContentHeight;
          pageNumber++;
        }
      }

      // Add footer to all pages
      this.addFooterToPdf(pdf);

      // Download
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  }

  // Get PDF blob for further processing
  async getPdfBlob(): Promise<Blob> {
    const htmlContent = this.generateHtmlContent();
    
    // Create temporary div with fixed dimensions - completely isolated
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.cssText = `
      position: fixed;
      left: -9999px;
      top: -9999px;
      width: 800px;
      padding: 40px;
      background-color: white;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      z-index: -1000;
      overflow: hidden;
      box-sizing: border-box;
    `;
    
    // Create isolated container
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: -10000px;
      top: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
      z-index: -1001;
    `;
    
    container.appendChild(tempDiv);
    document.body.appendChild(container);

    try {
      // Wait a bit for fonts to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(tempDiv, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 0.95);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const x = 10;
      const y = 10;
      const availableHeight = pdfHeight - 50; // Reserve space for footer

      if (imgHeight <= availableHeight) {
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      } else {
        const pageContentHeight = availableHeight;
        let currentY = 0;
        let pageNumber = 1;

        while (currentY < imgHeight) {
          if (pageNumber > 1) {
            pdf.addPage();
          }

          const remainingHeight = imgHeight - currentY;
          const sliceHeight = Math.min(pageContentHeight, remainingHeight);
          
          const sliceCanvas = document.createElement('canvas');
          const sliceCtx = sliceCanvas.getContext('2d');
          
          if (sliceCtx) {
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = (sliceHeight / imgHeight) * canvas.height;
            
            sliceCtx.drawImage(
              canvas,
              0, (currentY / imgHeight) * canvas.height,
              canvas.width, sliceCanvas.height,
              0, 0,
              canvas.width, sliceCanvas.height
            );
            
            const sliceImgData = sliceCanvas.toDataURL('image/png', 0.95);
            pdf.addImage(sliceImgData, 'PNG', x, y, imgWidth, sliceHeight);
          }
          
          currentY += pageContentHeight;
          pageNumber++;
        }
      }

      this.addFooterToPdf(pdf);

      return pdf.output('blob');

    } finally {
      document.body.removeChild(container);
    }
  }

  private generateHtmlContent(): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.5; padding-bottom: 60px;">
        ${this.content.join('')}
      </div>
    `;
  }

  private addFooterToPdf(pdf: jsPDF): void {
    const pageCount = pdf.getNumberOfPages();
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      
      // Save current state
      const currentFontSize = pdf.getFontSize();
      const currentFont = pdf.getFont();
      
      // Footer styling
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      
      // Add separator line above footer
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.5);
      pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
      
      // Footer content
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Ngay tao: ${new Date().toLocaleDateString('vi-VN')}`, 20, pageHeight - 14);
      
      // Page number (right aligned)
      const pageText = `Trang ${i} / ${pageCount}`;
      const pageTextWidth = pdf.getTextWidth(pageText);
      pdf.text(pageText, pageWidth - 20 - pageTextWidth, pageHeight - 14);
      
      // Restore previous state
      pdf.setFontSize(currentFontSize);
      pdf.setFont(currentFont.fontName, currentFont.fontStyle);
      pdf.setTextColor(0, 0, 0);
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.2);
    }
  }
}

// Utility functions for text processing - kept for compatibility
export const sanitizeVietnameseText = (text: string): string => {
  return text.trim();
};

// Format patient info utility
export const formatPatientInfo = (patientInfo: PatientInfo): string => {
  return `
THÔNG TIN XÉT NGHIỆM:
Mã số mẫu: ${patientInfo.sampleId}
Họ tên: ${patientInfo.patientName}
Ngày sinh: ${patientInfo.birthDate}
Số điện thoại: ${patientInfo.phone}
Chi nhánh: ${patientInfo.branch}
Ngày xét nghiệm: ${patientInfo.testDate}
Ngày phân tích: ${patientInfo.analysisDate}
  `.trim();
};

// Format biomarkers utility
export const formatBiomarkers = (biomarkers: BiomarkerResult[]): string => {
  let result = '\nCHỈ SỐ SINH HÓC:\n';
  biomarkers.forEach(biomarker => {
    result += `- ${biomarker.name}: ${biomarker.value} (${biomarker.unit}) - ${biomarker.status}\n`;
  });
  return result;
}; 
