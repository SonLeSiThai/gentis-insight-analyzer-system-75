import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Eye,
  Info
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Disease {
  id: number;
  code: string;
  name: string;
  description: string;
  synonyms: string[];
  diagnosis: string;
  treatment: string;
  summary: string | string[];
  overview?: {
    signsAndSymptoms?: {
      earlyStage?: string[];
      lateStage?: string[];
      general?: string[];
      special?: string[];
    };
    causes?: string[];
    affectedPopulations?: string;
    similarDiseases?: string[];
    diagnosticMethods?: string[];
    treatmentDetails?: {
      prevention?: string[];
      diet?: string[];
      acuteTreatment?: string[];
      monitoring?: string[];
    };
    prognosis?: string;
    references?: string[];
  };
}

export const DiseaseView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [viewType, setViewType] = useState<'detail' | 'summary'>('detail');

  // Your specific disease data
  const [diseases] = useState([
      {
      id: 1,
      code: 'D001',
      name: '3-Hydroxy-3-methylglutaric acidemia',
      description: 'Thiếu hụt enzym 3-hydroxy-3-methylglutaryl-CoA lyase',
      synonyms: ['HMG acidemia', 'HMG-CoA lyase deficiency', '3-Hydroxy-3-methylglutaryl-CoA lyase deficiency'],
      diagnosis: 'Tăng 3-hydroxy-3-methylglutamic acid trong nước tiểu, hạ đường huyết',
      treatment: 'Tránh nhịn ăn, glucose IV khi cấp cứu, chế độ ăn ít chất béo',
      summary: ['3-Hydroxy-3-methylglutaric acidemia (HMG acidemia) là một rối loạn chuyển hóa bẩm sinh hiếm gặp do đột biến gen HMGCL, gây thiếu hụt enzym 3-hydroxy-3-methylglutaryl-CoA lyase. Enzym này cần thiết cho quá trình phân giải leucine và sản xuất thể ceton trong thời kỳ nhịn đói hoặc stress chuyển hóa.',
                'Sự thiếu hụt enzym này dẫn đến tích tụ các chất chuyển hóa độc hại (bao gồm acid 3-hydroxy-3-methylglutaric, acid 3-methylglutaric) và gây ra các triệu chứng nghiêm trọng như hạ đường huyết không sinh ceton, nhiễm toan, nôn mửa, hôn mê và co giật.',
                'Bệnh thường khởi phát trong giai đoạn sơ sinh hoặc thời thơ ấu và có thể đe dọa tính mạng nếu không được chẩn đoán và điều trị kịp thời.'],
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
          'Bệnh là kết quả của đột biến trong gen HMGCL, nằm trên nhiễm sắc thể số 1. Gen này mã hóa enzym HMG-CoA lyase – một thành phần thiết yếu trong cả hai con đường: phân giải leucine và tạo ceton.',
          'Khi enzym thiếu hụt: Cơ thể không thể sản xuất đủ thể ceton – nguồn năng lượng quan trọng trong khi nhịn ăn',
          'Các chất trung gian độc hại của quá trình phân giải leucine bị tích tụ, ảnh hưởng đến hệ thần kinh và chuyển hóa toàn thân',
          'Bệnh di truyền theo kiểu lặn trên nhiễm sắc thể thường. Trẻ mắc bệnh khi nhận hai bản sao gen đột biến từ cha và mẹ.'
        ],
        affectedPopulations: 'Đây là một bệnh rất hiếm, với tỷ lệ ước tính dưới 1/1.000.000 trẻ sơ sinh trên toàn thế giới. Bệnh gặp ở cả nam và nữ với tỷ lệ như nhau. Một số vùng như Bồ Đào Nha, Tây Ban Nha, Saudi Arabia và Brazil ghi nhận số ca bệnh cao hơn mức trung bình toàn cầu.',
        similarDiseases: [
          'Glutaric acidemia type I: cũng gây hạ đường huyết và tổn thương não',
          'Medium-chain acyl-CoA dehydrogenase deficiency (MCAD): biểu hiện hạ đường huyết không sinh ceton',
          'Methylmalonic acidemia, propionic acidemia, và các rối loạn acid hữu cơ khác có thể có triệu chứng giống nhau như nôn, co giật, nhiễm toan'
        ],
        diagnosticMethods: [
          'Xét nghiệm acid hữu cơ nước tiểu: Tăng acid 3-hydroxy-3-methylglutaric, acid 3-methylglutaric, acid 3-methylglutaconic',
          'Khối phổ tandem (MS/MS): Tăng C6OH-carnitine trong máu',
          'Định lượng enzym trong bạch cầu hoặc nguyên bào sợi da',
          'Xét nghiệm gen: Phân tích gen HMGCL để xác định đột biến'
        ],
        treatmentDetails: {
          prevention: [
            'Tránh nhịn đói: ăn thường xuyên, cả ngày và đêm',
            'Tăng năng lượng qua glucose khi bệnh',
            'Tránh nhiễm trùng và các yếu tố gây stress chuyển hóa'
          ],
          diet: [
            'Hạn chế leucine trong chế độ ăn (protein vừa phải)',
            'Bổ sung thực phẩm y tế chuyên biệt ít leucine (theo chỉ định chuyên gia dinh dưỡng)',
            'Bổ sung glucose hoặc maltodextrin để duy trì năng lượng'
          ],
          acuteTreatment: [
            'Truyền glucose, có thể phối hợp insulin',
            'Theo dõi và điều chỉnh điện giải, acid-base',
            'Kiểm soát hạ đường huyết, tăng amoniac'
          ],
          monitoring: [
            'Đánh giá sự phát triển thể chất, tâm thần vận động',
            'Xét nghiệm chức năng gan, điện giải, lactate, amoniac'
          ]
        },
        prognosis: 'Nếu bệnh được phát hiện qua sàng lọc sơ sinh và được điều trị sớm, phần lớn bệnh nhân có thể phát triển bình thường. Tuy nhiên, nếu không được phát hiện, các đợt hạ đường huyết và nhiễm toan có thể gây tổn thương thần kinh không hồi phục hoặc tử vong.',
        references: [
          'National Organization for Rare Disorders. 3-Hydroxy-3-Methylglutaric Aciduria',
          'Grünert SC, Sass JO, Schwab KO, et al. 3-Hydroxy-3-methylglutaryl-CoA lyase deficiency – clinical presentation and outcome in 37 patients. Orphanet J Rare Dis. 2010;5:25. https://pubmed.ncbi.nlm.nih.gov/20701773',
          'Gibson KM, et al. HMG CoA lyase deficiency: Clinical spectrum and molecular analysis. Mol Genet Metab. 2000;70(1):58–65.',
          'Zschocke J, Hoffmann GF. Vademecum Metabolicum. 3rd Ed. Schattauer Verlag, 2011.'
        ]
      }
    },
    {
      id: 2,
      code: 'D002', 
      name: 'ARGININEMIA',
      description: 'Thiếu hụt enzym arginase 1 – ARG1 deficiency',
      synonyms: ['Arginase 1 deficiency', 'ARG1 deficiency', 'Hyperargininemia'],
      diagnosis: 'Xét nghiệm tandem MS, tăng glutarylcarnitine, phân tích nước tiểu',
      treatment: 'Chế độ ăn hạn chế lysine và tryptophan, bổ sung carnitine và riboflavin',
      summary: ['Argininemia là một rối loạn chuyển hóa hiếm gặp, thuộc nhóm rối loạn chu trình ure. Bệnh xảy ra do đột biến ở gen ARG1, gây thiếu hụt enzym arginase 1 – enzym cần thiết để chuyển hóa arginine thành ornithine và urê nhằm thải trừ nitơ dư thừa ra khỏi cơ thể.',
                'Thiếu enzym này dẫn đến tích tụ arginine và amoniac trong máu, gây độc cho hệ thần kinh trung ương. Triệu chứng thường xuất hiện từ cuối giai đoạn nhũ nhi đến thời thơ ấu, với các biểu hiện như chậm phát triển, co cứng cơ, co giật và chậm nói.',
                'So với các rối loạn chu trình ure khác, argininemia thường có biểu hiện mạn tính và ít gây tăng amoniac cấp tính nghiêm trọng hơn, nhưng vẫn có thể dẫn đến tổn thương thần kinh vĩnh viễn nếu không được điều trị.'],
      overview: {
        signsAndSymptoms: {
          general: [
            'Bệnh thường biểu hiện từ 1 đến 3 tuổi, sau một giai đoạn sơ sinh hoàn toàn bình thường. Các dấu hiệu thường gặp:',
            'Chậm phát triển thể chất và vận động, đặc biệt là kỹ năng đi đứng',
            'Tăng trương lực cơ (spasticity), thường ở hai chân – có thể dẫn đến dáng đi cứng hoặc bại liệt thể co cứng',
            'Co giật',
            'Chậm nói, chậm phát triển trí tuệ',
            'Tăng nồng độ arginine máu và, trong một số trường hợp, tăng amoniac',
            'Không giống các rối loạn chu trình ure khác như OTC hay CPS1 deficiency, các cơn tăng amoniac cấp tính trong argininemia ít gặp hơn, và bệnh thường tiến triển âm thầm với tổn thương thần kinh tiến triển.'
          ]
        },
        causes: [
          'Argininemia là bệnh di truyền lặn trên nhiễm sắc thể thường. Trẻ mắc bệnh khi thừa hưởng 2 bản sao đột biến của gen ARG1, nằm trên nhiễm sắc thể 6q23.',
          'Gen ARG1 mã hóa enzym arginase 1, enzyme này xúc tác bước cuối cùng trong chu trình ure – phân hủy arginine thành ornithine và urê. Khi enzym thiếu hụt, arginine không được chuyển hóa hết và tích tụ trong máu, đồng thời làm giảm khả năng loại bỏ amoniac.'
        ],
        affectedPopulations: 'Argininemia là một bệnh rất hiếm gặp, với tỷ lệ khoảng 1 trên 1.100.000 trẻ sơ sinh ở Hoa Kỳ. Cả nam và nữ đều có thể bị ảnh hưởng như nhau.',
        similarDiseases: [
          'Các rối loạn chu trình ure khác: thường có biểu hiện sớm với tăng amoniac cấp, nôn mửa, hôn mê sơ sinh',
          'Bại não thể co cứng (spastic cerebral palsy): có thể giống về biểu hiện thần kinh nhưng không có bất thường chuyển hóa',
          'Bệnh lý thần kinh tiến triển khác ở trẻ nhỏ',
          'Phenylketonuria (PKU): cũng có thể gây chậm phát triển tâm thần nếu không điều trị'
        ],
        diagnosticMethods: [
          'Sàng lọc sơ sinh: ',
          'Argininemia có thể được phát hiện qua chương trình sàng lọc sơ sinh bằng khối phổ ghép nối (MS/MS) – phát hiện mức arginine tăng cao trong máu.',
          'Xét nghiệm chẩn đoán: ',
          'Xét nghiệm acid amin huyết tương: tăng arginine',
          'Xét nghiệm ammonia máu: có thể tăng nhẹ',
          'Xét nghiệm enzym arginase: xác định hoạt tính thấp trong hồng cầu',
          'Xét nghiệm gen: phân tích gen ARG1 để xác định đột biến'
        ],
        treatmentDetails: {
          diet: [
            'Chế độ ăn ít protein, đặc biệt là hạn chế arginine',
            'Sử dụng các công thức y tế chuyên biệt không chứa arginine',
            'Hỗ trợ bởi chuyên gia dinh dưỡng chuyên sâu về rối loạn chuyển hóa'
          ],
          acuteTreatment: [
            'Sodium benzoate, sodium phenylbutyrate hoặc glycerol phenylbutyrate có thể được sử dụng để giúp thải amoniac qua con đường thay thế'
          ],
          monitoring: [
            'Đánh giá sự phát triển vận động và thần kinh',
            'Theo dõi nồng độ arginine, ammonia và các chỉ số dinh dưỡng'
          ],
          prevention: [
            'Vật lý trị liệu để hỗ trợ vận động',
            'Thuốc chống co giật nếu cần'
          ]
        },
        prognosis: 'Nếu phát hiện và điều trị sớm, nhiều bệnh nhân có thể phát triển tương đối bình thường và tránh được các biến chứng thần kinh nặng. Tuy nhiên, tổn thương thần kinh do bệnh gây ra thường không hồi phục nếu đã xuất hiện trước khi chẩn đoán.',
        references: [
          'National Organization for Rare Disorders. Arginase 1 Deficiency (Argininemia)',
          'Summar ML, Tuchman M. Urea Cycle Disorders Overview. GeneReviews. University of Washington, Seattle. Updated 2020.',
          'Sin YY, Baron G, Schulze A, et al. Arginase deficiency. JIMD Reports. 2015;22:45–52. https://pubmed.ncbi.nlm.nih.gov/25403983',
          'Caldovic L, Morizono H, Tuchman M. Genetics and diagnosis of urea cycle disorders. J Pediatr Biochem. 2007;1(1):37–46.'
        ]
      }
    },
    {
      id: 3,
      code: 'D003',
      name: 'CITRULLINEMIA TYPE I',
      description: 'Thiếu hụt enzym argininosuccinate synthetase – ASS1 deficiency',
      synonyms: ['ASS1 deficiency', 'Argininosuccinate synthetase deficiency', 'Argininosuccinate synthetase deficiency (Citrullinemia)', 'Citrullinemia', 'Citrullinemia I', 'Citrullinemia type I', 'Citrullinemia type I (Argininosuccinate synthetase deficiency)', 'Citrullinemia, Type 1', 'Citrullinemia, type 1 or ASA synthetase deficiency'],
      diagnosis: 'Xét nghiệm tandem mass spectrometry, phát hiện tăng C5 (isovalerylcarnitine)',
      treatment: 'Chế độ ăn hạn chế leucine, bổ sung glycine và carnitine',
      summary: ['Citrullinemia type I (CTLN1) là một rối loạn chuyển hóa bẩm sinh hiếm gặp thuộc nhóm rối loạn chu trình ure – con đường chính của cơ thể để loại bỏ amoniac dư thừa. Bệnh do đột biến ở gen ASS1, gây thiếu hụt enzym argininosuccinate synthetase. Khi enzym này bị thiếu hoặc bất hoạt, amoniac tích tụ trong máu (tăng ammoniac máu), dẫn đến tổn thương thần kinh nghiêm trọng hoặc tử vong nếu không được điều trị kịp thời.',
                'CTLN1 thường biểu hiện ở giai đoạn sơ sinh, với các triệu chứng như bú kém, nôn, ngủ gà, giảm trương lực cơ, hôn mê và co giật. Một số thể nhẹ có thể khởi phát muộn hơn hoặc không biểu hiện rõ ràng cho đến khi có yếu tố khởi phát như nhịn ăn, stress chuyển hóa hoặc nhiễm trùng.',
                'Nếu được phát hiện sớm và điều trị đúng cách, tiên lượng có thể cải thiện đáng kể.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Khởi phát trong vài ngày đầu sau sinh',
            'Bú kém, nôn mửa',
            'Ngủ gà, giảm trương lực cơ',
            'Co giật, hôn mê',
            'Tăng ammoniac máu nặng (thường > 1000 µmol/L)',
            'Nếu không điều trị, tổn thương não không hồi phục hoặc tử vong'
          ],
          lateStage: [
            'Triệu chứng xuất hiện ở trẻ nhỏ hoặc thanh thiếu niên',
            'Có thể gồm: đau đầu, rối loạn hành vi, giảm tập trung, buồn nôn, giảm lực cơ',
            'Một số người mang đột biến nhưng không có triệu chứng'
          ],
          general: [
            'Tăng nồng độ citrulline trong huyết tương',
            'Tăng ammoniac máu',
            'Nồng độ acid amin bất thường trong huyết tương và nước tiểu'
          ]
        },
        causes: [
          'CTLN1 là bệnh di truyền lặn trên nhiễm sắc thể thường do đột biến gen ASS1 nằm trên nhiễm sắc thể 9q34.1. Gen này mã hóa enzym argininosuccinate synthetase, tham gia bước thứ ba của chu trình ure – kết hợp citrulline với aspartate để tạo thành argininosuccinate.',
          'Khi enzym này thiếu hụt: ',
          'Ammoniac không được chuyển hóa thành urê để thải qua thận',
          'Citrulline tích tụ trong máu và nước tiểu',
          'Amoniac tích tụ trong máu gây độc thần kinh'
        ],
        affectedPopulations: 'Citrullinemia type I là bệnh hiếm gặp, tỷ lệ ước tính khoảng 1/57.000 trẻ sơ sinh ở Hoa Kỳ. Bệnh ảnh hưởng đến cả nam và nữ như nhau. Một số cộng đồng có tỷ lệ cao hơn do yếu tố di truyền, ví dụ: cộng đồng Amish và Mennonite.',
        similarDiseases: [
          'Các rối loạn chu trình ure khác: OTC deficiency, CPS1 deficiency, Argininemia, ASA lyase deficiency',
          'Rối loạn acid hữu cơ (organic acidemias): cũng có thể gây tăng ammoniac, nhiễm toan',
          'Nhiễm trùng huyết sơ sinh, xuất huyết não, hạ đường huyết: có thể có biểu hiện lâm sàng tương tự'
        ],
        diagnosticMethods: [
          'Sàng lọc sơ sinh: ',
          'Được phát hiện thông qua chương trình MS/MS – nồng độ citrulline tăng cao trong mẫu máu gót chân',
          'Xét nghiệm chẩn đoán: ',
          'Xét nghiệm ammoniac máu: tăng rất cao trong thể sơ sinh',
          'Acid amin huyết tương: tăng citrulline',
          'Xét nghiệm enzym: đo hoạt tính argininosuccinate synthetase trong nguyên bào sợi da',
          'Xét nghiệm gen: xác định đột biến trong gen ASS1',
          'Chẩn đoán trước sinh: ',
          'Phân tích gen thai nhi nếu đã biết đột biến trong gia đình',
          'Đo hoạt tính enzym hoặc nồng độ chất chuyển hóa trong dịch ối'
        ],
        treatmentDetails: {
          acuteTreatment: [
            'Nhập viện khẩn cấp',
            'Truyền glucose để giảm dị hóa',
            'Sử dụng thuốc thải amoniac như sodium benzoate, sodium phenylbutyrate',
            'Truyền arginine để hỗ trợ chu trình ure',
            'Lọc máu trong các trường hợp tăng ammoniac nặng (thường > 500–1000 µmol/L)'
          ],
          diet: [
            'Chế độ ăn hạn chế protein (tùy theo độ tuổi và mức độ nặng)',
            'Sử dụng thực phẩm y tế chuyên biệt (không chứa citrulline)',
            'Bổ sung arginine',
            'Thuốc hỗ trợ thải amoniac'
          ],
          monitoring: [
            'Xét nghiệm ammoniac, acid amin máu',
            'Đánh giá phát triển thần kinh, vận động',
            'Đánh giá chế độ dinh dưỡng'
          ]
        },
        prognosis: 'Nếu được chẩn đoán sớm và điều trị đúng, nhiều trẻ có thể phát triển tốt và tránh được tổn thương não. Tuy nhiên, các đợt tăng ammoniac nghiêm trọng có thể để lại di chứng thần kinh không hồi phục.',
        references: [
          'National Organization for Rare Disorders. Citrullinemia Type I',
          'Summar ML, Tuchman M. Urea Cycle Disorders Overview. GeneReviews. University of Washington, Seattle. Updated 2020.',
          'Scaglia F, Lee B. Clinical spectrum and outcomes of urea cycle disorders. Mol Genet Metab. 2006;81:S112–S120.',
          'Häberle J, Huemer M, Burlina A, et al. Suggested guidelines for the diagnosis and management of urea cycle disorders. Orphanet J Rare Dis. 2012;7:32. https://pubmed.ncbi.nlm.nih.gov/22770389'
        ]
      }
    },
    {
      id: 4,
      code: 'D004',
      name: 'ISOVALERIC ACIDEMIA',
      description: 'Thiếu hụt enzym isovaleryl-CoA dehydrogenase (IVD)',
      synonyms: ['Thiếu hụt isovaleric acid CoA dehydrogenase', 'IVA'],
      diagnosis: 'Tăng các axit hữu cơ trong nước tiểu, giảm hoạt độ carboxylase',
      treatment: 'Bổ sung biotin liều cao, theo dõi định kỳ',
      summary: ['Isovaleric acidemia (toan axit isovaleric) là một rối loạn chuyển hóa di truyền, do đột biến gen mã hóa enzym isovaleryl-CoA dehydrogenase, dẫn đến giảm hoặc mất hoàn toàn hoạt động của enzym này. Enzym này đóng vai trò trong việc phân hủy leucine – một loại axit amin. Sự thiếu hụt enzym khiến các hóa chất tích tụ trong máu gây ra các triệu chứng.',
                'Bệnh có thể khởi phát với các cơn cấp tính từng đợt trong giai đoạn sơ sinh hoặc sau này trong thời thơ ấu. Các cơn cấp tính đặc trưng bởi: nôn, bỏ bú, lừ đừ, các chỉ số xét nghiệm bất thường và mùi mồ hôi giống như mùi chân.',
                'Các triệu chứng mạn tính có thể bao gồm: chậm lớn (suy dinh dưỡng) và chậm phát triển tâm thần vận động.',
                'Việc điều trị bao gồm chế độ ăn ít protein, đặc biệt là hạn chế leucine; tránh các yếu tố gây khởi phát cơn cấp; và bổ sung carnitine và/hoặc glycine.',
                'Hiện chưa có phương pháp chữa khỏi hoàn toàn, tuy nhiên khi người bệnh lớn lên, các cơn cấp thường xuất hiện ít hơn.'],
      overview: {
        signsAndSymptoms: {
          general: [
            'Isovaleric acidemia là một rối loạn chuyển hóa hiếm gặp với mức độ nghiêm trọng thay đổi từ không có triệu chứng cho đến nhẹ hoặc đe dọa tính mạng, tùy thuộc vào kiểu đột biến gen và các yếu tố khởi phát cơn cấp tính. Hai biểu hiện lâm sàng chính thường được mô tả là thể cấp tính và thể mạn tính từng đợt, nhưng trên thực tế, bệnh này được xem như một phổ liên tục từ không triệu chứng đến nghiêm trọng. Một đặc điểm điển hình là mùi hôi chân trong mồ hôi hoặc ráy tai, do sự tích tụ của acid isovaleric. Trẻ có thể sớm phát triển ác cảm với thực phẩm giàu protein.',
            'Ở thể cấp tính, các triệu chứng thường xuất hiện sớm sau sinh, với biểu hiện lừ đừ ngày càng tăng, bú kém, nôn mửa, và có thể tiến triển đến hôn mê. Những biểu hiện này liên quan đến rối loạn hóa học trong cơ thể trẻ, bao gồm tăng acid, amoniac và các hợp chất độc hại từ isovaleric acid. Tình trạng stress chuyển hóa kéo dài có thể dẫn đến giảm bạch cầu hạt (neutropenia) và giảm nhiều loại tế bào khác (giảm toàn thể huyết cầu – pancytopenia). Bệnh nhân cũng có thể bị hạ thân nhiệt.',
            'Sau khi đợt cấp đầu tiên được xử lý, nếu không có tổn thương thần kinh nghiêm trọng, bệnh nhân thường sẽ chuyển sang thể mạn tính từng đợt.',
            'Sau giai đoạn sơ sinh, các triệu chứng mạn tính từng đợt là phổ biến. Trẻ có thể bị chậm phát triển thể chất (suy dinh dưỡng), chậm phát triển trí tuệ, hoặc các triệu chứng thần kinh như co giật và tăng trương lực cơ, thường là hậu quả từ tổn thương thần kinh sớm. Các đợt cấp cũng có thể xuất hiện lại, thường được kích hoạt bởi bệnh lý khác như nhiễm trùng. Thậm chí ở một số bệnh nhân không có đợt cấp sơ sinh, triệu chứng mạn tính vẫn có thể xảy ra.',
            'Việc nhận biết sớm các triệu chứng sơ sinh đã giúp triển khai sàng lọc sơ sinh đối với isovaleric acidemia ở Hoa Kỳ và nhiều quốc gia phát triển khác. Nếu được phát hiện trước khi xuất hiện triệu chứng, tiên lượng thường tốt hơn, với sự phát triển bình thường. Khoảng một nửa số trẻ được phát hiện qua sàng lọc sơ sinh chỉ có thiếu hụt nhẹ, không có triệu chứng và không cần điều trị.'
          ]
        },
        causes: [
          'Isovaleric acidemia là một rối loạn di truyền có tính chất lặn trên nhiễm sắc thể thường. Các rối loạn di truyền lặn xảy ra khi một cá thể nhận hai bản sao gen lỗi – một từ mỗi bố mẹ. Nếu một người chỉ mang một gen lỗi và một gen bình thường, họ sẽ là người mang gen bệnh nhưng thường không có biểu hiện. Nếu cả hai bố mẹ đều là người mang gen bệnh, khả năng truyền cả hai gen lỗi và sinh con mắc bệnh là 25% trong mỗi lần mang thai. Khả năng sinh con là người mang gen (như bố mẹ) là 50%, và khả năng sinh con không mang gen bệnh là 25%. Tỷ lệ rủi ro này là như nhau đối với cả bé trai và bé gái.',
          'Ở bệnh nhân mắc IVA, có đột biến ở gen IVD, khiến enzyme isovaleryl-CoA dehydrogenase không hoạt động. Enzyme này cần thiết để phân hủy acid amin leucine nhằm tạo năng lượng.'
        ],
        affectedPopulations: 'Isovaleric acidemia là một bệnh hiếm gặp, có thể khởi phát sớm sau sinh hoặc trong thời kỳ nhũ nhi, và đôi khi tới tận tuổi thiếu niên. Bệnh ảnh hưởng đến cả nam và nữ với tỷ lệ ngang nhau. Tỷ lệ hiện mắc là 1 trên 526.000 ở các nước phương Tây và 1 trên 250.000 ở Hoa Kỳ.',
        similarDiseases: [
          'Methylmalonic acidemia (MMA): do thiếu enzym methylmalonyl-CoA mutase, methylmalonyl racemase, hoặc enzyme tổng hợp adenosylcobalamin (vitamin B12 dẫn xuất). Bệnh nhân bài tiết methylmalonate trong nước tiểu cao bất thường.',
          'Propionic acidemia: do thiếu enzym propionyl-CoA carboxylase, cần thiết để phân hủy các acid amin isoleucine, valine, threonine và methionine. Biểu hiện thường trong giai đoạn sơ sinh, nếu không được điều trị có thể dẫn đến mất nước, buồn ngủ, nôn ói và có thể hôn mê. Cũng có thể biểu hiện nhẹ hơn và khởi phát muộn.',
          'Maple syrup urine disease (MSUD): rối loạn chuyển hóa bẩm sinh liên quan đến ba acid amin chuỗi nhánh: leucine, isoleucine, valine. Các cơn cấp có thể gây co giật, hôn mê, và nước tiểu có mùi siro phong.',
          'Nonketotic hyperglycinemia: là rối loạn chuyển hóa glycine, gây tích tụ glycine trong dịch cơ thể và đặc biệt là dịch não tủy. Có nhiều thể, từ thể cổ điển nặng tử vong sớm sau sinh, đến thể nhẹ hoặc thể biến thể phụ thuộc vào đột biến gen cụ thể.',
          'Glutaric aciduria type I (GA I): do đột biến enzyme glutaryl-CoA dehydrogenase, ảnh hưởng đến chuyển hóa lysine. Gây ra các triệu chứng não cấp (encephalopathy), co giật hoặc giảm trương lực cơ, tổn thương não vĩnh viễn.',
          'Glutaric aciduria type II (GA II hoặc MADD): do đột biến ảnh hưởng đến chuyển hóa vitamin riboflavin – cần thiết cho hoạt động của nhiều enzyme, bao gồm isovaleryl-CoA dehydrogenase. Gây ra giảm hoặc mất hoạt động của hơn 12 enzyme. Biểu hiện có thể từ sơ sinh đến trưởng thành, và có triệu chứng giống IVA.'
        ],
        diagnosticMethods: [
          'Tại Hoa Kỳ và một số quốc gia phát triển, Isovaleric acidemia được phát hiện định kỳ qua chương trình sàng lọc sơ sinh, bằng xét nghiệm máu sử dụng kỹ thuật khối phổ ghép nối (MS/MS – tandem mass spectrometry). Ở các quốc gia khác, việc chẩn đoán thường cần có nghi ngờ lâm sàng trước khi được xác nhận.',
          'Kiểm tra nồng độ acid và ceton cao trong máu (nhiễm toan ceton)',
          'Nồng độ glycine cao trong máu hoặc nước tiểu (tăng glycin máu và niệu)',
          'Nồng độ amoniac cao (tăng ammonemia)',
          'Số lượng bạch cầu hạt thấp (neutropenia), Tiểu cầu thấp (giảm tiểu cầu), Hoặc giảm toàn thể tế bào máu (pancytopenia)',
          'Chẩn đoán cuối cùng được xác nhận bằng xét nghiệm DNA. Trong một số trường hợp hiếm, các tế bào trong cơ thể như bạch cầu hoặc tế bào da có thể được lấy mẫu để đánh giá hoạt tính enzym isovaleryl-CoA dehydrogenase.',
          'Đo nồng độ các chất chuyển hóa bất thường trong dịch ối',
          'Đánh giá hoạt tính enzym isovaleryl-CoA dehydrogenase từ mẫu dịch hoặc mô thai qua chọc ối hoặc sinh thiết gai nhau (CVS)',
          'Hoặc xét nghiệm DNA của mô thai để tìm đột biến đã xác định ở đứa con đầu tiên.'
        ],
        treatmentDetails: {
          prevention: [
            'Mặc dù chưa có phương pháp chữa khỏi Isovaleric acidemia, nhưng tiên lượng thường tốt nếu tránh hoặc xử lý kịp thời các triệu chứng cấp tính ở giai đoạn sơ sinh.',
            'Bệnh nhân cần được theo dõi định kỳ bởi bác sĩ di truyền hoặc chuyên gia chuyển hóa có kinh nghiệm trong điều trị các rối loạn acid hữu cơ.',
            'Tần suất theo dõi sẽ phụ thuộc vào mức độ nặng của bệnh và tần suất xảy ra các đợt cấp.',
            'Bệnh nhân nên được theo dõi: Phát triển thể chất, Phát triển tâm thần vận động, Lịch sử ăn uống',
            'Các xét nghiệm bổ sung bao gồm: Nồng độ acid trong máu, Công thức máu toàn bộ, Điện giải đồ',
            'Ngoài ra, bác sĩ có thể theo dõi các biến chứng liên quan đến hệ thần kinh, gan hoặc các cơ quan khác.'
          ],
          diet: [
            'Carnitine hoặc glycine có thể được bổ sung để hỗ trợ đào thải acid độc qua thận.',
            'Bệnh nhân thường cần chế độ ăn ít protein, nhằm tránh nạp quá nhiều leucine (acid amin liên quan trực tiếp đến bệnh).',
            'Tuy nhiên, vẫn cần đủ protein để đáp ứng nhu cầu phát triển của cơ thể, đặc biệt ở trẻ nhỏ.',
            'Với bệnh nhân nặng không thể hấp thu đủ protein tự nhiên, có thể sử dụng thực phẩm y tế chuyên biệt không chứa leucine.',
            'Nên có chuyên gia dinh dưỡng hỗ trợ xây dựng thực đơn phù hợp cho từng bệnh nhân.'
          ],
          acuteTreatment: [
            'Trong giai đoạn cấp, giảm hoặc ngừng ăn protein trong 24 giờ',
            'Sau đó tăng cường thức ăn giàu đường, ít đạm để duy trì năng lượng.',
            'Nếu bệnh nhân không thể ăn uống, cần nhập viện để truyền glucose qua đường tĩnh mạch.',
            'Các rối loạn chuyển hóa khác, như tăng amoniac, cần được điều chỉnh dựa trên tình trạng cụ thể của từng bệnh nhân.',
            'Sau vài ngày, thường có thể trở lại chế độ ăn thông thường của bệnh nhân.'
          ]
        },
        prognosis: 'Mặc dù chưa có phương pháp chữa khỏi Isovaleric acidemia, nhưng tiên lượng thường tốt nếu tránh hoặc xử lý kịp thời các triệu chứng cấp tính ở giai đoạn sơ sinh. Bệnh nhân cần được theo dõi định kỳ bởi bác sĩ di truyền hoặc chuyên gia chuyển hóa có kinh nghiệm trong điều trị các rối loạn acid hữu cơ. Tần suất theo dõi sẽ phụ thuộc vào mức độ nặng của bệnh và tần suất xảy ra các đợt cấp.',
        references: [
          'Mohsen A-W, Vockley J. Biochemical characteristics of recombinant human isovaleryl-CoA dehydrogenase pre-treated with ethylenediaminetetraacetate in Flabins and Flavoproteins. Rudolf Weber, New York, 1999: 515-18.',
          'Sweetman L, Williams JD. Branched chain organic acidurias in The Metabolic and Molecular Basis of Inherited Disease. Scriver C, Beaudet AL, Sly W, Valle D, eds. McGraw-Hill, New York, 2001: 2125-64.',
          'Couce ML, Aldamiz-Echeverria L, Bueno MA, et al. Genotype and phenotype characterization in a Spanish cohort with isovaleric acidemia. J Hum Genet. 2017;62:355-360. https://pubmed.ncbi.nlm.nih.gov/27904153/',
          'Vockley J, Ensenauer R. Isovaleric Acidemia: New Aspects of Genetic and Phenotypic Heterogeneity. Am J Med Genet C Semin Med Genet. 2006;142C:95-103. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2652706/',
          'Vockley J, Rogan PK, Anderson BD, et al. Exon skipping in IVD RNA processing in isovaleric academia caused by point mutations in the coding region of the IVD gene. Am J Hum Genet. 2000;66:356-67. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1288088/'
        ]
      }
    },
    {
      id: 5,
      code: 'D005',
      name: 'GLUTARIC ACIDEMIA TYPE I',
      description: 'Thiếu hụt enzym glutaryl-CoA dehydrogenase',
      synonyms: ['GA-I', 'Glutaryl-CoA dehydrogenase deficiency', 'Aciduria glutarica type I'],
      diagnosis: 'Tăng methylmalonic acid trong máu và nước tiểu, tăng C3',
      treatment: 'Chế độ ăn hạn chế protein, bổ sung vitamin B12, carnitine',
      summary: ['Glutaric acidemia type I (GA-I) là một rối loạn chuyển hóa hiếm gặp do đột biến ở gen GCDH, dẫn đến thiếu hụt hoặc mất chức năng enzym glutaryl-CoA dehydrogenase. Enzym này có vai trò phân hủy các acid amin lysine, hydroxylysine và tryptophan. Khi thiếu enzym, các acid hữu cơ độc hại (glutaric acid và 3-hydroxyglutaric acid) tích tụ trong cơ thể, đặc biệt là trong não, gây tổn thương thần kinh nghiêm trọng.',
                'GA-I có thể không có triệu chứng trong những tuần đầu đời, nhưng thường khởi phát cấp tính khi trẻ bị stress chuyển hóa như nhiễm trùng hoặc tiêm vaccine. Các triệu chứng thần kinh cấp như giảm trương lực cơ, co giật, rối loạn vận động hoặc loạn trương lực cơ có thể xuất hiện nhanh chóng và không hồi phục nếu không được phát hiện sớm.',
                'Hiện chưa có phương pháp chữa khỏi GA-I, tuy nhiên, sàng lọc sơ sinh và điều trị kịp thời có thể giúp phòng ngừa tổn thương thần kinh nghiêm trọng.'],
      overview: {
        signsAndSymptoms: {
          general: [
            'GA-I có phổ biểu hiện lâm sàng rộng, từ thể không triệu chứng đến tổn thương thần kinh nghiêm trọng. Đặc điểm chung bao gồm:'
          ],
          earlyStage: [
            'Trẻ có thể bình thường cho đến khi bị stress chuyển hóa. Sau đó, biểu hiện đột ngột với:',
            'Giảm trương lực cơ (hypotonia)',
            'Co giật',
            'Loạn trương lực cơ (dystonia), rối loạn vận động',
            'Chậm phát triển tâm thần vận động',
            'Tổn thương nhân nền não, đặc biệt là thể vân (basal ganglia), có thể dẫn đến bại não vĩnh viễn.'
          ],
          lateStage: [
            'Một số trường hợp chỉ biểu hiện chậm phát triển trí tuệ nhẹ, rối loạn ngôn ngữ hoặc vận động tinh.'
          ],
          special: [
            'Tăng chu vi đầu (macrocephaly) thường là dấu hiệu sớm nhất nhưng dễ bị bỏ qua. Có thể phát hiện máu trong nước tiểu, tăng acid hữu cơ, đặc biệt là acid glutaric và 3-hydroxyglutaric.'
          ]
        },
        causes: [
          'GA-I là bệnh di truyền lặn trên nhiễm sắc thể thường. Trẻ mắc bệnh khi nhận 2 bản sao đột biến gen GCDH từ cả cha và mẹ. Gen GCDH mã hóa enzym glutaryl-CoA dehydrogenase, tham gia phân hủy lysine, hydroxylysine và tryptophan.',
          'Khi enzym này thiếu hụt, các acid hữu cơ không được chuyển hóa hoàn toàn, gây tích tụ và độc cho mô thần kinh.'
        ],
        affectedPopulations: 'GA-I là rối loạn hiếm gặp, ảnh hưởng đến cả nam và nữ. Tỷ lệ hiện mắc ước tính khoảng 1/100.000 người, nhưng ở một số cộng đồng có tần suất mang gen cao (như người Amish hoặc cộng đồng Oji-Cree ở Canada), tỷ lệ cao hơn nhiều.',
        similarDiseases: [
          'Canavan disease',
          'Leigh syndrome',
          'Metachromatic leukodystrophy',
          'Isovaleric acidemia',
          'Methylmalonic acidemia',
          'Các bệnh thần kinh tiến triển hoặc loạn trương lực cơ khác'
        ],
        diagnosticMethods: [
          'Sàng lọc sơ sinh: Thông qua xét nghiệm tandem mass spectrometry (MS/MS), phát hiện mức glutarylcarnitine (C5DC) tăng cao.',
          'Xét nghiệm acid hữu cơ trong nước tiểu: Tăng acid glutaric và 3-hydroxyglutaric.',
          'Xét nghiệm enzym: Đo hoạt tính glutaryl-CoA dehydrogenase trong bạch cầu hoặc nguyên bào sợi da.',
          'Xét nghiệm gen: Phân tích gen GCDH để xác định đột biến.'
        ],
        treatmentDetails: {
          prevention: [
            'Mục tiêu điều trị là ngăn ngừa hoặc làm giảm nguy cơ tổn thương não.'
          ],
          diet: [
            'Hạn chế lysine và tryptophan',
            'Bổ sung L-carnitine để tăng thải độc',
            'Sử dụng công thức dinh dưỡng chuyên biệt không chứa lysine'
          ],
          acuteTreatment: [
            'Khi có nguy cơ stress chuyển hóa (nhiễm trùng, phẫu thuật...):',
            'Tạm ngừng nạp protein',
            'Tăng cung cấp năng lượng qua glucose',
            'Nhập viện nếu cần truyền dịch, theo dõi thần kinh'
          ],
          monitoring: [
            'Định kỳ đánh giá phát triển thần kinh và thể chất',
            'MRI sọ não có thể cho thấy tổn thương nhân nền',
            'Vật lý trị liệu, phục hồi chức năng',
            'Hỗ trợ ngôn ngữ, học tập'
          ]
        },
        prognosis: 'Nếu phát hiện sớm và điều trị đúng, nhiều trẻ có thể phát triển bình thường hoặc chỉ bị ảnh hưởng nhẹ. Tuy nhiên, nếu tổn thương thần kinh xảy ra (đặc biệt sau các đợt cấp sớm), hậu quả thường không hồi phục.',
        references: [
          'National Organization for Rare Disorders. Glutaric Acidemia Type I. https://rarediseases.org',
          'Kolker S, Christensen E, Leonard JV, et al. Diagnosis and management of glutaric aciduria type I – revised recommendations. J Inherit Metab Dis. 2011;34(3):677–694. https://pubmed.ncbi.nlm.nih.gov/21562803',
          'Strauss KA, Morton DH. Type I Glutaric Acidemia, Review. GeneReviews. University of Washington, Seattle. Updated 2022.',
          'Boy N, Mühlhausen C, Maier EM, et al. Clinical and biochemical features of 43 patients with glutaric aciduria type I. Orphanet J Rare Dis. 2017;12:54. https://pubmed.ncbi.nlm.nih.gov/28403835'
        ]
      }
    },
    {
      id: 6,
      code: 'D006',
      name: '3-Methylcrotonyl-CoA Carboxylase Deficiency',
      description: 'Thiếu hụt enzyme 3-methylcrotonyl-CoA carboxylase trong chuyển hóa leucine',
      synonyms: ['3-MCC deficiency', 'MCC deficiency', '3-Methylcrotonylglycinuria'],
      diagnosis: 'Tăng 3-methylcrotonylglycine trong nước tiểu, tăng C5OH',
      treatment: 'Chế độ ăn hạn chế leucine, bổ sung carnitine và biotin',
      summary: ['3-Methylcrotonyl-CoA Carboxylase Deficiency (3-MCC) là một rối loạn chuyển hóa hiếm gặp do thiếu hụt enzyme 3-methylcrotonyl-CoA carboxylase, tham gia vào quá trình phân hủy leucine. Đây là một trong những rối loạn acid hữu cơ phổ biến nhất được phát hiện qua sàng lọc sơ sinh.',
                'Bệnh có phổ biểu hiện lâm sàng rộng, từ hoàn toàn không triệu chứng đến biểu hiện nặng với co giật, hạ đường huyết và nhiễm toan. Nhiều trường hợp được phát hiện qua sàng lọc sơ sinh mà không có triệu chứng lâm sàng.',
                'Với chẩn đoán sớm và quản lý thích hợp, hầu hết bệnh nhân có tiên lượng tốt và phát triển bình thường.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Bú kém, nôn mửa trong những ngày đầu sau sinh',
            'Ngủ gà, giảm phản xạ',
            'Hạ đường huyết nhẹ',
            'Tăng amoniac máu nhẹ',
            'Mùi cơ thể bất thường (mùi mèo)'
          ],
          lateStage: [
            'Chậm phát triển thể chất và trí tuệ nhẹ',
            'Co giật xuất hiện muộn',
            'Yếu cơ, giảm trương lực cơ',
            'Nhiễm toan chuyển hóa từng đợt'
          ],
          general: [
            'Nhiều trường hợp hoàn toàn không có triệu chứng và được phát hiện tình cờ qua sàng lọc sơ sinh. Triệu chứng thường xuất hiện trong các đợt stress chuyển hóa như nhiễm trùng, nhịn ăn kéo dài hoặc tăng nạp protein.'
          ]
        },
        causes: [
          '3-MCC deficiency là bệnh di truyền lặn trên nhiễm sắc thể thường do đột biến ở gen MCCC1 hoặc MCCC2. Hai gen này mã hóa các tiểu đơn vị α và β của enzyme 3-methylcrotonyl-CoA carboxylase.',
          'Enzyme này cần biotin làm cofactor và tham gia vào bước thứ ba trong quá trình phân hủy leucine. Khi enzyme thiếu hụt, 3-methylcrotonyl-CoA và các chất chuyển hóa liên quan tích tụ, dẫn đến tăng 3-methylcrotonylglycine trong nước tiểu.'
        ],
        affectedPopulations: '3-MCC deficiency là một trong những rối loạn acid hữu cơ phổ biến nhất, với tỷ lệ khoảng 1/36.000 đến 1/50.000 trẻ sơ sinh. Bệnh ảnh hưởng đến cả nam và nữ với tỷ lệ như nhau.',
        similarDiseases: [
          'Isovaleric acidemia: cũng ảnh hưởng đến chuyển hóa leucine',
          '3-Hydroxy-3-methylglutaric aciduria: rối loạn khác trong con đường phân hủy leucine',
          'Biotin deficiency: có thể gây triệu chứng tương tự',
          'Multiple carboxylase deficiency: thiếu hụt nhiều enzyme carboxylase'
        ],
        diagnosticMethods: [
          'Sàng lọc sơ sinh: MS/MS phát hiện tăng C5OH-carnitine',
          'Xét nghiệm acid hữu cơ nước tiểu: tăng 3-methylcrotonylglycine',
          'Xét nghiệm enzyme: đo hoạt tính 3-methylcrotonyl-CoA carboxylase',
          'Xét nghiệm gen: phân tích gen MCCC1 và MCCC2'
        ],
        treatmentDetails: {
          prevention: [
            'Tránh nhịn ăn kéo dài',
            'Tăng cường dinh dưỡng trong thời kỳ bệnh',
            'Giám sát chặt chẽ trong các đợt stress chuyển hóa'
          ],
          diet: [
            'Hạn chế leucine trong chế độ ăn',
            'Bổ sung L-carnitine (50-100 mg/kg/ngày)',
            'Bổ sung biotin nếu cần thiết',
            'Duy trì cân bằng dinh dưỡng với protein đủ cho phát triển'
          ],
          acuteTreatment: [
            'Truyền glucose để ngăn ngừa dị hóa protein',
            'Điều chỉnh acid-base nếu có nhiễm toan',
            'Ngừng nạp protein trong thời gian ngắn',
            'Theo dõi glucose máu và điện giải'
          ],
          monitoring: [
            'Theo dõi phát triển thần kinh và thể chất',
            'Xét nghiệm acid hữu cơ nước tiểu định kỳ',
            'Đánh giá tình trạng dinh dưỡng',
            'Kiểm tra nồng độ carnitine máu'
          ]
        },
        prognosis: 'Tiên lượng thường tốt, đặc biệt khi được phát hiện và điều trị sớm. Hầu hết bệnh nhân phát triển bình thường và không có biến chứng nghiêm trọng nếu được quản lý đúng cách.',
        references: [
          'Grünert SC, Sass JO, Schwab KO, et al. 3-Methylcrotonyl-CoA carboxylase deficiency: clinical outcomes and biochemical findings. Orphanet J Rare Dis. 2012;7:31.',
          'National Organization for Rare Disorders. 3-Methylcrotonyl-CoA Carboxylase Deficiency.',
          'Baumgarter MR, Hörster F, Dionisi-Vici C, et al. Proposed guidelines for the diagnosis and management of methylmalonic and propionic acidemia. Orphanet J Rare Dis. 2014;9:130.'
        ]
      }
    },
    {
      id: 7,
      code: 'D007',
      name: 'Methylmalonic acidemia (cbl disorders)',
      description: 'Rối loạn chuyển hóa vitamin B12, ảnh hưởng đến methylmalonyl-CoA mutase',
      synonyms: ['Cobalamin disorders', 'Vitamin B12 metabolism disorders', 'MMA cbl type'],
      diagnosis: 'Tăng methylmalonic acid, homocysteine, giảm methionine',
      treatment: 'Bổ sung vitamin B12 dạng hydroxocobalamin hoặc cyanocobalamin',
      summary: ['Methylmalonic acidemia (MMA) cbl disorders là nhóm các rối loạn di truyền ảnh hưởng đến chuyển hóa vitamin B12 (cobalamin). Các rối loạn này gây ra thiếu hụt adenosylcobalamin và/hoặc methylcobalamin, dẫn đến tích tụ methylmalonic acid và homocysteine.',
                'Các biểu hiện lâm sàng bao gồm thiếu máu megaloblastic, chậm phát triển, rối loạn thần kinh và các vấn đề tiêu hóa. Khác với MMA do thiếu hụt enzyme, các cbl disorders thường đáp ứng tốt với liệu pháp bổ sung vitamin B12.',
                'Chẩn đoán sớm và điều trị kịp thời có thể cải thiện đáng kể tiên lượng và ngăn ngừa các biến chứng nghiêm trọng.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Bú kém, nôn mửa, chậm tăng cân trong giai đoạn sơ sinh',
            'Thiếu máu megaloblastic xuất hiện sớm',
            'Chậm phát triển tâm thần vận động',
            'Giảm trương lực cơ, yếu cơ',
            'Co giật có thể xuất hiện trong các trường hợp nặng'
          ],
          lateStage: [
            'Rối loạn thần kinh tiến triển: ataxia, neuropathy ngoại biên',
            'Suy giảm trí tuệ, rối loạn hành vi',
            'Vấn đề thị giác: thoái hóa võng mạc',
            'Tăng nguy cơ huyết khối do tăng homocysteine'
          ],
          general: [
            'Biểu hiện có thể xuất hiện từ sơ sinh đến tuổi trưởng thành tùy thuộc vào mức độ thiếu hụt. Các triệu chứng thường cải thiện nhanh chóng với liệu pháp vitamin B12 thích hợp.'
          ]
        },
        causes: [
          'Cbl disorders do đột biến ở các gen liên quan đến hấp thu, vận chuyển và chuyển hóa vitamin B12. Các gen chính bao gồm MMACHC (cblC), MMADHC (cblD), MMAA (cblA), và MMAB (cblB).',
          'Các rối loạn này ảnh hưởng đến khả năng tạo ra adenosylcobalamin (cần cho methylmalonyl-CoA mutase) và/hoặc methylcobalamin (cần cho methionine synthase), dẫn đến tích tụ acid methylmalonic và homocysteine.'
        ],
        affectedPopulations: 'Cbl disorders hiếm gặp với tỷ lệ tổng thể khoảng 1/200.000 trẻ sơ sinh. CblC là phổ biến nhất, chiếm khoảng 40% các trường hợp MMA. Bệnh ảnh hưởng đến cả nam và nữ như nhau.',
        similarDiseases: [
          'Methylmalonic acidemia do thiếu hụt mutase: không đáp ứng với vitamin B12',
          'Homocystinuria do thiếu hụt cystathionine β-synthase',
          'Folate deficiency: có thể gây thiếu máu megaloblastic tương tự',
          'Transcobalamin deficiency: rối loạn vận chuyển vitamin B12'
        ],
        diagnosticMethods: [
          'Sàng lọc sơ sinh: tăng C3-carnitine và methionine thấp',
          'Xét nghiệm acid hữu cơ: tăng methylmalonic acid trong nước tiểu',
          'Xét nghiệm acid amin: tăng homocysteine, giảm methionine',
          'Đo nồng độ vitamin B12 và các dạng hoạt tính của nó',
          'Xét nghiệm gen: phân tích các gen MMACHC, MMADHC, MMAA, MMAB'
        ],
        treatmentDetails: {
          prevention: [
            'Theo dõi sát sao các chỉ số sinh hóa',
            'Tránh các yếu tố gây stress chuyển hóa',
            'Tiêm phòng đầy đủ để tránh nhiễm trùng'
          ],
          diet: [
            'Bổ sung hydroxocobalamin hoặc cyanocobalamin (1-10mg/ngày)',
            'Bổ sung folate và betaine trong một số trường hợp',
            'Hạn chế protein nhẹ nếu cần thiết',
            'Bổ sung carnitine để hỗ trợ thải acid hữu cơ'
          ],
          acuteTreatment: [
            'Liều cao vitamin B12 trong các đợt cấp',
            'Điều trị hỗ trợ cho thiếu máu và các biến chứng',
            'Truyền máu nếu thiếu máu nặng',
            'Theo dõi chức năng thận và tim'
          ],
          monitoring: [
            'Theo dõi methylmalonic acid và homocysteine trong máu/nước tiểu',
            'Công thức máu định kỳ để đánh giá thiếu máu',
            'Đánh giá phát triển thần kinh và nhận thức',
            'Kiểm tra chức năng thận và tim mạch'
          ]
        },
        prognosis: 'Tiên lượng phụ thuộc vào kiểu cbl và mức độ đáp ứng với vitamin B12. Nhiều trường hợp có cải thiện đáng kể với điều trị. Tuy nhiên, tổn thương thần kinh có thể không hồi phục hoàn toàn nếu điều trị muộn.',
        references: [
          'Carrillo-Carrasco N, Chandler RJ, Venditti CP. Combined methylmalonic acidemia and homocystinuria, cblC type. I. Clinical presentations, diagnosis and management. J Inherit Metab Dis. 2012;35(1):91-102.',
          'Huemer M, Scholl-Bürgi S, Hadaya K, et al. Three new cases of late-onset cblC defect and review of the literature illustrating when to consider inborn errors of metabolism beyond infancy. Orphanet J Rare Dis. 2014;9:161.',
          'National Organization for Rare Disorders. Methylmalonic Acidemia.'
        ]
      }
    },
    {
      id: 8,
      code: 'D008',
      name: 'Propionic acidemia (propionyl-CoA carboxylase)',
      description: 'Thiếu hụt enzyme propionyl-CoA carboxylase, gây tích tụ axit propionic',
      synonyms: ['PA', 'PCC deficiency', 'Propionyl-CoA carboxylase deficiency'],
      diagnosis: 'Tăng propionic acid, 3-hydroxypropionate, tăng C3',
      treatment: 'Chế độ ăn hạn chế protein, bổ sung carnitine và biotin',
      summary: ['Propionic acidemia (PA) là một rối loạn chuyển hóa nghiêm trọng do thiếu hụt enzyme propionyl-CoA carboxylase (PCC). Enzyme này tham gia vào quá trình phân hủy các acid amin isoleucine, valine, threonine, methionine, và cholesterol.',
                'PA thường biểu hiện trong giai đoạn sơ sinh với các triệu chứng như bú kém, nôn mửa, ngủ gà và có thể tiến triển nhanh chóng đến hôn mê và tử vong nếu không được điều trị kịp thời. Các đợt cấp thường được kích hoạt bởi nhiễm trùng, stress hoặc tăng nạp protein.',
                                 'Điều trị bao gồm chế độ ăn hạn chế protein, bổ sung carnitine và biotin, cùng với quản lý các đợt cấp. Tiên lượng phụ thuộc vào việc chẩn đoán sớm và tuân thủ điều trị.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Biểu hiện trong 24-48 giờ đầu sau sinh',
            'Bú kém, nôn mửa kéo dài',
            'Ngủ gà, giảm trương lực cơ',
            'Nhiễm toan chuyển hóa nghiêm trọng',
            'Tăng amoniac máu, co giật',
            'Hôn mê và có thể tử vong nếu không điều trị'
          ],
          lateStage: [
            'Chậm phát triển thể chất và trí tuệ',
            'Các đợt cấp tái phát với nôn mửa, ngủ gà',
            'Cardiomyopathy (bệnh cơ tim)',
            'Suy giảm miễn dịch, nhiễm trùng tái phát',
            'Osteoporosis và các vấn đề xương'
          ],
          general: [
            'Triệu chứng thường xuất hiện sớm và nghiêm trọng. Các đợt cấp có thể được kích hoạt bởi nhiễm trùng, stress, nhịn ăn hoặc tăng nạp protein. Mùi cơ thể đặc trưng có thể xuất hiện.'
          ]
        },
        causes: [
          'PA là bệnh di truyền lặn trên nhiễm sắc thể thường do đột biến ở gen PCCA hoặc PCCB. Hai gen này mã hóa các tiểu đơn vị α và β của enzyme propionyl-CoA carboxylase.',
          'Enzyme này cần biotin làm cofactor và chuyển hóa propionyl-CoA thành methylmalonyl-CoA. Khi enzyme thiếu hụt, propionic acid và các chất chuyển hóa độc hại tích tụ, gây tổn thương nhiều cơ quan.'
        ],
        affectedPopulations: 'PA có tỷ lệ khoảng 1/100.000 đến 1/150.000 trẻ sơ sinh trên toàn thế giới. Một số quần thể có tỷ lệ cao hơn do hiệu ứng người sáng lập. Bệnh ảnh hưởng đến cả nam và nữ như nhau.',
        similarDiseases: [
          'Methylmalonic acidemia: có triệu chứng tương tự nhưng khác về sinh hóa',
          'Isovaleric acidemia: cũng gây mùi cơ thể bất thường',
          'Multiple carboxylase deficiency: thiếu hụt nhiều enzyme carboxylase',
          'Urea cycle disorders: có thể gây tăng amoniac tương tự'
        ],
        diagnosticMethods: [
          'Sàng lọc sơ sinh: MS/MS phát hiện tăng C3-carnitine',
          'Xét nghiệm acid hữu cơ: tăng propionic acid, 3-hydroxypropionate',
          'Xét nghiệm enzyme: đo hoạt tính propionyl-CoA carboxylase',
          'Xét nghiệm gen: phân tích gen PCCA và PCCB',
          'Đánh giá chức năng gan, thận và tim'
        ],
        treatmentDetails: {
          prevention: [
            'Tránh nhịn ăn kéo dài',
            'Điều trị nhiễm trùng sớm và tích cực',
            'Tăng cường năng lượng trong thời kỳ stress',
            'Vaccine phòng bệnh đầy đủ'
          ],
          diet: [
            'Hạn chế protein (0.5-1.5g/kg/ngày)',
            'Tránh các acid amin isoleucine, valine, threonine, methionine',
            'Bổ sung L-carnitine (100-400mg/kg/ngày)',
            'Bổ sung biotin và các vitamin nhóm B'
          ],
          acuteTreatment: [
            'Ngừng nạp protein ngay lập tức',
            'Truyền glucose để ngăn ngừa dị hóa',
            'Điều chỉnh acid-base và điện giải',
            'Lọc máu nếu tăng amoniac nghiêm trọng',
            'Hỗ trợ hô hấp và tuần hoàn nếu cần'
          ],
          monitoring: [
            'Theo dõi acid hữu cơ nước tiểu định kỳ',
            'Kiểm tra chức năng gan, thận định kỳ',
            'Đánh giá phát triển thần kinh và nhận thức',
            'Theo dõi tình trạng dinh dưỡng và tăng trưởng'
          ]
        },
        prognosis: 'Tiên lượng biến đổi rộng, từ tử vong sơ sinh đến phát triển gần bình thường. Chẩn đoán sớm và tuân thủ điều trị nghiêm ngặt cải thiện đáng kể tiên lượng. Các biến chứng dài hạn bao gồm chậm phát triển, bệnh cơ tim và suy giảm miễn dịch.',
        references: [
          'Baumgartner MR, Hörster F, Dionisi-Vici C, et al. Proposed guidelines for the diagnosis and management of methylmalonic and propionic acidemia. Orphanet J Rare Dis. 2014;9:130.',
          'Schwab MA, Sauer SW, Okun JG, et al. Secondary mitochondrial dysfunction in propionic aciduria: a pathogenic role for endogenous mitochondrial toxins. Biochem J. 2006;398(1):107-12.',
          'National Organization for Rare Disorders. Propionic Acidemia.'
        ]
      }
    },
    {
      id: 9,
      code: 'D009',
      name: 'β-Ketothiolase deficiency (Beta-ketothiolase)',
      description: 'Thiếu hụt enzyme mitochondrial acetoacetyl-CoA thiolase',
      synonyms: ['MAT deficiency', 'Mitochondrial acetoacetyl-CoA thiolase deficiency', 'β-KT deficiency'],
      diagnosis: 'Tăng 2-methyl-3-hydroxybutyric acid, tiglylglycine',
      treatment: 'Tránh nhịn ăn, glucose khi cấp cứu, chế độ ăn đều đặn',
      summary: ['β-Ketothiolase deficiency là một rối loạn chuyển hóa hiếm gặp do thiếu hụt enzyme mitochondrial acetoacetyl-CoA thiolase (MAT). Enzyme này tham gia vào quá trình phân hủy isoleucine và ketolysis.',
                'Bệnh thường biểu hiện với các đợt ketoacidosis từng đợt, được kích hoạt bởi nhịn ăn, nhiễm trùng hoặc stress. Các triệu chứng bao gồm nôn mửa, ngủ gà, thở nhanh và có thể tiến triển đến hôn mê nếu không được điều trị.',
                                 'Với chẩn đoán đúng và quản lý phù hợp, hầu hết bệnh nhân có tiên lượng tốt và phát triển bình thường giữa các đợt cấp.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Khởi phát thường sau 6 tháng tuổi',
            'Nôn mửa kéo dài, từ chối ăn',
            'Ngủ gà, giảm hoạt động',
            'Thở nhanh, sâu (Kussmaul breathing)',
            'Mùi thở ngọt (do ketone)',
            'Mất nước, giảm cân nhanh'
          ],
          lateStage: [
            'Các đợt ketoacidosis tái phát',
            'Phát triển bình thường giữa các đợt cấp',
            'Có thể chậm phát triển nhẹ nếu có nhiều đợt cấp',
            'Rối loạn học tập nhẹ ở một số trường hợp'
          ],
          general: [
            'Bệnh nhân thường hoàn toàn bình thường giữa các đợt cấp. Các đợt ketoacidosis thường được kích hoạt bởi nhịn ăn kéo dài, nhiễm trùng, stress hoặc tăng nạp protein.'
          ]
        },
        causes: [
          'β-Ketothiolase deficiency là bệnh di truyền lặn trên nhiễm sắc thể thường do đột biến ở gen ACAT1. Gen này mã hóa enzyme mitochondrial acetoacetyl-CoA thiolase (MAT).',
          'Enzyme MAT tham gia vào hai con đường chuyển hóa: phân hủy isoleucine và ketolysis. Khi enzyme thiếu hụt, ketone bodies không được chuyển hóa hiệu quả, dẫn đến tích tụ và ketoacidosis.'
        ],
        affectedPopulations: 'Đây là một rối loạn rất hiếm gặp với tỷ lệ ước tính khoảng 1/1.000.000 trẻ sơ sinh. Bệnh ảnh hưởng đến cả nam và nữ với tỷ lệ như nhau. Một số gia đình có tỷ lệ cao hơn do cận huyết.',
        similarDiseases: [
          'Diabetic ketoacidosis: có triệu chứng ketoacidosis tương tự',
          'HMG-CoA lyase deficiency: cũng gây ketoacidosis và hạ đường huyết',
          'Fatty acid oxidation disorders: có thể gây ketoacidosis hypoketotic',
          'Isovaleric acidemia: cũng ảnh hưởng đến chuyển hóa isoleucine'
        ],
        diagnosticMethods: [
          'Xét nghiệm acid hữu cơ nước tiểu: tăng 2-methyl-3-hydroxybutyric acid, tiglylglycine',
          'Xét nghiệm máu: ketoacidosis, tăng ketone bodies',
          'MS/MS: có thể phát hiện bất thường trong sàng lọc mở rộng',
          'Xét nghiệm enzyme: đo hoạt tính acetoacetyl-CoA thiolase',
          'Xét nghiệm gen: phân tích gen ACAT1'
        ],
        treatmentDetails: {
          prevention: [
            'Tránh nhịn ăn kéo dài (>8-12 giờ)',
            'Ăn thường xuyên, nhất là trước khi ngủ',
            'Tăng cường dinh dưỡng trong thời kỳ bệnh',
            'Giáo dục gia đình về dấu hiệu cảnh báo'
          ],
          diet: [
            'Chế độ ăn đều đặn, nhiều bữa nhỏ',
            'Hạn chế nhẹ isoleucine nếu cần',
            'Tăng carbohydrate trong thời kỳ stress',
            'Bổ sung glucose/dextrose khi có triệu chứng sớm'
          ],
          acuteTreatment: [
            'Truyền glucose IV ngay lập tức',
            'Điều chỉnh acid-base bằng bicarbonate nếu cần',
            'Bù dịch và điện giải',
            'Ngừng nạp protein tạm thời',
            'Theo dõi sát glucose và ketone máu'
          ],
          monitoring: [
            'Theo dõi phát triển thể chất và nhận thức',
            'Xét nghiệm acid hữu cơ định kỳ',
            'Đánh giá tuân thủ chế độ ăn',
            'Giáo dục gia đình về quản lý cấp cứu'
          ]
        },
        prognosis: 'Tiên lượng thường tốt với quản lý phù hợp. Hầu hết bệnh nhân phát triển bình thường và có thể sống cuộc sống bình thường. Tần suất và mức độ nghiêm trọng của các đợt cấp thường giảm theo tuổi.',
        references: [
          'Fukao T, Mitchell G, Sass JO, et al. Ketone body metabolism and its defects. J Inherit Metab Dis. 2014;37(4):541-51.',
          'National Organization for Rare Disorders. Beta-Ketothiolase Deficiency.',
          'Sass JO. Inborn errors of ketogenesis and ketone body utilization. J Inherit Metab Dis. 2012;35(1):23-8.'
        ]
      }
    },
    {
      id: 10,
      code: 'D010',
      name: 'Methylmalonic acidemia with homocystinuria',
      description: 'Rối loạn phối hợp chuyển hóa methylmalonic acid và homocysteine',
      synonyms: ['MMA-HC', 'Combined MMA and homocystinuria', 'Cobalamin metabolism disorder'],
      diagnosis: 'Tăng cả methylmalonic acid và homocysteine, giảm methionine',
      treatment: 'Bổ sung vitamin B12, folate, betaine, chế độ ăn hạn chế methionine',
      summary: ['Methylmalonic acidemia with homocystinuria (MMA-HC) là một nhóm rối loạn di truyền hiếm gặp ảnh hưởng đến chuyển hóa vitamin B12, dẫn đến tích tụ đồng thời methylmalonic acid và homocysteine.',
                'Các triệu chứng bao gồm thiếu máu megaloblastic, chậm phát triển, rối loạn thần kinh, và tăng nguy cơ huyết khối. Điều trị đòi hỏi phối hợp nhiều liệu pháp và theo dõi chặt chẽ.',
                'Tiên lượng phụ thuộc vào việc chẩn đoán sớm và tuân thủ điều trị, nhưng nhiều biến chứng có thể tiến triển mặc dù điều trị tích cực.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Bú kém, nôn mửa trong giai đoạn sơ sinh',
            'Thiếu máu megaloblastic xuất hiện sớm',
            'Chậm tăng cân, suy dinh dưỡng',
            'Chậm phát triển tâm thần vận động',
            'Giảm trương lực cơ, yếu cơ'
          ],
          lateStage: [
            'Rối loạn thần kinh tiến triển: dementia, ataxia',
            'Vấn đề thị giác: thoái hóa võng mạc, glaucoma',
            'Huyết khối tĩnh mạch và động mạch',
            'Suy thận tiến triển',
            'Cardiomyopathy, tăng huyết áp phổi'
          ],
          general: [
            'Biểu hiện có thể xuất hiện từ sơ sinh đến tuổi trưởng thành. Mức độ nghiêm trọng phụ thuộc vào kiểu gen và mức độ đáp ứng với vitamin B12.'
          ]
        },
        causes: [
          'MMA-HC do đột biến ở các gen liên quan đến chuyển hóa vitamin B12, chủ yếu là MMACHC (cblC), MMADHC (cblD), MMAA (cblA), MMAB (cblB).',
          'Các đột biến này ảnh hưởng đến tổng hợp adenosylcobalamin và methylcobalamin, dẫn đến thiếu hụt hoạt tính methylmalonyl-CoA mutase và methionine synthase, gây tích tụ cả MMA và homocysteine.'
        ],
        affectedPopulations: 'MMA-HC rất hiếm gặp với tỷ lệ ước tính khoảng 1/200.000 trẻ sơ sinh. CblC là kiểu phổ biến nhất. Bệnh ảnh hưởng đến cả nam và nữ với tỷ lệ như nhau.',
        similarDiseases: [
          'Isolated methylmalonic acidemia: chỉ có tăng MMA',
          'Isolated homocystinuria: chỉ có tăng homocysteine',
          'Folate deficiency: có thể gây thiếu máu megaloblastic tương tự',
          'Classical homocystinuria (CBS deficiency): chỉ có tăng homocysteine'
        ],
        diagnosticMethods: [
          'Sàng lọc sơ sinh: MS/MS có thể phát hiện bất thường methionine',
          'Xét nghiệm acid hữu cơ: tăng methylmalonic acid',
          'Xét nghiệm acid amin: tăng homocysteine, giảm methionine',
          'Đo nồng độ vitamin B12 và các metabolite',
          'Xét nghiệm gen: phân tích các gen liên quan'
        ],
        treatmentDetails: {
          prevention: [
            'Theo dõi sát sao các chỉ số sinh hóa',
            'Phòng ngừa huyết khối bằng aspirin liều thấp',
            'Vaccine đầy đủ để tránh nhiễm trùng',
            'Theo dõi chức năng thận và tim mạch'
          ],
          diet: [
            'Bổ sung hydroxocobalamin hoặc cyanocobalamin (liều cao)',
            'Bổ sung folate và betaine',
            'Hạn chế protein và methionine',
            'Bổ sung carnitine để hỗ trợ thải độc'
          ],
          acuteTreatment: [
            'Liều cao vitamin B12 trong các đợt cấp',
            'Điều trị hỗ trợ cho thiếu máu nặng',
            'Quản lý biến chứng huyết khối',
            'Theo dõi chức năng thận và tim'
          ],
          monitoring: [
            'Theo dõi MMA và homocysteine định kỳ',
            'Khám mắt định kỳ để phát hiện thoái hóa võng mạc',
            'Đánh giá chức năng thận và tim mạch',
            'Theo dõi phát triển thần kinh và nhận thức'
          ]
        },
        prognosis: 'Tiên lượng biến đổi tùy theo kiểu gen và đáp ứng điều trị. Nhiều biến chứng có thể tiến triển mặc dù điều trị tích cực. Chẩn đoán sớm và điều trị kịp thời có thể cải thiện tiên lượng nhưng không ngăn ngừa hoàn toàn các biến chứng dài hạn.',
        references: [
          'Huemer M, Baumgartner MR. The clinical presentation of cobalamin-related disorders: From acquired deficiencies to inborn errors of absorption and intracellular metabolism. J Inherit Metab Dis. 2019;42(4):686-705.',
          'Carrillo-Carrasco N, Venditti CP. Combined methylmalonic acidemia and homocystinuria. GeneReviews. University of Washington, Seattle.',
          'National Organization for Rare Disorders. Methylmalonic Acidemia with Homocystinuria.'
        ]
      }
    },
    {
      id: 11,
      code: 'D011',
      name: 'Methylmalonic acidemia with homocystinuria (MMADHC protein)',
      description: 'Rối loạn do đột biến gen MMADHC, ảnh hưởng đến chuyển hóa vitamin B12',
      synonyms: ['CblD-variant 1', 'MMADHC deficiency', 'CblD defect'],
      diagnosis: 'Tăng methylmalonic acid và homocysteine, phân tích gen MMADHC',
      treatment: 'Bổ sung hydroxocobalamin, folate, betaine',
      summary: ['MMADHC deficiency (cblD) là một rối loạn hiếm gặp trong nhóm các bệnh chuyển hóa vitamin B12, do đột biến gen MMADHC. Đây là một trong những kiểu nghiêm trọng nhất của nhóm cobalamin disorders.',
                'Bệnh biểu hiện với sự kết hợp của tăng methylmalonic acid và homocysteine, kèm theo các triệu chứng đa cơ quan nghiêm trọng bao gồm suy thận, bệnh mắt, và rối loạn thần kinh.',
                'Tiên lượng thường xấu hơn so với các kiểu cbl khác, với tỷ lệ tử vong cao và các biến chứng nặng nề mặc dù điều trị tích cực.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Biểu hiện sớm trong giai đoạn sơ sinh với bú kém, nôn mửa',
            'Thiếu máu megaloblastic nghiêm trọng',
            'Chậm phát triển tâm thần vận động rõ rệt',
            'Nhiễm toan chuyển hóa',
            'Giảm trương lực cơ và yếu cơ'
          ],
          lateStage: [
            'Suy thận tiến triển nhanh, có thể cần lọc máu',
            'Thoái hóa võng mạc và các vấn đề thị giác nghiêm trọng',
            'Rối loạn thần kinh tiến triển: co giật, dementia',
            'Bệnh mạch máu và huyết khối',
            'Suy tim và tăng huyết áp phổi'
          ],
          general: [
            'CblD thường có biểu hiện nghiêm trọng hơn các kiểu cbl khác và đáp ứng kém với điều trị vitamin B12. Các biến chứng thường xuất hiện sớm và tiến triển nhanh.'
          ]
        },
        causes: [
          'CblD do đột biến ở gen MMADHC, mã hóa protein tham gia vào quá trình chuyển hóa vitamin B12 trong tế bào.',
          'Protein MMADHC cần thiết cho việc chuyển đổi cobalamin thành các dạng hoạt tính adenosylcobalamin và methylcobalamin, dẫn đến thiếu hụt cả hai con đường chuyển hóa.'
        ],
        affectedPopulations: 'CblD là kiểu hiếm nhất trong nhóm cobalamin disorders, với chỉ vài trăm trường hợp được báo cáo trên toàn thế giới. Bệnh ảnh hưởng đến cả nam và nữ như nhau.',
        similarDiseases: [
          'CblC deficiency: có triệu chứng tương tự nhưng thường nhẹ hơn',
          'Isolated methylmalonic acidemia',
          'Hemolytic uremic syndrome: có thể gây suy thận tương tự'
        ],
        diagnosticMethods: [
          'Xét nghiệm acid hữu cơ: tăng cao methylmalonic acid',
          'Xét nghiệm acid amin: tăng homocysteine, giảm methionine',
          'Đo nồng độ vitamin B12 và các metabolite',
          'Xét nghiệm gen MMADHC: phát hiện đột biến đặc hiệu',
          'Đánh giá chức năng thận và mắt'
        ],
        treatmentDetails: {
          prevention: [
            'Theo dõi chặt chẽ chức năng thận',
            'Kiểm tra mắt định kỳ',
            'Phòng ngừa nhiễm trùng và biến chứng'
          ],
          diet: [
            'Bổ sung hydroxocobalamin liều cao',
            'Bổ sung folate và betaine',
            'Hạn chế protein nghiêm ngặt',
            'Bổ sung carnitine và các vitamin'
          ],
          acuteTreatment: [
            'Liều rất cao vitamin B12',
            'Lọc máu nếu suy thận nặng',
            'Điều trị hỗ trợ cho các biến chứng',
            'Theo dõi tích cực trong ICU'
          ],
          monitoring: [
            'Theo dõi chức năng thận hàng tuần',
            'Đánh giá mắt định kỳ',
            'Theo dõi các chỉ số sinh hóa',
            'Đánh giá phát triển thần kinh'
          ]
        },
        prognosis: 'Tiên lượng thường xấu với tỷ lệ tử vong cao trong những năm đầu đời. Các biến chứng nghiêm trọng như suy thận và mù lòa thường không thể đảo ngược mặc dù điều trị tích cực.',
        references: [
          'Weisfeld-Adams JD, Morrissey MA, Kirmse BM, et al. Newborn screening and early biochemical follow-up in combined methylmalonic aciduria and homocystinuria, cblC type. Mol Genet Metab. 2010;99(2):116-23.',
          'National Organization for Rare Disorders. Methylmalonic Acidemia with Homocystinuria, cblD Type.',
          'Huemer M, et al. Guidelines for the diagnosis and management of cblC-type methylmalonic aciduria and homocystinuria. J Inherit Metab Dis. 2017;40(1):21-48.'
        ]
      }
    },
    {
      id: 12,
      code: 'D012',
      name: 'Malonic acidemia',
      description: 'Thiếu hụt enzyme malonyl-CoA decarboxylase, gây tích tụ axit malonic',
      synonyms: ['MCD deficiency', 'Malonyl-CoA decarboxylase deficiency'],
      diagnosis: 'Tăng malonic acid trong nước tiểu, có thể tăng C3DC',
      treatment: 'Chế độ ăn đều đặn, tránh nhịn ăn, theo dõi phát triển',
      summary: ['Malonic acidemia là một rối loạn chuyển hóa hiếm gặp do thiếu hụt enzyme malonyl-CoA decarboxylase (MCD). Enzyme này tham gia vào quá trình oxy hóa acid béo và tổng hợp acid béo.',
                'Bệnh có phổ biểu hiện rộng, từ không triệu chứng đến chậm phát triển, co giật và cardiomyopathy. Nhiều trường hợp được phát hiện tình cờ qua xét nghiệm acid hữu cơ.',
                'Với quản lý phù hợp, hầu hết bệnh nhân có tiên lượng tốt, mặc dù một số có thể có chậm phát triển nhẹ.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Nhiều trường hợp không có triệu chứng trong giai đoạn sơ sinh',
            'Chậm tăng cân, bú kém ở một số trường hợp',
            'Co giật có thể xuất hiện sớm',
            'Chậm phát triển vận động nhẹ'
          ],
          lateStage: [
            'Chậm phát triển trí tuệ nhẹ đến trung bình',
            'Cardiomyopathy trong một số trường hợp',
            'Rối loạn học tập và hành vi',
            'Nhiễm toan chuyển hóa nhẹ'
          ],
          general: [
            'Biểu hiện lâm sàng rất đa dạng, từ hoàn toàn bình thường đến có triệu chứng rõ rệt. Mức độ nghiêm trọng không hoàn toàn tương quan với nồng độ malonic acid.'
          ]
        },
        causes: [
          'Malonic acidemia do đột biến ở gen MLYCD, mã hóa enzyme malonyl-CoA decarboxylase.',
          'Enzyme này tham gia vào điều hòa oxy hóa acid béo và tổng hợp acid béo. Khi thiếu hụt, malonyl-CoA tích tụ và được chuyển hóa thành malonic acid.'
        ],
        affectedPopulations: 'Malonic acidemia rất hiếm gặp với chỉ vài chục trường hợp được báo cáo trên toàn thế giới. Bệnh ảnh hưởng đến cả nam và nữ như nhau.',
        similarDiseases: [
          'Fatty acid oxidation disorders: có thể có triệu chứng tương tự',
          'Methylmalonic acidemia: cũng gây tăng acid hữu cơ',
          'Cardiomyopathy do các nguyên nhân khác'
        ],
        diagnosticMethods: [
          'Xét nghiệm acid hữu cơ nước tiểu: tăng malonic acid',
          'MS/MS: có thể phát hiện tăng C3DC-carnitine',
          'Xét nghiệm enzyme: đo hoạt tính malonyl-CoA decarboxylase',
          'Xét nghiệm gen: phân tích gen MLYCD'
        ],
        treatmentDetails: {
          prevention: [
            'Tránh nhịn ăn kéo dài',
            'Ăn thường xuyên, đặc biệt trước khi ngủ',
            'Theo dõi phát triển nhận thức'
          ],
          diet: [
            'Chế độ ăn cân bằng, không cần hạn chế đặc biệt',
            'Tăng cường dinh dưỡng trong thời kỳ bệnh',
            'Có thể bổ sung carnitine nếu cần'
          ],
          acuteTreatment: [
            'Điều trị triệu chứng khi có co giật',
            'Hỗ trợ dinh dưỡng trong thời kỳ cấp',
            'Theo dõi chức năng tim nếu có cardiomyopathy'
          ],
          monitoring: [
            'Đánh giá phát triển thần kinh định kỳ',
            'Siêu âm tim để theo dõi chức năng tim',
            'Xét nghiệm acid hữu cơ định kỳ',
            'Hỗ trợ giáo dục đặc biệt nếu cần'
          ]
        },
        prognosis: 'Tiên lượng thường tốt, nhất là với các trường hợp không triệu chứng. Một số có thể có chậm phát triển nhẹ nhưng thường không nghiêm trọng.',
        references: [
          'National Organization for Rare Disorders. Malonic Acidemia.',
          'Souri M, Aoyama T, Hoganson G, Hashimoto T. Very long-chain acyl-CoA dehydrogenase deficiency: molecular diagnosis by newborn screening. Mol Genet Metab. 2005;85(2):150-6.',
          'Jurecki E, Cederbaum S, Kopesky J, et al. Adherence to clinic recommendations among patients with phenylketonuria in the United States. Mol Genet Metab. 2017;120(3):190-197.'
        ]
      }
    },
    {
      id: 13,
      code: 'D013',
      name: 'Isobutyrylglycinuria',
      description: 'Thiếu hụt enzyme isobutyryl-CoA dehydrogenase trong chuyển hóa valine',
      synonyms: ['IBG', 'Isobutyryl-CoA dehydrogenase deficiency'],
      diagnosis: 'Tăng isobutyrylglycine trong nước tiểu, có thể tăng C4',
      treatment: 'Thường không cần điều trị đặc biệt, theo dõi định kỳ',
      summary: ['Isobutyrylglycinuria (IBG) là một rối loạn chuyển hóa lành tính do thiếu hụt enzyme isobutyryl-CoA dehydrogenase, tham gia vào quá trình phân hủy valine.',
                'Đây là một trong những rối loạn chuyển hóa lành tính nhất, với hầu hết các trường hợp hoàn toàn không có triệu chứng và được phát hiện tình cờ qua sàng lọc sơ sinh.',
                'Không cần điều trị đặc biệt và tiên lượng hoàn toàn tốt với phát triển bình thường.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Hầu hết hoàn toàn không có triệu chứng',
            'Phát triển bình thường trong giai đoạn sơ sinh',
            'Không có biểu hiện bất thường về thể chất'
          ],
          lateStage: [
            'Tiếp tục phát triển bình thường',
            'Một số nghiên cứu báo cáo chậm phát triển nhẹ nhưng chưa được xác nhận',
            'Không có biến chứng nghiêm trọng'
          ],
          general: [
            'IBG được coi là một biến thể bình thường hơn là một bệnh lý. Hầu hết các trường hợp được phát hiện qua sàng lọc sơ sinh và không bao giờ có triệu chứng.'
          ]
        },
        causes: [
          'IBG do đột biến ở gen ACAD8, mã hóa enzyme isobutyryl-CoA dehydrogenase.',
          'Enzyme này tham gia vào bước đầu của quá trình phân hủy valine. Khi thiếu hụt, isobutyryl-CoA được chuyển hóa thành isobutyrylglycine và thải qua nước tiểu.'
        ],
        affectedPopulations: 'IBG tương đối phổ biến hơn các rối loạn acid hữu cơ khác, với tỷ lệ khoảng 1/50.000 trẻ sơ sinh. Bệnh ảnh hưởng đến cả nam và nữ như nhau.',
        similarDiseases: [
          'Short-chain acyl-CoA dehydrogenase deficiency: cũng thường lành tính',
          'Ethylmalonic encephalopathy: có thể có triệu chứng tương tự nhưng nghiêm trọng hơn',
          'Các rối loạn chuyển hóa valine khác'
        ],
        diagnosticMethods: [
          'Sàng lọc sơ sinh: MS/MS có thể phát hiện tăng C4-carnitine',
          'Xét nghiệm acid hữu cơ nước tiểu: tăng isobutyrylglycine',
          'Xét nghiệm gen: phân tích gen ACAD8',
          'Thường không cần xét nghiệm enzyme'
        ],
        treatmentDetails: {
          prevention: [
            'Không cần biện pháp phòng ngừa đặc biệt',
            'Theo dõi phát triển thông thường'
          ],
          diet: [
            'Không cần hạn chế chế độ ăn',
            'Chế độ ăn bình thường phù hợp với tuổi',
            'Không cần bổ sung vitamin hay carnitine'
          ],
          acuteTreatment: [
            'Không cần điều trị cấp cứu',
            'Điều trị triệu chứng nếu có vấn đề khác không liên quan'
          ],
          monitoring: [
            'Theo dõi phát triển thông thường như trẻ bình thường',
            'Không cần xét nghiệm sinh hóa đặc biệt',
            'Tư vấn di truyền cho gia đình'
          ]
        },
        prognosis: 'Tiên lượng hoàn toàn tốt với phát triển bình thường. Được coi là một biến thể sinh hóa lành tính hơn là một bệnh lý thực sự.',
        references: [
          'National Organization for Rare Disorders. Isobutyrylglycinuria.',
          'Koeberl DD, Young SP, Gregersen NS, et al. Rare disorders of metabolism with elevated butyryl- and isobutyryl-carnitine detected by tandem mass spectrometry newborn screening. Pediatr Res. 2003;54(2):219-23.',
          'Ferdinandusse S, Friederich MW, Burlina A, et al. Clinical and biochemical characterization of four patients with mutations in ECHS1. Orphanet J Rare Dis. 2015;10:79.'
        ]
      }
    },
    {
      id: 14,
      code: 'D014',
      name: '2-Methyl-3-hydroxybutyric acidemia',
      description: 'Thiếu hụt enzyme 2-methyl-3-hydroxybutyryl-CoA dehydrogenase',
      synonyms: ['MHBD deficiency', '2M3HBA'],
      diagnosis: 'Tăng 2-methyl-3-hydroxybutyric acid trong nước tiểu',
      treatment: 'Theo dõi định kỳ, chế độ ăn cân bằng',
      summary: ['2-Methyl-3-hydroxybutyric acidemia là một rối loạn chuyển hóa hiếm gặp do thiếu hụt enzyme 2-methyl-3-hydroxybutyryl-CoA dehydrogenase, tham gia vào quá trình phân hủy isoleucine.',
                'Bệnh thường có biểu hiện nhẹ với chậm phát triển nhẹ hoặc không có triệu chứng. Một số trường hợp có thể có rối loạn thần kinh nhẹ.',
                'Với theo dõi thích hợp, hầu hết bệnh nhân có tiên lượng tốt và không cần điều trị đặc biệt.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Thường không có triệu chứng rõ rệt trong giai đoạn sơ sinh',
            'Có thể chậm phát triển vận động nhẹ',
            'Bú và tăng cân bình thường'
          ],
          lateStage: [
            'Chậm phát triển trí tuệ nhẹ ở một số trường hợp',
            'Rối loạn học tập nhẹ',
            'Một số có thể có rối loạn hành vi nhẹ'
          ],
          general: [
            'Phổ biểu hiện rộng từ hoàn toàn bình thường đến chậm phát triển nhẹ. Mức độ nghiêm trọng không tương quan với nồng độ acid trong nước tiểu.'
          ]
        },
        causes: [
          '2-Methyl-3-hydroxybutyric acidemia do đột biến ở gen HADH2, mã hóa enzyme 2-methyl-3-hydroxybutyryl-CoA dehydrogenase.',
          'Enzyme này tham gia vào quá trình phân hủy isoleucine. Khi thiếu hụt, 2-methyl-3-hydroxybutyric acid tích tụ và thải qua nước tiểu.'
        ],
        affectedPopulations: 'Đây là một rối loạn rất hiếm gặp với chỉ vài chục trường hợp được báo cáo. Bệnh ảnh hưởng đến cả nam và nữ như nhau.',
        similarDiseases: [
          'Beta-ketothiolase deficiency: cũng ảnh hưởng đến chuyển hóa isoleucine',
          'Methylmalonic acidemia: có thể có triệu chứng tương tự',
          'Các rối loạn chuyển hóa acid amino khác'
        ],
        diagnosticMethods: [
          'Xét nghiệm acid hữu cơ nước tiểu: tăng 2-methyl-3-hydroxybutyric acid',
          'MS/MS: có thể phát hiện bất thường trong một số trường hợp',
          'Xét nghiệm gen: phân tích gen HADH2',
          'Đánh giá phát triển thần kinh'
        ],
        treatmentDetails: {
          prevention: [
            'Theo dõi phát triển định kỳ',
            'Không cần biện pháp phòng ngừa đặc biệt'
          ],
          diet: [
            'Chế độ ăn cân bằng bình thường',
            'Không cần hạn chế isoleucine nghiêm ngặt',
            'Đảm bảo dinh dưỡng đầy đủ cho phát triển'
          ],
          acuteTreatment: [
            'Thường không cần điều trị cấp cứu',
            'Điều trị hỗ trợ nếu có các vấn đề khác'
          ],
          monitoring: [
            'Đánh giá phát triển thần kinh định kỳ',
            'Hỗ trợ giáo dục đặc biệt nếu cần',
            'Xét nghiệm acid hữu cơ định kỳ'
          ]
        },
        prognosis: 'Tiên lượng thường tốt. Một số có thể có chậm phát triển nhẹ nhưng thường không ảnh hưởng nghiêm trọng đến chất lượng cuộc sống.',
        references: [
          'Olsen RK, Olpin SE, Andresen BS, et al. ETFDH mutations as a major cause of riboflavin-responsive multiple acyl-CoA dehydrogenation deficiency. Brain. 2007;130(8):2045-54.',
          'National Organization for Rare Disorders. 2-Methyl-3-hydroxybutyric acidemia.',
          'Sass JO, Ensenauer R, Röschinger W, et al. 2-Methylbutyryl-CoA dehydrogenase deficiency: functional and molecular studies on a defect in isoleucine catabolism. Mol Genet Metab. 2008;93(1):30-5.'
        ]
      }
    },
    {
      id: 15,
      code: 'D015',
      name: '2-Methylbutyrylglycinuria',
      description: 'Thiếu hụt enzyme 2-methylbutyryl-CoA dehydrogenase trong chuyển hóa isoleucine',
      synonyms: ['2-MBG', '2-Methylbutyryl-CoA dehydrogenase deficiency'],
      diagnosis: 'Tăng 2-methylbutyrylglycine trong nước tiểu',
      treatment: 'Thường không cần điều trị, theo dõi định kỳ',
      summary: ['2-Methylbutyrylglycinuria là một rối loạn chuyển hóa lành tính do thiếu hụt enzyme 2-methylbutyryl-CoA dehydrogenase, tham gia vào quá trình phân hủy isoleucine.',
                'Tương tự như isobutyrylglycinuria, đây là một rối loạn rất lành tính với hầu hết các trường hợp không có triệu chứng lâm sàng.',
                'Được phát hiện chủ yếu qua sàng lọc sơ sinh và không cần điều trị đặc biệt.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Hoàn toàn không có triệu chứng trong giai đoạn sơ sinh',
            'Phát triển bình thường',
            'Không có bất thường về thể chất'
          ],
          lateStage: [
            'Tiếp tục phát triển bình thường',
            'Không có biến chứng lâu dài',
            'Có thể chậm phát triển rất nhẹ nhưng chưa được khẳng định'
          ],
          general: [
            'Được coi là một biến thể sinh hóa lành tính. Hầu hết các trường hợp không bao giờ có triệu chứng và được phát hiện tình cờ.'
          ]
        },
        causes: [
          '2-Methylbutyrylglycinuria do đột biến ở gen SBCAD (ACADSB), mã hóa enzyme 2-methylbutyryl-CoA dehydrogenase.',
          'Enzyme này tham gia vào quá trình phân hủy isoleucine. Khi thiếu hụt, 2-methylbutyryl-CoA được chuyển hóa thành 2-methylbutyrylglycine.'
        ],
        affectedPopulations: '2-MBG tương đối phổ biến hơn nhiều rối loạn acid hữu cơ khác, với tỷ lệ khoảng 1/50.000 đến 1/100.000 trẻ sơ sinh. Bệnh ảnh hưởng đến cả nam và nữ như nhau.',
        similarDiseases: [
          'Isobutyrylglycinuria: cũng rất lành tính và không triệu chứng',
          'Short-chain acyl-CoA dehydrogenase deficiency',
          'Các rối loạn chuyển hóa isoleucine khác'
        ],
        diagnosticMethods: [
          'Xét nghiệm acid hữu cơ nước tiểu: tăng 2-methylbutyrylglycine',
          'MS/MS: có thể phát hiện bất thường C5-carnitine',
          'Xét nghiệm gen: phân tích gen SBCAD',
          'Thường không cần xét nghiệm enzyme'
        ],
        treatmentDetails: {
          prevention: [
            'Không cần biện pháp phòng ngừa',
            'Theo dõi phát triển thông thường'
          ],
          diet: [
            'Chế độ ăn bình thường',
            'Không cần hạn chế isoleucine',
            'Không cần bổ sung đặc biệt'
          ],
          acuteTreatment: [
            'Không cần điều trị cấp cứu',
            'Không có các đợt cấp'
          ],
          monitoring: [
            'Theo dõi phát triển thông thường',
            'Tư vấn di truyền cho gia đình',
            'Không cần xét nghiệm đặc biệt'
          ]
        },
        prognosis: 'Tiên lượng hoàn toàn tốt. Được coi là một biến thể bình thường hơn là một bệnh lý cần điều trị.',
        references: [
          'National Organization for Rare Disorders. 2-Methylbutyrylglycinuria.',
          'Gibson KM, Bennett MJ, Naylor EW, Morton DH. Short-chain acyl-coenzyme A dehydrogenase deficiency. Acta Paediatr Suppl. 1999;88(432):59-61.',
          'Sass JO, Ensenauer R, Röschinger W, et al. 2-Methylbutyryl-CoA dehydrogenase deficiency. Mol Genet Metab. 2008;93(1):30-5.'
        ]
      }
    },
    {
      id: 16,
      code: 'D016',
      name: '3-Methylglutaconic acidemia type I',
      description: 'Thiếu hụt enzyme 3-methylglutaconyl-CoA hydratase trong chuyển hóa leucine',
      synonyms: ['3-MGA type I', 'MGA1', '3-Methylglutaconyl-CoA hydratase deficiency'],
      diagnosis: 'Tăng 3-methylglutaconic acid và 3-methylglutaric acid trong nước tiểu',
      treatment: 'Chế độ ăn hạn chế leucine, bổ sung carnitine',
      summary: ['3-Methylglutaconic acidemia type I (3-MGA I) là dạng nhẹ nhất trong nhóm các rối loạn 3-methylglutaconic acidemia, do thiếu hụt enzyme 3-methylglutaconyl-CoA hydratase trong con đường phân hủy leucine.',
                'Khác với các type khác, 3-MGA I có nguyên nhân sinh hóa rõ ràng và thường có biểu hiện nhẹ hơn với chậm phát triển nhẹ và rối loạn thần kinh không nghiêm trọng.',
                'Với điều trị thích hợp, hầu hết bệnh nhân có tiên lượng tương đối tốt so với các type khác.'],
      overview: {
        signsAndSymptoms: {
          earlyStage: [
            'Chậm phát triển nhẹ trong giai đoạn nhũ nhi',
            'Có thể có chậm nói',
            'Giảm trương lực cơ nhẹ',
            'Bú và tăng cân có thể chậm'
          ],
          lateStage: [
            'Chậm phát triển trí tuệ nhẹ đến trung bình',
            'Rối loạn ngôn ngữ và học tập',
            'Co giật ở một số trường hợp',
            'Nhiễm toan chuyển hóa nhẹ từng đợt'
          ],
          general: [
            '3-MGA I thường có biểu hiện nhẹ nhất trong nhóm 3-methylglutaconic acidemia. Các triệu chứng chủ yếu liên quan đến chậm phát triển và rối loạn học tập.'
          ]
        },
        causes: [
          '3-MGA I do đột biến ở gen AUH, mã hóa enzyme 3-methylglutaconyl-CoA hydratase.',
          'Enzyme này tham gia vào con đường phân hủy leucine. Khi thiếu hụt, 3-methylglutaconic acid và 3-methylglutaric acid tích tụ và thải qua nước tiểu.'
        ],
        affectedPopulations: '3-MGA I rất hiếm gặp với chỉ vài chục trường hợp được báo cáo trên toàn thế giới. Bệnh ảnh hưởng đến cả nam và nữ như nhau.',
        similarDiseases: [
          '3-Methylglutaconic acidemia type II (Barth syndrome): nghiêm trọng hơn với cardiomyopathy',
          '3-Methylglutaconic acidemia type III: có rối loạn thần kinh nặng hơn',
          'HMG-CoA lyase deficiency: cũng ảnh hưởng đến chuyển hóa leucine'
        ],
        diagnosticMethods: [
          'Xét nghiệm acid hữu cơ nước tiểu: tăng 3-methylglutaconic acid và 3-methylglutaric acid',
          'MS/MS: có thể phát hiện bất thường trong sàng lọc mở rộng',
          'Xét nghiệm enzyme: đo hoạt tính 3-methylglutaconyl-CoA hydratase',
          'Xét nghiệm gen: phân tích gen AUH'
        ],
        treatmentDetails: {
          prevention: [
            'Tránh stress chuyển hóa',
            'Theo dõi phát triển nhận thức',
            'Giáo dục gia đình về dấu hiệu cảnh báo'
          ],
          diet: [
            'Hạn chế leucine trong chế độ ăn',
            'Bổ sung L-carnitine',
            'Chế độ ăn cân bằng với protein vừa phải',
            'Tránh nhịn ăn kéo dài'
          ],
          acuteTreatment: [
            'Điều trị nhiễm toan nếu có',
            'Hỗ trợ dinh dưỡng trong thời kỳ bệnh',
            'Điều trị co giật nếu xuất hiện'
          ],
          monitoring: [
            'Đánh giá phát triển thần kinh định kỳ',
            'Xét nghiệm acid hữu cơ định kỳ',
            'Hỗ trợ giáo dục đặc biệt',
            'Theo dõi tình trạng dinh dưỡng'
          ]
        },
        prognosis: 'Tiên lượng tương đối tốt so với các type khác của 3-MGA. Hầu hết có thể sống độc lập với hỗ trợ giáo dục thích hợp, mặc dù có thể có chậm phát triển nhẹ.',
        references: [
          'National Organization for Rare Disorders. 3-Methylglutaconic Acidemia.',
          'Wortmann SB, Kluijtmans LA, Rodenburg RJ, et al. 3-Methylglutaconic aciduria type I redefined: a syndrome with late-onset leukoencephalopathy. Neurology. 2010;75(12):1079-83.',
          'Kelson TL, Secor McVoy JR, Rizzo WB. Human liver fatty aldehyde dehydrogenase: microsomal localization, purification, and biochemical characterization. Biochim Biophys Acta. 1997;1335(1-2):99-110.'
        ]
      }
    }
  ]);

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDisease = (disease: Disease, type: 'detail' | 'summary') => {
    setSelectedDisease(disease);
    setViewType(type);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Danh mục bệnh</h2>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên bệnh hoặc mã bệnh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Disease Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bệnh ({filteredDiseases.length} bệnh)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã bệnh</TableHead>
                <TableHead>Tên bệnh</TableHead>
                <TableHead>Mô tả ngắn</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiseases.map((disease) => (
                <TableRow key={disease.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {disease.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {disease.name}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {disease.description.substring(0, 100)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDisease(disease, 'detail')}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Chi tiết
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDisease(disease, 'summary')}
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Tóm tắt
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Disease Details Dialog */}
      {selectedDisease && (
        <Dialog open={!!selectedDisease} onOpenChange={() => setSelectedDisease(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {viewType === 'detail' ? 'Thông tin chi tiết' : 'Tóm tắt'}: {selectedDisease.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {viewType === 'detail' ? (
                <div className="space-y-6">
                  {/* Từ đồng nghĩa */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-800">Từ đồng nghĩa</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedDisease.synonyms.map((synonym: string, index: number) => (
                        <li key={index} className="text-slate-700">{synonym}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Dấu hiệu và Triệu chứng */}
                  {selectedDisease.overview?.signsAndSymptoms && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-slate-800">Dấu hiệu và Triệu chứng</h3>
                      <div className="space-y-3">
                        {selectedDisease.id === 3 ? (
                          // Format for CITRULLINEMIA TYPE I (ID: 003)
                          <>
                            {selectedDisease.overview.signsAndSymptoms.earlyStage && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">1. Thể sơ sinh (thường gặp nhất):</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.signsAndSymptoms.earlyStage.map((symptom: string, index: number) => (
                                    <li key={index} className="text-slate-600">{symptom}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedDisease.overview.signsAndSymptoms.lateStage && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">2. Thể khởi phát muộn hoặc không điển hình:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.signsAndSymptoms.lateStage.map((symptom: string, index: number) => (
                                    <li key={index} className="text-slate-600">{symptom}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedDisease.overview.signsAndSymptoms.general && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">3. Dấu hiệu sinh hóa:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.signsAndSymptoms.general.map((note: string, index: number) => (
                                    <li key={index} className="text-slate-600">{note}</li>
                                  ))}
                                </ul>
                              </div>
                                                         )}
                           </>
                        ) : selectedDisease.id === 5 ? (
                          // Format for GLUTARIC ACIDEMIA TYPE I (ID: 005)
                          <>
                            {selectedDisease.overview.signsAndSymptoms.general && (
                              <div className="mb-3">
                                <p className="text-slate-700">{selectedDisease.overview.signsAndSymptoms.general[0]}</p>
                              </div>
                            )}
                            {selectedDisease.overview.signsAndSymptoms.earlyStage && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">Giai đoạn sơ sinh - nhũ nhi:</h4>
                                <p className="text-slate-600 mb-2">{selectedDisease.overview.signsAndSymptoms.earlyStage[0]}</p>
                                <ul className="list-disc list-inside space-y-1 ml-8">
                                  {selectedDisease.overview.signsAndSymptoms.earlyStage.slice(1).map((symptom: string, index: number) => (
                                    <li key={index} className="text-slate-600">{symptom}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedDisease.overview.signsAndSymptoms.lateStage && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">Giai đoạn muộn hoặc thể nhẹ:</h4>
                                <p className="text-slate-600">{selectedDisease.overview.signsAndSymptoms.lateStage[0]}</p>
                              </div>
                            )}
                            {selectedDisease.overview.signsAndSymptoms.special && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">Triệu chứng đặc biệt:</h4>
                                <p className="text-slate-600">{selectedDisease.overview.signsAndSymptoms.special[0]}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {selectedDisease.overview.signsAndSymptoms.earlyStage && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">Giai đoạn sơ sinh - nhũ nhi:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.signsAndSymptoms.earlyStage.map((symptom: string, index: number) => (
                                    <li key={index} className="text-slate-600">{symptom}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedDisease.overview.signsAndSymptoms.lateStage && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">Giai đoạn muộn:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.signsAndSymptoms.lateStage.map((symptom: string, index: number) => (
                                    <li key={index} className="text-slate-600">{symptom}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedDisease.overview.signsAndSymptoms.general && (
                              <ul className="list-disc list-inside space-y-1">
                                {selectedDisease.overview.signsAndSymptoms.general.map((note: string, index: number) => (
                                  <li key={index} className="text-slate-700">{note}</li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Nguyên nhân */}
                  {selectedDisease.overview?.causes && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-slate-800">Nguyên nhân</h3>
                      <div className="space-y-2">
                        {selectedDisease.overview.causes.map((cause: string, index: number) => (
                          <p key={index} className="text-slate-700">{cause}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Đối tượng ảnh hưởng */}
                  {selectedDisease.overview?.affectedPopulations && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-slate-800">Đối tượng ảnh hưởng</h3>
                      <p className="text-slate-700">{selectedDisease.overview.affectedPopulations}</p>
                    </div>
                  )}

                  {/* Các bệnh có triệu chứng tương tự */}
                  {selectedDisease.overview?.similarDiseases && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-slate-800">Các bệnh có triệu chứng tương tự</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedDisease.overview.similarDiseases.map((disease: string, index: number) => (
                          <li key={index} className="text-slate-700">{disease}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Chẩn đoán */}
                  {selectedDisease.overview?.diagnosticMethods && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-slate-800">Chẩn đoán</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedDisease.overview.diagnosticMethods.map((method: string, index: number) => (
                          <li key={index} className="text-slate-700">{method}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Điều trị */}
                  {selectedDisease.overview?.treatmentDetails && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-slate-800">Điều trị</h3>
                      <div className="space-y-3">
                        {selectedDisease.id === 3 ? (
                          // Format for CITRULLINEMIA TYPE I (ID: 003)
                          <>
                            <p className="text-slate-700">Mục tiêu điều trị là giảm ammoniac máu và duy trì chuyển hóa nitơ ổn định.</p>
                            
                            {selectedDisease.overview.treatmentDetails.acuteTreatment && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">1. Trong đợt cấp:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.acuteTreatment.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.diet && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">2. Dài hạn:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.diet.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.monitoring && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">3. Theo dõi định kỳ:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.monitoring.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : selectedDisease.id === 2 ? (
                          // Format for ARGININEMIA (ID: 002)
                          <>
                            <p className="text-slate-700">Mục tiêu điều trị là giảm nồng độ arginine và amoniac máu để phòng ngừa tổn thương thần kinh tiến triển.</p>
                            
                            {selectedDisease.overview.treatmentDetails.diet && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">1. Chế độ ăn uống:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.diet.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.acuteTreatment && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">2. Thuốc hỗ trợ thải ammoniac:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.acuteTreatment.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.monitoring && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">3. Theo dõi định kỳ:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.monitoring.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.prevention && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">4. Điều trị triệu chứng thần kinh:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.prevention.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : selectedDisease.id === 4 ? (
                          // Format for ISOVALERIC ACIDEMIA (ID: 004)
                          <>
                            {selectedDisease.overview.treatmentDetails.prevention && (
                              <div>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.prevention.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.diet && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">Bổ sung dinh dưỡng</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.diet.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.acuteTreatment && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">Xử lý trong các đợt cấp</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.acuteTreatment.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : selectedDisease.id === 5 ? (
                          // Format for GLUTARIC ACIDEMIA TYPE I (ID: 005)
                          <>
                            {selectedDisease.overview.treatmentDetails.prevention && (
                              <div className="mb-3">
                                <p className="text-slate-700">{selectedDisease.overview.treatmentDetails.prevention[0]}</p>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.diet && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">1. Chế độ ăn uống đặc biệt:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.diet.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.acuteTreatment && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">2. Dự phòng và điều trị các đợt cấp:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.acuteTreatment.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.monitoring && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">3. Theo dõi lâu dài:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.monitoring.slice(0, 2).map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.monitoring && selectedDisease.overview.treatmentDetails.monitoring.length > 2 && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">4. Hỗ trợ khác:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.monitoring.slice(2).map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : (
                          // Default format for other diseases
                          <>
                            <p className="text-slate-700">Hiện không có cách chữa khỏi hoàn toàn, nhưng nếu được chẩn đoán sớm và điều trị đúng, trẻ có thể phát triển tốt.</p>
                            
                            {selectedDisease.overview.treatmentDetails.prevention && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">1. Phòng ngừa các đợt cấp:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.prevention.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.diet && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">2. Chế độ ăn uống:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.diet.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.acuteTreatment && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">3. Điều trị trong đợt cấp:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.acuteTreatment.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedDisease.overview.treatmentDetails.monitoring && (
                              <div>
                                <h4 className="font-medium mb-2 text-slate-700">4. Theo dõi định kỳ:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                  {selectedDisease.overview.treatmentDetails.monitoring.map((item: string, index: number) => (
                                    <li key={index} className="text-slate-600">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tiên lượng */}
                  {selectedDisease.overview?.prognosis && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-slate-800">Tiên lượng</h3>
                      <p className="text-slate-700">{selectedDisease.overview.prognosis}</p>
                    </div>
                  )}

                  {/* Tài liệu tham khảo */}
                  {selectedDisease.overview?.references && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-slate-800">Tài liệu tham khảo</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedDisease.overview.references.map((reference: string, index: number) => (
                          <li key={index} className="text-slate-700 text-sm">{reference}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-2">Tóm tắt:</h3>
                  {Array.isArray(selectedDisease.summary) ? (
                    <div className="space-y-2">
                      {selectedDisease.summary.map((paragraph: string, index: number) => (
                        <p key={index} className="text-slate-700">{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-700">{selectedDisease.summary}</p>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
