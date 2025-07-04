import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Eye, Activity } from 'lucide-react';
import { TestResultDetails } from './TestResultDetails';
import { PdfGenerator } from '@/lib/pdfGenerator';
import { BIOMARKER_LIST, generateDefaultBiomarkers } from '@/data/biomarkers';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  id: number;
  testCode: string;
  patientName: string;
  birthDate: string;
  testDate: string;
  result: string;
  phone: string;
  branch: string;
  analysisDate: string;
  diagnosis: string;
  diseaseCode: string | null;
  biomarkers: any;
  doctorConclusion: string;
}

const mockTestResults: TestResult[] = [
  {
    id: 1,
    testCode: 'y12345678',
    patientName: 'Nguyễn Văn A',
    birthDate: '01/01/2023',
    testDate: '05/05/2024',
    result: 'positive',
    phone: '0901234567',
    branch: 'Hà Nội',
    analysisDate: '06/05/2024',
    diagnosis: 'Nghi ngờ bệnh Phenylketon niệu',
    diseaseCode: 'D001',
    biomarkers: {
      'c0-carnitine': { value: 0.12, normal: '< 0.2', status: 'high' },
      'c2-carnitine': { value: 0.08, normal: '< 0.15', status: 'high' },
      'c3-carnitine': { value: 0.03, normal: '< 0.06', status: 'high' },
      'c4-carnitine': { value: 0.02, normal: '< 0.04', status: 'high' },
      'c5-carnitine': { value: 0.02, normal: '< 0.03', status: 'high' },
      'c5dc-carnitine': { value: 0.01, normal: '< 0.02', status: 'high' },
      'c6-carnitine': { value: 0.01, normal: '< 0.02', status: 'high' },
      'c8-carnitine': { value: 0.01, normal: '< 0.02', status: 'high' },
      'c10-carnitine': { value: 0.01, normal: '< 0.02', status: 'high' },
      'c12-carnitine': { value: 0.01, normal: '< 0.02', status: 'high' },
      'c14-carnitine': { value: 0.01, normal: '< 0.02', status: 'high' },
    },
    doctorConclusion: 'Cần làm thêm các xét nghiệm chuyên sâu để xác định bệnh.',
  },
  {
    id: 2,
    testCode: 'y12345679',
    patientName: 'Trần Thị B',
    birthDate: '15/03/2023',
    testDate: '10/05/2024',
    result: 'negative',
    phone: '0909876543',
    branch: 'Đà Nẵng',
    analysisDate: '11/05/2024',
    diagnosis: 'Không phát hiện bất thường',
    diseaseCode: null,
    biomarkers: {
      'c0-carnitine': { value: 0.05, normal: '< 0.2', status: 'normal' },
      'c2-carnitine': { value: 0.1, normal: '< 0.15', status: 'normal' },
      'c3-carnitine': { value: 0.04, normal: '< 0.06', status: 'normal' },
      'c4-carnitine': { value: 0.03, normal: '< 0.04', status: 'normal' },
      'c5-carnitine': { value: 0.01, normal: '< 0.03', status: 'normal' },
      'c5dc-carnitine': { value: 0.01, normal: '< 0.02', status: 'normal' },
      'c6-carnitine': { value: 0.01, normal: '< 0.02', status: 'normal' },
      'c8-carnitine': { value: 0.01, normal: '< 0.02', status: 'normal' },
      'c10-carnitine': { value: 0.01, normal: '< 0.02', status: 'normal' },
      'c12-carnitine': { value: 0.01, normal: '< 0.02', status: 'normal' },
      'c14-carnitine': { value: 0.01, normal: '< 0.02', status: 'normal' },
    },
    doctorConclusion: '',
  },
  {
    id: 3,
    testCode: 'y12345680',
    patientName: 'Lê Văn C',
    birthDate: '22/07/2023',
    testDate: '15/05/2024',
    result: 'positive',
    phone: '0903456789',
    branch: 'Hồ Chí Minh',
    analysisDate: '16/05/2024',
    diagnosis: 'Nghi ngờ bệnh Argininemia',
    diseaseCode: 'D002',
    biomarkers: {
      'c0-carnitine': { value: 0.25, normal: '< 0.2', status: 'high' },
      'c2-carnitine': { value: 0.18, normal: '< 0.15', status: 'high' },
      'c3-carnitine': { value: 0.07, normal: '< 0.06', status: 'high' },
      'c4-carnitine': { value: 0.05, normal: '< 0.04', status: 'high' },
      'c5-carnitine': { value: 0.04, normal: '< 0.03', status: 'high' },
      'c5dc-carnitine': { value: 0.03, normal: '< 0.02', status: 'high' },
      'c6-carnitine': { value: 0.03, normal: '< 0.02', status: 'high' },
      'c8-carnitine': { value: 0.03, normal: '< 0.02', status: 'high' },
      'c10-carnitine': { value: 0.03, normal: '< 0.02', status: 'high' },
      'c12-carnitine': { value: 0.03, normal: '< 0.02', status: 'high' },
      'c14-carnitine': { value: 0.03, normal: '< 0.02', status: 'high' },
    },
    doctorConclusion: 'Cần hội chẩn với bác sĩ chuyên khoa để đưa ra kết luận cuối cùng.',
  },
];

