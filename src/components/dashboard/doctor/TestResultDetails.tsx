import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { PdfGenerator } from '@/lib/pdfGenerator';
import { Download, FileText, Activity, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BIOMARKER_LIST, generateDefaultBiomarkers } from '@/data/biomarkers';

// --- PHẦN 1: DỮ LIỆU BỆNH ĐÃ ĐƯỢC CẬP NHẬT ---
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
  'D002': {
    id: 2,
    code: 'D002',
    name: 'ARGININEMIA',
    classification: 'Rối loạn chu trình ure',
    description: 'Thiếu hụt enzym arginase 1 – ARG1 deficiency',
    synonyms: ['Arginase 1 deficiency', 'ARG1 deficiency', 'Hyperargininemia'],
    diagnosis: 'Xét nghiệm tandem MS, tăng glutarylcarnitine, phân tích nước tiểu',
    treatment: 'Chế độ ăn hạn chế lysine và tryptophan, bổ sung carnitine và riboflavin',
    summary: ['Argininemia là một rối loạn chuyển hóa hiếm gặp, thuộc nhóm rối loạn chu trình ure. Bệnh xảy ra do đột biến ở gen ARG1, gây thiếu hụt enzym arginase 1 – enzym cần thiết để chuyển hóa arginine thành ornithine và urê nhằm thải trừ nitơ dư thừa ra khỏi cơ thể.', 'Thiếu enzym này dẫn đến tích tụ arginine và amoniac trong máu, gây độc cho hệ thần kinh trung ương. Triệu chứng thường xuất hiện từ cuối giai đoạn nhũ nhi đến thời thơ ấu, với các biểu hiện như chậm phát triển, co cứng cơ, co giật và chậm nói.', 'So với các rối loạn chu trình ure khác, argininemia thường có biểu hiện mạn tính và ít gây tăng amoniac cấp tính nghiêm trọng hơn, nhưng vẫn có thể dẫn đến tổn thương thần kinh vĩnh viễn nếu không được điều trị.'],
    overview: { signsAndSymptoms: { general: ['Bệnh thường biểu hiện từ 1 đến 3 tuổi, sau một giai đoạn sơ sinh hoàn toàn bình thường. Các dấu hiệu thường gặp:', 'Chậm phát triển thể chất và vận động, đặc biệt là kỹ năng đi đứng', 'Tăng trương lực cơ (spasticity), thường ở hai chân – có thể dẫn đến dáng đi cứng hoặc bại liệt thể co cứng', 'Co giật', 'Chậm nói, chậm phát triển trí tuệ', 'Tăng nồng độ arginine máu và, trong một số trường hợp, tăng amoniac', 'Không giống các rối loạn chu trình ure khác như OTC hay CPS1 deficiency, các cơn tăng amoniac cấp tính trong argininemia ít gặp hơn, và bệnh thường tiến triển âm thầm với tổn thương thần kinh tiến triển.'] }, causes: ['Argininemia là bệnh di truyền lặn trên nhiễm sắc thể thường. Trẻ mắc bệnh khi thừa hưởng 2 bản sao đột biến của gen ARG1, nằm trên nhiễm sắc thể 6q23.', 'Gen ARG1 mã hóa enzym arginase 1, enzyme này xúc tác bước cuối cùng trong chu trình ure – phân hủy arginine thành ornithine và urê. Khi enzym thiếu hụt, arginine không được chuyển hóa hết và tích tụ trong máu, đồng thời làm giảm khả năng loại bỏ amoniac.'], affectedPopulations: 'Argininemia là một bệnh rất hiếm gặp, với tỷ lệ khoảng 1 trên 1.100.000 trẻ sơ sinh ở Hoa Kỳ. Cả nam và nữ đều có thể bị ảnh hưởng như nhau.', similarDiseases: ['Các rối loạn chu trình ure khác: thường có biểu hiện sớm với tăng amoniac cấp, nôn mửa, hôn mê sơ sinh', 'Bại não thể co cứng (spastic cerebral palsy): có thể giống về biểu hiện thần kinh nhưng không có bất thường chuyển hóa', 'Bệnh lý thần kinh tiến triển khác ở trẻ nhỏ', 'Phenylketonuria (PKU): cũng có thể gây chậm phát triển tâm thần nếu không điều trị'], diagnosticMethods: ['Sàng lọc sơ sinh: ', 'Argininemia có thể được phát hiện qua chương trình sàng lọc sơ sinh bằng khối phổ ghép nối (MS/MS) – phát hiện mức arginine tăng cao trong máu.', 'Xét nghiệm chẩn đoán: ', 'Xét nghiệm acid amin huyết tương: tăng arginine', 'Xét nghiệm ammonia máu: có thể tăng nhẹ', 'Xét nghiệm enzym arginase: xác định hoạt tính thấp trong hồng cầu', 'Xét nghiệm gen: phân tích gen ARG1 để xác định đột biến'], treatmentDetails: { diet: ['Chế độ ăn ít protein, đặc biệt là hạn chế arginine', 'Sử dụng các công thức y tế chuyên biệt không chứa arginine', 'Hỗ trợ bởi chuyên gia dinh dưỡng chuyên sâu về rối loạn chuyển hóa'], acuteTreatment: ['Sodium benzoate, sodium phenylbutyrate hoặc glycerol phenylbutyrate có thể được sử dụng để giúp thải amoniac qua con đường thay thế'], monitoring: ['Đánh giá sự phát triển vận động và thần kinh', 'Theo dõi nồng độ arginine, ammonia và các chỉ số dinh dưỡng'], prevention: ['Vật lý trị liệu để hỗ trợ vận động', 'Thuốc chống co giật nếu cần'] }, prognosis: 'Nếu phát hiện và điều trị sớm, nhiều bệnh nhân có thể phát triển tương đối bình thường và tránh được các biến chứng thần kinh nặng. Tuy nhiên, tổn thương thần kinh do bệnh gây ra thường không hồi phục nếu đã xuất hiện trước khi chẩn đoán.', references: ['National Organization for Rare Disorders. Arginase 1 Deficiency (Argininemia)', 'Summar ML, Tuchman M. Urea Cycle Disorders Overview. GeneReviews. University of Washington, Seattle. Updated 2020.', 'Sin YY, Baron G, Schulze A, et al. Arginase deficiency. JIMD Reports. 2015;22:45–52. https://pubmed.ncbi.nlm.nih.gov/25403983', 'Caldovic L, Morizono H, Tuchman M. Genetics and diagnosis of urea cycle disorders. J Pediatr Biochem. 2007;1(1):37–46.'] }
  },
  'D003': {
    id: 3,
    code: 'D003',
    name: 'CITRULLINEMIA TYPE I',
    classification: 'Rối loạn chu trình ure',
    description: 'Thiếu hụt enzym argininosuccinate synthetase – ASS1 deficiency',
    synonyms: ['ASS1 deficiency', 'Argininosuccinate synthetase deficiency', 'Argininosuccinate synthetase deficiency (Citrullinemia)', 'Citrullinemia', 'Citrullinemia I', 'Citrullinemia type I', 'Citrullinemia type I (Argininosuccinate synthetase deficiency)', 'Citrullinemia, Type 1', 'Citrullinemia, type 1 or ASA synthetase deficiency'],
    diagnosis: 'Xét nghiệm tandem mass spectrometry, phát hiện tăng C5 (isovalerylcarnitine)',
    treatment: 'Chế độ ăn hạn chế leucine, bổ sung glycine và carnitine',
    summary: ['Citrullinemia type I (CTLN1) là một rối loạn chuyển hóa bẩm sinh hiếm gặp thuộc nhóm rối loạn chu trình ure – con đường chính của cơ thể để loại bỏ amoniac dư thừa. Bệnh do đột biến ở gen ASS1, gây thiếu hụt enzym argininosuccinate synthetase. Khi enzym này bị thiếu hoặc bất hoạt, amoniac tích tụ trong máu (tăng ammoniac máu), dẫn đến tổn thương thần kinh nghiêm trọng hoặc tử vong nếu không được điều trị kịp thời.', 'CTLN1 thường biểu hiện ở giai đoạn sơ sinh, với các triệu chứng như bú kém, nôn, ngủ gà, giảm trương lực cơ, hôn mê và co giật. Một số thể nhẹ có thể khởi phát muộn hơn hoặc không biểu hiện rõ ràng cho đến khi có yếu tố khởi phát như nhịn ăn, stress chuyển hóa hoặc nhiễm trùng.', 'Nếu được phát hiện sớm và điều trị đúng cách, tiên lượng có thể cải thiện đáng kể.'],
    overview: { signsAndSymptoms: { earlyStage: ['Khởi phát trong vài ngày đầu sau sinh', 'Bú kém, nôn mửa', 'Ngủ gà, giảm trương lực cơ', 'Co giật, hôn mê', 'Tăng ammoniac máu nặng (thường > 1000 µmol/L)', 'Nếu không điều trị, tổn thương não không hồi phục hoặc tử vong'], lateStage: ['Triệu chứng xuất hiện ở trẻ nhỏ hoặc thanh thiếu niên', 'Có thể gồm: đau đầu, rối loạn hành vi, giảm tập trung, buồn nôn, giảm lực cơ', 'Một số người mang đột biến nhưng không có triệu chứng'], general: ['Tăng nồng độ citrulline trong huyết tương', 'Tăng ammoniac máu', 'Nồng độ acid amin bất thường trong huyết tương và nước tiểu'] }, causes: ['CTLN1 là bệnh di truyền lặn trên nhiễm sắc thể thường do đột biến gen ASS1 nằm trên nhiễm sắc thể 9q34.1. Gen này mã hóa enzym argininosuccinate synthetase, tham gia bước thứ ba của chu trình ure – kết hợp citrulline với aspartate để tạo thành argininosuccinate.', 'Khi enzym này thiếu hụt: ', 'Ammoniac không được chuyển hóa thành urê để thải qua thận', 'Citrulline tích tụ trong máu và nước tiểu', 'Amoniac tích tụ trong máu gây độc thần kinh'], affectedPopulations: 'Citrullinemia type I là bệnh hiếm gặp, tỷ lệ ước tính khoảng 1/57.000 trẻ sơ sinh ở Hoa Kỳ. Bệnh ảnh hưởng đến cả nam và nữ như nhau. Một số cộng đồng có tỷ lệ cao hơn do yếu tố di truyền, ví dụ: cộng đồng Amish và Mennonite.', similarDiseases: ['Các rối loạn chu trình ure khác: OTC deficiency, CPS1 deficiency, Argininemia, ASA lyase deficiency', 'Rối loạn acid hữu cơ (organic acidemias): cũng có thể gây tăng ammoniac, nhiễm toan', 'Nhiễm trùng huyết sơ sinh, xuất huyết não, hạ đường huyết: có thể có biểu hiện lâm sàng tương tự'], diagnosticMethods: ['Sàng lọc sơ sinh: ', 'Được phát hiện thông qua chương trình MS/MS – nồng độ citrulline tăng cao trong mẫu máu gót chân', 'Xét nghiệm chẩn đoán: ', 'Xét nghiệm ammoniac máu: tăng rất cao trong thể sơ sinh', 'Acid amin huyết tương: tăng citrulline', 'Xét nghiệm enzym: đo hoạt tính argininosuccinate synthetase trong nguyên bào sợi da', 'Xét nghiệm gen: xác định đột biến trong gen ASS1', 'Chẩn đoán trước sinh: ', 'Phân tích gen thai nhi nếu đã biết đột biến trong gia đình', 'Đo hoạt tính enzym hoặc nồng độ chất chuyển hóa trong dịch ối'], treatmentDetails: { acuteTreatment: ['Nhập viện khẩn cấp', 'Truyền glucose để giảm dị hóa', 'Sử dụng thuốc thải amoniac như sodium benzoate, sodium phenylbutyrate', 'Truyền arginine để hỗ trợ chu trình ure', 'Lọc máu trong các trường hợp tăng ammoniac nặng (thường > 500–1000 µmol/L)'], diet: ['Chế độ ăn hạn chế protein (tùy theo độ tuổi và mức độ nặng)', 'Sử dụng thực phẩm y tế chuyên biệt (không chứa citrulline)', 'Bổ sung arginine', 'Thuốc hỗ trợ thải amoniac'], monitoring: ['Xét nghiệm ammoniac, acid amin máu', 'Đánh giá phát triển thần kinh, vận động', 'Đánh giá chế độ dinh dưỡng'] }, prognosis: 'Nếu được chẩn đoán sớm và điều trị đúng, nhiều trẻ có thể phát triển tốt và tránh được tổn thương não. Tuy nhiên, các đợt tăng ammoniac nghiêm trọng có thể để lại di chứng thần kinh không hồi phục.', references: ['National Organization for Rare Disorders. Citrullinemia Type I', 'Summar ML, Tuchman M. Urea Cycle Disorders Overview. GeneReviews. University of Washington, Seattle. Updated 2020.', 'Scaglia F, Lee B. Clinical spectrum and outcomes of urea cycle disorders. Mol Genet Metab. 2006;81:S112–S120.', 'Häberle J, Huemer M, Burlina A, et al. Suggested guidelines for the diagnosis and management of urea cycle disorders. Orphanet J Rare Dis. 2012;7:32. https://pubmed.ncbi.nlm.nih.gov/22770389'] }
  },
  'D004': {
    id: 4,
    code: 'D004',
    name: 'ISOVALERIC ACIDEMIA',
    classification: 'Rối loạn chuyển hóa axit amin',
    description: 'Thiếu hụt enzym isovaleryl-CoA dehydrogenase (IVD)',
    synonyms: ['Thiếu hụt isovaleric acid CoA dehydrogenase', 'IVA'],
    diagnosis: 'Tăng các axit hữu cơ trong nước tiểu, giảm hoạt độ carboxylase',
    treatment: 'Bổ sung biotin liều cao, theo dõi định kỳ',
    summary: ['Isovaleric acidemia (toan axit isovaleric) là một rối loạn chuyển hóa di truyền, do đột biến gen mã hóa enzym isovaleryl-CoA dehydrogenase, dẫn đến giảm hoặc mất hoàn toàn hoạt động của enzym này. Enzym này đóng vai trò trong việc phân hủy leucine – một loại axit amin. Sự thiếu hụt enzym khiến các hóa chất tích tụ trong máu gây ra các triệu chứng.', 'Bệnh có thể khởi phát với các cơn cấp tính từng đợt trong giai đoạn sơ sinh hoặc sau này trong thời thơ ấu. Các cơn cấp tính đặc trưng bởi: nôn, bỏ bú, lừ đừ, các chỉ số xét nghiệm bất thường và mùi mồ hôi giống như mùi chân.', 'Các triệu chứng mạn tính có thể bao gồm: chậm lớn (suy dinh dưỡng) và chậm phát triển tâm thần vận động.', 'Việc điều trị bao gồm chế độ ăn ít protein, đặc biệt là hạn chế leucine; tránh các yếu tố gây khởi phát cơn cấp; và bổ sung carnitine và/hoặc glycine.', 'Hiện chưa có phương pháp chữa khỏi hoàn toàn, tuy nhiên khi người bệnh lớn lên, các cơn cấp thường xuất hiện ít hơn.'],
    overview: { signsAndSymptoms: { general: ['Isovaleric acidemia là một rối loạn chuyển hóa hiếm gặp với mức độ nghiêm trọng thay đổi từ không có triệu chứng cho đến nhẹ hoặc đe dọa tính mạng, tùy thuộc vào kiểu đột biến gen và các yếu tố khởi phát cơn cấp tính. Hai biểu hiện lâm sàng chính thường được mô tả là thể cấp tính và thể mạn tính từng đợt, nhưng trên thực tế, bệnh này được xem như một phổ liên tục từ không triệu chứng đến nghiêm trọng. Một đặc điểm điển hình là mùi hôi chân trong mồ hôi hoặc ráy tai, do sự tích tụ của acid isovaleric. Trẻ có thể sớm phát triển ác cảm với thực phẩm giàu protein.', 'Ở thể cấp tính, các triệu chứng thường xuất hiện sớm sau sinh, với biểu hiện lừ đừ ngày càng tăng, bú kém, nôn mửa, và có thể tiến triển đến hôn mê. Những biểu hiện này liên quan đến rối loạn hóa học trong cơ thể trẻ, bao gồm tăng acid, amoniac và các hợp chất độc hại từ isovaleric acid. Tình trạng stress chuyển hóa kéo dài có thể dẫn đến giảm bạch cầu hạt (neutropenia) và giảm nhiều loại tế bào khác (giảm toàn thể huyết cầu – pancytopenia). Bệnh nhân cũng có thể bị hạ thân nhiệt.', 'Sau khi đợt cấp đầu tiên được xử lý, nếu không có tổn thương thần kinh nghiêm trọng, bệnh nhân thường sẽ chuyển sang thể mạn tính từng đợt.', 'Sau giai đoạn sơ sinh, các triệu chứng mạn tính từng đợt là phổ biến. Trẻ có thể bị chậm phát triển thể chất (suy dinh dưỡng), chậm phát triển trí tuệ, hoặc các triệu chứng thần kinh như co giật và tăng trương lực cơ, thường là hậu quả từ tổn thương thần kinh sớm. Các đợt cấp cũng có thể xuất hiện lại, thường được kích hoạt bởi bệnh lý khác như nhiễm trùng. Thậm chí ở một số bệnh nhân không có đợt cấp sơ sinh, triệu chứng mạn tính vẫn có thể xảy ra.', 'Việc nhận biết sớm các triệu chứng sơ sinh đã giúp triển khai sàng lọc sơ sinh đối với isovaleric acidemia ở Hoa Kỳ và nhiều quốc gia phát triển khác. Nếu được phát hiện trước khi xuất hiện triệu chứng, tiên lượng thường tốt hơn, với sự phát triển bình thường. Khoảng một nửa số trẻ được phát hiện qua sàng lọc sơ sinh chỉ có thiếu hụt nhẹ, không có triệu chứng và không cần điều trị.'] }, causes: ['Isovaleric acidemia là một rối loạn di truyền có tính chất lặn trên nhiễm sắc thể thường. Các rối loạn di truyền lặn xảy ra khi một cá thể nhận hai bản sao gen lỗi – một từ mỗi bố mẹ. Nếu một người chỉ mang một gen lỗi và một gen bình thường, họ sẽ là người mang gen bệnh nhưng thường không có biểu hiện. Nếu cả hai bố mẹ đều là người mang gen bệnh, khả năng truyền cả hai gen lỗi và sinh con mắc bệnh là 25% trong mỗi lần mang thai. Khả năng sinh con là người mang gen (như bố mẹ) là 50%, và khả năng sinh con không mang gen bệnh là 25%. Tỷ lệ rủi ro này là như nhau đối với cả bé trai và bé gái.', 'Ở bệnh nhân mắc IVA, có đột biến ở gen IVD, khiến enzyme isovaleryl-CoA dehydrogenase không hoạt động. Enzyme này cần thiết để phân hủy acid amin leucine nhằm tạo năng lượng.'], affectedPopulations: 'Isovaleric acidemia là một bệnh hiếm gặp, có thể khởi phát sớm sau sinh hoặc trong thời kỳ nhũ nhi, và đôi khi tới tận tuổi thiếu niên. Bệnh ảnh hưởng đến cả nam và nữ với tỷ lệ ngang nhau. Tỷ lệ hiện mắc là 1 trên 526.000 ở các nước phương Tây và 1 trên 250.000 ở Hoa Kỳ.', similarDiseases: ['Methylmalonic acidemia (MMA): do thiếu enzym methylmalonyl-CoA mutase, methylmalonyl racemase, hoặc enzyme tổng hợp adenosylcobalamin (vitamin B12 dẫn xuất). Bệnh nhân bài tiết methylmalonate trong nước tiểu cao bất thường.', 'Propionic acidemia: do thiếu enzym propionyl-CoA carboxylase, cần thiết để phân hủy các acid amin isoleucine, valine, threonine và methionine. Biểu hiện thường trong giai đoạn sơ sinh, nếu không được điều trị có thể dẫn đến mất nước, buồn ngủ, nôn ói và có thể hôn mê. Cũng có thể biểu hiện nhẹ hơn và khởi phát muộn.', 'Maple syrup urine disease (MSUD): rối loạn chuyển hóa bẩm sinh liên quan đến ba acid amin chuỗi nhánh: leucine, isoleucine, valine. Các cơn cấp có thể gây co giật, hôn mê, và nước tiểu có mùi siro phong.', 'Nonketotic hyperglycinemia: là rối loạn chuyển hóa glycine, gây tích tụ glycine trong dịch cơ thể và đặc biệt là dịch não tủy. Có nhiều thể, từ thể cổ điển nặng tử vong sớm sau sinh, đến thể nhẹ hoặc thể biến thể phụ thuộc vào đột biến gen cụ thể.', 'Glutaric aciduria type I (GA I): do đột biến enzyme glutaryl-CoA dehydrogenase, ảnh hưởng đến chuyển hóa lysine. Gây ra các triệu chứng não cấp (encephalopathy), co giật hoặc giảm trương lực cơ, tổn thương não vĩnh viễn.', 'Glutaric aciduria type II (GA II hoặc MADD): do đột biến ảnh hưởng đến chuyển hóa vitamin riboflavin – cần thiết cho hoạt động của nhiều enzyme, bao gồm isovaleryl-CoA dehydrogenase. Gây ra giảm hoặc mất hoạt động của hơn 12 enzyme. Biểu hiện có thể từ sơ sinh đến trưởng thành, và có triệu chứng giống IVA.'], diagnosticMethods: ['Tại Hoa Kỳ và một số quốc gia phát triển, Isovaleric acidemia được phát hiện định kỳ qua chương trình sàng lọc sơ sinh, bằng xét nghiệm máu sử dụng kỹ thuật khối phổ ghép nối (MS/MS – tandem mass spectrometry). Ở các quốc gia khác, việc chẩn đoán thường cần có nghi ngờ lâm sàng trước khi được xác nhận.', 'Kiểm tra nồng độ acid và ceton cao trong máu (nhiễm toan ceton)', 'Nồng độ glycine cao trong máu hoặc nước tiểu (tăng glycin máu và niệu)', 'Nồng độ amoniac cao (tăng ammonemia)', 'Số lượng bạch cầu hạt thấp (neutropenia), Tiểu cầu thấp (giảm tiểu cầu), Hoặc giảm toàn thể tế bào máu (pancytopenia)', 'Chẩn đoán cuối cùng được xác nhận bằng xét nghiệm DNA. Trong một số trường hợp hiếm, các tế bào trong cơ thể như bạch cầu hoặc tế bào da có thể được lấy mẫu để đánh giá hoạt tính enzym isovaleryl-CoA dehydrogenase.', 'Đo nồng độ các chất chuyển hóa bất thường trong dịch ối', 'Đánh giá hoạt tính enzym isovaleryl-CoA dehydrogenase từ mẫu dịch hoặc mô thai qua chọc ối hoặc sinh thiết gai nhau (CVS)', 'Hoặc xét nghiệm DNA của mô thai để tìm đột biến đã xác định ở đứa con đầu tiên.'], treatmentDetails: { prevention: ['Mặc dù chưa có phương pháp chữa khỏi Isovaleric acidemia, nhưng tiên lượng thường tốt nếu tránh hoặc xử lý kịp thời các triệu chứng cấp tính ở giai đoạn sơ sinh.', 'Bệnh nhân cần được theo dõi định kỳ bởi bác sĩ di truyền hoặc chuyên gia chuyển hóa có kinh nghiệm trong điều trị các rối loạn acid hữu cơ.', 'Tần suất theo dõi sẽ phụ thuộc vào mức độ nặng của bệnh và tần suất xảy ra các đợt cấp.', 'Bệnh nhân nên được theo dõi: Phát triển thể chất, Phát triển tâm thần vận động, Lịch sử ăn uống', 'Các xét nghiệm bổ sung bao gồm: Nồng độ acid trong máu, Công thức máu toàn bộ, Điện giải đồ', 'Ngoài ra, bác sĩ có thể theo dõi các biến chứng liên quan đến hệ thần kinh, gan hoặc các cơ quan khác.'], diet: ['Carnitine hoặc glycine có thể được bổ sung để hỗ trợ đào thải acid độc qua thận.', 'Bệnh nhân thường cần chế độ ăn ít protein, nhằm tránh nạp quá nhiều leucine (acid amin liên quan trực tiếp đến bệnh).', 'Tuy nhiên, vẫn cần đủ protein để đáp ứng nhu cầu phát triển của cơ thể, đặc biệt ở trẻ nhỏ.', 'Với bệnh nhân nặng không thể hấp thu đủ protein tự nhiên, có thể sử dụng thực phẩm y tế chuyên biệt không chứa leucine.', 'Nên có chuyên gia dinh dưỡng hỗ trợ xây dựng thực đơn phù hợp cho từng bệnh nhân.'], acuteTreatment: ['Trong giai đoạn cấp, giảm hoặc ngừng ăn protein trong 24 giờ', 'Sau đó tăng cường thức ăn giàu đường, ít đạm để duy trì năng lượng.', 'Nếu bệnh nhân không thể ăn uống, cần nhập viện để truyền glucose qua đường tĩnh mạch.', 'Các rối loạn chuyển hóa khác, như tăng amoniac, cần được điều chỉnh dựa trên tình trạng cụ thể của từng bệnh nhân.', 'Sau vài ngày, thường có thể trở lại chế độ ăn thông thường của bệnh nhân.'] }, prognosis: 'Mặc dù chưa có phương pháp chữa khỏi Isovaleric acidemia, nhưng tiên lượng thường tốt nếu tránh hoặc xử lý kịp thời các triệu chứng cấp tính ở giai đoạn sơ sinh. Bệnh nhân cần được theo dõi định kỳ bởi bác sĩ di truyền hoặc chuyên gia chuyển hóa có kinh nghiệm trong điều trị các rối loạn acid hữu cơ. Tần suất theo dõi sẽ phụ thuộc vào mức độ nặng của bệnh và tần suất xảy ra các đợt cấp.', references: ['Mohsen A-W, Vockley J. Biochemical characteristics of recombinant human isovaleryl-CoA dehydrogenase pre-treated with ethylenediaminetetraacetate in Flabins and Flavoproteins. Rudolf Weber, New York, 1999: 515-18.', 'Sweetman L, Williams JD. Branched chain organic acidurias in The Metabolic and Molecular Basis of Inherited Disease. Scriver C, Beaudet AL, Sly W, Valle D, eds. McGraw-Hill, New York, 2001: 2125-64.', 'Couce ML, Aldamiz-Echeverria L, Bueno MA, et al. Genotype and phenotype characterization in a Spanish cohort with isovaleric acidemia. J Hum Genet. 2017;62:355-360. https://pubmed.ncbi.nlm.nih.gov/27904153/', 'Vockley J, Ensenauer R. Isovaleric Acidemia: New Aspects of Genetic and Phenotypic Heterogeneity. Am J Med Genet C Semin Med Genet. 2006;142C:95-103. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2652706/', 'Vockley J, Rogan PK, Anderson BD, et al. Exon skipping in IVD RNA processing in isovaleric academia caused by point mutations in the coding region of the IVD gene. Am J Hum Genet. 2000;66:356-67. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1288088/'] }
  },
  'D005': {
    id: 5,
    code: 'D005',
    name: 'GLUTARIC ACIDEMIA TYPE I',
    classification: 'Rối loạn chuyển hóa axit amin',
    description: 'Thiếu hụt enzym glutaryl-CoA dehydrogenase',
    synonyms: ['GA-I', 'Glutaryl-CoA dehydrogenase deficiency', 'Aciduria glutarica type I'],
    diagnosis: 'Tăng methylmalonic acid trong máu và nước tiểu, tăng C3',
    treatment: 'Chế độ ăn hạn chế protein, bổ sung vitamin B12, carnitine',
    summary: ['Glutaric acidemia type I (GA-I) là một rối loạn chuyển hóa hiếm gặp do đột biến ở gen GCDH, dẫn đến thiếu hụt hoặc mất chức năng enzym glutaryl-CoA dehydrogenase. Enzym này có vai trò phân hủy các acid amin lysine, hydroxylysine và tryptophan. Khi thiếu enzym, các acid hữu cơ độc hại (glutaric acid và 3-hydroxyglutaric acid) tích tụ trong cơ thể, đặc biệt là trong não, gây tổn thương thần kinh nghiêm trọng.', 'GA-I có thể không có triệu chứng trong những tuần đầu đời, nhưng thường khởi phát cấp tính khi trẻ bị stress chuyển hóa như nhiễm trùng hoặc tiêm vaccine. Các triệu chứng thần kinh cấp như giảm trương lực cơ, co giật, rối loạn vận động hoặc loạn trương lực cơ có thể xuất hiện nhanh chóng và không hồi phục nếu không được phát hiện sớm.', 'Hiện chưa có phương pháp chữa khỏi GA-I, tuy nhiên, sàng lọc sơ sinh và điều trị kịp thời có thể giúp phòng ngừa tổn thương thần kinh nghiêm trọng.'],
    overview: { signsAndSymptoms: { general: ['GA-I có phổ biểu hiện lâm sàng rộng, từ thể không triệu chứng đến tổn thương thần kinh nghiêm trọng. Đặc điểm chung bao gồm:'], earlyStage: ['Trẻ có thể bình thường cho đến khi bị stress chuyển hóa. Sau đó, biểu hiện đột ngột với:', 'Giảm trương lực cơ (hypotonia)', 'Co giật', 'Loạn trương lực cơ (dystonia), rối loạn vận động', 'Chậm phát triển tâm thần vận động', 'Tổn thương nhân nền não, đặc biệt là thể vân (basal ganglia), có thể dẫn đến bại não vĩnh viễn.'], lateStage: ['Một số trường hợp chỉ biểu hiện chậm phát triển trí tuệ nhẹ, rối loạn ngôn ngữ hoặc vận động tinh.'], special: ['Tăng chu vi đầu (macrocephaly) thường là dấu hiệu sớm nhất nhưng dễ bị bỏ qua. Có thể phát hiện máu trong nước tiểu, tăng acid hữu cơ, đặc biệt là acid glutaric và 3-hydroxyglutaric.'] }, causes: ['GA-I là bệnh di truyền lặn trên nhiễm sắc thể thường. Trẻ mắc bệnh khi nhận 2 bản sao đột biến gen GCDH từ cả cha và mẹ. Gen GCDH mã hóa enzym glutaryl-CoA dehydrogenase, tham gia phân hủy lysine, hydroxylysine và tryptophan.', 'Khi enzym này thiếu hụt, các acid hữu cơ không được chuyển hóa hoàn toàn, gây tích tụ và độc cho mô thần kinh.'], affectedPopulations: 'GA-I là rối loạn hiếm gặp, ảnh hưởng đến cả nam và nữ. Tỷ lệ hiện mắc ước tính khoảng 1/100.000 người, nhưng ở một số cộng đồng có tần suất mang gen cao (như người Amish hoặc cộng đồng Oji-Cree ở Canada), tỷ lệ cao hơn nhiều.', similarDiseases: ['Canavan disease', 'Leigh syndrome', 'Metachromatic leukodystrophy', 'Isovaleric acidemia', 'Methylmalonic acidemia', 'Các bệnh thần kinh tiến triển hoặc loạn trương lực cơ khác'], diagnosticMethods: ['Sàng lọc sơ sinh: Thông qua xét nghiệm tandem mass spectrometry (MS/MS), phát hiện mức glutarylcarnitine (C5DC) tăng cao.', 'Xét nghiệm acid hữu cơ trong nước tiểu: Tăng acid glutaric và 3-hydroxyglutaric.', 'Xét nghiệm enzym: Đo hoạt tính glutaryl-CoA dehydrogenase trong bạch cầu hoặc nguyên bào sợi da.', 'Xét nghiệm gen: Phân tích gen GCDH để xác định đột biến.'], treatmentDetails: { prevention: ['Mục tiêu điều trị là ngăn ngừa hoặc làm giảm nguy cơ tổn thương não.'], diet: ['Hạn chế lysine và tryptophan', 'Bổ sung L-carnitine để tăng thải độc', 'Sử dụng công thức dinh dưỡng chuyên biệt không chứa lysine'], acuteTreatment: ['Khi có nguy cơ stress chuyển hóa (nhiễm trùng, phẫu thuật...):', 'Tạm ngừng nạp protein', 'Tăng cung cấp năng lượng qua glucose', 'Nhập viện nếu cần truyền dịch, theo dõi thần kinh'], monitoring: ['Định kỳ đánh giá phát triển thần kinh và thể chất', 'MRI sọ não có thể cho thấy tổn thương nhân nền', 'Vật lý trị liệu, phục hồi chức năng', 'Hỗ trợ ngôn ngữ, học tập'] }, prognosis: 'Nếu phát hiện sớm và điều trị đúng, nhiều trẻ có thể phát triển bình thường hoặc chỉ bị ảnh hưởng nhẹ. Tuy nhiên, nếu tổn thương thần kinh xảy ra (đặc biệt sau các đợt cấp sớm), hậu quả thường không hồi phục.', references: ['National Organization for Rare Disorders. Glutaric Acidemia Type I. https://rarediseases.org', 'Kolker S, Christensen E, Leonard JV, et al. Diagnosis and management of glutaric aciduria type I – revised recommendations. J Inherit Metab Dis. 2011;34(3):677–694. https://pubmed.ncbi.nlm.nih.gov/21562803', 'Strauss KA, Morton DH. Type I Glutaric Acidemia, Review. GeneReviews. University of Washington, Seattle. Updated 2022.', 'Boy N, Mühlhausen C, Maier EM, et al. Clinical and biochemical features of 43 patients with glutaric aciduria type I. Orphanet J Rare Dis. 2017;12:54. https://pubmed.ncbi.nlm.nih.gov/28403835'] }
  }
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
    // This function can remain as is, or be updated to use the new detailed disease info
    // For now, we'll leave it as it was.
    // ... (handleDownloadReport implementation)
  };

  const disease = testResult.diseaseCode ? (diseaseInfo as any)[testResult.diseaseCode] : null;

  return (
    <div className="space-y-6">
      {/* Basic Info Card (can be kept as is) */}
      <Card>
        {/* ... Card content for patient and test info ... */}
      </Card>

      {/* Test Results and Diagnosis Card */}
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

          {/* Biomarkers Table (can be kept as is) */}
          <div>
            {/* ... Biomarkers table implementation ... */}
          </div>

          {/* Doctor's Conclusion (can be kept as is) */}
          <div>
            {/* ... Doctor's conclusion implementation ... */}
          </div>
        </CardContent>
      </Card>

      {/* Doctor Conclusion Dialog (can be kept as is) */}
      {showConclusionDialog && (
         <Dialog open={showConclusionDialog} onOpenChange={setShowConclusionDialog}>
            {/* ... Dialog implementation ... */}
         </Dialog>
      )}

      {/* --- PHẦN 2: DIALOG HIỂN THỊ THÔNG TIN BỆNH ĐÃ ĐƯỢC CẬP NHẬT --- */}
      {disease && showDiseaseDialog && (
        <Dialog open={showDiseaseDialog} onOpenChange={setShowDiseaseDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {diseaseViewType === 'detail' ? 'Thông tin chi tiết bệnh' : 'Tóm tắt bệnh'}: {disease.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {diseaseViewType === 'detail' ? (
                <div className="space-y-6">
                  {/* General Info */}
                  <div className="prose prose-sm max-w-none">
                    <p><strong>Mã bệnh:</strong> <Badge variant="outline">{disease.code}</Badge></p>
                    <p><strong>Phân loại:</strong> {disease.classification}</p>
                    <p><strong>Mô tả ngắn:</strong> {disease.description}</p>
                  </div>

                  {/* Synonyms */}
                  {disease.synonyms && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 border-b pb-1">Từ đồng nghĩa</h3>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        {disease.synonyms.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Overview Section */}
                  {disease.overview && (
                    <div className="space-y-6">
                      {/* Signs and Symptoms */}
                      {disease.overview.signsAndSymptoms && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Dấu hiệu và Triệu chứng</h3>
                          <div className="space-y-3 prose prose-sm max-w-none">
                            {disease.overview.signsAndSymptoms.general?.map((p: string, i: number) => <p key={i}>{p}</p>)}
                            {disease.overview.signsAndSymptoms.earlyStage && (
                              <div>
                                <h4 className="font-semibold">Giai đoạn sớm:</h4>
                                <ul className="list-disc list-inside pl-4">
                                  {disease.overview.signsAndSymptoms.earlyStage.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                </ul>
                              </div>
                            )}
                            {disease.overview.signsAndSymptoms.lateStage && (
                              <div className="mt-2">
                                <h4 className="font-semibold">Giai đoạn muộn:</h4>
                                <ul className="list-disc list-inside pl-4">
                                  {disease.overview.signsAndSymptoms.lateStage.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Causes */}
                      {disease.overview.causes && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Nguyên nhân</h3>
                          <div className="space-y-2 prose prose-sm max-w-none">
                            {disease.overview.causes.map((p: string, i: number) => <p key={i}>{p}</p>)}
                          </div>
                        </div>
                      )}

                      {/* Treatment Details */}
                      {disease.overview.treatmentDetails && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Chi tiết điều trị</h3>
                          <div className="space-y-3 prose prose-sm max-w-none">
                            {disease.overview.treatmentDetails.prevention && (
                              <div>
                                <h4 className="font-semibold">Phòng ngừa:</h4>
                                <ul className="list-disc list-inside pl-4">
                                  {disease.overview.treatmentDetails.prevention.map((item: string, i: number) => <li key={i}>{item}</li>)}
                                </ul>
                              </div>
                            )}
                             {disease.overview.treatmentDetails.diet && (
                              <div className="mt-2">
                                <h4 className="font-semibold">Chế độ ăn:</h4>
                                <ul className="list-disc list-inside pl-4">
                                  {disease.overview.treatmentDetails.diet.map((item: string, i: number) => <li key={i}>{item}</li>)}
                                </ul>
                              </div>
                            )}
                            {disease.overview.treatmentDetails.acuteTreatment && (
                              <div className="mt-2">
                                <h4 className="font-semibold">Điều trị cấp tính:</h4>
                                <ul className="list-disc list-inside pl-4">
                                  {disease.overview.treatmentDetails.acuteTreatment.map((item: string, i: number) => <li key={i}>{item}</li>)}
                                </ul>
                              </div>
                            )}
                            {disease.overview.treatmentDetails.monitoring && (
                               <div className="mt-2">
                                <h4 className="font-semibold">Theo dõi:</h4>
                                <ul className="list-disc list-inside pl-4">
                                  {disease.overview.treatmentDetails.monitoring.map((item: string, i: number) => <li key={i}>{item}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Other details */}
                       <div className="grid md:grid-cols-2 gap-6">
                        {disease.overview.affectedPopulations && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2 border-b pb-1">Đối tượng ảnh hưởng</h3>
                            <p className="prose prose-sm max-w-none">{disease.overview.affectedPopulations}</p>
                          </div>
                        )}
                        {disease.overview.prognosis && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2 border-b pb-1">Tiên lượng</h3>
                            <p className="prose prose-sm max-w-none">{disease.overview.prognosis}</p>
                          </div>
                        )}
                      </div>

                      {/* Diagnostic Methods */}
                      {disease.overview.diagnosticMethods && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Phương pháp chẩn đoán</h3>
                           <div className="space-y-2 prose prose-sm max-w-none">
                            {disease.overview.diagnosticMethods.map((p: string, i: number) => <p key={i}>{p}</p>)}
                          </div>
                        </div>
                      )}

                      {/* Similar Diseases */}
                      {disease.overview.similarDiseases && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Các bệnh tương tự</h3>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            {disease.overview.similarDiseases.map((d: string, i: number) => <li key={i}>{d}</li>)}
                          </ul>
                        </div>
                      )}

                      {/* References */}
                      {disease.overview.references && (
                         <div>
                          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Tài liệu tham khảo</h3>
                          <ul className="list-disc list-inside space-y-1 pl-4 text-xs">
                            {disease.overview.references.map((r: string, i: number) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Summary View
                <div className="prose prose-sm max-w-none">
                  {disease.summary.map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};