import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Search, FileText, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DiseaseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  const [viewType, setViewType] = useState<'detail' | 'summary'>('detail');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const [diseases] = useState([
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
      name: '3-Hydroxy-3-methylglutaric acidemia (3-hydroxy-3-methylglutaryl-CoA lyase)',
      classification: 'Rối loạn chuyển hóa',
      description: 'Bệnh do thiếu hụt enzyme 3-hydroxy-3-methylglutaryl-CoA lyase.',
      symptoms: ['Hạ đường huyết', 'Nôn mửa', 'Hôn mê'],
      diagnosis: 'Xét nghiệm axit hữu cơ trong nước tiểu',
      treatment: 'Tránh nhịn ăn, bổ sung glucose',
      summary: 'Rối loạn chuyển hóa có thể gây hạ đường huyết nghiêm trọng.'
    },
    {
      id: 4,
      code: 'D004',
      name: 'Holocarboxylase synthetase (multiple carboxylase) deficiency',
      classification: 'Rối loạn chuyển hóa',
      description: 'Thiếu hụt enzyme holocarboxylase synthetase.',
      symptoms: ['Phát ban da', 'Rụng tóc', 'Co giật'],
      diagnosis: 'Xét nghiệm axit hữu cơ, đáp ứng với biotin',
      treatment: 'Bổ sung biotin liều cao',
      summary: 'Bệnh hiếm gặp đáp ứng tốt với điều trị biotin.'
    },
    {
      id: 5,
      code: 'D005',
      name: 'Methylmalonic acidemia (methylmalonyl-CoA mutase)',
      classification: 'Rối loạn chuyển hóa',
      description: 'Thiếu hụt enzyme methylmalonyl-CoA mutase.',
      symptoms: ['Nôn mửa', 'Chậm phát triển', 'Nhiễm toan'],
      diagnosis: 'Tăng methylmalonic acid trong máu và nước tiểu',
      treatment: 'Hạn chế protein, bổ sung vitamin B12',
      summary: 'Rối loạn chuyển hóa nghiêm trọng cần điều trị tích cực.'
    },
    {
      id: 6,
      code: 'D006',
      name: '3-Methylcrotonyl-CoA Carboxylase Deficiency',
      classification: 'Rối loạn chuyển hóa',
      description: 'Thiếu hụt enzyme 3-methylcrotonyl-CoA carboxylase.',
      symptoms: ['Nôn mửa', 'Hạ đường huyết', 'Co giật'],
      diagnosis: 'Tăng 3-methylcrotonylglycine trong nước tiểu',
      treatment: 'Bổ sung biotin, hạn chế leucine',
      summary: 'Bệnh hiếm có thể đáp ứng với biotin.'
    },
    {
      id: 7,
      code: 'D007',
      name: 'Methylmalonic acidemia (cbl disorders)',
      classification: 'Rối loạn chuyển hóa',
      description: 'Rối loạn chuyển hóa vitamin B12.',
      symptoms: ['Thiếu máu', 'Chậm phát triển', 'Nhiễm toan'],
      diagnosis: 'Tăng methylmalonic acid, giảm vitamin B12',
      treatment: 'Bổ sung vitamin B12 dạng tiêm',
      summary: 'Bệnh liên quan đến chuyển hóa vitamin B12.'
    },
    {
      id: 8,
      code: 'D008',
      name: 'Propionic acidemia (propionyl-CoA carboxylase)',
      classification: 'Rối loạn chuyển hóa',
      description: 'Thiếu hụt enzyme propionyl-CoA carboxylase.',
      symptoms: ['Nôn mửa', 'Hôn mê', 'Nhiễm toan'],
      diagnosis: 'Tăng propionic acid trong máu',
      treatment: 'Hạn chế protein, bổ sung biotin',
      summary: 'Rối loạn chuyển hóa nghiêm trọng.'
    },
    {
      id: 9,
      code: 'D009',
      name: 'β-Ketothiolase deficiency (Beta-ketothiolase)',
      classification: 'Rối loạn chuyển hóa',
      description: 'Thiếu hụt enzyme beta-ketothiolase.',
      symptoms: ['Nôn mửa', 'Nhiễm toan', 'Hạ đường huyết'],
      diagnosis: 'Tăng 2-methyl-3-hydroxybutyric acid',
      treatment: 'Tránh nhịn ăn, hạn chế isoleucine',
      summary: 'Rối loạn chuyển hóa isoleucine.'
    },
    {
      id: 10,
      code: 'D010',
      name: 'Methylmalonic acidemia with homocystinuria (methylmalonyl-CoA mutase and homocysteine)',
      classification: 'Rối loạn chuyển hóa',
      description: 'Kết hợp thiếu methylmalonyl-CoA mutase và rối loạn homocysteine.',
      symptoms: ['Chậm phát triển', 'Thiếu máu', 'Rối loạn thần kinh'],
      diagnosis: 'Tăng cả methylmalonic acid và homocysteine',
      treatment: 'Bổ sung vitamin B12, folate',
      summary: 'Bệnh phức tạp ảnh hưởng nhiều hệ thống.'
    },
    {
      id: 11,
      code: 'D011',
      name: 'Methylmalonic acidemia with homocystinuria (MMADHC protein)',
      classification: 'Rối loạn chuyển hóa',
      description: 'Rối loạn do đột biến gen MMADHC.',
      symptoms: ['Thiếu máu', 'Rối loạn thần kinh', 'Chậm phát triển'],
      diagnosis: 'Phân tích gen MMADHC',
      treatment: 'Bổ sung vitamin B12, theo dõi chặt chẽ',
      summary: 'Bệnh di truyền hiếm gặp.'
    },
    {
      id: 12,
      code: 'D012',
      name: 'Malonic acidemia (malonyl-CoA decarboxylase)',
      classification: 'Rối loạn chuyển hóa',
      description: 'Thiếu hụt enzyme malonyl-CoA decarboxylase.',
      symptoms: ['Chậm phát triển', 'Hạ đường huyết', 'Nôn mửa'],
      diagnosis: 'Tăng malonic acid trong nước tiểu',
      treatment: 'Chế độ ăn đặc biệt, tránh nhịn ăn',
      summary: 'Bệnh hiếm gặp cần quản lý dinh dưỡng cẩn thận.'
    },
    {
      id: 13,
      code: 'D013',
      name: 'Isobutyrylglycinuria (isobutyryl-CoA dehydrogenase)',
      classification: 'Rối loạn chuyển hóa',
      description: 'Thiếu hụt enzyme isobutyryl-CoA dehydrogenase.',
      symptoms: ['Thường không có triệu chứng', 'Chậm phát triển nhẹ'],
      diagnosis: 'Tăng isobutyrylglycine trong nước tiểu',
      treatment: 'Theo dõi, hạn chế valine nếu cần',
      summary: 'Bệnh thường lành tính.'
    },
    {
      id: 14,
      code: 'D014',
      name: '2-Methyl-3-hydroxybutyric acidemia',
      classification: 'Rối loạn chuyển hóa',
      description: 'Thiếu hụt enzyme 2-methyl-3-hydroxybutyryl-CoA dehydrogenase.',
      symptoms: ['Hạ đường huyết', 'Nôn mửa khi bệnh'],
      diagnosis: 'Tăng 2-methyl-3-hydroxybutyric acid',
      treatment: 'Tránh nhịn ăn, bổ sung glucose khi bệnh',
      summary: 'Bệnh có thể gây hạ đường huyết khi stress.'
    },
    {
      id: 15,
      code: 'D015',
      name: '2-Methylbutyrylglycinuria',
      classification: 'Rối loạn chuyển hóa',
      description: 'Thiếu hụt enzyme 2-methylbutyryl-CoA dehydrogenase.',
      symptoms: ['Thường không có triệu chứng'],
      diagnosis: 'Tăng 2-methylbutyrylglycine trong nước tiểu',
      treatment: 'Theo dõi định kỳ',
      summary: 'Bệnh thường lành tính, ít triệu chứng.'
    },
    {
      id: 16,
      code: 'D016',
      name: '3-Methylglutaconic acidemia type I',
      classification: 'Rối loạn chuyển hóa',
      description: 'Thiếu hụt enzyme 3-methylglutaconyl-CoA hydratase.',
      symptoms: ['Chậm phát triển', 'Rối loạn thần kinh nhẹ'],
      diagnosis: 'Tăng 3-methylglutaconic acid trong nước tiểu',
      treatment: 'Hỗ trợ triệu chứng, theo dõi định kỳ',
      summary: 'Bệnh hiếm với tiên lượng thường tốt.'
    }
  ]);

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.classification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredDiseases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDiseases = filteredDiseases.slice(startIndex, endIndex);

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleViewDisease = (disease: any, type: 'detail' | 'summary') => {
    setSelectedDisease(disease);
    setViewType(type);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý bệnh</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm bệnh mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm bệnh..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 font-medium text-slate-600">Mã bệnh</th>
                  <th className="text-left p-3 font-medium text-slate-600">Tên bệnh</th>
                  <th className="text-left p-3 font-medium text-slate-600">Phân loại</th>
                  <th className="text-right p-3 font-medium text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentDiseases.map((disease) => (
                  <tr key={disease.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-mono text-sm font-medium text-red-600">{disease.code}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800">{disease.name}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{disease.classification}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDisease(disease, 'detail')}
                        >
                          <FileText className="h-3 w-3 mr-1" />
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-slate-600">
                Hiển thị {startIndex + 1} đến {Math.min(endIndex, filteredDiseases.length)} của {filteredDiseases.length} bệnh
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

      {/* Disease Detail/Summary Dialog */}
      {selectedDisease && (
        <Dialog open={!!selectedDisease} onOpenChange={() => setSelectedDisease(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {viewType === 'detail' ? 'Chi tiết' : 'Tóm tắt'}: {selectedDisease.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Mã bệnh:</strong> {selectedDisease.code}
                </div>
                <div>
                  <strong>Phân loại:</strong> {selectedDisease.classification}
                </div>
              </div>
              
              {viewType === 'detail' ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Mô tả:</h3>
                    <p className="text-slate-700">{selectedDisease.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Triệu chứng:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedDisease.symptoms.map((symptom: string, index: number) => (
                        <li key={index} className="text-slate-700">{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Chẩn đoán:</h3>
                    <p className="text-slate-700">{selectedDisease.diagnosis}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Điều trị:</h3>
                    <p className="text-slate-700">{selectedDisease.treatment}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-2">Tóm tắt:</h3>
                  <p className="text-slate-700">{selectedDisease.summary}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
