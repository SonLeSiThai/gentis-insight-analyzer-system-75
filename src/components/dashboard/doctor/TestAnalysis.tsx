import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import jsPDF from 'jspdf';
import { 
  Search, 
  Filter, 
  FileText, 
  Download, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Activity,
  BarChart3,
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestAnalysisProps {
  userRole: string;
}

export const TestAnalysis = ({ userRole }: TestAnalysisProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patientCodeFilter, setPatientCodeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [diseaseFilter, setDiseaseFilter] = useState<'all' | 'with' | 'without'>('all');
  const [analyzingTest, setAnalyzingTest] = useState<any>(null);
  const [finalConclusion, setFinalConclusion] = useState('');
  const isCollaborator = userRole === 'collaborator';
  const { toast } = useToast();

  const [tests] = useState([
    {
      id: 1,
      code: 'XN_240115_001',
      patientCode: 'PT001',
      patientName: 'Nguyễn Văn A',
      date: '2024-01-15',
      diagnosisTime: '2024-01-15 14:35:27',
      hasDiagnosis: true,
      diagnosis: 'Tiểu đường type 2',
      riskScore: 85,
      biomarkers: {
        glucose: { value: 180, normal: '70-100', status: 'high', tier: 1 },
        hba1c: { value: 8.5, normal: '4-6', status: 'high', tier: 1 },
        cholesterol: { value: 240, normal: '<200', status: 'high', tier: 2 }
      },
      doctorConclusion: '',
      analysisComplete: true
    },
    {
      id: 2,
      code: 'XN_240114_002',
      patientCode: 'PT002',
      patientName: 'Trần Thị B',
      date: '2024-01-14',
      diagnosisTime: '2024-01-14 10:22:15',
      hasDiagnosis: true,
      diagnosis: 'Rối loạn lipid máu',
      riskScore: 65,
      biomarkers: {
        totalCholesterol: { value: 220, normal: '<200', status: 'high', tier: 2 },
        ldl: { value: 140, normal: '<100', status: 'high', tier: 1 },
        hdl: { value: 45, normal: '>40', status: 'normal', tier: 2 }
      },
      doctorConclusion: 'Bệnh nhân cần điều chỉnh chế độ ăn uống và tăng cường vận động',
      analysisComplete: true
    },
    {
      id: 3,
      code: 'XN_240113_003',
      patientCode: 'PT003',
      patientName: 'Lê Văn C',
      date: '2024-01-13',
      diagnosisTime: '2024-01-13 16:45:33',
      hasDiagnosis: false,
      diagnosis: 'Bình thường',
      riskScore: 25,
      biomarkers: {
        glucose: { value: 95, normal: '70-100', status: 'normal', tier: 1 },
        cholesterol: { value: 185, normal: '<200', status: 'normal', tier: 2 }
      },
      doctorConclusion: '',
      analysisComplete: true
    },
    {
      id: 4,
      code: 'XN_240112_004',
      patientCode: 'PT004',
      patientName: 'Phạm Văn D',
      date: '2024-01-12',
      diagnosisTime: '',
      hasDiagnosis: true,
      diagnosis: 'Gan nhiễm mỡ',
      riskScore: 78,
      biomarkers: {
        alt: { value: 85, normal: '7-56', status: 'high', tier: 1 },
        ast: { value: 72, normal: '10-40', status: 'high', tier: 1 },
        ggt: { value: 95, normal: '9-48', status: 'high', tier: 2 }
      },
      doctorConclusion: '',
      analysisComplete: false
    }
  ]);

  const calculateRiskScore = (biomarkers: any) => {
    let tier1Count = 0;
    let tier2Count = 0;
    
    Object.values(biomarkers).forEach((marker: any) => {
      if (marker.status !== 'normal') {
        if (marker.tier === 1) tier1Count++;
        else if (marker.tier === 2) tier2Count++;
      }
    });
    
    return 10 * tier1Count + 1 * tier2Count;
  };

  const handleReAnalyze = (test: any) => {
    const newRiskScore = calculateRiskScore(test.biomarkers);
    const diagnosisTime = new Date().toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    toast({
      title: "Phân tích lại hoàn tất",
      description: `Xét nghiệm ${test.code} đã được phân tích lại. Điểm nguy cơ: ${newRiskScore}`,
    });
    
    console.log('Phân tích lại:', {
      testCode: test.code,
      oldRiskScore: test.riskScore,
      newRiskScore,
      diagnosisTime
    });
  };

  const handleSaveConclusion = (testId: number, conclusion: string) => {
    toast({
      title: "Lưu kết luận thành công",
      description: "Kết luận cuối cùng của bác sĩ đã được lưu",
    });
    
    console.log('Lưu kết luận:', { testId, conclusion });
    setAnalyzingTest(null);
    setFinalConclusion('');
  };

  const handleExportTestData = (test: any) => {
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = 20;
    
    // Title
    pdf.setFontSize(16);
    pdf.text('BAO CAO KET QUA XET NGHIEM', 20, yPosition);
    yPosition += 20;
    
    // Basic Info
    pdf.setFontSize(12);
    pdf.text('THONG TIN CO BAN:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.text(`Ma xet nghiem: ${test.code}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Ma benh nhan: ${test.patientCode}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Ten benh nhan: ${test.patientName}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Ngay xet nghiem: ${test.date}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Thoi gian chan doan: ${test.diagnosisTime || 'Chua hoan thanh'}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Chan doan: ${test.diagnosis}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Diem nguy co: ${test.riskScore}`, 20, yPosition);
    yPosition += 15;
    
    // Biomarkers
    pdf.setFontSize(12);
    pdf.text('CHI SO SINH HOC:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    Object.entries(test.biomarkers).forEach(([key, marker]: [string, any]) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(`- ${key.toUpperCase()}: ${marker.value} (BT: ${marker.normal}) - ${marker.status.toUpperCase()} [Tier ${marker.tier}]`, 20, yPosition);
      yPosition += 6;
    });
    
    yPosition += 10;
    
    // Doctor Conclusion
    pdf.setFontSize(12);
    pdf.text('KET LUAN BAC SI:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    const conclusion = test.doctorConclusion || 'Chua co ket luan';
    pdf.text(conclusion, 20, yPosition);
    yPosition += 15;
    
    // Footer
    pdf.setFontSize(8);
    pdf.text('Bao cao duoc tao boi SLSS Gentis', 20, yPosition);
    yPosition += 5;
    pdf.text(`Ngay tao: ${new Date().toLocaleString('vi-VN')}`, 20, yPosition);
    
    pdf.save(`KetQuaXetNghiem_${test.code}.pdf`);
    
    toast({
      title: "Xuất dữ liệu thành công",
      description: `Dữ liệu xét nghiệm ${test.code} đã được xuất PDF`,
    });
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatientCode = patientCodeFilter === '' || test.patientCode.includes(patientCodeFilter);
    const matchesDateRange = (!dateFilter.start || test.date >= dateFilter.start) &&
                            (!dateFilter.end || test.date <= dateFilter.end);
    const matchesDisease = diseaseFilter === 'all' ||
                          (diseaseFilter === 'with' && test.hasDiagnosis) ||
                          (diseaseFilter === 'without' && !test.hasDiagnosis);
    
    return matchesSearch && matchesPatientCode && matchesDateRange && matchesDisease;
  });

  const stats = {
    total: tests.length,
    withDisease: tests.filter(t => t.hasDiagnosis).length,
    withoutDisease: tests.filter(t => !t.hasDiagnosis).length,
    needsConclusion: tests.filter(t => !t.doctorConclusion && t.analysisComplete).length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Phân tích số liệu xét nghiệm</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Thống kê tổng quan
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Xuất toàn bộ dữ liệu
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bộ lọc và tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Mã XN hoặc tên BN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mã bệnh nhân</label>
              <Input
                placeholder="Nhập mã bệnh nhân"
                value={patientCodeFilter}
                onChange={(e) => setPatientCodeFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Từ ngày</label>
              <Input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Đến ngày</label>
              <Input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Lọc theo kết quả</label>
            <div className="flex space-x-4">
              <Button 
                variant={diseaseFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDiseaseFilter('all')}
              >
                Tất cả
              </Button>
              <Button 
                variant={diseaseFilter === 'with' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDiseaseFilter('with')}
              >
                Có bệnh
              </Button>
              <Button 
                variant={diseaseFilter === 'without' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDiseaseFilter('without')}
              >
                Không bệnh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="space-y-4">
        {filteredTests.map((test) => (
          <Card key={test.id} className="border border-slate-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{test.code}</CardTitle>
                  <p className="text-sm text-slate-600">
                    {test.patientName} ({test.patientCode}) • {test.date}
                  </p>
                  {test.diagnosisTime && (
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Thời gian chẩn đoán chính xác: {test.diagnosisTime}
                    </p>
                  )}
                  {!test.diagnosisTime && (
                    <p className="text-xs text-red-600 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Chưa hoàn thành chẩn đoán
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={test.hasDiagnosis ? "destructive" : "secondary"}>
                    {test.hasDiagnosis ? 'Có bệnh' : 'Không bệnh'}
                  </Badge>
                  <Badge variant="outline">
                    Điểm nguy cơ: {test.riskScore}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Chẩn đoán: {test.diagnosis}</p>
              </div>

              {/* Biomarkers */}
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Chỉ số sinh học</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {Object.entries(test.biomarkers).map(([key, marker]: [string, any]) => (
                    <div key={key} className={`p-2 rounded text-xs ${
                      marker.status === 'high' ? 'bg-red-50 text-red-700' :
                      marker.status === 'low' ? 'bg-blue-50 text-blue-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      <div className="flex justify-between">
                        <span className="font-medium">{key.toUpperCase()}</span>
                        <Badge variant="outline" className="text-xs">
                          Tier {marker.tier}
                        </Badge>
                      </div>
                      <p className="font-bold">{marker.value}</p>
                      <p className="text-xs opacity-70">BT: {marker.normal}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor's Conclusion */}
              {test.doctorConclusion && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-1">Kết luận bác sĩ:</p>
                  <p className="text-sm text-green-700">{test.doctorConclusion}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-2 border-t border-slate-200">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExportTestData(test)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Xuất CSV
                </Button>
                {!isCollaborator && test.analysisComplete && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleReAnalyze(test)}
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    Phân tích lại
                  </Button>
                )}
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setAnalyzingTest(test);
                    setFinalConclusion(test.doctorConclusion);
                  }}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  {test.doctorConclusion ? 'Sửa kết luận' : 'Nhập kết luận'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Doctor Conclusion Dialog */}
      {analyzingTest && (
        <Dialog open={!!analyzingTest} onOpenChange={() => setAnalyzingTest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Kết luận cuối cùng - {analyzingTest.code}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Thông tin xét nghiệm</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Bệnh nhân:</strong> {analyzingTest.patientName}</div>
                  <div><strong>Mã BN:</strong> {analyzingTest.patientCode}</div>
                  <div><strong>Ngày XN:</strong> {analyzingTest.date}</div>
                  <div><strong>Điểm nguy cơ:</strong> {analyzingTest.riskScore}</div>
                </div>
                <div className="mt-2">
                  <strong>Chẩn đoán AI:</strong> {analyzingTest.diagnosis}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kết luận cuối cùng của bác sĩ:
                </label>
                <Textarea
                  value={finalConclusion}
                  onChange={(e) => setFinalConclusion(e.target.value)}
                  placeholder="Nhập kết luận cuối cùng của bác sĩ..."
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleSaveConclusion(analyzingTest.id, finalConclusion)}
                  disabled={!finalConclusion.trim()}
                >
                  Lưu kết luận
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setAnalyzingTest(null)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
