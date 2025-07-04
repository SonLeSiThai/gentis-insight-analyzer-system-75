
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PdfGenerator, sanitizeVietnameseText, formatBiomarkers } from '@/lib/pdfGenerator';
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Activity,
  Calendar,
  Eye,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Biomarker {
  value: number;
  normal: string;
  status: 'high' | 'low' | 'normal';
}

interface Report {
  id: number;
  patientCode: string;
  patientName: string;
  testCode: string;
  date: string;
  testDateTime: string;
  diagnosisDateTime: string;
  riskLevel: 'high' | 'medium' | 'low';
  primaryDiagnosis: string;
  riskScore: number;
  recommendations: string[];
  biomarkers: Record<string, Biomarker>;
}

interface ReportsViewProps {
  userRole: string;
}

export const ReportsView = ({ userRole }: ReportsViewProps) => {
  const isCollaborator = userRole === 'collaborator';
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const { toast } = useToast();
  
  const [reports] = useState<Report[]>(isCollaborator ? [
    {
      id: 3,
      patientCode: 'PT003',
      patientName: 'Lê Văn C',
      testCode: 'XN_240101_003',
      date: '2024-01-13',
      testDateTime: '2024-01-13 08:15:32',
      diagnosisDateTime: '2024-01-13 14:22:15',
      riskLevel: 'high',
      primaryDiagnosis: 'Gan nhiễm mỡ',
      riskScore: 78,
      recommendations: [
        'Giảm cân và tập thể dục đều đặn',
        'Hạn chế rượu bia hoàn toàn',
        'Theo dõi lại sau 3 tháng'
      ],
      biomarkers: {
        alt: { value: 85, normal: '7-56', status: 'high' },
        ast: { value: 72, normal: '10-40', status: 'high' },
        ggt: { value: 95, normal: '9-48', status: 'high' }
      }
    }
  ] : [
    {
      id: 1,
      patientCode: 'PT001',
      patientName: 'Nguyễn Văn A',
      testCode: 'XN_240101_001',
      date: '2024-01-15',
      testDateTime: '2024-01-15 09:30:45',
      diagnosisDateTime: '2024-01-15 16:45:22',
      riskLevel: 'high',
      primaryDiagnosis: 'Tiểu đường type 2',
      riskScore: 85,
      recommendations: [
        'Theo dõi đường huyết thường xuyên',
        'Làm thêm xét nghiệm HbA1c sau 3 tháng',
        'Chuyển khoa Nội tiết'
      ],
      biomarkers: {
        glucose: { value: 180, normal: '70-100', status: 'high' },
        hba1c: { value: 8.5, normal: '4-6', status: 'high' },
        cholesterol: { value: 240, normal: '<200', status: 'high' }
      }
    },
    {
      id: 2,
      patientCode: 'PT002',
      patientName: 'Trần Thị B',
      testCode: 'XN_240101_002',
      date: '2024-01-14',
      testDateTime: '2024-01-14 14:20:18',
      diagnosisDateTime: '2024-01-14 18:35:07',
      riskLevel: 'medium',
      primaryDiagnosis: 'Rối loạn lipid máu',
      riskScore: 65,
      recommendations: [
        'Điều chỉnh chế độ ăn uống',
        'Tăng cường vận động',
        'Theo dõi lại sau 6 tháng'
      ],
      biomarkers: {
        totalCholesterol: { value: 220, normal: '<200', status: 'high' },
        ldl: { value: 140, normal: '<100', status: 'high' },
        hdl: { value: 45, normal: '>40', status: 'normal' }
      }
    }
  ]);

  const handleExportPDF = async (reportId: number) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      try {
        const pdfGen = new PdfGenerator();
        
        // Title
        pdfGen.addTitle('BÁO CÁO CHẨN ĐOÁN XÉT NGHIỆM CHI TIẾT');
        
        // Patient Info Section
        pdfGen.addSectionHeader('THÔNG TIN BỆNH NHÂN:');
        pdfGen.addLabelValue('Họ tên', report.patientName);
        pdfGen.addLabelValue('Mã bệnh nhân', report.patientCode);
        pdfGen.addLabelValue('Mã xét nghiệm', report.testCode);
        pdfGen.addLabelValue('Thời gian xét nghiệm', report.testDateTime);
        pdfGen.addLabelValue('Thời gian chẩn đoán', report.diagnosisDateTime);
        
        pdfGen.addSpace();
        
        // Diagnosis Section
        pdfGen.addSectionHeader('KẾT QUẢ CHẨN ĐOÁN:');
        pdfGen.addLabelValue('Chẩn đoán chính', report.primaryDiagnosis);
        pdfGen.addLabelValue('Điểm nguy cơ', `${report.riskScore}/100`);
        const riskLevelText = report.riskLevel === 'high' ? 'CAO' : report.riskLevel === 'medium' ? 'TRUNG BÌNH' : 'THẤP';
        pdfGen.addLabelValue('Mức độ nguy cơ', riskLevelText);
        
        pdfGen.addSpace();
        
        // Convert biomarkers to array format for new API
        const biomarkersArray = Object.entries(report.biomarkers).map(([key, marker]) => ({
          name: key.toUpperCase(),
          value: marker.value,
          unit: '',
          normalRange: marker.normal,
          status: marker.status === 'high' ? 'Cao' : 
                  marker.status === 'low' ? 'Thấp' : 'Bình thường'
        }));
        
        // Format biomarkers using new table format
        pdfGen.formatBiomarkers(biomarkersArray);
        
        pdfGen.addSpace();
        
        // Recommendations Section
        pdfGen.addSectionHeader('KHUYẾN NGHỊ XỬ LÝ CHI TIẾT:');
        report.recommendations.forEach((rec, index) => {
          pdfGen.addText(`${index + 1}. ${rec}`);
        });
        
        pdfGen.addSpace();
        
        // Risk Analysis Section
        const abnormalCount = Object.values(report.biomarkers).filter(m => m.status !== 'normal').length;
        const abnormalNames = Object.entries(report.biomarkers)
          .filter(([_, m]) => m.status !== 'normal')
          .map(([key, _]) => key.toUpperCase())
          .join(', ');
        
        pdfGen.addSectionHeader('PHÂN TÍCH NGUY CƠ:');
        pdfGen.addLabelValue('Số chỉ số bất thường', abnormalCount.toString());
        pdfGen.addLabelValue('Các chỉ số vượt ngưỡng', abnormalNames);
        
        // Generate and download PDF
        await pdfGen.downloadPdf(`BaoCaoChiTiet_${report.patientCode}_${report.date}.pdf`);
        
        toast({
          title: "Xuất báo cáo chi tiết thành công",
          description: `Báo cáo chi tiết cho bệnh nhân ${report.patientName} đã được tải xuống với font tiếng Việt`,
        });
        
        console.log('Xuất báo cáo chi tiết cho:', report.patientName);
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
          title: "Lỗi tạo PDF",
          description: "Không thể tạo file PDF. Vui lòng thử lại.",
          variant: "destructive"
        });
      }
    }
  };

  const handleExportAll = () => {
    const allReportsContent = reports.map(report => `
      BÁAO CÁO CHẨN ĐOÁN XÉT NGHIỆM CHI TIẾT
      ======================================
      
      THÔNG TIN BỆNH NHÂN:
      - Họ tên: ${report.patientName}
      - Mã bệnh nhân: ${report.patientCode}
      - Mã xét nghiệm: ${report.testCode}
      - Thời gian xét nghiệm: ${report.testDateTime}
      - Thời gian chẩn đoán: ${report.diagnosisDateTime}
      
      KẾT QUẢ CHẨN ĐOÁN:
      - Chẩn đoán chính: ${report.primaryDiagnosis}
      - Điểm nguy cơ: ${report.riskScore}/100
      - Mức độ nguy cơ: ${report.riskLevel === 'high' ? 'CAO' : report.riskLevel === 'medium' ? 'TRUNG BÌNH' : 'THẤP'}
      
      CHI TIẾT CÁC CHỈ SỐ SINH HỌC:
      ${Object.entries(report.biomarkers).map(([key, marker]) => 
        `- ${key.toUpperCase()}: ${marker.value} (Bình thường: ${marker.normal}) - Trạng thái: ${marker.status === 'high' ? 'CAO' : marker.status === 'low' ? 'THẤP' : 'BÌNH THƯỜNG'}`
      ).join('\n      ')}
      
      KHUYẾN NGHỊ XỬ LÝ CHI TIẾT:
      ${report.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n      ')}
      
      ======================================
    `).join('\n\n');

    const finalContent = allReportsContent + `
      \n\nTÓM TẮT THỐNG KÊ TỔNG QUAN:
      - Tổng số báo cáo: ${reports.length}
      - Nguy cơ cao: ${reports.filter(r => r.riskLevel === 'high').length}
      - Nguy cơ trung bình: ${reports.filter(r => r.riskLevel === 'medium').length}
      - Nguy cơ thấp: ${reports.filter(r => r.riskLevel === 'low').length}
      - Tỷ lệ phát hiện bệnh: ${((reports.filter(r => r.riskLevel !== 'low').length / reports.length) * 100).toFixed(1)}%
      
                    Báo cáo được tạo bởi Gentis
      Ngày tạo: ${new Date().toLocaleString('vi-VN')}
      Người tạo: Bác sĩ ${userRole === 'collaborator' ? 'Cộng tác' : 'Chính'}
    `;

    const blob = new Blob([finalContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TongHopBaoCaoChiTiet_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Xuất tất cả báo cáo chi tiết",
      description: `Đã xuất ${reports.length} báo cáo chi tiết thành công`,
    });
    
    console.log('Xuất tất cả báo cáo chi tiết');
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge variant="destructive">Nguy cơ cao</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Nguy cơ trung bình</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Nguy cơ thấp</Badge>;
      default:
        return <Badge variant="secondary">Chưa đánh giá</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {isCollaborator ? 'Báo cáo chẩn đoán - Bệnh nhân được phân công' : 'Báo cáo phân tích'}
        </h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleExportAll}>
          <Download className="h-4 w-4 mr-2" />
          Xuất tất cả báo cáo chi tiết
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Nguy cơ cao</p>
                <p className="text-2xl font-bold text-red-600">
                  {reports.filter(r => r.riskLevel === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Nguy cơ trung bình</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reports.filter(r => r.riskLevel === 'medium').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">
                  {isCollaborator ? 'BN được phân công' : 'Tổng bệnh nhân'}
                </p>
                <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Độ chính xác</p>
                <p className="text-2xl font-bold text-green-600">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Mã XN</TableHead>
                <TableHead>Thời gian XN</TableHead>
                <TableHead>Thời gian CĐ</TableHead>
                <TableHead>Chẩn đoán</TableHead>
                <TableHead>Điểm nguy cơ</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.patientName}</p>
                      <p className="text-sm text-slate-600">{report.patientCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">{report.testCode}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Clock className="h-3 w-3 mr-1 text-slate-500" />
                      {report.testDateTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <FileText className="h-3 w-3 mr-1 text-slate-500" />
                      {report.diagnosisDateTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{report.primaryDiagnosis}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-red-600">{report.riskScore}/100</span>
                  </TableCell>
                  <TableCell>
                    {getRiskBadge(report.riskLevel)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setViewingReport(report)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Chi tiết
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleExportPDF(report.id)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Tải về
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Report Detail Dialog - Simplified */}
      {viewingReport && (
        <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thông tin cơ bản - {viewingReport.patientName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-3">Thông tin tóm tắt</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-slate-600">Họ tên:</label>
                    <p className="font-medium">{viewingReport.patientName}</p>
                  </div>
                  <div>
                    <label className="text-slate-600">Mã bệnh nhân:</label>
                    <p className="font-medium">{viewingReport.patientCode}</p>
                  </div>
                  <div>
                    <label className="text-slate-600">Mã xét nghiệm:</label>
                    <p className="font-medium">{viewingReport.testCode}</p>
                  </div>
                  <div>
                    <label className="text-slate-600">Điểm nguy cơ:</label>
                    <p className="font-bold text-red-600">{viewingReport.riskScore}/100</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Chẩn đoán chính</h3>
                <p className="text-blue-700 font-medium">{viewingReport.primaryDiagnosis}</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng</h3>
                <p className="text-yellow-700 text-sm">
                  • Thông tin chi tiết về chỉ số sinh học, khuyến nghị xử lý được cung cấp trong file kết quả tải về.<br/>
                  • Để xem đầy đủ thông tin phân tích, vui lòng tải file báo cáo chi tiết.<br/>
                  • Kết quả chỉ mang tính chất tham khảo, cần kết hợp thăm khám lâm sàng.
                </p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    handleExportPDF(viewingReport.id);
                    setViewingReport(null);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải báo cáo chi tiết
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setViewingReport(null)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
