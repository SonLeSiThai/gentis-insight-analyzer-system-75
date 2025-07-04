import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { PdfGenerator } from '@/lib/pdfGenerator';
import { Download, FileText, Calendar, User, Phone, MapPin, Activity, Info, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BIOMARKER_LIST, generateDefaultBiomarkers } from '@/data/biomarkers';

interface TestResultDetailsProps {
  testResult: {
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
  };
  userRole: string;
}

export const TestResultDetails = ({ testResult, userRole }: TestResultDetailsProps) => {
  const [showConclusionDialog, setShowConclusionDialog] = useState(false);
  const [conclusion, setConclusion] = useState(testResult.doctorConclusion);
  const [showDiseaseDialog, setShowDiseaseDialog] = useState(false);
  const [diseaseViewType, setDiseaseViewType] = useState<'detail' | 'summary'>('detail');
  const { toast } = useToast();
  const isCollaborator = userRole === 'collaborator';

  // Mock doctor phone for the test result
  const doctorPhone = '0987 654 321';

  // Mock additional patient data based on test code
  const getAdditionalPatientData = () => {
    if (testResult.testCode === 'y12345678') {
      return {
        gender: 'Nữ',
        gestationalAge: 39, // weeks
        birthWeight: 3800, // grams
        twinStatus: 'Sinh đơn', // đôi/đơn
        ivfStatus: 'Có', // có/không
        address: 'Hà Nội',
        antibioticUse: 'Không', // có/không
        breastfeeding: 'Có', // có/không
        sampleCode: testResult.testCode,
        sampleCollectionDate: '03/05/2025',
        sampleReceiptDate: '03/05/2025'
      };
    } else if (testResult.testCode === 'y12345679') {
      return {
        gender: 'Nữ',
        gestationalAge: 39, // weeks
        birthWeight: 3700, // grams
        twinStatus: 'Sinh đơn', // đôi/đơn
        ivfStatus: 'Có', // có/không
        address: 'Hà Nội',
        antibioticUse: 'Không', // có/không
        breastfeeding: 'Có', // có/không
        sampleCode: testResult.testCode,
        sampleCollectionDate: '03/06/2025',
        sampleReceiptDate: '03/06/2025',
        doctorPhone: '0908 631 472'
      };
    }
    // Default data for other tests
    return {
      gender: 'Nữ',
      gestationalAge: 39, // weeks
      birthWeight: 3800, // grams
      twinStatus: 'Sinh đơn', // đôi/đơn
      ivfStatus: 'Có', // có/không
      address: 'Hà Nội',
      antibioticUse: 'Không', // có/không
      breastfeeding: 'Có', // có/không
      sampleCode: testResult.testCode,
      sampleCollectionDate: '03/05/2025',
      sampleReceiptDate: '03/05/2025'
    };
  };

  const additionalPatientData = getAdditionalPatientData();

  // Mock disease data matching your disease list
  const diseaseInfo = {
    D001: {
      name: 'Isovaleric acidemia (isovaleryl-CoA dehydrogenase)',
      description: 'Rối loạn chuyển hóa axit amin do thiếu hụt enzyme isovaleryl-CoA dehydrogenase, dẫn đến tích tụ axit isovaleric.',
      symptoms: ['Mùi chân đặc trưng', 'Nôn mửa', 'Hôn mê', 'Chậm phát triển'],
      diagnosis: 'Xét nghiệm tandem mass spectrometry, phát hiện tăng C5 (isovalerylcarnitine)',
      treatment: 'Chế độ ăn hạn chế leucine, bổ sung glycine và carnitine',
      summary: 'Bệnh chuyển hóa hiếm gặp do thiếu enzyme isovaleryl-CoA dehydrogenase, có thể gây nguy hiểm tính mạng nếu không điều trị.'
    },
    D002: {
      name: 'Glutaric acidemia type I (glutaryl-CoA dehydrogenase)',
      description: 'Rối loạn chuyển hóa do thiếu hụt enzyme glutaryl-CoA dehydrogenase, gây tích tụ axit glutaric.',
      symptoms: ['Đầu to', 'Chậm phát triển vận động', 'Rối loạn thần kinh', 'Co giật'],
      diagnosis: 'Xét nghiệm tandem MS, tăng glutarylcarnitine, phân tích nước tiểu',
      treatment: 'Chế độ ăn hạn chế lysine và tryptophan, bổ sung carnitine và riboflavin',
      summary: 'Bệnh chuyển hóa ảnh hưởng đến não bộ, cần chẩn đoán và điều trị sớm để tránh tổn thương não vĩnh viễn.'
    }
  };

  // Generate full biomarker data with your 77 biomarkers
  const fullBiomarkers = generateDefaultBiomarkers();
  
  // Merge with existing data
  Object.keys(testResult.biomarkers).forEach(key => {
    if (fullBiomarkers[key]) {
      fullBiomarkers[key] = testResult.biomarkers[key];
    }
  });

  const handleSaveConclusion = () => {
    toast({
      title: "Lưu kết luận thành công",
      description: "Kết luận của bác sĩ đã được cập nhật",
    });
    setShowConclusionDialog(false);
  };

  const handleReAnalyze = () => {
    toast({
      title: "Phân tích lại",
      description: `Đang phân tích lại xét nghiệm ${testResult.testCode}`,
    });
  };

  const handleDownloadReport = async () => {
    const additionalPatientData = {
      gender: 'Nữ',
      gestationalAge: 39,
      birthWeight: 3800,
      twinStatus: 'Sinh đơn',
      ivfStatus: 'Có',
      address: 'Chi nhánh Hà Nội',
      antibioticUse: 'Bình thường',
      breastfeeding: 'Dùng sữa mẹ',
      sampleCode: testResult.testCode,
      sampleCollectionDate: '02/07/2025',
      sampleReceiptDate: '02/07/2025',
      doctorPhone: '0901 234 567'
    };

    const doctorPhone = userRole === 'collaborator' ? '0901 234 567' : '0123 456 789';

    const fullBiomarkers = generateDefaultBiomarkers();
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
      
      // Title
      pdfGen.addTitle('BÁO CÁO XÉT NGHIỆM CHI TIẾT');
      
      // Section A - Test Information
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
      
      // Section B - Biomarkers (all 77)
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
      
      // Section C - Analysis Results
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
    
    // Section D - Diagnosis
      pdfGen.addSectionHeader('D. KẾT QUẢ CHẨN ĐOÁN:');
      pdfGen.addLabelValue('Kết quả xét nghiệm', testResult.result === 'positive' ? 'Dương tính' : 'Âm tính');
      pdfGen.addLabelValue('Chẩn đoán', testResult.diagnosis);
    if (testResult.diseaseCode) {
        pdfGen.addLabelValue('Mã bệnh', testResult.diseaseCode);
    }
      
      pdfGen.addSpace();
    
    // Section E - Doctor Conclusion
      pdfGen.addSectionHeader('E. KẾT LUẬN CỦA BÁC SĨ:');
      pdfGen.addText(testResult.doctorConclusion || 'Chưa có kết luận từ bác sĩ');
      
      // Generate and download PDF
      await pdfGen.downloadPdf(`BaoCao_ChiTiet_${testResult.testCode}.pdf`);
    
    toast({
      title: "Tải xuống thành công",
      description: `Báo cáo chi tiết ${testResult.testCode} đã được tải xuống PDF`,
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

  const disease = testResult.diseaseCode ? diseaseInfo[testResult.diseaseCode as keyof typeof diseaseInfo] : null;

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Thông tin xét nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Thông tin bệnh nhi */}
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                🔹 THÔNG TIN BỆNH NHI
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Họ và tên:</span>
                    <span className="ml-2 font-medium">{testResult.patientName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Ngày sinh:</span>
                    <span className="ml-2">{testResult.birthDate}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Giới tính:</span>
                    <span className="ml-2">{additionalPatientData.gender}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Số tuổi thai lúc sinh:</span>
                    <span className="ml-2">
                      {additionalPatientData.gestationalAge >= 38 ? 'Đủ tháng' : 'Thiếu tháng'} 
                      ({additionalPatientData.gestationalAge >= 38 ? '≥' : '<'} 38 tuần)
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Cân nặng lúc sinh:</span>
                    <span className="ml-2">{additionalPatientData.birthWeight}g</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Sinh đôi/đơn:</span>
                    <span className="ml-2">{additionalPatientData.twinStatus}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Thai IVF:</span>
                    <span className="ml-2">{additionalPatientData.ivfStatus}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Địa chỉ:</span>
                    <span className="ml-2">{additionalPatientData.address}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Số điện thoại bố/mẹ:</span>
                    <span className="ml-2">{testResult.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Số điện thoại bác sĩ chỉ định:</span>
                    <span className="ml-2">{additionalPatientData.doctorPhone || doctorPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin dinh dưỡng & điều trị */}
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                🔹 THÔNG TIN DINH DƯỠNG & ĐIỀU TRỊ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                <div>
                  <span className="font-medium text-slate-700">Tình trạng dùng kháng sinh:</span>
                  <span className="ml-2">{additionalPatientData.antibioticUse}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Dùng sữa mẹ:</span>
                  <span className="ml-2">{additionalPatientData.breastfeeding}</span>
                </div>
              </div>
            </div>

            {/* Thông tin xét nghiệm */}
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
                🔹 THÔNG TIN XÉT NGHIỆM
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Mã số mẫu:</span>
                    <span className="ml-2 font-mono text-red-600 font-medium">{testResult.testCode}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Ngày lấy mẫu:</span>
                    <span className="ml-2">{additionalPatientData.sampleCollectionDate}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Ngày nhận mẫu:</span>
                    <span className="ml-2">{additionalPatientData.sampleReceiptDate}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Ngày xét nghiệm:</span>
                    <span className="ml-2">{testResult.testDate}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Kết quả:</span>
                    <span className="ml-2">
                      <Badge variant={testResult.result === 'positive' ? "destructive" : "secondary"}>
                        {testResult.result === 'positive' ? 'Dương tính' : 'Âm tính'}
                      </Badge>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <div className="flex space-x-2">
              {!isCollaborator && (
                <Button onClick={handleReAnalyze} variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Phân tích lại
                </Button>
              )}
              {!isCollaborator && (
                <Button onClick={() => setShowConclusionDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  {testResult.doctorConclusion ? 'Sửa kết luận' : 'Nhập kết luận'}
                </Button>
              )}
            </div>
            <Button onClick={handleDownloadReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Tải báo cáo chi tiết
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results and Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Kết quả xét nghiệm và chẩn đoán
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Chẩn đoán:</h3>
                <p className="text-blue-700 text-lg">{testResult.diagnosis}</p>
              </div>
              {disease && (
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setDiseaseViewType('detail');
                      setShowDiseaseDialog(true);
                    }}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Chi tiết
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setDiseaseViewType('summary');
                      setShowDiseaseDialog(true);
                    }}
                  >
                    <Info className="h-3 w-3 mr-1" />
                    Tóm tắt
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* All 77 Biomarkers Table */}
          <div>
            <h4 className="font-medium mb-3">Chi tiết 77 chỉ số sinh học:</h4>
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Chỉ số</TableHead>
                    <TableHead>Kết quả</TableHead>
                    <TableHead>Khoảng tham chiếu</TableHead>
                    <TableHead>Nhận định</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BIOMARKER_LIST.map((biomarker, index) => {
                    const key = biomarker.code.toLowerCase();
                    const marker = fullBiomarkers[key];
                    return (
                      <TableRow key={biomarker.id}>
                        <TableCell className="text-sm text-slate-600">{index + 1}</TableCell>
                        <TableCell className="font-medium text-sm">{biomarker.name}</TableCell>
                        <TableCell className="font-semibold">{marker.value || '--'}</TableCell>
                        <TableCell className="text-slate-600 text-sm">{marker.normal}</TableCell>
                        <TableCell>
                          <Badge variant={
                            marker.status === 'high' ? "destructive" : 
                            marker.status === 'low' ? "secondary" : "outline"
                          }>
                            {marker.status === 'high' ? 'Tăng' : 
                             marker.status === 'low' ? 'Giảm' : 'Trong ngưỡng'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Doctor's Conclusion */}
          {testResult.doctorConclusion && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Kết luận bác sĩ:</h4>
              <p className="text-green-700">{testResult.doctorConclusion}</p>
            </div>
          )}

          {!testResult.doctorConclusion && !isCollaborator && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Chưa có kết luận từ bác sĩ. Vui lòng nhập kết luận cho xét nghiệm này.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctor Conclusion Dialog */}
      {showConclusionDialog && (
        <Dialog open={showConclusionDialog} onOpenChange={setShowConclusionDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Kết luận cho xét nghiệm {testResult.testCode}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kết luận của bác sĩ:
                </label>
                <Textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Nhập kết luận của bác sĩ..."
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSaveConclusion}
                  disabled={!conclusion.trim()}
                >
                  Lưu kết luận
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConclusionDialog(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Disease Info Dialog */}
      {disease && showDiseaseDialog && (
        <Dialog open={showDiseaseDialog} onOpenChange={setShowDiseaseDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {diseaseViewType === 'detail' ? 'Chi tiết' : 'Tóm tắt'}: {disease.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {diseaseViewType === 'detail' ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Mô tả:</h3>
                    <p className="text-slate-700">{disease.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Triệu chứng:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {disease.symptoms.map((symptom: string, index: number) => (
                        <li key={index} className="text-slate-700">{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Chẩn đoán:</h3>
                    <p className="text-slate-700">{disease.diagnosis}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Điều trị:</h3>
                    <p className="text-slate-700">{disease.treatment}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-2">Tóm tắt:</h3>
                  <p className="text-slate-700">{disease.summary}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
