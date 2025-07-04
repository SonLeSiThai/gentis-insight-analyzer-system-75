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

// Dữ liệu chi tiết cho 5 bệnh
const diseaseInfo = {
  D001: {
    id: 1,
    code: 'D001',
    name: '3-Hydroxy-3-methylglutaric acidemia',
    description: 'Thiếu hụt enzym 3-hydroxy-3-methylglutaryl-CoA lyase',
    synonyms: ['HMG acidemia', 'HMG-CoA lyase deficiency', '3-Hydroxy-3-methylglutaryl-CoA lyase deficiency'],
    diagnosis: 'Tăng 3-hydroxy-3-methylglutaric acid trong nước tiểu, hạ đường huyết',
    treatment: 'Tránh nhịn ăn, glucose IV khi cấp cứu, chế độ ăn ít chất béo',
    summary: [
      '3-Hydroxy-3-methylglutaric acidemia (HMG acidemia) là một rối loạn chuyển hóa bẩm sinh hiếm gặp do đột biến gen HMGCL, gây thiếu hụt enzym 3-hydroxy-3-methylglutaryl-CoA lyase.',
      'Sự thiếu hụt enzym này dẫn đến tích tụ các chất chuyển hóa độc hại và gây ra các triệu chứng nghiêm trọng như hạ đường huyết không sinh ceton, nhiễm toan, nôn mửa, hôn mê và co giật.',
      'Bệnh thường khởi phát trong giai đoạn sơ sinh hoặc thời thơ ấu và có thể đe dọa tính mạng nếu không được chẩn đoán và điều trị kịp thời.'
    ],
    overview: {
      signsAndSymptoms: {
        earlyStage: [
          'Khởi phát đột ngột khi nhịn ăn, nhiễm trùng hoặc stress chuyển hóa',
          'Hạ đường huyết nghiêm trọng nhưng không có thể ceton (hypoketotic hypoglycemia)',
          'Nôn mửa, lừ đừ, giảm trương lực cơ, co giật, hôn mê',
          'Nhiễm toan chuyển hóa, tăng amoniac, tăng lactate'
        ],
        lateStage: [
          'Trẻ có thể chậm phát triển, có nguy cơ tổn thương thần kinh',
          'Biểu hiện thần kinh mạn tính như co giật, giảm trương lực cơ, loạn trương lực'
        ],
        general: [
          'Triệu chứng thường xuất hiện trong 1 năm đầu đời và các đợt cấp có thể tái phát nếu không được phòng ngừa hiệu quả.'
        ]
      },
      causes: [
        'Đột biến gen HMGCL (nhiễm sắc thể 1) làm giảm hoặc mất chức năng enzym HMG-CoA lyase.',
        'Thiếu enzym khiến quá trình phân giải leucine và sản xuất thể ceton bị gián đoạn.',
        'Tích tụ các chất chuyển hóa độc hại ảnh hưởng đến hệ thần kinh và chuyển hóa toàn thân.',
        'Di truyền lặn trên nhiễm sắc thể thường.'
      ],
      affectedPopulations:
        'Rất hiếm (dưới 1/1.000.000 trẻ sơ sinh), gặp ở cả nam và nữ như nhau. Một số vùng như Bồ Đào Nha, Tây Ban Nha, Saudi Arabia và Brazil ghi nhận tỷ lệ cao hơn.',
      similarDiseases: [
        'Glutaric acidemia type I',
        'Medium-chain acyl-CoA dehydrogenase deficiency (MCAD)',
        'Methylmalonic acidemia',
        'Propionic acidemia'
      ],
      diagnosticMethods: [
        'Xét nghiệm acid hữu cơ nước tiểu (tăng acid 3-hydroxy-3-methylglutaric, 3-methylglutaric).',
        'MS/MS: tăng C6OH-carnitine.',
        'Định lượng enzym HMG-CoA lyase.',
        'Xét nghiệm gen HMGCL.'
      ],
      treatmentDetails: {
        prevention: [
          'Tránh nhịn đói: ăn thường xuyên.',
          'Tăng năng lượng qua glucose khi bệnh.',
          'Tránh nhiễm trùng và stress chuyển hóa.'
        ],
        diet: [
          'Hạn chế leucine trong chế độ ăn.',
          'Bổ sung thực phẩm y tế ít leucine.',
          'Bổ sung glucose hoặc maltodextrin.'
        ],
        acuteTreatment: [
          'Truyền glucose (có thể kết hợp insulin).',
          'Điều chỉnh điện giải, acid-base.',
          'Kiểm soát hạ đường huyết và tăng amoniac.'
        ],
        monitoring: [
          'Theo dõi phát triển thể chất, tâm thần vận động.',
          'Xét nghiệm chức năng gan, lactate, amoniac.'
        ]
      },
      prognosis:
        'Nếu phát hiện qua sàng lọc sơ sinh và điều trị sớm, bệnh nhân có thể phát triển bình thường; nếu không, có nguy cơ tổn thương thần kinh vĩnh viễn.',
      references: [
        'National Organization for Rare Disorders. 3-Hydroxy-3-Methylglutaric Aciduria',
        'Grünert SC, et al. Orphanet J Rare Dis. 2010;5:25.',
        'Gibson KM, et al. Mol Genet Metab. 2000;70(1):58–65.'
      ]
    }
  },
  D002: {
    id: 2,
    code: 'D002',
    name: 'ARGININEMIA',
    description: 'Thiếu hụt enzym arginase 1 – ARG1 deficiency',
    synonyms: ['Arginase 1 deficiency', 'ARG1 deficiency', 'Hyperargininemia'],
    diagnosis: 'MS/MS: tăng arginine; acid amin huyết tương; ammonia máu tăng nhẹ',
    treatment: 'Chế độ ăn ít protein (hạn chế arginine); sodium benzoate/phenylbutyrate; hỗ trợ dinh dưỡng',
    summary: [
      'Argininemia là rối loạn chu trình ure do đột biến gen ARG1, thiếu enzyme arginase 1.',
      'Tích tụ arginine và amoniac, gây độc hệ thần kinh trung ương.',
      'Triệu chứng khởi phát từ 1–3 tuổi: chậm phát triển, co cứng cơ, co giật, chậm nói.'
    ],
    overview: {
      signsAndSymptoms: {
        general: [
          'Chậm phát triển thể chất, vận động sau giai đoạn sơ sinh bình thường.',
          'Tăng trương lực cơ (spasticity), co giật.',
          'Tăng nồng độ arginine máu, ammonia máu tăng nhẹ.'
        ]
      },
      causes: [
        'Di truyền lặn trên nhiễm sắc thể thường ở gen ARG1 (6q23).',
        'Thiếu enzyme arginase 1 làm gián đoạn chu trình ure.'
      ],
      affectedPopulations:
        'Rất hiếm (≈1/1.100.000), ảnh hưởng ngang nhau nam nữ.',
      similarDiseases: [
        'Urea cycle disorders khác (OTC, CPS1 deficiency)',
        'Spastic cerebral palsy',
        'Phenylketonuria (PKU)'
      ],
      diagnosticMethods: [
        'Sàng lọc sơ sinh MS/MS: arginine tăng cao.',
        'Xét nghiệm enzym arginase 1 trong hồng cầu.',
        'Xét nghiệm gen ARG1.'
      ],
      treatmentDetails: {
        diet: ['Chế độ ăn ít protein, hạn chế arginine', 'Thực phẩm y tế không chứa arginine'],
        acuteTreatment: [
          'Sodium benzoate/phenylbutyrate để thải amoniac.',
          'Hỗ trợ dinh dưỡng, vật lý trị liệu.'
        ],
        monitoring: ['Theo dõi arginine, ammonia, phát triển thần kinh'],
        prevention: ['Điều trị co giật nếu cần']
      },
      prognosis:
        'Phát hiện và điều trị sớm giúp bệnh nhân phát triển tương đối bình thường; tổn thương thần kinh thường không hồi phục nếu đã xảy ra.',
      references: [
        'National Organization for Rare Disorders. Arginase 1 Deficiency',
        'Summar ML, Tuchman M. GeneReviews. Updated 2020.'
      ]
    }
  },
  D003: {
    id: 3,
    code: 'D003',
    name: 'CITRULLINEMIA TYPE I',
    description: 'Thiếu hụt enzym argininosuccinate synthetase – ASS1 deficiency',
    synonyms: [
      'ASS1 deficiency',
      'Citrullinemia type I',
      'Argininosuccinate synthetase deficiency'
    ],
    diagnosis: 'MS/MS: tăng citrulline; ammoniac máu >1000 µmol/L',
    treatment:
      'Chế độ ăn ít protein; truyền glucose; sodium benzoate/phenylbutyrate; lọc máu khi cần',
    summary: [
      'Citrullinemia type I (CTLN1) là rối loạn chu trình ure do đột biến gen ASS1.',
      'Thiếu enzyme làm amoniac tích tụ, gây độc thần kinh nghiêm trọng.',
      'Khởi phát sơ sinh: bú kém, nôn, ngủ gà, co giật, hôn mê.'
    ],
    overview: {
      signsAndSymptoms: {
        earlyStage: [
          'Bú kém, nôn, ngủ gà, giảm trương lực cơ, co giật, hôn mê',
          'Amoniac máu nặng (>1000 µmol/L)'
        ],
        lateStage: ['Đau đầu, rối loạn hành vi, giảm lực cơ ở trẻ lớn hoặc mang đột biến không triệu chứng'],
        general: ['Tăng citrulline huyết tương, tăng amoniac máu']
      },
      causes: [
        'Đột biến gen ASS1 (9q34.1), thiếu enzyme kết hợp citrulline với aspartate.',
        'Amoniac không chuyển hóa thành urê, tích tụ gây độc thần kinh.'
      ],
      affectedPopulations:
        '≈1/57.000 trẻ sơ sinh ở Mỹ; cao hơn ở cộng đồng Amish/Mennonite.',
      similarDiseases: [
        'OTC deficiency',
        'CPS1 deficiency',
        'Argininemia'
      ],
      diagnosticMethods: [
        'Sàng lọc sơ sinh MS/MS: citrulline tăng.',
        'Xét nghiệm ammoniac, acid amin huyết tương.',
        'Xét nghiệm enzym ASS1.',
        'Chẩn đoán gen ASS1.'
      ],
      treatmentDetails: {
        acuteTreatment: [
          'Nhập viện khẩn cấp, truyền glucose, lọc máu nếu cần',
          'Sodium benzoate/phenylbutyrate; truyền arginine'
        ],
        diet: ['Chế độ ăn ít protein, bổ sung arginine', 'Thực phẩm y tế không chứa citrulline'],
        monitoring: ['Theo dõi ammoniac, acid amin, phát triển thần kinh']
      },
      prognosis:
        'Chẩn đoán sớm và điều trị đúng giúp tránh tổn thương não; các đợt amoniac nặng để lại di chứng nếu không kịp thời.',
      references: [
        'NORD. Citrullinemia Type I',
        'Summar ML, Tuchman M. GeneReviews. Updated 2020.'
      ]
    }
  },
  D004: {
    id: 4,
    code: 'D004',
    name: 'ISOVALERIC ACIDEMIA',
    description: 'Thiếu hụt enzym isovaleryl-CoA dehydrogenase (IVD)',
    synonyms: ['IVA', 'Isovaleric acid CoA dehydrogenase deficiency'],
    diagnosis: 'MS/MS: tăng C5-carnitine; acid hữu cơ trong nước tiểu',
    treatment: 'Chế độ ăn ít leucine; bổ sung carnitine/glycine; biotin liều cao',
    summary: [
      'Isovaleric acidemia (IVA) là rối loạn chuyển hóa di truyền do đột biến gen IVD.',
      'Thiếu enzyme phân hủy leucine, chất độc tích tụ, gây các cơn cấp tính.',
      'Triệu chứng: nôn, bỏ bú, lừ đừ, “mùi chân” trong mồ hôi; chậm phát triển mạn tính.'
    ],
    overview: {
      signsAndSymptoms: {
        general: [
          'Hai thể: cấp tính (sơ sinh) và mạn tính tái phát.',
          'Đặc trưng bởi mùi “chân” do acid isovaleric tích tụ.'
        ]
      },
      causes: [
        'Đột biến gen IVD, enzyme isovaleryl-CoA dehydrogenase không hoạt động.',
        'Gián đoạn phân hủy leucine.'
      ],
      affectedPopulations:
        '1/526.000 ở phương Tây, 1/250.000 ở Mỹ; khởi phát từ sơ sinh đến thiếu niên.',
      similarDiseases: [
        'MMA, propionic acidemia, MSUD, nonketotic hyperglycinemia'
      ],
      diagnosticMethods: [
        'Sàng lọc sơ sinh MS/MS',
        'Xét nghiệm acid và ceton cao trong máu',
        'Xét nghiệm enzym IVD hoặc gen'
      ],
      treatmentDetails: {
        prevention: [
          'Theo dõi định kỳ chuyên gia chuyển hóa.',
          'Tránh stress chuyển hóa.'
        ],
        diet: [
          'Chế độ ăn ít leucine, đủ protein thiết yếu.',
          'Thực phẩm y tế không chứa leucine.'
        ],
        acuteTreatment: [
          'Ngừng protein 24h, tăng glucose.',
          'Truyền glucose IV nếu không ăn được.'
        ]
      },
      prognosis:
        'Tiên lượng tốt nếu phát hiện qua sàng lọc sơ sinh và điều trị kịp thời.',
      references: [
        'Vockley J. Am J Med Genet C Semin Med Genet. 2006;142C:95-103.',
        'Couce ML, et al. J Hum Genet. 2017;62:355-360.'
      ]
    }
  },
  D005: {
    id: 5,
    code: 'D005',
    name: 'GLUTARIC ACIDEMIA TYPE I',
    description: 'Thiếu hụt enzym glutaryl-CoA dehydrogenase',
    synonyms: ['GA-I', 'Glutaryl-CoA dehydrogenase deficiency'],
    diagnosis: 'MS/MS: tăng C5DC-carnitine; acid hữu cơ (glutaric, 3-hydroxyglutaric)',
    treatment: 'Chế độ ăn ít lysine/tryptophan; bổ sung B12, carnitine',
    summary: [
      'GA-I do đột biến gen GCDH, enzyme phân hủy lysine/tryptophan bị thiếu.',
      'Tích tụ acid độc hại gây tổn thương thần kinh nghiêm trọng.',
      'Khởi phát cấp tính khi stress chuyển hóa hoặc đưa vào chế độ ăn bình thường.'
    ],
    overview: {
      signsAndSymptoms: {
        general: ['GA-I biểu hiện từ không triệu chứng đến tổn thương thần kinh nặng.'],
        earlyStage: [
          'Hypotonia, co giật, dystonia, chậm phát triển tâm thần vận động',
          'Tăng vòng đầu (macrocephaly)'
        ],
        lateStage: ['Chậm phát triển trí tuệ, vận động tinh.'],
        special: ['Tổn thương nhân nền (basal ganglia) trên MRI.']
      },
      causes: [
        'Di truyền lặn ở gen GCDH, enzyme glutaryl-CoA dehydrogenase thiếu hụt.',
        'Tích tụ glutaric và 3-hydroxyglutaric acid.'
      ],
      affectedPopulations:
        '≈1/100.000 người, cao hơn ở cộng đồng Amish hoặc Oji-Cree.',
      similarDiseases: [
        'Canavan disease',
        'Leigh syndrome',
        'Methylmalonic acidemia',
        'Isovaleric acidemia'
      ],
      diagnosticMethods: [
        'Sàng lọc sơ sinh MS/MS: tăng C5DC-carnitine.',
        'Xét nghiệm acid hữu cơ, enzym GCDH, gen GCDH.'
      ],
      treatmentDetails: {
        prevention: [
          'Theo dõi định kỳ bởi chuyên gia chuyển hóa.',
          'Tránh stress chuyển hóa.'
        ],
        diet: [
          'Hạn chế lysine/tryptophan.',
          'Bổ sung L-carnitine.'
        ],
        acuteTreatment: [
          'Ngừng protein, tăng glucose IV.',
          'Sodium benzoate/phenylbutyrate để thải ammonia.'
        ],
        monitoring: ['MRI não, phát triển thần kinh, công thức máu']
      },
      prognosis:
        'Nếu chẩn đoán và điều trị sớm, nhiều trẻ phát triển bình thường; tổn thương thần kinh sớm thường không hồi phục.',
      references: [
        'Kolker S, et al. J Inherit Metab Dis. 2011;34(3):677–694.',
        'Strauss KA, Morton DH. GeneReviews. Updated 2022.'
      ]
    }
  }
};


