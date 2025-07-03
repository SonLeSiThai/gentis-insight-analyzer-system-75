
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PdfGenerator, sanitizeVietnameseText, formatBiomarkers } from '@/lib/pdfGenerator';
import { 
  Upload, 
  FileText, 
  Download, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  FileSpreadsheet,
  Activity,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DataAnalysis = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Disease matrix for risk score calculation
  const diseaseMatrix = {
    tier1: ['glucose', 'hba1c', 'alt', 'ast', 'ldl'], // High impact biomarkers
    tier2: ['cholesterol', 'triglycerides', 'hdl', 'ggt', 'urea', 'creatinine'] // Medium impact biomarkers
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast({
          title: "Lỗi định dạng file",
          description: "Vui lòng chọn file CSV",
          variant: "destructive"
        });
        return;
      }
      setUploadedFile(file);
      console.log('File CSV đã chọn:', file.name, file.size);
    }
  };

  const parseCSVData = (csvContent: string) => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const patientInfoIndex = lines.findIndex(line => line.includes('Thông tin bệnh nhân'));
    
    if (patientInfoIndex === -1) {
      throw new Error('Không tìm thấy phần "Thông tin bệnh nhân" trong file');
    }

    // Parse biomarker data (before patient info)
    const biomarkerLines = lines.slice(0, patientInfoIndex);
    const headers = biomarkerLines[0].split(',');
    const biomarkerNames = headers.slice(0, 1); // First column is biomarker names
    const standardRanges = headers.slice(1, 3); // Next columns are normal ranges
    const sampleData = headers.slice(3); // Remaining columns are patient samples

    // Parse patient info (after patient info marker)
    const patientLines = lines.slice(patientInfoIndex + 1);
    const patients: any[] = [];

    // Parse each biomarker row
    const biomarkers: any = {};
    biomarkerLines.slice(1).forEach(line => {
      const values = line.split(',');
      const biomarkerName = values[0];
      const normalRange = values[1] + (values[2] ? `-${values[2]}` : '');
      const sampleValues = values.slice(3);
      
      biomarkers[biomarkerName] = {
        normalRange,
        values: sampleValues.map(v => parseFloat(v) || 0)
      };
    });

    // Parse patient information
    sampleData.forEach((sample, index) => {
      const patientInfo: any = { sampleId: sample, biomarkers: {} };
      
      // Get biomarker values for this patient
      Object.keys(biomarkers).forEach(biomarkerName => {
        const value = biomarkers[biomarkerName].values[index];
        const normalRange = biomarkers[biomarkerName].normalRange;
        
        // Determine if value is abnormal (simplified logic)
        let status = 'normal';
        if (normalRange.includes('<') && value > parseFloat(normalRange.replace('<', ''))) {
          status = 'high';
        } else if (normalRange.includes('>') && value < parseFloat(normalRange.replace('>', ''))) {
          status = 'low';
        } else if (normalRange.includes('-')) {
          const [min, max] = normalRange.split('-').map(v => parseFloat(v));
          if (value < min) status = 'low';
          if (value > max) status = 'high';
        }

        patientInfo.biomarkers[biomarkerName] = {
          value,
          normalRange,
          status,
          tier: diseaseMatrix.tier1.includes(biomarkerName.toLowerCase()) ? 1 : 2
        };
      });

      // Calculate risk score
      let tier1Count = 0;
      let tier2Count = 0;
      Object.values(patientInfo.biomarkers).forEach((marker: any) => {
        if (marker.status !== 'normal') {
          if (marker.tier === 1) tier1Count++;
          else tier2Count++;
        }
      });
      
      patientInfo.riskScore = 10 * tier1Count + 1 * tier2Count;
      patients.push(patientInfo);
    });

    // Add patient details from the patient info section
    patientLines.forEach((line, index) => {
      const [field, ...values] = line.split(',');
      if (field && patients[index]) {
        switch (field.toLowerCase()) {
          case 'họ tên':
          case 'name':
            values.forEach((name, i) => {
              if (patients[i]) patients[i].name = name;
            });
            break;
          case 'tuổi':
          case 'age':
            values.forEach((age, i) => {
              if (patients[i]) patients[i].age = parseInt(age) || 0;
            });
            break;
          case 'giới tính':
          case 'gender':
            values.forEach((gender, i) => {
              if (patients[i]) patients[i].gender = gender;
            });
            break;
          case 'mã bệnh nhân':
          case 'patient_code':
            values.forEach((code, i) => {
              if (patients[i]) patients[i].patientCode = code;
            });
            break;
        }
      }
    });

    return patients;
  };

  const processFile = async () => {
    if (!uploadedFile) return;

    setProcessing(true);
    setProgress(0);

    try {
      const content = await uploadedFile.text();
      
      // Simulate processing progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const results = parseCSVData(content);
      setAnalysisResults(results);
      
      toast({
        title: "Phân tích hoàn tất",
        description: `Đã phân tích ${results.length} bệnh nhân từ file ${uploadedFile.name}`,
      });

      console.log('Kết quả phân tích:', results);
      
    } catch (error) {
      console.error('Lỗi xử lý file:', error);
      toast({
        title: "Lỗi xử lý file",
        description: error instanceof Error ? error.message : "Không thể xử lý file CSV",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const exportResults = async (format: 'csv' | 'pdf') => {
    if (analysisResults.length === 0) return;

    if (format === 'csv') {
      const csvContent = [
        'Mã BN,Tên BN,Tuổi,Giới tính,Chẩn đoán,Điểm nguy cơ,Ngày phân tích',
        ...analysisResults.map(result => [
          result.patientCode || result.sampleId,
          result.name || 'N/A',
          result.age || 'N/A',
          result.gender || 'N/A',
          result.riskScore > 50 ? 'Nguy cơ cao' : result.riskScore > 20 ? 'Nguy cơ trung bình' : 'Bình thường',
          result.riskScore,
          new Date().toLocaleDateString('vi-VN')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `KetQuaPhanTich_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      try {
        // PDF export
        const pdfGen = new PdfGenerator();
        
        // Title
        pdfGen.addTitle('BÁO CÁO PHÂN TÍCH XÉT NGHIỆM');
        
        // Summary
        pdfGen.addLabelValue('Ngày tạo', new Date().toLocaleDateString('vi-VN'));
        pdfGen.addLabelValue('Tổng số mẫu', analysisResults.length.toString());
        pdfGen.addSpace();
        
        analysisResults.forEach((result, index) => {
          // Sample header
          pdfGen.addSectionHeader(`BÁO CÁO MẪU #${index + 1}`);
          
          // Basic info
          pdfGen.addLabelValue('Mã bệnh nhân', result.patientCode || result.sampleId);
          pdfGen.addLabelValue('Tên bệnh nhân', result.name || 'N/A');
          pdfGen.addLabelValue('Tuổi', result.age?.toString() || 'N/A');
          pdfGen.addLabelValue('Giới tính', result.gender || 'N/A');
          pdfGen.addLabelValue('Điểm nguy cơ', `${result.riskScore}/100`);
          
          pdfGen.addSpace();
          
          // Convert biomarkers to array format for new API
          const biomarkersArray = Object.entries(result.biomarkers).map(([key, marker]: [string, any]) => ({
            name: key.toUpperCase(),
            value: marker.value,
            unit: '',
            normalRange: marker.normalRange,
            status: marker.status === 'high' ? 'Cao' : 
                    marker.status === 'low' ? 'Thấp' : 'Bình thường'
          }));
          
          // Format biomarkers using new table format
          pdfGen.formatBiomarkers(biomarkersArray);
          
          // Conclusion
          const conclusion = result.riskScore > 50 ? 'NGUY CƠ CAO - Cần can thiệp y tế ngay' : 
                           result.riskScore > 20 ? 'NGUY CƠ TRUNG BÌNH - Theo dõi và tái khám' : 
                           'BÌNH THƯỜNG - Duy trì lối sống lành mạnh';
          pdfGen.addText(`Kết luận: ${conclusion}`);
          
          pdfGen.addSpace();
        });
        
        // Generate and download PDF
        await pdfGen.downloadPdf(`BaoCaoPhanTich_${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
          title: "Lỗi tạo PDF",
          description: "Không thể tạo file PDF. Vui lòng thử lại.",
          variant: "destructive"
        });
        return;
      }
    }

    toast({
      title: "Xuất kết quả thành công",
      description: `Đã xuất ${analysisResults.length} kết quả phân tích với font tiếng Việt`,
    });
  };

  const stats = analysisResults.length > 0 ? {
    total: analysisResults.length,
    highRisk: analysisResults.filter(r => r.riskScore > 50).length,
    mediumRisk: analysisResults.filter(r => r.riskScore > 20 && r.riskScore <= 50).length,
    lowRisk: analysisResults.filter(r => r.riskScore <= 20).length,
    avgRiskScore: Math.round(analysisResults.reduce((sum, r) => sum + r.riskScore, 0) / analysisResults.length)
  } : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Phân tích dữ liệu hàng loạt</h2>
        {analysisResults.length > 0 && (
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => exportResults('csv')}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Xuất CSV
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => exportResults('pdf')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Xuất PDF
            </Button>
          </div>
        )}
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tải lên dữ liệu xét nghiệm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-700 mb-2">
                Tải lên file CSV chứa dữ liệu xét nghiệm
              </p>
              <p className="text-sm text-slate-500 mb-4">
                Định dạng: Các hàng là chỉ số XN, các cột là mẫu BN, phân cách bởi "Thông tin bệnh nhân"
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={processing}
              >
                <Upload className="h-4 w-4 mr-2" />
                Chọn file CSV
              </Button>
              {uploadedFile && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {uploadedFile && !processing && analysisResults.length === 0 && (
              <div className="text-center">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={processFile}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Bắt đầu phân tích
                </Button>
              </div>
            )}

            {processing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Đang phân tích dữ liệu...</span>
                  <span className="text-sm text-slate-500">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {stats && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-600">Tổng mẫu</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-600">Nguy cơ cao</p>
                    <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-600">Nguy cơ trung bình</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.mediumRisk}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-600">Bình thường</p>
                    <p className="text-2xl font-bold text-green-600">{stats.lowRisk}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-600">Điểm TB</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.avgRiskScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Kết quả phân tích chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.map((result, index) => (
                  <Card key={index} className="border border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-lg">
                            {result.name || `Mẫu ${result.sampleId}`}
                          </h3>
                          <p className="text-sm text-slate-600">
                            Mã: {result.patientCode || result.sampleId} • 
                            Tuổi: {result.age || 'N/A'} • 
                            Giới tính: {result.gender || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={result.riskScore > 50 ? "destructive" : 
                                   result.riskScore > 20 ? "default" : "secondary"}
                          >
                            Điểm nguy cơ: {result.riskScore}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(result.biomarkers).slice(0, 8).map(([key, marker]: [string, any]) => (
                          <div key={key} className={`p-2 rounded text-xs ${
                            marker.status === 'high' ? 'bg-red-50 text-red-700' :
                            marker.status === 'low' ? 'bg-blue-50 text-blue-700' :
                            'bg-green-50 text-green-700'
                          }`}>
                            <div className="font-medium">{key.toUpperCase()}</div>
                            <div className="font-bold">{marker.value}</div>
                            <div className="text-xs opacity-70">
                              BT: {marker.normalRange} • T{marker.tier}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
