import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { PdfGenerator } from '@/lib/pdfGenerator';
import { Download, FileText, User, Activity, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BIOMARKER_LIST, generateDefaultBiomarkers } from '@/data/biomarkers';

// Dữ liệu chi tiết cho 5 bệnh, được cấu trúc lại để dễ tra cứu
const diseaseInfo = {
  'D001': {
    id: 1,
    code: 'D001',
    name: '3-Hydroxy-3-methylglutaric acidemia',
    classification: 'Rối loạn chuyển hóa',
    description: 'Thiếu hụt enzym 3-hydroxy-3-methylglutaryl-CoA lyase',
    synonyms: ['HMG acidemia', 'HMG-CoA lyase deficiency', '3-Hydroxy-3-methylglutaryl-CoA lyase deficiency'],
    diagnosis: 'Tăng 3-hydroxy-3-methylglutamic acid trong nước tiểu, hạ đường huyết',
    treatment: 'Tránh nhịn ăn, glucose IV khi cấp cứu, chế độ ăn ít chất béo',
    summary: ['3-Hydroxy-3-methylglutaric acidemia (HMG acidemia) là một rối loạn chuyển hóa bẩm sinh hiếm gặp do đột biến gen HMGCL, gây thiếu hụt enzym 3-hydroxy-3-methylglutaryl-CoA lyase. Enzym này cần thiết cho quá trình phân giải leucine và sản xuất thể ceton trong thời kỳ nhịn đói hoặc stress chuyển hóa.', 'Sự thiếu hụt enzym này dẫn đến tích tụ các chất chuyển hóa độc hại (bao gồm acid 3-hydroxy-3-methylglutaric, acid 3-methylglutaric) và gây ra các triệu chứng nghiêm trọng như hạ đường huyết không sinh ceton, nhiễm toan, nôn mửa, hôn mê và co giật.', 'Bệnh thường khởi phát trong giai đoạn sơ sinh hoặc thời thơ ấu và có thể đe dọa tính mạng nếu không được chẩn đoán và điều trị kịp thời.'],
    overview: { signsAndSymptoms: { earlyStage: ['Khởi phát đột ngột khi nhịn ăn, nhiễm trùng hoặc stress chuyển hóa', 'Hạ đường huyết nghiêm trọng nhưng không có thể ceton (hypoketotic hypoglycemia)', 'Nôn mửa, lừ đừ, giảm trương lực cơ, co giật, hôn mê', 'Nhiễm toan chuyển hóa, tăng amoniac, tăng lactate'], lateStage: ['Trẻ có thể chậm phát triển, có nguy cơ tổn thương thần kinh', 'Biểu hiện thần kinh mạn tính như co giật, giảm trương lực cơ, loạn trương lực'], general: ['Triệu chứng thường xuất hiện trong 1 năm đầu đời và các đợt cấp có thể tái phát nếu không được phòng ngừa hiệu quả.'] }, causes: ['Bệnh là kết quả của đột biến trong gen HMGCL, nằm trên nhiễm sắc thể số 1. Gen này mã hóa enzym HMG-CoA lyase – một thành phần thiết yếu trong cả hai con đường: phân giải leucine và tạo ceton.', 'Khi enzym thiếu hụt: Cơ thể không thể sản xuất đủ thể ceton – nguồn năng lượng quan trọng trong khi nhịn ăn', 'Các chất trung gian độc hại của quá trình phân giải leucine bị tích tụ, ảnh hưởng đến hệ thần kinh và chuyển hóa toàn thân', 'Bệnh di truyền theo kiểu lặn trên nhiễm sắc thể thường. Trẻ mắc bệnh khi nhận hai bản sao gen đột biến từ cha và mẹ.'], affectedPopulations: 'Đây là một bệnh rất hiếm, với tỷ lệ ước tính dưới 1/1.000.000 trẻ sơ sinh trên toàn thế giới. Bệnh gặp ở cả nam và nữ với tỷ lệ như nhau. Một số vùng như Bồ Đào Nha, Tây Ban Nha, Saudi Arabia và Brazil ghi nhận số ca bệnh cao hơn mức trung bình toàn cầu.', similarDiseases: ['Glutaric acidemia type I: cũng gây hạ đường huyết và tổn thương não', 'Medium-chain acyl-CoA dehydrogenase deficiency (MCAD): biểu hiện hạ đường huyết không sinh ceton', 'Methylmalonic acidemia, propionic acidemia, và các rối loạn acid hữu cơ khác có thể có triệu chứng giống nhau như nôn, co giật, nhiễm toan'], diagnosticMethods: ['Xét nghiệm acid hữu cơ nước tiểu: Tăng acid 3-hydroxy-3-methylglutaric, acid 3-methylglutaric, acid 3-methylglutaconic', 'Khối phổ tandem (MS/MS): Tăng C6OH-carnitine trong máu', 'Định lượng enzym trong bạch cầu hoặc nguyên bào sợi da', 'Xét nghiệm gen: Phân tích gen HMGCL để xác định đột biến'], treatmentDetails: { prevention: ['Tránh nhịn đói: ăn thường xuyên, cả ngày và đêm', 'Tăng năng lượng qua glucose khi bệnh', 'Tránh nhiễm trùng và các yếu tố gây stress chuyển hóa'], diet: ['Hạn chế leucine trong chế độ ăn (protein vừa phải)', 'Bổ sung thực phẩm y tế chuyên biệt ít leucine (theo chỉ định chuyên gia dinh dưỡng)', 'Bổ sung glucose hoặc maltodextrin để duy trì năng lượng'], acuteTreatment: ['Truyền glucose, có thể phối hợp insulin', 'Theo dõi và điều chỉnh điện giải, acid-base', 'Kiểm soát hạ đường huyết, tăng amoniac'], monitoring: ['Đánh giá sự phát triển thể chất, tâm thần vận động', 'Xét nghiệm chức năng gan, điện giải, lactate, amoniac'] }, prognosis: 'Nếu bệnh được phát hiện qua sàng lọc sơ sinh và được điều trị sớm, phần lớn bệnh nhân có thể phát triển bình thường. Tuy nhiên, nếu không được phát hiện, các đợt hạ đường huyết và nhiễm toan có thể gây tổn thương thần kinh không hồi phục hoặc tử vong.', references: ['National Organization for Rare Disorders. 3-Hydroxy-3-Methylglutaric Aciduria', 'Grünert SC, Sass JO, Schwab KO, et al. 3-Hydroxy-3-methylglutaryl-CoA lyase deficiency – clinical presentation and outcome in 37 patients. Orphanet J Rare Dis. 2010;5:25. https://pubmed.ncbi.nlm.nih.gov/20701773', 'Gibson KM, et al. HMG CoA lyase deficiency: Clinical spectrum and molecular analysis. Mol Genet Metab. 2000;70(1):58–65.', 'Zschocke J, Hoffmann GF. Vademecum Metabolicum. 3rd Ed. Schattauer Verlag, 2011.'] }
  },
  'D002': { id: 2, code: 'D002', name: 'ARGININEMIA', classification: 'Rối loạn chu trình ure', description: 'Thiếu hụt enzym arginase 1 – ARG1 deficiency', synonyms: ['Arginase 1 deficiency', 'ARG1 deficiency', 'Hyperargininemia'], diagnosis: 'Xét nghiệm tandem MS, tăng glutarylcarnitine, phân tích nước tiểu', treatment: 'Chế độ ăn hạn chế lysine và tryptophan, bổ sung carnitine và riboflavin', summary: ['Argininemia là một rối loạn chuyển hóa hiếm gặp, thuộc nhóm rối loạn chu trình ure. Bệnh xảy ra do đột biến ở gen ARG1, gây thiếu hụt enzym arginase 1 – enzym cần thiết để chuyển hóa arginine thành ornithine và urê nhằm thải trừ nitơ dư thừa ra khỏi cơ thể.', 'Thiếu enzym này dẫn đến tích tụ arginine và amoniac trong máu, gây độc cho hệ thần kinh trung ương. Triệu chứng thường xuất hiện từ cuối giai đoạn nhũ nhi đến thời thơ ấu, với các biểu hiện như chậm phát triển, co cứng cơ, co giật và chậm nói.', 'So với các rối loạn chu trình ure khác, argininemia thường có biểu hiện mạn tính và ít gây tăng amoniac cấp tính nghiêm trọng hơn, nhưng vẫn có thể dẫn đến tổn thương thần kinh vĩnh viễn nếu không được điều trị.'], overview: { signsAndSymptoms: { general: ['Bệnh thường biểu hiện từ 1 đến 3 tuổi, sau một giai đoạn sơ sinh hoàn toàn bình thường. Các dấu hiệu thường gặp:', 'Chậm phát triển thể chất và vận động, đặc biệt là kỹ năng đi đứng', 'Tăng trương lực cơ (spasticity), thường ở hai chân – có thể dẫn đến dáng đi cứng hoặc bại liệt thể co cứng', 'Co giật', 'Chậm nói, chậm phát triển trí tuệ', 'Tăng nồng độ arginine máu và, trong một số trường hợp, tăng amoniac', 'Không giống các rối loạn chu trình ure khác như OTC hay CPS1 deficiency, các cơn tăng amoniac cấp tính trong argininemia ít gặp hơn, và bệnh thường tiến triển âm thầm với tổn thương thần kinh tiến triển.'] }, causes: ['Argininemia là bệnh di truyền lặn trên nhiễm sắc thể thường. Trẻ mắc bệnh khi thừa hưởng 2 bản sao đột biến của gen ARG1, nằm trên nhiễm sắc thể 6q23.', 'Gen ARG1 mã hóa enzym arginase 1, enzyme này xúc tác bước cuối cùng trong chu trình ure – phân hủy arginine thành ornithine và urê. Khi enzym thiếu hụt, arginine không được chuyển hóa hết và tích tụ trong máu, đồng thời làm giảm khả năng loại bỏ amoniac.'], affectedPopulations: 'Argininemia là một bệnh rất hiếm gặp, với tỷ lệ khoảng 1 trên 1.100.000 trẻ sơ sinh ở Hoa Kỳ. Cả nam và nữ đều có thể bị ảnh hưởng như nhau.', similarDiseases: ['Các rối loạn chu trình ure khác: thường có biểu hiện sớm với tăng amoniac cấp, nôn mửa, hôn mê sơ sinh', 'Bại não thể co cứng (spastic cerebral palsy): có thể giống về biểu hiện thần kinh nhưng không có bất thường chuyển hóa', 'Bệnh lý thần kinh tiến triển khác ở trẻ nhỏ', 'Phenylketonuria (PKU): cũng có thể gây chậm phát triển tâm thần nếu không điều trị'], diagnosticMethods: ['Sàng lọc sơ sinh: ', 'Argininemia có thể được phát hiện qua chương trình sàng lọc sơ sinh bằng khối phổ ghép nối (MS/MS) – phát hiện mức arginine tăng cao trong máu.', 'Xét nghiệm chẩn đoán: ', 'Xét nghiệm acid amin huyết tương: tăng arginine', 'Xét nghiệm ammonia máu: có thể tăng nhẹ', 'Xét nghiệm enzym arginase: xác định hoạt tính thấp trong hồng cầu', 'Xét nghiệm gen: phân tích gen ARG1 để xác định đột biến'], treatmentDetails: { diet: ['Chế độ ăn ít protein, đặc biệt là hạn chế arginine', 'Sử dụng các công thức y tế chuyên biệt không chứa arginine', 'Hỗ trợ bởi chuyên gia dinh dưỡng chuyên sâu về rối loạn chuyển hóa'], acuteTreatment: ['Sodium benzoate, sodium phenylbutyrate hoặc glycerol phenylbutyrate có thể được sử dụng để giúp thải amoniac qua con đường thay thế'], monitoring: ['Đánh giá sự phát triển vận động và thần kinh', 'Theo dõi nồng độ arginine, ammonia và các chỉ số dinh dưỡng'], prevention: ['Vật lý trị liệu để hỗ trợ vận động', 'Thuốc chống co giật nếu cần'] }, prognosis: 'Nếu phát hiện và điều trị sớm, nhiều bệnh nhân có thể phát triển tương đối bình thường và tránh được các biến chứng thần kinh nặng. Tuy nhiên, tổn thương thần kinh do bệnh gây ra thường không hồi phục nếu đã xuất hiện trước khi chẩn đoán.', references: ['National Organization for Rare Disorders. Arginase 1 Deficiency (Argininemia)', 'Summar ML, Tuchman M. Urea Cycle Disorders Overview. GeneReviews. University of Washington, Seattle. Updated 2020.', 'Sin YY, Baron G, Schulze A, et al. Arginase deficiency. JIMD Reports. 2015;22:45–52. https://pubmed.ncbi.nlm.nih.gov/25403983', 'Caldovic L, Morizono H, Tuchman M. Genetics and diagnosis of urea cycle disorders. J Pediatr Biochem. 2007;1(1):37–46.'] } },
  'D003': { id: 3, code: 'D003', name: 'CITRULLINEMIA TYPE I', classification: 'Rối loạn chu trình ure', description: 'Thiếu hụt enzym argininosuccinate synthetase – ASS1 deficiency', synonyms: ['ASS1 deficiency', 'Argininosuccinate synthetase deficiency', 'Argininosuccinate synthetase deficiency (Citrullinemia)', 'Citrullinemia', 'Citrullinemia I', 'Citrullinemia type I'], diagnosis: 'Xét nghiệm tandem mass spectrometry, phát hiện tăng C5 (isovalerylcarnitine)', treatment: 'Chế độ ăn hạn chế leucine, bổ sung glycine và carnitine', summary: ['Citrullinemia type I (CTLN1) là một rối loạn chuyển hóa bẩm sinh hiếm gặp...', 'CTLN1 thường biểu hiện ở giai đoạn sơ sinh...', 'Nếu được phát hiện sớm...'], overview: { signsAndSymptoms: { earlyStage: ['Khởi phát trong vài ngày đầu sau sinh', 'Bú kém, nôn mửa', 'Ngủ gà...', 'Co giật, hôn mê...'], lateStage: ['Triệu chứng xuất hiện ở trẻ nhỏ...', 'Có thể gồm: đau đầu...'], general: ['Tăng nồng độ citrulline...'] }, causes: ['CTLN1 là bệnh di truyền lặn...'], affectedPopulations: 'Citrullinemia type I là bệnh hiếm gặp...', similarDiseases: ['Các rối loạn chu trình ure khác...', 'Rối loạn acid hữu cơ...'], diagnosticMethods: ['Sàng lọc sơ sinh: ...', 'Xét nghiệm chẩn đoán: ...'], treatmentDetails: { acuteTreatment: ['Nhập viện khẩn cấp...'], diet: ['Chế độ ăn hạn chế protein...'], monitoring: ['Xét nghiệm ammoniac...', 'Đánh giá phát triển thần kinh...'] }, prognosis: 'Nếu được chẩn đoán sớm và điều trị đúng...', references: ['National Organization for Rare Disorders. Citrullinemia Type I', 'Summar ML, Tuchman M. ...'] } },
  'D004': { id: 4, code: 'D004', name: 'ISOVALERIC ACIDEMIA', classification: 'Rối loạn chuyển hóa axit amin', description: 'Thiếu hụt enzym isovaleryl-CoA dehydrogenase (IVD)', synonyms: ['Thiếu hụt isovaleric acid CoA dehydrogenase', 'IVA'], diagnosis: 'Tăng các axit hữu cơ trong nước tiểu, giảm hoạt độ carboxylase', treatment: 'Bổ sung biotin liều cao, theo dõi định kỳ', summary: ['Isovaleric acidemia (toan axit isovaleric) là một rối loạn chuyển hóa di truyền...'], overview: { signsAndSymptoms: { general: ['Isovaleric acidemia là một rối loạn chuyển hóa hiếm gặp...'] }, causes: ['Isovaleric acidemia là một rối loạn di truyền...'], affectedPopulations: 'Isovaleric acidemia là một bệnh hiếm gặp...', similarDiseases: ['Methylmalonic acidemia (MMA)...', 'Propionic acidemia...'], diagnosticMethods: ['Tại Hoa Kỳ và một số quốc gia phát triển...'], treatmentDetails: { prevention: ['Mặc dù chưa có phương pháp chữa khỏi...'], diet: ['Carnitine hoặc glycine...'], acuteTreatment: ['Trong giai đoạn cấp...'] }, prognosis: 'Mặc dù chưa có phương pháp chữa khỏi...', references: ['Mohsen A-W, Vockley J. ...'] } },
  'D005': { id: 5, code: 'D005', name: 'GLUTARIC ACIDEMIA TYPE I', classification: 'Rối loạn chuyển hóa axit amin', description: 'Thiếu hụt enzym glutaryl-CoA dehydrogenase', synonyms: ['GA-I', 'Glutaryl-CoA dehydrogenase deficiency', 'Aciduria glutarica type I'], diagnosis: 'Tăng methylmalonic acid trong máu và nước tiểu, tăng C3', treatment: 'Chế độ ăn hạn chế protein, bổ sung vitamin B12, carnitine', summary: ['Glutaric acidemia type I (GA-I) là một rối loạn chuyển hóa hiếm gặp...'], overview: { signsAndSymptoms: { general: ['GA-I có phổ biểu hiện lâm sàng rộng...'], earlyStage: ['Trẻ có thể bình thường...'], lateStage: ['Một số trường hợp chỉ biểu hiện...'], special: ['Tăng chu vi đầu...'] }, causes: ['GA-I là bệnh di truyền lặn...'], affectedPopulations: 'GA-I là rối loạn hiếm gặp...', similarDiseases: ['Canavan disease', 'Leigh syndrome...'], diagnosticMethods: ['Sàng lọc sơ sinh: ...'], treatmentDetails: { prevention: ['Mục tiêu điều trị là...'], diet: ['Hạn chế lysine...'], acuteTreatment: ['Khi có nguy cơ stress...'], monitoring: ['Định kỳ đánh giá...'] }, prognosis: 'Nếu phát hiện sớm và điều trị đúng...', references: ['National Organization for Rare Disorders. Glutaric Acidemia Type I...', 'Kolker S, Christensen E, Leonard JV, et al. ...'] } }
};

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
  const doctorPhone = '0987 654 321';

  const getAdditionalPatientData = () => {
    if (testResult.testCode === 'y12345678') {
      return { gender: 'Nữ', gestationalAge: 39, birthWeight: 3800, twinStatus: 'Sinh đơn', ivfStatus: 'Có', address: 'Hà Nội', antibioticUse: 'Không', breastfeeding: 'Có', sampleCode: testResult.testCode, sampleCollectionDate: '03/05/2025', sampleReceiptDate: '03/05/2025' };
    } else if (testResult.testCode === 'y12345679') {
      return { gender: 'Nữ', gestationalAge: 39, birthWeight: 3700, twinStatus: 'Sinh đơn', ivfStatus: 'Có', address: 'Hà Nội', antibioticUse: 'Không', breastfeeding: 'Có', sampleCode: testResult.testCode, sampleCollectionDate: '03/06/2025', sampleReceiptDate: '03/06/2025', doctorPhone: '0908 631 472' };
    }
    return { gender: 'Nữ', gestationalAge: 39, birthWeight: 3800, twinStatus: 'Sinh đơn', ivfStatus: 'Có', address: 'Hà Nội', antibioticUse: 'Không', breastfeeding: 'Có', sampleCode: testResult.testCode, sampleCollectionDate: '03/05/2025', sampleReceiptDate: '03/05/2025' };
  };

  const additionalPatientData = getAdditionalPatientData();
  const fullBiomarkers = generateDefaultBiomarkers();
  Object.keys(testResult.biomarkers).forEach(key => {
    if (fullBiomarkers[key]) { fullBiomarkers[key] = testResult.biomarkers[key]; }
  });

  const handleSaveConclusion = () => {
    toast({ title: "Lưu kết luận thành công", description: "Kết luận của bác sĩ đã được cập nhật" });
    setShowConclusionDialog(false);
  };

  const handleReAnalyze = () => {
    toast({ title: "Phân tích lại", description: `Đang phân tích lại xét nghiệm ${testResult.testCode}` });
  };
  
  const handleDownloadReport = async () => { /* ... giữ nguyên logic tải PDF ... */ };

  const disease = testResult.diseaseCode ? (diseaseInfo as any)[testResult.diseaseCode] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center"><User className="h-5 w-5 mr-2" />Thông tin xét nghiệm</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">🔹 THÔNG TIN BỆNH NHI</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                <div className="space-y-3">
                  <div><span className="font-medium text-slate-700">Họ và tên:</span><span className="ml-2 font-medium">{testResult.patientName}</span></div>
                  <div><span className="font-medium text-slate-700">Ngày sinh:</span><span className="ml-2">{testResult.birthDate}</span></div>
                  <div><span className="font-medium text-slate-700">Giới tính:</span><span className="ml-2">{additionalPatientData.gender}</span></div>
                  <div><span className="font-medium text-slate-700">Số tuổi thai lúc sinh:</span><span className="ml-2">{additionalPatientData.gestationalAge >= 38 ? 'Đủ tháng' : 'Thiếu tháng'} ({additionalPatientData.gestationalAge >= 38 ? '≥' : '<'} 38 tuần)</span></div>
                  <div><span className="font-medium text-slate-700">Cân nặng lúc sinh:</span><span className="ml-2">{additionalPatientData.birthWeight}g</span></div>
                </div>
                <div className="space-y-3">
                  <div><span className="font-medium text-slate-700">Sinh đôi/đơn:</span><span className="ml-2">{additionalPatientData.twinStatus}</span></div>
                  <div><span className="font-medium text-slate-700">Thai IVF:</span><span className="ml-2">{additionalPatientData.ivfStatus}</span></div>
                  <div><span className="font-medium text-slate-700">Địa chỉ:</span><span className="ml-2">{additionalPatientData.address}</span></div>
                  <div><span className="font-medium text-slate-700">Số điện thoại bố/mẹ:</span><span className="ml-2">{testResult.phone}</span></div>
                  <div><span className="font-medium text-slate-700">Số điện thoại bác sĩ chỉ định:</span><span className="ml-2">{additionalPatientData.doctorPhone || doctorPhone}</span></div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">🔹 THÔNG TIN DINH DƯỠNG & ĐIỀU TRỊ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                <div><span className="font-medium text-slate-700">Tình trạng dùng kháng sinh:</span><span className="ml-2">{additionalPatientData.antibioticUse}</span></div>
                <div><span className="font-medium text-slate-700">Dùng sữa mẹ:</span><span className="ml-2">{additionalPatientData.breastfeeding}</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">🔹 THÔNG TIN XÉT NGHIỆM</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                <div className="space-y-3">
                  <div><span className="font-medium text-slate-700">Mã số mẫu:</span><span className="ml-2 font-mono text-red-600 font-medium">{testResult.testCode}</span></div>
                  <div><span className="font-medium text-slate-700">Ngày lấy mẫu:</span><span className="ml-2">{additionalPatientData.sampleCollectionDate}</span></div>
                  <div><span className="font-medium text-slate-700">Ngày nhận mẫu:</span><span className="ml-2">{additionalPatientData.sampleReceiptDate}</span></div>
                </div>
                <div className="space-y-3">
                  <div><span className="font-medium text-slate-700">Ngày xét nghiệm:</span><span className="ml-2">{testResult.testDate}</span></div>
                  <div><span className="font-medium text-slate-700">Kết quả:</span><span className="ml-2"><Badge variant={testResult.result === 'positive' ? "destructive" : "secondary"}>{testResult.result === 'positive' ? 'Dương tính' : 'Âm tính'}</Badge></span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <div className="flex space-x-2">
              {!isCollaborator && (<Button onClick={handleReAnalyze} variant="outline"><Activity className="h-4 w-4 mr-2" />Phân tích lại</Button>)}
              {!isCollaborator && (<Button onClick={() => setShowConclusionDialog(true)} className="bg-blue-600 hover:bg-blue-700"><FileText className="h-4 w-4 mr-2" />{testResult.doctorConclusion ? 'Sửa kết luận' : 'Nhập kết luận'}</Button>)}
            </div>
            <Button onClick={handleDownloadReport} variant="outline"><Download className="h-4 w-4 mr-2" />Tải báo cáo chi tiết</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><FileText className="h-5 w-5 mr-2" />Kết quả xét nghiệm và chẩn đoán</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Chẩn đoán:</h3>
                <p className="text-blue-700 text-lg">{testResult.diagnosis}</p>
              </div>
              {disease && (
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => { setDiseaseViewType('detail'); setShowDiseaseDialog(true); }}><FileText className="h-3 w-3 mr-1" />Chi tiết</Button>
                  <Button size="sm" variant="outline" onClick={() => { setDiseaseViewType('summary'); setShowDiseaseDialog(true); }}><Info className="h-3 w-3 mr-1" />Tóm tắt</Button>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Chi tiết 77 chỉ số sinh học:</h4>
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>STT</TableHead><TableHead>Chỉ số</TableHead><TableHead>Kết quả</TableHead><TableHead>Khoảng tham chiếu</TableHead><TableHead>Nhận định</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BIOMARKER_LIST.map((biomarker, index) => {
                    const key = biomarker.code.toLowerCase();
                    const marker = fullBiomarkers[key];
                    return (
                      <TableRow key={biomarker.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium text-sm">{biomarker.name}</TableCell>
                        <TableCell className="font-semibold">{marker.value || '--'}</TableCell>
                        <TableCell className="text-slate-600 text-sm">{marker.normal}</TableCell>
                        <TableCell><Badge variant={marker.status === 'high' ? "destructive" : marker.status === 'low' ? "secondary" : "outline"}>{marker.status === 'high' ? 'Tăng' : marker.status === 'low' ? 'Giảm' : 'Trong ngưỡng'}</Badge></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          {testResult.doctorConclusion && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Kết luận bác sĩ:</h4>
              <p className="text-green-700">{testResult.doctorConclusion}</p>
            </div>
          )}
          {!testResult.doctorConclusion && !isCollaborator && (
            <div className="bg-yellow-50 p-4 rounded-lg"><p className="text-yellow-800 text-sm">Chưa có kết luận từ bác sĩ. Vui lòng nhập kết luận cho xét nghiệm này.</p></div>
          )}
        </CardContent>
      </Card>
      
      {showConclusionDialog && (
        <Dialog open={showConclusionDialog} onOpenChange={setShowConclusionDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Kết luận cho xét nghiệm {testResult.testCode}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kết luận của bác sĩ:</label>
                <Textarea value={conclusion} onChange={(e) => setConclusion(e.target.value)} placeholder="Nhập kết luận của bác sĩ..." rows={4} />
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSaveConclusion} disabled={!conclusion.trim()}>Lưu kết luận</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowConclusionDialog(false)}>Hủy</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {disease && showDiseaseDialog && (
        <Dialog open={showDiseaseDialog} onOpenChange={setShowDiseaseDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{diseaseViewType === 'detail' ? 'Thông tin chi tiết bệnh' : 'Tóm tắt bệnh'}: {disease.name}</DialogTitle></DialogHeader>
            <div className="space-y-6 py-4">
              {diseaseViewType === 'detail' ? (
                <div className="space-y-6">
                  <div className="prose prose-sm max-w-none"><p><strong>Mã bệnh:</strong> <Badge variant="outline">{disease.code}</Badge></p><p><strong>Phân loại:</strong> {disease.classification}</p><p><strong>Mô tả ngắn:</strong> {disease.description}</p></div>
                  {disease.synonyms && (<div><h3 className="text-lg font-semibold mb-2 border-b pb-1">Từ đồng nghĩa</h3><ul className="list-disc list-inside space-y-1 pl-4">{disease.synonyms.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>)}
                  {disease.overview && (
                    <div className="space-y-6">
                      {disease.overview.signsAndSymptoms && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Dấu hiệu và Triệu chứng</h3>
                          <div className="space-y-3 prose prose-sm max-w-none">
                            {disease.overview.signsAndSymptoms.general?.map((p: string, i: number) => <p key={i}>{p}</p>)}
                            {disease.overview.signsAndSymptoms.earlyStage && (<div><h4 className="font-semibold">Giai đoạn sớm:</h4><ul className="list-disc list-inside pl-4">{disease.overview.signsAndSymptoms.earlyStage.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>)}
                            {disease.overview.signsAndSymptoms.lateStage && (<div className="mt-2"><h4 className="font-semibold">Giai đoạn muộn:</h4><ul className="list-disc list-inside pl-4">{disease.overview.signsAndSymptoms.lateStage.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>)}
                          </div>
                        </div>
                      )}
                      {disease.overview.causes && (<div><h3 className="text-lg font-semibold mb-2 border-b pb-1">Nguyên nhân</h3><div className="space-y-2 prose prose-sm max-w-none">{disease.overview.causes.map((p: string, i: number) => <p key={i}>{p}</p>)}</div></div>)}
                      {disease.overview.treatmentDetails && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Chi tiết điều trị</h3>
                          <div className="space-y-3 prose prose-sm max-w-none">
                            {disease.overview.treatmentDetails.prevention && (<div><h4 className="font-semibold">Phòng ngừa:</h4><ul className="list-disc list-inside pl-4">{disease.overview.treatmentDetails.prevention.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul></div>)}
                            {disease.overview.treatmentDetails.diet && (<div className="mt-2"><h4 className="font-semibold">Chế độ ăn:</h4><ul className="list-disc list-inside pl-4">{disease.overview.treatmentDetails.diet.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul></div>)}
                            {disease.overview.treatmentDetails.acuteTreatment && (<div className="mt-2"><h4 className="font-semibold">Điều trị cấp tính:</h4><ul className="list-disc list-inside pl-4">{disease.overview.treatmentDetails.acuteTreatment.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul></div>)}
                            {disease.overview.treatmentDetails.monitoring && (<div className="mt-2"><h4 className="font-semibold">Theo dõi:</h4><ul className="list-disc list-inside pl-4">{disease.overview.treatmentDetails.monitoring.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul></div>)}
                          </div>
                        </div>
                      )}
                      <div className="grid md:grid-cols-2 gap-6">
                        {disease.overview.affectedPopulations && (<div><h3 className="text-lg font-semibold mb-2 border-b pb-1">Đối tượng ảnh hưởng</h3><p className="prose prose-sm max-w-none">{disease.overview.affectedPopulations}</p></div>)}
                        {disease.overview.prognosis && (<div><h3 className="text-lg font-semibold mb-2 border-b pb-1">Tiên lượng</h3><p className="prose prose-sm max-w-none">{disease.overview.prognosis}</p></div>)}
                      </div>
                      {disease.overview.diagnosticMethods && (<div><h3 className="text-lg font-semibold mb-2 border-b pb-1">Phương pháp chẩn đoán</h3><div className="space-y-2 prose prose-sm max-w-none">{disease.overview.diagnosticMethods.map((p: string, i: number) => <p key={i}>{p}</p>)}</div></div>)}
                      {disease.overview.similarDiseases && (<div><h3 className="text-lg font-semibold mb-2 border-b pb-1">Các bệnh tương tự</h3><ul className="list-disc list-inside space-y-1 pl-4">{disease.overview.similarDiseases.map((d: string, i: number) => <li key={i}>{d}</li>)}</ul></div>)}
                      {disease.overview.references && (<div><h3 className="text-lg font-semibold mb-2 border-b pb-1">Tài liệu tham khảo</h3><ul className="list-disc list-inside space-y-1 pl-4 text-xs">{disease.overview.references.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul></div>)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  {disease.summary.map((paragraph: string, index: number) => (<p key={index}>{paragraph}</p>))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};