interface TestResultDetailsProps {
  testResult: {
    id: number; testCode: string; patientName: string; birthDate: string; testDate: string; result: string;
    phone: string; branch: string; analysisDate: string; diagnosis: string; diseaseCode: string | null;
    biomarkers: any; doctorConclusion: string;
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
  
  // --- HÀM TẢI PDF ĐÃ ĐƯỢC PHỤC HỒI ĐẦY ĐỦ ---
  const handleDownloadReport = async () => {
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
    
      toast({ title: "Tải xuống thành công", description: `Báo cáo chi tiết ${testResult.testCode} đã được tải xuống PDF` });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({ title: "Lỗi tạo PDF", description: "Không thể tạo file PDF. Vui lòng thử lại.", variant: "destructive" });
    }
  };

  const disease = testResult.diseaseCode ? (diseaseInfo as any)[testResult.diseaseCode] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center"><User className="h-5 w-5 mr-2" />Thông tin xét nghiệm</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">🔹 THÔNG TIN BỆNH NHI</h3>
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
              <h3 className="text-lg font-semibold text-green-600 mb-4">🔹 THÔNG TIN DINH DƯỠNG & ĐIỀU TRỊ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                <div><span className="font-medium text-slate-700">Tình trạng dùng kháng sinh:</span><span className="ml-2">{additionalPatientData.antibioticUse}</span></div>
                <div><span className="font-medium text-slate-700">Dùng sữa mẹ:</span><span className="ml-2">{additionalPatientData.breastfeeding}</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-4">🔹 THÔNG TIN XÉT NGHIỆM</h3>
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