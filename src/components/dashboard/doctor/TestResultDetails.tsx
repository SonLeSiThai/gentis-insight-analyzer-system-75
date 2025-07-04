
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { PdfGenerator, PatientInfo, BiomarkerResult } from '@/lib/pdfGenerator';
import { Download, FileText, Info, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResultDetailsProps {
  result: any;
  onClose: () => void;
  userRole: string;
}

// Disease catalog - same as in DiseaseView component
const diseasesCatalog = [
  {
    id: 1,
    code: 'D001',
    name: 'Isovaleric acidemia (isovaleryl-CoA dehydrogenase)',
    classification: 'Rối loạn chuyển hóa axit amin',
    description: 'Rối loạn chuyển hóa axit amin do thiếu hụt enzyme isovaleryl-CoA dehydrogenase, dẫn đến tích tụ axit isovaleric.',
    symptoms: ['Mùi chân đặc trưng', 'Nôn mửa', 'Hôn mê', 'Chậm phát triển'],
    diagnosis: 'Xét nghiệm tandem mass spectrometry, phát hiện tăng C5 (isovalerylcarnitine)',
    treatment: 'Chế độ ăn hạn chế leucine, bổ sung glycine và carnitine',
    summary: 'Bệnh chuyển hóa hiếm gặp do thiếu enzyme isovaleryl-CoA dehydrogenase, có thể gây nguy hiểm tính mạng nếu không điều trị.'
  },
  {
    id: 2,
    code: 'D002',
    name: 'Glutaric acidemia type I (glutaryl-CoA dehydrogenase)',
    classification: 'Rối loạn chuyển hóa axit amin',
    description: 'Rối loạn chuyển hóa do thiếu hụt enzyme glutaryl-CoA dehydrogenase, gây tích tụ axit glutaric.',
    symptoms: ['Đầu to', 'Chậm phát triển vận động', 'Rối loạn thần kinh', 'Co giật'],
    diagnosis: 'Xét nghiệm tandem MS, tăng glutarylcarnitine, phân tích nước tiểu',
    treatment: 'Chế độ ăn hạn chế lysine và tryptophan, bổ sung carnitine và riboflavin',
    summary: 'Bệnh chuyển hóa ảnh hưởng đến não bộ, cần chẩn đoán và điều trị sớm để tránh tổn thương não vĩnh viễn.'
  },
  {
    id: 3,
    code: 'D003',
    name: 'Argininemia (arginase deficiency)',
    classification: 'Rối loạn chuyển hóa axit amin',
    description: 'Rối loạn chuyển hóa do thiếu hụt enzyme arginase, dẫn đến tích tụ arginine trong máu.',
    symptoms: ['Chậm phát triển trí tuệ', 'Co cứng cơ', 'Rối loạn vận động', 'Thiểu năng trí tuệ'],
    diagnosis: 'Tăng arginine trong máu và nước tiểu, giảm hoạt tính enzyme arginase',
    treatment: 'Chế độ ăn hạn chế protein, đặc biệt là arginine',
    summary: 'Rối loạn chu trình ure hiếm gặp, tiến triển chậm nhưng có thể gây tổn thương não vĩnh viễn.'
  }
];

export const TestResultDetails: React.FC<TestResultDetailsProps> = ({ result, onClose, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedConclusion, setEditedConclusion] = useState(result.doctorConclusion || '');
  const [selectedDiseaseDialog, setSelectedDiseaseDialog] = useState<any>(null);
  const [viewType, setViewType] = useState<'detail' | 'summary'>('detail');
  const { toast } = useToast();

  // Find disease information from catalog based on diagnosis
  const getDiseaseInfo = (diagnosisName: string) => {
    if (diagnosisName === 'Bình thường') return null;
    
    return diseasesCatalog.find(disease => 
      disease.name.toLowerCase().includes(diagnosisName.toLowerCase()) ||
      diagnosisName.toLowerCase().includes(disease.name.toLowerCase())
    );
  };

  const diseaseInfo = getDiseaseInfo(result.diagnosis);

  const handleSaveConclusion = () => {
    // In a real app, this would save to backend
    result.doctorConclusion = editedConclusion;
    setIsEditing(false);
    toast({
      title: "Đã lưu kết luận",
      description: "Kết luận của bác sĩ đã được cập nhật thành công",
    });
  };

  const handleViewDiseaseInfo = (type: 'detail' | 'summary') => {
    if (diseaseInfo) {
      setSelectedDiseaseDialog(diseaseInfo);
      setViewType(type);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const pdfGenerator = new PdfGenerator();
      
      pdfGenerator.addTitle('KẾT QUẢ XÉT NGHIỆM SÀNG LỌC SƠ SINH');
      
      const patientInfo: PatientInfo = {
        sampleId: result.sampleId,
        patientName: result.patientName,
        birthDate: result.birthDate,
        phone: result.phone,
        branch: result.branch,
        testDate: result.testDate,
        analysisDate: result.analysisDate
      };
      
      pdfGenerator.formatPatientInfo(patientInfo);
      
      if (result.biomarkers && result.biomarkers.length > 0) {
        const biomarkers: BiomarkerResult[] = result.biomarkers.map((b: any) => ({
          name: b.name,
          value: b.value,
          unit: b.unit || '',
          status: b.status,
          normalRange: b.normalRange
        }));
        
        pdfGenerator.formatBiomarkers(biomarkers);
      }
      
      pdfGenerator.addSectionHeader('KẾT QUẢ CHẨN ĐOÁN:');
      pdfGenerator.addLabelValue('Chẩn đoán', result.diagnosis);
      
      if (result.doctorConclusion) {
        pdfGenerator.addSectionHeader('KẾT LUẬN BÁC SĨ:');
        pdfGenerator.addText(result.doctorConclusion);
      }
      
      await pdfGenerator.downloadPdf(`KetQuaXetNghiem_${result.sampleId}.pdf`);
      
      toast({
        title: "Tải xuống thành công",
        description: `Kết quả xét nghiệm ${result.sampleId} đã được tải xuống PDF`,
      });
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Lỗi tải xuống",
        description: "Không thể tải xuống PDF. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Thông tin bệnh nhân
            <Button onClick={handleDownloadPdf} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Tải PDF
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Mã mẫu:</strong> {result.sampleId}
            </div>
            <div>
              <strong>Họ tên:</strong> {result.patientName}
            </div>
            <div>
              <strong>Ngày sinh:</strong> {result.birthDate}
            </div>
            <div>
              <strong>Số điện thoại:</strong> {result.phone}
            </div>
            <div>
              <strong>Chi nhánh:</strong> {result.branch}
            </div>
            <div>
              <strong>Ngày xét nghiệm:</strong> {result.testDate}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {result.biomarkers && result.biomarkers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả các chỉ số sinh học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">STT</th>
                    <th className="text-left p-2">Chỉ số</th>
                    <th className="text-center p-2">Kết quả</th>
                    <th className="text-center p-2">Khoảng tham chiếu</th>
                    <th className="text-center p-2">Nhận định</th>
                  </tr>
                </thead>
                <tbody>
                  {result.biomarkers.map((biomarker: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2 font-medium">{biomarker.name}</td>
                      <td className="p-2 text-center font-semibold">{biomarker.value}</td>
                      <td className="p-2 text-center text-gray-600">{biomarker.normalRange}</td>
                      <td className="p-2 text-center">
                        <Badge 
                          variant={
                            biomarker.status === 'Tăng' ? 'destructive' :
                            biomarker.status === 'Giảm' ? 'secondary' :
                            'default'
                          }
                        >
                          {biomarker.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle>Kết quả chẩn đoán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Chẩn đoán:</strong> {result.diagnosis}
            </div>
            
            {diseaseInfo && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-800">Thông tin về bệnh:</h4>
                <div className="space-y-2">
                  <div><strong>Mã bệnh:</strong> {diseaseInfo.code}</div>
                  <div><strong>Phân loại:</strong> {diseaseInfo.classification}</div>
                  <div className="flex space-x-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDiseaseInfo('detail')}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Xem chi tiết
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDiseaseInfo('summary')}
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Xem tóm tắt
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Doctor's Conclusion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Kết luận của bác sĩ
            {userRole === 'doctor' && (
              <Button 
                onClick={() => setIsEditing(!isEditing)} 
                variant="outline" 
                size="sm"
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editedConclusion}
                onChange={(e) => setEditedConclusion(e.target.value)}
                placeholder="Nhập kết luận của bác sĩ..."
                rows={6}
              />
              <div className="flex space-x-2">
                <Button onClick={handleSaveConclusion}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <div className="min-h-[100px] p-4 bg-gray-50 rounded">
              {result.doctorConclusion || 'Chưa có kết luận của bác sĩ'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disease Information Dialog */}
      {selectedDiseaseDialog && (
        <Dialog open={!!selectedDiseaseDialog} onOpenChange={() => setSelectedDiseaseDialog(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {viewType === 'detail' ? 'Chi tiết' : 'Tóm tắt'}: {selectedDiseaseDialog.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Mã bệnh:</strong> {selectedDiseaseDialog.code}
                </div>
                <div>
                  <strong>Phân loại:</strong> {selectedDiseaseDialog.classification}
                </div>
              </div>
              
              {viewType === 'detail' ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Mô tả:</h3>
                    <p className="text-slate-700">{selectedDiseaseDialog.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Triệu chứng:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedDiseaseDialog.symptoms.map((symptom: string, index: number) => (
                        <li key={index} className="text-slate-700">{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Chẩn đoán:</h3>
                    <p className="text-slate-700">{selectedDiseaseDialog.diagnosis}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Điều trị:</h3>
                    <p className="text-slate-700">{selectedDiseaseDialog.treatment}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-2">Tóm tắt:</h3>
                  <p className="text-slate-700">{selectedDiseaseDialog.summary}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
