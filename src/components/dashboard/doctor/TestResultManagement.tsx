import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PdfGenerator, sanitizeVietnameseText, formatBiomarkers } from '@/lib/pdfGenerator';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Search, 
  Download,
  Eye,
  Activity,
  FileText,
  Info
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
import { TestResultDetails } from './TestResultDetails';

interface TestResultManagementProps {
  userRole: string;
}

export const TestResultManagement = ({ userRole }: TestResultManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const isCollaborator = userRole === 'collaborator';
  const { toast } = useToast();

  const [testResults] = useState([
    {
      id: 1,
      testCode: 'y12345678',
      patientName: 'Nguyễn Thị AA',
      birthDate: '03/07/2025',
      testDate: '03/07/2025',
      result: 'positive',
      phone: '0901 234 567',
      branch: 'Chi nhánh Hà Nội',
      analysisDate: '03/07/2025',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      diagnosis: 'Citrullinemia type I (argininosuccinate synthetase)',
      diseaseCode: 'D001',
      biomarkers: {
        ala: { value: 291, normal: '117 - 541', status: 'normal' },
        arg: { value: 2.1, normal: '0.9 - 32', status: 'normal' },
        cit: { value: 35, normal: '4 - 29', status: 'high' },
        gln: { value: 333, normal: '88 - 901', status: 'normal' },
        glu: { value: 412, normal: '62 - 797', status: 'normal' },
        gly: { value: 313, normal: '184 - 837', status: 'normal' },
        leu: { value: 193, normal: '53 - 260', status: 'normal' },
        met: { value: 30.2, normal: '5.6 - 40.1', status: 'normal' },
        orn: { value: 149, normal: '14 - 194', status: 'normal' },
        phe: { value: 50, normal: '23 - 97', status: 'normal' },
        pro: { value: 168, normal: '73 - 264', status: 'normal' },
        tyr: { value: 88, normal: '15 - 358', status: 'normal' },
        val: { value: 158, normal: '51 - 212', status: 'normal' },
        c0: { value: 30.3, normal: '7.5 - 59', status: 'normal' },
        c2: { value: 8.1, normal: '4.6 - 52', status: 'normal' },
        c3: { value: 1.1, normal: '0.36 - 4.93', status: 'normal' },
        c3dc_c4oh: { value: 0.03, normal: '0 - 0.33', status: 'normal' },
        c4: { value: 0.12, normal: '0.05 - 0.7', status: 'normal' },
        c4dc_c5oh: { value: 0.1, normal: '0.07 - 0.45', status: 'normal' },
        c5: { value: 0.12, normal: '0.03 - 0.33', status: 'normal' },
        c5dc_c6oh: { value: 0.06, normal: '0.02 - 0.18', status: 'normal' },
        c5_1: { value: 0.02, normal: '0 - 0.08', status: 'normal' },
        c6: { value: 18, normal: '0.007 - 0.12', status: 'normal' },
        c6dc: { value: 0.05, normal: '0.02 - 0.25', status: 'normal' },
        c8: { value: 19, normal: '0.013 - 0.21', status: 'normal' },
        c8_1: { value: 0.06, normal: '0 - 0.22', status: 'normal' },
        c10: { value: 32, normal: '0.015 - 0.24', status: 'normal' },
        c10_1: { value: 0.03, normal: '0 - 0.08', status: 'normal' },
        c10_2: { value: 7, normal: '0 - 0.08', status: 'normal' },
        c12: { value: 42, normal: '0.017 - 0.29', status: 'normal' },
        c12_1: { value: 0.02, normal: '0.01 - 0.27', status: 'normal' },
        c14: { value: 0.1, normal: '0.06 - 0.5', status: 'normal' },
        c14_1: { value: 0.02, normal: '0.02 - 0.37', status: 'normal' },
        c14_2: { value: 0.01, normal: '0 - 0.06', status: 'normal' },
        c14oh: { value: 5, normal: '0 - 0.04', status: 'normal' },
        c16: { value: 0.9, normal: '0.8 - 6.7', status: 'normal' },
        c16_1: { value: 0.04, normal: '0.04 - 0.54', status: 'normal' },
        c16_1oh: { value: 0.03, normal: '0.01 - 0.13', status: 'normal' },
        c16oh: { value: 0.01, normal: '0 - 0.06', status: 'normal' },
        c18: { value: 0.39, normal: '0.23 - 1.97', status: 'normal' },
        c18_1: { value: 0.5, normal: '0.5 - 2.5', status: 'normal' },
        c18_1oh: { value: 0.01, normal: '0 - 0.05', status: 'normal' },
        c18_2: { value: 0.13, normal: '0.06 - 0.56', status: 'normal' },
        c18oh: { value: 0, normal: '0 - 0.03', status: 'normal' },
        c18_2oh: { value: 0.01, normal: '0 - 0.04', status: 'normal' },
        c20: { value: 0.01, normal: '0.01 - 0.11', status: 'normal' },
        c22: { value: 0.01, normal: '0 - 0.02', status: 'normal' },
        c24: { value: 0.01, normal: '0 - 0.06', status: 'normal' },
        c26: { value: 0.01, normal: '0 - 0.03', status: 'normal' },
        ado: { value: 0.65, normal: '0.21 - 3.14', status: 'normal' },
        d_ado: { value: 0.02, normal: '0 - 0.05', status: 'normal' },
        c20_0_lpc: { value: 0.5, normal: '0.05 - 1.77', status: 'normal' },
        c22_0_lpc: { value: 0.67, normal: '0.03 - 1.5', status: 'normal' },
        c24_0_lpc: { value: 0.95, normal: '0.08 - 2.78', status: 'normal' },
        c26_0_lpc: { value: 0.37, normal: '0.03 - 0.75', status: 'normal' },
        lv_pt_ratio: { value: 2.54, normal: '0.66 - 2.72', status: 'normal' },
        cit_arg_ratio: { value: 9.3, normal: '0.3 - 19.9', status: 'normal' },
        cit_phe_ratio: { value: 0.4, normal: '0.07 - 0.72', status: 'normal' },
        carnitine_cit_ratio: { value: 2.46, normal: '1.53 - 8.75', status: 'normal' },
        c14_1_c12_1_ratio: { value: 1.47, normal: '0.9 - 5', status: 'normal' },
        leu_phe_ratio: { value: 3.00, normal: '0.63 - 3.74', status: 'normal' },
        met_leu_ratio: { value: 0.16, normal: '0.02 - 0.66', status: 'normal' },
        met_phe_ratio: { value: 0.61, normal: '0.17 - 0.74', status: 'normal' },
        phe_tyr_ratio: { value: 0.57, normal: '0.16 - 1.6', status: 'normal' },
        tyr_leu_ratio: { value: 0.46, normal: '0.13 - 2.64', status: 'normal' },
        tyr_met_ratio: { value: 2.91, normal: '1.86 - 16.06', status: 'normal' },
        val_phe_ratio: { value: 2.97, normal: '0.58 - 3.5', status: 'normal' },
        c3_met_ratio: { value: 0.03, normal: '0.01 - 0.25', status: 'normal' },
        c3_c2_ratio: { value: 0.15, normal: '0.01 - 0.34', status: 'normal' },
        c3_c16_ratio: { value: 1.22, normal: '0.19 - 1.35', status: 'normal' },
        c3dc_c4oh_c8_ratio: { value: 1.48, normal: '0.29 - 5.25', status: 'normal' },
        c0_c16_c18_ratio: { value: 10.4, normal: '1.88 - 12.16', status: 'normal' },
        c4dc_c5oh_c8_ratio: { value: 8.61, normal: '1.38 - 12.6', status: 'normal' },
        c8_c10_ratio: { value: 0.66, normal: '0.4 - 2.3', status: 'normal' },
        c8_c2_ratio: { value: 2, normal: '0 - 0.01', status: 'normal' },
        c5dc_c6oh_c8_ratio: { value: 2.58, normal: '0.14 - 9', status: 'normal' },
        c16_c18_1_c2_ratio: { value: 0.15, normal: '0.16 - 0.89', status: 'low' }
      },
      doctorConclusion: ''
    },
    {
      id: 2,
      testCode: 'y12345679',
      patientName: 'Hoàng Thị BB',
      birthDate: '03/08/2025',
      testDate: '03/07/2025',
      result: 'negative',
      phone: '0975 246 813',
      branch: 'Chi nhánh Hà Nội',
      analysisDate: '03/07/2025',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      diagnosis: 'Bình thường',
      diseaseCode: null,
      biomarkers: {
        ala: { value: 166, normal: '117 - 541', status: 'normal' },
        arg: { value: 5.7, normal: '0.9 - 32', status: 'normal' },
        cit: { value: 15.9, normal: '4 - 29', status: 'normal' },
        gln: { value: 405, normal: '88 - 901', status: 'normal' },
        glu: { value: 331, normal: '62 - 797', status: 'normal' },
        gly: { value: 365, normal: '184 - 837', status: 'normal' },
        leu: { value: 87, normal: '53 - 260', status: 'normal' },
        met: { value: 20.2, normal: '5.6 - 40.1', status: 'normal' },
        orn: { value: 68, normal: '14 - 194', status: 'normal' },
        phe: { value: 55, normal: '23 - 97', status: 'normal' },
        pro: { value: 141, normal: '73 - 264', status: 'normal' },
        tyr: { value: 100, normal: '15 - 358', status: 'normal' },
        val: { value: 76, normal: '51 - 212', status: 'normal' },
        c0: { value: 25.2, normal: '7.5 - 59', status: 'normal' },
        c2: { value: 17.5, normal: '4.6 - 52', status: 'normal' },
        c3: { value: 2.66, normal: '0.36 - 4.93', status: 'normal' },
        c3dc_c4oh: { value: 0.07, normal: '0 - 0.33', status: 'normal' },
        c4: { value: 0.28, normal: '0.05 - 0.7', status: 'normal' },
        c4dc_c5oh: { value: 0.18, normal: '0.07 - 0.45', status: 'normal' },
        c5: { value: 0.14, normal: '0.03 - 0.33', status: 'normal' },
        c5dc_c6oh: { value: 0.12, normal: '0.02 - 0.18', status: 'normal' },
        c5_1: { value: 0.02, normal: '0 - 0.08', status: 'normal' },
        c6: { value: 0.12, normal: '0.007 - 0.12', status: 'normal' },
        c6dc: { value: 0.08, normal: '0.02 - 0.25', status: 'normal' },
        c8: { value: 0.21, normal: '0.013 - 0.21', status: 'normal' },
        c8_1: { value: 0.07, normal: '0 - 0.22', status: 'normal' },
        c10: { value: 0.24, normal: '0.015 - 0.24', status: 'normal' },
        c10_1: { value: 0.08, normal: '0 - 0.08', status: 'normal' },
        c10_2: { value: 0.01, normal: '0 - 0.08', status: 'normal' },
        c12: { value: 132, normal: '0.017 - 0.29', status: 'normal' },
        c12_1: { value: 0.1, normal: '0.01 - 0.27', status: 'normal' },
        c14: { value: 0.27, normal: '0.06 - 0.5', status: 'normal' },
        c14_1: { value: 0.16, normal: '0.02 - 0.37', status: 'normal' },
        c14_2: { value: 0.03, normal: '0 - 0.06', status: 'normal' },
        c14oh: { value: 16, normal: '0 - 0.04', status: 'normal' },
        c16: { value: 4.3, normal: '0.8 - 6.7', status: 'normal' },
        c16_1: { value: 0.33, normal: '0.04 - 0.54', status: 'normal' },
        c16_1oh: { value: 0.05, normal: '0.01 - 0.13', status: 'normal' },
        c16oh: { value: 0.02, normal: '0 - 0.06', status: 'normal' },
        c18: { value: 1.2, normal: '0.23 - 1.97', status: 'normal' },
        c18_1: { value: 1.2, normal: '0.5 - 2.5', status: 'normal' },
        c18_1oh: { value: 0.03, normal: '0 - 0.05', status: 'normal' },
        c18_2: { value: 0.16, normal: '0.06 - 0.56', status: 'normal' },
        c18oh: { value: 0.01, normal: '0 - 0.03', status: 'normal' },
        c18_2oh: { value: 0.01, normal: '0 - 0.04', status: 'normal' },
        c20: { value: 0.02, normal: '0.01 - 0.11', status: 'normal' },
        c22: { value: 0.01, normal: '0 - 0.02', status: 'normal' },
        c24: { value: 0.01, normal: '0 - 0.06', status: 'normal' },
        c26: { value: 0, normal: '0 - 0.03', status: 'normal' },
        ado: { value: '01.07', normal: '0.21 - 3.14', status: 'normal' },
        d_ado: { value: 0.02, normal: '0 - 0.05', status: 'normal' },
        c20_0_lpc: { value: 0.32, normal: '0.05 - 1.77', status: 'normal' },
        c22_0_lpc: { value: 0.42, normal: '0.03 - 1.5', status: 'normal' },
        c24_0_lpc: { value: 1, normal: '0.08 - 2.78', status: 'normal' },
        c26_0_lpc: { value: 0.3, normal: '0.03 - 0.75', status: 'normal' },
        lv_pt_ratio: { value: '01.05', normal: '0.66 - 2.72', status: 'normal' },
        cit_arg_ratio: { value: 2.8, normal: '0.3 - 19.9', status: 'normal' },
        cit_phe_ratio: { value: 0.29, normal: '0.07 - 0.72', status: 'normal' },
        carnitine_cit_ratio: { value: 3.78, normal: '1.53 - 8.75', status: 'normal' },
        c14_1_c12_1_ratio: { value: 1.63, normal: '0.9 - 5', status: 'normal' },
        leu_phe_ratio: { value: 1.58, normal: '0.63 - 3.74', status: 'normal' },
        met_leu_ratio: { value: 0.23, normal: '0.02 - 0.66', status: 'normal' },
        met_phe_ratio: { value: 0.37, normal: '0.17 - 0.74', status: 'normal' },
        phe_tyr_ratio: { value: 0.55, normal: '0.16 - 1.6', status: 'normal' },
        tyr_leu_ratio: { value: 1.14, normal: '0.13 - 2.64', status: 'normal' },
        tyr_met_ratio: { value: 4.95, normal: '1.86 - 16.06', status: 'normal' },
        val_phe_ratio: { value: 1.29, normal: '0.58 - 3.5', status: 'normal' },
        c3_met_ratio: { value: 0.12, normal: '0.01 - 0.25', status: 'normal' },
        c3_c2_ratio: { value: 0.17, normal: '0.01 - 0.34', status: 'normal' },
        c3_c16_ratio: { value: 0.6, normal: '0.19 - 1.35', status: 'normal' },
        c3dc_c4oh_c8_ratio: { value: 0.29, normal: '0.29 - 5.25', status: 'normal' },
        c0_c16_c18_ratio: { value: 4.33, normal: '1.88 - 12.16', status: 'normal' },
        c4dc_c5oh_c8_ratio: { value: 1.38, normal: '1.38 - 12.6', status: 'normal' },
        c8_c10_ratio: { value: 0.96, normal: '0.4 - 2.3', status: 'normal' },
        c8_c2_ratio: { value: 0.01, normal: '0 - 0.01', status: 'normal' },
        c5dc_c6oh_c8_ratio: { value: 0.47, normal: '0.14 - 9', status: 'normal' },
        c16_c18_1_c2_ratio: { value: 0.28, normal: '0.16 - 0.89', status: 'normal' }
      },
      doctorConclusion: ''
    },
    {
      id: 3,
      testCode: 'DEF789012',
      patientName: 'Lê Văn C',
      birthDate: '1992-11-08',
      testDate: '2024-01-13',
      result: 'negative',
      phone: '0912345678',
      branch: 'Chi nhánh Đà Nẵng',
      analysisDate: '2024-01-13',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      diagnosis: 'Bình thường',
      diseaseCode: null,
      biomarkers: {
        glucose: { value: 95, normal: '70-100', status: 'normal', tier: 1 },
        cholesterol: { value: 185, normal: '<200', status: 'normal', tier: 2 }
      },
      doctorConclusion: ''
    }
  ]);

  const handleReAnalyze = (testResult: any) => {
    toast({
      title: "Phân tích lại",
      description: `Đang phân tích lại xét nghiệm ${testResult.testCode}`,
    });
    console.log('Re-analyzing test:', testResult.testCode);
  };

  const handleDownloadDetails = async (testResult: any) => {
    try {
      const pdfGen = new PdfGenerator();
      
      // Title
      pdfGen.addTitle('BÁO CÁO KẾT QUẢ XÉT NGHIỆM');
      
      // Patient Information
      const patientInfo = {
        sampleId: testResult.testCode,
        patientName: testResult.patientName,
        birthDate: testResult.birthDate,
        phone: testResult.phone,
        branch: testResult.branch,
        testDate: testResult.testDate,
        analysisDate: testResult.analysisDate
      };
      pdfGen.formatPatientInfo(patientInfo);
      
      // Results Section
      pdfGen.addSectionHeader('KẾT QUẢ:');
      const resultText = testResult.result === 'positive' ? 'Dương tính' : 'Âm tính';
      pdfGen.addLabelValue('Kết quả', resultText);
      pdfGen.addLabelValue('Chẩn đoán', testResult.diagnosis);
      
      pdfGen.addSpace();
      
      // Convert biomarkers object to array for the new format
      const biomarkersArray = Object.entries(testResult.biomarkers).map(([key, marker]: [string, any]) => ({
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
      
      // Doctor Conclusion Section
      pdfGen.addSectionHeader('KẾT LUẬN BÁC SĨ:');
      const conclusion = testResult.doctorConclusion || 'Chưa có kết luận';
      pdfGen.addText(conclusion);
      
      // Generate and download PDF
      await pdfGen.downloadPdf(`BaoCao_${testResult.testCode}.pdf`);
      
      toast({
        title: "Tải xuống thành công",
        description: `Báo cáo xét nghiệm ${testResult.testCode} đã được tải xuống PDF với font tiếng Việt`,
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

  const handleViewTestDetails = (testResult: any) => {
    setSelectedTest(testResult);
  };

  // Filter test results by account code for collaborators
  const filteredTestResults = testResults.filter(test => {
    const matchesSearch = test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For collaborators, only show tests with their account code
    if (isCollaborator) {
      return matchesSearch && test.accountCode === 'COL001';
    }
    
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTestResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTestResults = filteredTestResults.slice(startIndex, endIndex);

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý xét nghiệm</h2>
          {isCollaborator && (
            <p className="text-sm text-slate-600 mt-1">
              Hiển thị xét nghiệm được phân công cho tài khoản: COL001
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
              placeholder="Tìm kiếm theo tên hoặc mã số mẫu..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách xét nghiệm
            {isCollaborator && (
              <Badge variant="outline" className="ml-2">
                {filteredTestResults.length} xét nghiệm được phân công
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã số mẫu</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Ngày XN</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Chi nhánh</TableHead>
                <TableHead>Ngày phân tích</TableHead>
                <TableHead>Phân tích lại</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTestResults.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-mono text-sm">{test.testCode}</TableCell>
                  <TableCell className="font-medium">{test.patientName}</TableCell>
                  <TableCell>{test.birthDate}</TableCell>
                  <TableCell>{test.testDate}</TableCell>
                  <TableCell>
                    <Badge variant={test.result === 'positive' ? "destructive" : "secondary"}>
                      {test.result === 'positive' ? 'Dương tính' : 'Âm tính'}
                    </Badge>
                  </TableCell>
                  <TableCell>{test.phone}</TableCell>
                  <TableCell>{test.branch}</TableCell>
                  <TableCell>{test.analysisDate}</TableCell>
                  <TableCell>
                    {!isCollaborator && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReAnalyze(test)}
                      >
                        <Activity className="h-3 w-3 mr-1" />
                        Phân tích lại
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewTestDetails(test)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Xem
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadDetails(test)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Tải
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-slate-600">
                Hiển thị {startIndex + 1} đến {Math.min(endIndex, filteredTestResults.length)} của {filteredTestResults.length} kết quả xét nghiệm
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Result Details Dialog */}
      {selectedTest && (
        <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Chi tiết xét nghiệm: {selectedTest.testCode} - {selectedTest.patientName}
              </DialogTitle>
            </DialogHeader>
            <TestResultDetails testResult={selectedTest} userRole={userRole} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
