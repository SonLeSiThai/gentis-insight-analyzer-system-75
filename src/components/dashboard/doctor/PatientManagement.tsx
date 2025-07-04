
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import jsPDF from 'jspdf';
import { 
  Search, 
  Download,
  Eye
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
import { PatientDetails } from './PatientDetails';

interface PatientManagementProps {
  userRole: string;
}

export const PatientManagement = ({ userRole }: PatientManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const isCollaborator = userRole === 'collaborator';
  const { toast } = useToast();

  const [patients] = useState([
    {
      id: 1,
      code: 'PT001',
      name: 'Nguyễn Văn A',
      age: 45,
      gender: 'Nam',
      phone: '0123456789',
      address: 'Hà Nội',
      assignedDoctor: 'BS. Trần Văn B',
      assignedDate: '2024-01-10',
      lastVisit: '2024-01-15',
      status: 'active',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      tests: [
        {
          id: 1,
          code: 'XN_240115_001',
          date: '2024-01-15',
          testDateTime: '2024-01-15 09:30:45',
          diagnosisTime: '2024-01-15 14:35:27',
          diagnosis: 'Tiểu đường type 2',
          riskScore: 85,
          biomarkers: {
            glucose: 180,
            hba1c: 8.5,
            cholesterol: 240
          },
          doctorConclusion: 'Bệnh nhân cần điều chỉnh chế độ ăn uống và dùng thuốc theo chỉ định'
        }
      ]
    },
    {
      id: 2,
      code: 'PT002',
      name: 'Trần Thị B',
      age: 38,
      gender: 'Nữ',
      phone: '0987654321',
      address: 'TP.HCM',
      assignedDoctor: 'BS. Nguyễn Thị C',
      assignedDate: '2024-01-12',
      lastVisit: '2024-01-14',
      status: 'active',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      tests: [
        {
          id: 2,
          code: 'XN_240114_002',
          date: '2024-01-14',
          testDateTime: '2024-01-14 14:20:18',
          diagnosisTime: '2024-01-14 10:22:15',
          diagnosis: 'Rối loạn lipid máu',
          riskScore: 65,
          biomarkers: {
            totalCholesterol: 220,
            ldl: 140,
            hdl: 45
          },
          doctorConclusion: ''
        }
      ]
    }
  ]);

  const handleDownloadDetails = (patient: any) => {
    const pdfContent = `
      THÔNG TIN CHI TIẾT BỆNH NHÂN
      ============================
      
      THÔNG TIN CƠ BẢN:
      - Mã bệnh nhân: ${patient.code}
      - Họ tên: ${patient.name}
      - Tuổi: ${patient.age}
      - Giới tính: ${patient.gender}
      - Số điện thoại: ${patient.phone}
      - Địa chỉ: ${patient.address}
      - Bác sĩ chỉ định: ${patient.assignedDoctor}
      - Mã tài khoản: ${patient.accountCode}
      - Ngày phân công: ${patient.assignedDate}
      - Lần khám gần nhất: ${patient.lastVisit}
      - Trạng thái: ${patient.status === 'active' ? 'Đang điều trị' : 'Ngưng điều trị'}
      
      LỊCH SỬ XÉT NGHIỆM CHI TIẾT:
      ${patient.tests.map((test: any) => `
      - Mã xét nghiệm: ${test.code}
      - Ngày xét nghiệm: ${test.date}
      - Thời gian xét nghiệm chính xác: ${test.testDateTime}
      - Thời gian chẩn đoán chính xác: ${test.diagnosisTime}
      - Chẩn đoán: ${test.diagnosis}
      - Điểm nguy cơ: ${test.riskScore}/100
      - Chỉ số sinh học:
        ${Object.entries(test.biomarkers).map(([key, value]) => `  + ${key.toUpperCase()}: ${value}`).join('\n        ')}
      - Kết luận bác sĩ: ${test.doctorConclusion || 'Chưa có kết luận'}
      `).join('\n      ')}
      
      KHUYẾN NGHỊ VÀ PHÂN TÍCH CHI TIẾT:
      - Tình trạng sức khỏe tổng quan: ${patient.tests.length > 0 ? patient.tests[0].diagnosis : 'Chưa có dữ liệu'}
      - Các chỉ số cần theo dõi: ${patient.tests.length > 0 ? Object.keys(patient.tests[0].biomarkers).join(', ').toUpperCase() : 'Chưa có dữ liệu'}
      - Lịch tái khám được khuyến nghị: 3-6 tháng
      - Ghi chú đặc biệt: Cần tuân thủ nghiêm ngặt chế độ điều trị
      
      ============================
                    Báo cáo được tạo bởi Gentis
      Ngày tạo: ${new Date().toLocaleString('vi-VN')}
      Người tạo: Bác sĩ ${userRole === 'collaborator' ? 'Cộng tác' : 'Chính'}
      Tài khoản: ${patient.accountCode}
    `;

    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = 20;
    
    // Title
    pdf.setFontSize(16);
    pdf.text('THONG TIN CHI TIET BENH NHAN', 20, yPosition);
    yPosition += 20;
    
    // Basic Info
    pdf.setFontSize(12);
    pdf.text('THONG TIN CO BAN:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.text(`Ma benh nhan: ${patient.code}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Ho ten: ${patient.name}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Tuoi: ${patient.age}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Gioi tinh: ${patient.gender}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`So dien thoai: ${patient.phone}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Dia chi: ${patient.address}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Bac si chi dinh: ${patient.assignedDoctor}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Ma tai khoan: ${patient.accountCode}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Ngay phan cong: ${patient.assignedDate}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Lan kham gan nhat: ${patient.lastVisit}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Trang thai: ${patient.status === 'active' ? 'Dang dieu tri' : 'Ngung dieu tri'}`, 20, yPosition);
    yPosition += 15;
    
    // Test History
    pdf.setFontSize(12);
    pdf.text('LICH SU XET NGHIEM CHI TIET:', 20, yPosition);
    yPosition += 10;
    
    patient.tests.forEach((test: any, index: number) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(10);
      pdf.text(`${index + 1}. Ma xet nghiem: ${test.code}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`   Ngay xet nghiem: ${test.date}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`   Thoi gian xet nghiem: ${test.testDateTime}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`   Thoi gian chan doan: ${test.diagnosisTime}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`   Chan doan: ${test.diagnosis}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`   Diem nguy co: ${test.riskScore}/100`, 20, yPosition);
      yPosition += 6;
      pdf.text(`   Chi so sinh hoc:`, 20, yPosition);
      yPosition += 4;
      
      Object.entries(test.biomarkers).forEach(([key, value]) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`     + ${key.toUpperCase()}: ${value}`, 20, yPosition);
        yPosition += 4;
      });
      
      pdf.text(`   Ket luan bac si: ${test.doctorConclusion || 'Chua co ket luan'}`, 20, yPosition);
      yPosition += 10;
    });
    
    yPosition += 5;
    
    // Recommendations
    pdf.setFontSize(12);
    pdf.text('KHUYEN NGHI VA PHAN TICH CHI TIET:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.text(`Tinh trang suc khoe tong quan: ${patient.tests.length > 0 ? patient.tests[0].diagnosis : 'Chua co du lieu'}`, 20, yPosition);
    yPosition += 6;
    const indicators = patient.tests.length > 0 ? Object.keys(patient.tests[0].biomarkers).join(', ').toUpperCase() : 'Chua co du lieu';
    pdf.text(`Cac chi so can theo doi: ${indicators}`, 20, yPosition);
    yPosition += 6;
    pdf.text('Lich tai kham duoc khuyen nghi: 3-6 thang', 20, yPosition);
    yPosition += 6;
    pdf.text('Ghi chu dac biet: Can tuan thu nghiem ngat che do dieu tri', 20, yPosition);
    yPosition += 15;
    
    // Footer
    pdf.setFontSize(8);
            pdf.text('Bao cao duoc tao boi Gentis', 20, yPosition);
    yPosition += 5;
    pdf.text(`Ngay tao: ${new Date().toLocaleString('vi-VN')}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Nguoi tao: Bac si ${userRole === 'collaborator' ? 'Cong tac' : 'Chinh'}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Tai khoan: ${patient.accountCode}`, 20, yPosition);
    
    pdf.save(`ThongTinChiTiet_${patient.code}.pdf`);
    
    toast({
      title: "Tải xuống thành công",
      description: `Thông tin chi tiết bệnh nhân ${patient.name} đã được tải xuống PDF`,
    });
  };

  const handleViewPatientDetails = (patient: any) => {
    setSelectedPatient(patient);
  };

  // Filter patients by account code for collaborators
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For collaborators, only show patients with their account code
    if (isCollaborator) {
      return matchesSearch && patient.accountCode === 'COL001';
    }
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý bệnh nhân</h2>
          {isCollaborator && (
            <p className="text-sm text-slate-600 mt-1">
              Hiển thị bệnh nhân được phân công cho tài khoản: COL001
            </p>
          )}
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách bệnh nhân 
            {isCollaborator && (
              <Badge variant="outline" className="ml-2">
                {filteredPatients.length} bệnh nhân được phân công
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã BN</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Tuổi</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-mono text-sm">{patient.code}</TableCell>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>
                    <Badge variant={patient.status === 'active' ? "default" : "secondary"}>
                      {patient.status === 'active' ? 'Đang điều trị' : 'Ngưng điều trị'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewPatientDetails(patient)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Xem
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadDetails(patient)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Tải chi tiết
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Chi tiết bệnh nhân: {selectedPatient.name} ({selectedPatient.code})
              </DialogTitle>
            </DialogHeader>
            <PatientDetails patient={selectedPatient} userRole={userRole} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
