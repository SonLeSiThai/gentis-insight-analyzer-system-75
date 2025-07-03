
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import jsPDF from 'jspdf';
import { Plus, Search, Upload, FileText, AlertTriangle, Download } from 'lucide-react';

interface TestManagementProps {
  userRole?: string;
}

export const TestManagement = ({ userRole }: TestManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const isCollaborator = userRole === 'collaborator';
  
  // Dữ liệu xét nghiệm cho bác sĩ cộng tác (chỉ bệnh nhân được phân công)
  const collaboratorTests = [
    {
      id: 4,
      code: 'XN_240101_004',
      name: 'Sinh hóa máu - BN được phân công',
      date: '2024-01-16',
      samples: 3,
      status: 'completed',
      riskSamples: 1,
      processingTime: '1h 20m',
      suggestedDiseases: ['Gan nhiễm mỡ'],
      assignedPatients: ['PT003', 'PT007', 'PT012'],
      detailedResults: {
        averageALT: 75,
        averageAST: 68,
        abnormalSamples: [
          { patientId: 'PT003', alt: 85, ast: 72, risk: 'high' }
        ]
      }
    },
    {
      id: 5,
      code: 'XN_240101_005',
      name: 'Lipid profile - BN được phân công',
      date: '2024-01-15',
      samples: 2,
      status: 'processing',
      riskSamples: 0,
      processingTime: '45m',
      suggestedDiseases: [],
      assignedPatients: ['PT015', 'PT018'],
      detailedResults: {
        averageTotalCholesterol: 195,
        averageLDL: 125,
        averageHDL: 48,
        abnormalSamples: []
      }
    }
  ];

  // Dữ liệu xét nghiệm cho bác sĩ chính
  const doctorTests = [
    {
      id: 1,
      code: 'XN_240101_001',
      name: 'Sinh hóa máu tổng quát',
      date: '2024-01-15',
      samples: 15,
      status: 'completed',
      riskSamples: 3,
      processingTime: '2h 15m',
      suggestedDiseases: ['Tiểu đường type 2', 'Rối loạn lipid', 'Gan nhiễm mỡ'],
      detailedResults: {
        averageGlucose: 145,
        averageCholesterol: 220,
        abnormalSamples: [
          { patientId: 'BN001', glucose: 180, cholesterol: 260, risk: 'high' },
          { patientId: 'BN007', glucose: 165, cholesterol: 240, risk: 'medium' },
          { patientId: 'BN012', glucose: 200, cholesterol: 280, risk: 'high' }
        ]
      }
    },
    {
      id: 2,
      code: 'XN_240101_002',
      name: 'Lipid profile',
      date: '2024-01-15',
      samples: 8,
      status: 'processing',
      riskSamples: 2,
      processingTime: '1h 30m',
      suggestedDiseases: ['Rối loạn lipid máu', 'Xơ vữa động mạch'],
      detailedResults: {
        averageTotalCholesterol: 235,
        averageLDL: 145,
        averageHDL: 42,
        abnormalSamples: [
          { patientId: 'BN003', totalChol: 280, ldl: 180, hdl: 35, risk: 'high' },
          { patientId: 'BN009', totalChol: 250, ldl: 160, hdl: 38, risk: 'medium' }
        ]
      }
    },
    {
      id: 3,
      code: 'XN_240101_003',
      name: 'HbA1c và Glucose',
      date: '2024-01-14',
      samples: 12,
      status: 'completed',
      riskSamples: 4,
      processingTime: '1h 45m',
      suggestedDiseases: ['Tiểu đường type 2', 'Tiền tiểu đường'],
      detailedResults: {
        averageHbA1c: 7.2,
        averageGlucose: 155,
        abnormalSamples: [
          { patientId: 'BN002', hba1c: 8.5, glucose: 190, risk: 'high' },
          { patientId: 'BN005', hba1c: 7.8, glucose: 170, risk: 'high' },
          { patientId: 'BN008', hba1c: 6.8, glucose: 145, risk: 'medium' },
          { patientId: 'BN011', hba1c: 7.1, glucose: 160, risk: 'medium' }
        ]
      }
    }
  ];

  const [tests] = useState(isCollaborator ? collaboratorTests : doctorTests);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log('File đã chọn:', file.name, file.size, file.type);
    }
  };

  const handleCreateTest = (formData: FormData) => {
    const testName = formData.get('testName') as string;
    const description = formData.get('description') as string;
    
    if (uploadedFile) {
      console.log('Tạo xét nghiệm mới:', {
        name: testName,
        description: description,
        file: uploadedFile.name,
        fileSize: uploadedFile.size,
        fileType: uploadedFile.type
      });

      // Giả lập xử lý file CSV/Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('Nội dung file:', content.substring(0, 200) + '...');
        
        // Giả lập phân tích dữ liệu
        setTimeout(() => {
          alert(`Xét nghiệm "${testName}" đã được tạo và đang xử lý dữ liệu từ file "${uploadedFile.name}"`);
        }, 1000);
      };
      reader.readAsText(uploadedFile);
      
      setUploadedFile(null);
    }
  };

  const handleExportReport = (testId: number) => {
    const test = tests.find(t => t.id === testId);
    if (test) {
      // Determine test type and access appropriate properties
      let testSpecificDetails = '';
      let abnormalSamplesDetails = '';

      if (test.name.includes('Sinh hóa máu')) {
        if (isCollaborator) {
          // For collaborator ALT/AST tests
          const results = test.detailedResults as any;
          testSpecificDetails = `- ALT trung bình: ${results.averageALT || 'N/A'} U/L
- AST trung bình: ${results.averageAST || 'N/A'} U/L`;
          
          abnormalSamplesDetails = results.abnormalSamples?.length > 0 ? 
            results.abnormalSamples.map((sample: any, index: number) => 
              `${index + 1}. Mã BN: ${sample.patientId}
     - ALT: ${sample.alt} U/L
     - AST: ${sample.ast} U/L
     - Mức độ nguy cơ: ${sample.risk === 'high' ? 'Cao' : 'Trung bình'}`
            ).join('\n') : 'Không có mẫu bất thường';
        } else {
          // For doctor glucose/cholesterol tests
          const results = test.detailedResults as any;
          testSpecificDetails = `- Glucose trung bình: ${results.averageGlucose || 'N/A'} mg/dL
- Cholesterol trung bình: ${results.averageCholesterol || 'N/A'} mg/dL`;
          
          abnormalSamplesDetails = results.abnormalSamples?.length > 0 ? 
            results.abnormalSamples.map((sample: any, index: number) => 
              `${index + 1}. Mã BN: ${sample.patientId}
     - Glucose: ${sample.glucose} mg/dL
     - Cholesterol: ${sample.cholesterol} mg/dL
     - Mức độ nguy cơ: ${sample.risk === 'high' ? 'Cao' : 'Trung bình'}`
            ).join('\n') : 'Không có mẫu bất thường';
        }
      } else if (test.name.includes('Lipid profile')) {
        const results = test.detailedResults as any;
        testSpecificDetails = `- Total Cholesterol trung bình: ${results.averageTotalCholesterol || 'N/A'} mg/dL
- LDL trung bình: ${results.averageLDL || 'N/A'} mg/dL
- HDL trung bình: ${results.averageHDL || 'N/A'} mg/dL`;
        
        abnormalSamplesDetails = results.abnormalSamples?.length > 0 ? 
          results.abnormalSamples.map((sample: any, index: number) => 
            `${index + 1}. Mã BN: ${sample.patientId}
     - Total Cholesterol: ${sample.totalChol} mg/dL
     - LDL: ${sample.ldl} mg/dL
     - HDL: ${sample.hdl} mg/dL
     - Mức độ nguy cơ: ${sample.risk === 'high' ? 'Cao' : 'Trung bình'}`
          ).join('\n') : 'Không có mẫu bất thường';
      } else if (test.name.includes('HbA1c')) {
        const results = test.detailedResults as any;
        testSpecificDetails = `- HbA1c trung bình: ${results.averageHbA1c || 'N/A'}%
- Glucose trung bình: ${results.averageGlucose || 'N/A'} mg/dL`;
        
        abnormalSamplesDetails = results.abnormalSamples?.length > 0 ? 
          results.abnormalSamples.map((sample: any, index: number) => 
            `${index + 1}. Mã BN: ${sample.patientId}
     - HbA1c: ${sample.hba1c}%
     - Glucose: ${sample.glucose} mg/dL
     - Mức độ nguy cơ: ${sample.risk === 'high' ? 'Cao' : 'Trung bình'}`
          ).join('\n') : 'Không có mẫu bất thường';
      }

      // Tạo báo cáo chi tiết với tất cả thông tin
      const reportContent = `
BÁO CÁO XÉT NGHIỆM CHI TIẾT
============================

THÔNG TIN CHUNG:
Mã xét nghiệm: ${test.code}
Tên xét nghiệm: ${test.name}
Ngày thực hiện: ${test.date}
Số mẫu xét nghiệm: ${test.samples}
Thời gian xử lý: ${test.processingTime}
Trạng thái: ${test.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
${isCollaborator && (test as any).assignedPatients ? `Bệnh nhân được phân công: ${(test as any).assignedPatients.join(', ')}` : ''}

KẾT QUẢ TỔNG QUAN:
- Số mẫu có nguy cơ cao: ${test.riskSamples}
- Tỷ lệ nguy cơ cao: ${((test.riskSamples / test.samples) * 100).toFixed(1)}%
- Số mẫu bình thường: ${test.samples - test.riskSamples}

CÁC BỆNH ĐƯỢC GỢI Ý:
${test.suggestedDiseases.length > 0 ? test.suggestedDiseases.map((disease, index) => `${index + 1}. ${disease}`).join('\n') : 'Không có bệnh được phát hiện'}

CHI TIẾT KẾT QUẢ XÉT NGHIỆM:
${testSpecificDetails}

DANH SÁCH MẪU BẤT THƯỜNG:
${abnormalSamplesDetails}

KHUYẾN NGHỊ:
- Theo dõi chặt chẽ các bệnh nhân có nguy cơ cao
- Tư vấn thay đổi lối sống cho bệnh nhân
- Xem xét các xét nghiệm bổ sung nếu cần thiết
${isCollaborator ? '- Liên hệ bác sĩ chính để tư vấn thêm nếu cần thiết' : ''}

============================
Báo cáo được tạo bởi SLSS Gentis
Ngày tạo: ${new Date().toLocaleString('vi-VN')}
Bác sĩ phụ trách: ${isCollaborator ? 'Bác sĩ cộng tác' : 'Bác sĩ chính'}
      `;

      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.height;
      let yPosition = 20;
      
      // Title
      pdf.setFontSize(16);
      pdf.text('BAO CAO XET NGHIEM CHI TIET', 20, yPosition);
      yPosition += 20;
      
      // Basic Info
      pdf.setFontSize(12);
      pdf.text('THONG TIN CHUNG:', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.text(`Ma xet nghiem: ${test.code}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Ten xet nghiem: ${test.name}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Ngay thuc hien: ${test.date}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`So mau xet nghiem: ${test.samples}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Thoi gian xu ly: ${test.processingTime}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Trang thai: ${test.status === 'completed' ? 'Hoan thanh' : 'Dang xu ly'}`, 20, yPosition);
      yPosition += 15;
      
      // Results Overview
      pdf.setFontSize(12);
      pdf.text('KET QUA TONG QUAN:', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.text(`So mau co nguy co cao: ${test.riskSamples}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Ty le nguy co cao: ${((test.riskSamples / test.samples) * 100).toFixed(1)}%`, 20, yPosition);
      yPosition += 6;
      pdf.text(`So mau binh thuong: ${test.samples - test.riskSamples}`, 20, yPosition);
      yPosition += 15;
      
      // Suggested Diseases
      pdf.setFontSize(12);
      pdf.text('CAC BENH DUOC GOI Y:', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      if (test.suggestedDiseases.length > 0) {
        test.suggestedDiseases.forEach((disease, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(`${index + 1}. ${disease}`, 20, yPosition);
          yPosition += 6;
        });
      } else {
        pdf.text('Khong co benh duoc phat hien', 20, yPosition);
        yPosition += 6;
      }
      yPosition += 10;
      
      // Recommendations
      pdf.setFontSize(12);
      pdf.text('KHUYEN NGHI:', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.text('- Theo doi chat che cac benh nhan co nguy co cao', 20, yPosition);
      yPosition += 6;
      pdf.text('- Tu van thay doi loi song cho benh nhan', 20, yPosition);
      yPosition += 6;
      pdf.text('- Xem xet cac xet nghiem bo sung neu can thiet', 20, yPosition);
      yPosition += 15;
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Bao cao duoc tao boi SLSS Gentis', 20, yPosition);
      yPosition += 5;
      pdf.text(`Ngay tao: ${new Date().toLocaleString('vi-VN')}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Bac si phu trach: ${isCollaborator ? 'Bac si cong tac' : 'Bac si chinh'}`, 20, yPosition);
      
      pdf.save(`BaoCao_ChiTiet_${test.code}.pdf`);
      
      console.log('Xuất báo cáo chi tiết cho xét nghiệm:', test.name);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ xử lý</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {isCollaborator ? 'Quản lý xét nghiệm - Bệnh nhân được phân công' : 'Quản lý xét nghiệm'}
        </h2>
        {!isCollaborator && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Tạo xét nghiệm mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo xét nghiệm mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateTest(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên xét nghiệm</label>
                  <Input name="testName" placeholder="Nhập tên xét nghiệm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mô tả</label>
                  <textarea 
                    name="description"
                    className="w-full p-2 border border-slate-300 rounded-md h-20"
                    placeholder="Mô tả chi tiết về xét nghiệm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">File dữ liệu xét nghiệm</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 mb-2">Kéo thả file hoặc click để chọn</p>
                    <p className="text-xs text-slate-500 mb-2">Hỗ trợ: CSV, Excel (nhiều mẫu)</p>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Chọn file
                    </Button>
                    {uploadedFile && (
                      <div className="mt-2 p-2 bg-green-50 rounded">
                        <p className="text-sm text-green-800">
                          ✓ Đã chọn: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!uploadedFile}
                >
                  Tạo và xử lý xét nghiệm
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm xét nghiệm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã XN</TableHead>
                <TableHead>Tên xét nghiệm</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Số mẫu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Mẫu nguy cơ cao</TableHead>
                <TableHead>Thời gian xử lý</TableHead>
                {isCollaborator && <TableHead>BN được phân công</TableHead>}
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.code}</TableCell>
                  <TableCell>{test.name}</TableCell>
                  <TableCell>{test.date}</TableCell>
                  <TableCell>{test.samples}</TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell>
                    {test.riskSamples > 0 ? (
                      <Badge variant="destructive" className="flex items-center w-fit">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {test.riskSamples}
                      </Badge>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </TableCell>
                  <TableCell>{test.processingTime}</TableCell>
                  {isCollaborator && (
                    <TableCell>
                      <div className="text-xs">
                        {(test as any).assignedPatients?.join(', ') || 'N/A'}
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleExportReport(test.id)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Xuất báo cáo
                      </Button>
                      {test.riskSamples > 0 && (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Cảnh báo
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