interface TestResultManagementProps {
  userRole: string;
}

export const TestResultManagement = ({ userRole }: TestResultManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const { toast } = useToast();

  const filteredResults = mockTestResults.filter(result => 
    result.testCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAdditionalPatientData = (testCode: string) => {
    if (testCode === 'y12345678') {
      return { gender: 'Nữ', gestationalAge: 39, birthWeight: 3800, twinStatus: 'Sinh đơn', ivfStatus: 'Có', address: 'Hà Nội', antibioticUse: 'Không', breastfeeding: 'Có', sampleCode: testCode, sampleCollectionDate: '03/05/2025', sampleReceiptDate: '03/05/2025' };
    } else if (testCode === 'y12345679') {
      return { gender: 'Nữ', gestationalAge: 39, birthWeight: 3700, twinStatus: 'Sinh đơn', ivfStatus: 'Có', address: 'Hà Nội', antibioticUse: 'Không', breastfeeding: 'Có', sampleCode: testCode, sampleCollectionDate: '03/06/2025', sampleReceiptDate: '03/06/2025', doctorPhone: '0908 631 472' };
    }
    return { gender: 'Nữ', gestationalAge: 39, birthWeight: 3800, twinStatus: 'Sinh đơn', ivfStatus: 'Có', address: 'Hà Nội', antibioticUse: 'Không', breastfeeding: 'Có', sampleCode: testCode, sampleCollectionDate: '03/05/2025', sampleReceiptDate: '03/05/2025' };
  };

  const handleDownloadReport = async (testResult: any) => {
    const additionalPatientData = getAdditionalPatientData(testResult.testCode);
    const doctorPhone = '0987 654 321';
    const fullBiomarkers = generateDefaultBiomarkers();
    
    // Apply test-specific biomarker values
    Object.keys(testResult.biomarkers).forEach(key => {
      if (fullBiomarkers[key]) { 
        fullBiomarkers[key] = testResult.biomarkers[key]; 
      }
    });

    const highBiomarkers = BIOMARKER_LIST.filter(biomarker => {
      const key = biomarker.code.toLowerCase();
      return fullBiomarkers[key]?.status === 'high';
    });
    const lowBiomarkers = BIOMARKER_LIST.filter(biomarker => {
      const key = biomarker.code.toLowerCase();
      return fullBiomarkers[key]?.status === 'low';
    });

    try {
      const pdfGen = new PdfGenerator();
      
      pdfGen.addTitle('BÁO CÁO XÉT NGHIỆM CHI TIẾT');
      
      pdfGen.addSectionHeader('A. THÔNG TIN XÉT NGHIỆM:');
      pdfGen.addLabelValue('Mã số mẫu', testResult.testCode);
      pdfGen.addLabelValue('Họ tên', testResult.patientName);
      pdfGen.addLabelValue('Ngày sinh', testResult.birthDate);
      pdfGen.addLabelValue('Giới tính', additionalPatientData.gender);
      pdfGen.addLabelValue('Số tuổi thai lúc sinh', `${additionalPatientData.gestationalAge} tuần`);
      pdfGen.addLabelValue('Cân nặng lúc sinh', `${additionalPatientData.birthWeight}g`);
      pdfGen.addLabelValue('Sinh đôi/sinh đơn', additionalPatientData.twinStatus);
      pdfGen.addLabelValue('Thai IVF', additionalPatientData.ivfStatus);
      pdfGen.addLabelValue('Địa chỉ', additionalPatientData.address);
      pdfGen.addLabelValue('Tình trạng dùng kháng sinh', additionalPatientData.antibioticUse);
      pdfGen.addLabelValue('Dùng sữa mẹ', additionalPatientData.breastfeeding);
      pdfGen.addLabelValue('Ngày lấy mẫu', additionalPatientData.sampleCollectionDate);
      pdfGen.addLabelValue('Ngày nhận mẫu', additionalPatientData.sampleReceiptDate);
      pdfGen.addLabelValue('Ngày xét nghiệm', testResult.testDate);
      pdfGen.addLabelValue('Ngày phân tích', testResult.analysisDate);
      pdfGen.addLabelValue('Số điện thoại', testResult.phone);
      pdfGen.addLabelValue('Số điện thoại bác sĩ', additionalPatientData.doctorPhone || doctorPhone);
      pdfGen.addLabelValue('Kết quả', testResult.result === 'positive' ? 'Dương tính' : 'Âm tính');
      pdfGen.addSpace();
      
      pdfGen.addSectionHeader('B. CHI TIẾT 77 CHỈ SỐ SINH HỌC:');
      const biomarkersArray = BIOMARKER_LIST.map(biomarker => {
        const key = biomarker.code.toLowerCase();
        const marker = fullBiomarkers[key];
        return {
          name: biomarker.name,
          value: marker.value,
          unit: '',
          normalRange: marker.normal,
          status: marker.status === 'high' ? 'Tăng' : marker.status === 'low' ? 'Giảm' : 'Trong ngưỡng'
        };
      });
      pdfGen.formatBiomarkers(biomarkersArray);
      pdfGen.addSpace();
      
      pdfGen.addSectionHeader('C. KẾT QUẢ PHÂN TÍCH:');
      pdfGen.addText('DANH SÁCH CÁC CHỈ SỐ TĂNG:');
      if (highBiomarkers.length > 0) {
        highBiomarkers.slice(0, 5).forEach(biomarker => {
          const key = biomarker.code.toLowerCase();
          const marker = fullBiomarkers[key];
          pdfGen.addText(`- ${biomarker.name}: ${marker.value} (BT: ${marker.normal})`);
        });
      } else {
        pdfGen.addText('Không có chỉ số nào tăng cao');
      }
      pdfGen.addSpace();
    
      pdfGen.addText('DANH SÁCH CÁC CHỈ SỐ GIẢM:');
      if (lowBiomarkers.length > 0) {
        lowBiomarkers.slice(0, 5).forEach(biomarker => {
          const key = biomarker.code.toLowerCase();
          const marker = fullBiomarkers[key];
          pdfGen.addText(`- ${biomarker.name}: ${marker.value} (BT: ${marker.normal})`);
        });
      } else {
        pdfGen.addText('Không có chỉ số nào giảm thấp');
      }
      pdfGen.addSpace();
    
      pdfGen.addSectionHeader('D. KẾT QUẢ CHẨN ĐOÁN:');
      pdfGen.addLabelValue('Kết quả xét nghiệm', testResult.result === 'positive' ? 'Dương tính' : 'Âm tính');
      pdfGen.addLabelValue('Chẩn đoán', testResult.diagnosis);
      if (testResult.diseaseCode) {
        pdfGen.addLabelValue('Mã bệnh', testResult.diseaseCode);
      }
      pdfGen.addSpace();
    
      pdfGen.addSectionHeader('E. KẾT LUẬN CỦA BÁC SĨ:');
      pdfGen.addText(testResult.doctorConclusion || 'Chưa có kết luận từ bác sĩ');
      
      await pdfGen.downloadPdf(`BaoCao_ChiTiet_${testResult.testCode}.pdf`);
    
      toast({ 
        title: "Tải xuống thành công", 
        description: `Báo cáo chi tiết ${testResult.testCode} đã được tải xuống PDF` 
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({ 
        title: "Lỗi tạo PDF", 
        description: "Không thể tạo file PDF. Vui lòng thử lại.", 
        variant: "destructive" 
      });
    }
  };

  if (selectedTest) {
    return (
      <div>
        <Button 
          onClick={() => setSelectedTest(null)} 
          variant="outline" 
          className="mb-4"
        >
          ← Quay lại danh sách
        </Button>
        <TestResultDetails testResult={selectedTest} userRole={userRole} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý kết quả xét nghiệm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã xét nghiệm hoặc tên bệnh nhân"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã xét nghiệm</TableHead>
                  <TableHead>Tên bệnh nhân</TableHead>
                  <TableHead>Ngày sinh</TableHead>
                  <TableHead>Ngày xét nghiệm</TableHead>
                  <TableHead>Kết quả</TableHead>
                  <TableHead>Chẩn đoán</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-mono">{result.testCode}</TableCell>
                    <TableCell className="font-medium">{result.patientName}</TableCell>
                    <TableCell>{result.birthDate}</TableCell>
                    <TableCell>{result.testDate}</TableCell>
                    <TableCell>
                      <Badge variant={result.result === 'positive' ? "destructive" : "secondary"}>
                        {result.result === 'positive' ? 'Dương tính' : 'Âm tính'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{result.diagnosis}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTest(result)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReport(result)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Tải
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
