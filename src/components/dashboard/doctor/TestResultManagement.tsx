import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

// --- BẮT ĐẦU: IMPORT CÁC PHỤ THUỘC CẦN THIẾT ---
import { PdfGenerator } from '@/lib/pdfGenerator';
import { BIOMARKER_LIST, generateDefaultBiomarkers } from '@/data/biomarkers';
// --- KẾT THÚC: IMPORT CÁC PHỤ THUỘC CẦN THIẾT ---

interface TestResultManagementProps {
  userRole: string;
}

export const TestResultManagement = ({ userRole }: TestResultManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
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
      diseaseCode: 'D003',
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
        c12: { value: 0.132, normal: '0.017 - 0.29', status: 'normal' },
        c12_1: { value: 0.1, normal: '0.01 - 0.27', status: 'normal' },
        c14: { value: 0.27, normal: '0.06 - 0.5', status: 'normal' },
        c14_1: { value: 0.16, normal: '0.02 - 0.37', status: 'normal' },
        c14_2: { value: 0.03, normal: '0 - 0.06', status: 'normal' },
        c14oh: { value: 0.016, normal: '0 - 0.04', status: 'normal' },
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
        ado: { value: 1.07, normal: '0.21 - 3.14', status: 'normal' },
        d_ado: { value: 0.02, normal: '0 - 0.05', status: 'normal' },
        c20_0_lpc: { value: 0.32, normal: '0.05 - 1.77', status: 'normal' },
        c22_0_lpc: { value: 0.42, normal: '0.03 - 1.5', status: 'normal' },
        c24_0_lpc: { value: 1, normal: '0.08 - 2.78', status: 'normal' },
        c26_0_lpc: { value: 0.3, normal: '0.03 - 0.75', status: 'normal' },
        lv_pt_ratio: { value: 1.05, normal: '0.66 - 2.72', status: 'normal' },
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
      testCode: 'y12345680',
      patientName: 'Trần Văn CC',
      birthDate: '03/09/2025',
      testDate: '03/07/2025',
      result: 'positive',
      phone: '0917 826 453',
      branch: 'Chi nhánh Hà Nội',
      analysisDate: '03/07/2025',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      diagnosis: 'Argininemia (arginase deficiency)',
      diseaseCode: 'D002',
      biomarkers: {
        ala: { value: 399, normal: '117 - 541', status: 'normal' },
        arg: { value: 0.8, normal: '0.9 - 32', status: 'low' },
        cit: { value: 19.8, normal: '4 - 29', status: 'normal' },
        gln: { value: 197, normal: '88 - 901', status: 'normal' },
        glu: { value: 225, normal: '62 - 797', status: 'normal' },
        gly: { value: 640, normal: '184 - 837', status: 'normal' },
        leu: { value: 232, normal: '53 - 260', status: 'normal' },
        met: { value: 29, normal: '5.6 - 40.1', status: 'normal' },
        orn: { value: 10, normal: '14 - 194', status: 'low' },
        phe: { value: 72, normal: '23 - 97', status: 'normal' },
        pro: { value: 196, normal: '73 - 264', status: 'normal' },
        tyr: { value: 102, normal: '15 - 358', status: 'normal' },
        val: { value: 191, normal: '51 - 212', status: 'normal' },
        c0: { value: 31.1, normal: '7.5 - 59', status: 'normal' },
        c2: { value: 2.4, normal: '4.6 - 52', status: 'low' },
        c3: { value: 0.47, normal: '0.36 - 4.93', status: 'normal' },
        c3dc_c4oh: { value: 0.03, normal: '0 - 0.33', status: 'normal' },
        c4: { value: 0.07, normal: '0.05 - 0.7', status: 'normal' },
        c4dc_c5oh: { value: 0.14, normal: '0.07 - 0.45', status: 'normal' },
        c5: { value: 0.07, normal: '0.03 - 0.33', status: 'normal' },
        c5dc_c6oh: { value: 0.05, normal: '0.02 - 0.18', status: 'normal' },
        c5_1: { value: 0.01, normal: '0 - 0.08', status: 'normal' },
        c6: { value: 0.004, normal: '0.007 - 0.12', status: 'low' },
        c6dc: { value: 0.06, normal: '0.02 - 0.25', status: 'normal' },
        c8: { value: 0.017, normal: '0.013 - 0.21', status: 'normal' },
        c8_1: { value: 0.05, normal: '0 - 0.22', status: 'normal' },
        c10: { value: 0.002, normal: '0.015 - 0.24', status: 'low' },
        c10_1: { value: 0.02, normal: '0 - 0.08', status: 'normal' },
        c10_2: { value: 0.005, normal: '0 - 0.08', status: 'normal' },
        c12: { value: 0.021, normal: '0.017 - 0.29', status: 'normal' },
        c12_1: { value: 0.01, normal: '0.01 - 0.27', status: 'normal' },
        c14: { value: 0.09, normal: '0.06 - 0.5', status: 'normal' },
        c14_1: { value: 0.02, normal: '0.02 - 0.37', status: 'normal' },
        c14_2: { value: 0.01, normal: '0 - 0.06', status: 'normal' },
        c14oh: { value: 0.006, normal: '0 - 0.04', status: 'normal' },
        c16: { value: 1.1, normal: '0.8 - 6.7', status: 'normal' },
        c16_1: { value: 0.04, normal: '0.04 - 0.54', status: 'normal' },
        c16_1oh: { value: 0.05, normal: '0.01 - 0.13', status: 'normal' },
        c16oh: { value: 0.01, normal: '0 - 0.06', status: 'normal' },
        c18: { value: 0.7, normal: '0.23 - 1.97', status: 'normal' },
        c18_1: { value: 0.5, normal: '0.5 - 2.5', status: 'normal' },
        c18_1oh: { value: 0.01, normal: '0 - 0.05', status: 'normal' },
        c18_2: { value: 0.12, normal: '0.06 - 0.56', status: 'normal' },
        c18oh: { value: 0.01, normal: '0 - 0.03', status: 'normal' },
        c18_2oh: { value: 0.02, normal: '0 - 0.04', status: 'normal' },
        c20: { value: 0.02, normal: '0.01 - 0.11', status: 'normal' },
        c22: { value: 0.01, normal: '0 - 0.02', status: 'normal' },
        c24: { value: 0.02, normal: '0 - 0.06', status: 'normal' },
        c26: { value: 0.01, normal: '0 - 0.03', status: 'normal' },
        ado: { value: 0.22, normal: '0.21 - 3.14', status: 'normal' },
        d_ado: { value: 0.02, normal: '0 - 0.05', status: 'normal' },
        c20_0_lpc: { value: 0.33, normal: '0.05 - 1.77', status: 'normal' },
        c22_0_lpc: { value: 0.2, normal: '0.03 - 1.5', status: 'normal' },
        c24_0_lpc: { value: 0.37, normal: '0.08 - 2.78', normal: 'normal' },
        c26_0_lpc: { value: 0.2, normal: '0.03 - 0.75', status: 'normal' },
        lv_pt_ratio: { value: 2.44, normal: '0.66 - 2.72', status: 'normal' },
        cit_arg_ratio: { value: 13.4, normal: '0.3 - 19.9', status: 'normal' },
        cit_phe_ratio: { value: 0.28, normal: '0.07 - 0.72', status: 'normal' },
        carnitine_cit_ratio: { value: 2.19, normal: '1.53 - 8.75', status: 'normal' },
        c14_1_c12_1_ratio: { value: 1.46, normal: '0.9 - 5', status: 'normal' },
        leu_phe_ratio: { value: 3.23, normal: '0.63 - 3.74', status: 'normal' },
        met_leu_ratio: { value: 0.13, normal: '0.02 - 0.66', status: 'normal' },
        met_phe_ratio: { value: 0.4, normal: '0.17 - 0.74', status: 'normal' },
        phe_tyr_ratio: { value: 0.71, normal: '0.16 - 1.6', status: 'normal' },
        tyr_leu_ratio: { value: 0.44, normal: '0.13 - 2.64', status: 'normal' },
        tyr_met_ratio: { value: 3.51, normal: '1.86 - 16.06', status: 'normal' },
        val_phe_ratio: { value: 2.51, normal: '0.58 - 3.5', status: 'normal' },
        c3_met_ratio: { value: 0.02, normal: '0.01 - 0.25', status: 'normal' },
        c3_c2_ratio: { value: 0.22, normal: '0.01 - 0.34', status: 'normal' },
        c3_c16_ratio: { value: 0.42, normal: '0.19 - 1.35', status: 'normal' },
        c3dc_c4oh_c8_ratio: { value: 1.43, normal: '0.29 - 5.25', status: 'normal' },
        c0_c16_c18_ratio: { value: 11.75, normal: '1.88 - 12.16', status: 'normal' },
        c4dc_c5oh_c8_ratio: { value: 12, normal: '1.38 - 12.6', status: 'normal' },
        c8_c10_ratio: { value: 0.91, normal: '0.4 - 2.3', status: 'normal' },
        c8_c2_ratio: { value: 0.006, normal: '0 - 0.01', status: 'normal' },
        c5dc_c6oh_c8_ratio: { value: 2.29, normal: '0.14 - 9', status: 'normal' },
        c16_c18_1_c2_ratio: { value: 0.63, normal: '0.16 - 0.89', status: 'normal' }
      },
      doctorConclusion: ''
    },
    {
      id: 4,
      testCode: 'y12345681',
      patientName: 'Nguyễn Văn DD',
      birthDate: '03/10/2025',
      testDate: '03/10/2025',
      result: 'positive',
      phone: '0963 251 748',
      branch: 'Chi nhánh Hà Nội',
      analysisDate: '03/10/2025',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      diagnosis: 'Glutaric acidemia type I (glutaryl-CoA dehydrogenase)',
      diseaseCode: 'D005',
      biomarkers: {
        ala: { value: 218, normal: '117 - 541', status: 'normal' },
        arg: { value: 6, normal: '0.9 - 32', status: 'normal' },
        cit: { value: 16.3, normal: '4 - 29', status: 'normal' },
        gln: { value: 506, normal: '88 - 901', status: 'normal' },
        glu: { value: 408, normal: '62 - 797', status: 'normal' },
        gly: { value: 402, normal: '184 - 837', status: 'normal' },
        leu: { value: 106, normal: '53 - 260', status: 'normal' },
        met: { value: 12.9, normal: '5.6 - 40.1', status: 'normal' },
        orn: { value: 57, normal: '14 - 194', status: 'normal' },
        phe: { value: 48, normal: '23 - 97', status: 'normal' },
        pro: { value: 232, normal: '73 - 264', status: 'normal' },
        tyr: { value: 105, normal: '15 - 358', status: 'normal' },
        val: { value: 106, normal: '51 - 212', status: 'normal' },
        c0: { value: 6, normal: '7.5 - 59', status: 'low' },
        c2: { value: 25.8, normal: '4.6 - 52', status: 'normal' },
        c3: { value: 1.75, normal: '0.36 - 4.93', status: 'normal' },
        c3dc_c4oh: { value: 0.2, normal: '0 - 0.33', status: 'normal' },
        c4: { value: 0.41, normal: '0.05 - 0.7', status: 'normal' },
        c4dc_c5oh: { value: 0.2, normal: '0.07 - 0.45', status: 'normal' },
        c5: { value: 0.18, normal: '0.03 - 0.33', status: 'normal' },
        c5dc_c6oh: { value: 0.22, normal: '0.02 - 0.18', status: 'high' },
        c5_1: { value: 0.02, normal: '0 - 0.08', status: 'normal' },
        c6: { value: 0.178, normal: '0.007 - 0.12', status: 'high' },
        c6dc: { value: 0.17, normal: '0.02 - 0.25', status: 'normal' },
        c8: { value: 0.376, normal: '0.013 - 0.21', status: 'high' },
        c8_1: { value: 0.05, normal: '0 - 0.22', status: 'normal' },
        c10: { value: 0.494, normal: '0.015 - 0.24', status: 'high' },
        c10_1: { value: 0.12, normal: '0 - 0.08', status: 'high' },
        c10_2: { value: 0.014, normal: '0 - 0.08', status: 'normal' },
        c12: { value: 0.228, normal: '0.017 - 0.29', status: 'normal' },
        c12_1: { value: 0.16, normal: '0.01 - 0.27', status: 'normal' },
        c14: { value: 0.3, normal: '0.06 - 0.5', status: 'normal' },
        c14_1: { value: 0.2, normal: '0.02 - 0.37', status: 'normal' },
        c14_2: { value: 0.03, normal: '0 - 0.06', status: 'normal' },
        c14oh: { value: 0.023, normal: '0 - 0.04', status: 'normal' },
        c16: { value: 5.7, normal: '0.8 - 6.7', status: 'normal' },
        c16_1: { value: 0.35, normal: '0.04 - 0.54', status: 'normal' },
        c16_1oh: { value: 0.07, normal: '0.01 - 0.13', status: 'normal' },
        c16oh: { value: 0.03, normal: '0 - 0.06', status: 'normal' },
        c18: { value: 1.64, normal: '0.23 - 1.97', status: 'normal' },
        c18_1: { value: 1.6, normal: '0.5 - 2.5', status: 'normal' },
        c18_1oh: { value: 0.04, normal: '0 - 0.05', status: 'normal' },
        c18_2: { value: 0.18, normal: '0.06 - 0.56', status: 'normal' },
        c18oh: { value: 0.02, normal: '0 - 0.03', status: 'normal' },
        c18_2oh: { value: 0.02, normal: '0 - 0.04', status: 'normal' },
        c20: { value: 0.04, normal: '0.01 - 0.11', status: 'normal' },
        c22: { value: 0.01, normal: '0 - 0.02', status: 'normal' },
        c24: { value: 0.02, normal: '0 - 0.06', status: 'normal' },
        c26: { value: 0.01, normal: '0 - 0.03', status: 'normal' },
        ado: { value: 1.53, normal: '0.21 - 3.14', status: 'normal' },
        d_ado: { value: 0.04, normal: '0 - 0.05', status: 'normal' },
        c20_0_lpc: { value: 0.21, normal: '0.05 - 1.77', status: 'normal' },
        c22_0_lpc: { value: 1.07, normal: '0.03 - 1.5', status: 'normal' },
        c24_0_lpc: { value: 1.15, normal: '0.08 - 2.78', status: 'normal' },
        c26_0_lpc: { value: 0.21, normal: '0.03 - 0.75', status: 'normal' },
        lv_pt_ratio: { value: 1.38, normal: '0.66 - 2.72', status: 'normal' },
        cit_arg_ratio: { value: 2.7, normal: '0.3 - 19.9', status: 'normal' },
        cit_phe_ratio: { value: 0.34, normal: '0.07 - 0.72', status: 'normal' },
        carnitine_cit_ratio: { value: 3.99, normal: '1.53 - 8.75', status: 'normal' },
        c14_1_c12_1_ratio: { value: 1.26, normal: '0.9 - 5', status: 'normal' },
        leu_phe_ratio: { value: 2.19, normal: '0.63 - 3.74', status: 'normal' },
        met_leu_ratio: { value: 0.12, normal: '0.02 - 0.66', status: 'normal' },
        met_phe_ratio: { value: 0.27, normal: '0.17 - 0.74', status: 'normal' },
        phe_tyr_ratio: { value: 0.46, normal: '0.16 - 1.6', status: 'normal' },
        tyr_leu_ratio: { value: 1, normal: '0.13 - 2.64', status: 'normal' },
        tyr_met_ratio: { value: 8.16, normal: '1.86 - 16.06', status: 'normal' },
        val_phe_ratio: { value: 2.07, normal: '0.58 - 3.5', status: 'normal' },
        c3_met_ratio: { value: 0.13, normal: '0.01 - 0.25', status: 'normal' },
        c3_c2_ratio: { value: 0.08, normal: '0.01 - 0.34', status: 'normal' },
        c3_c16_ratio: { value: 0.3, normal: '0.19 - 1.35', status: 'normal' },
        c3dc_c4oh_c8_ratio: { value: 0.44, normal: '0.29 - 5.25', status: 'normal' },
        c0_c16_c18_ratio: { value: 2.71, normal: '1.88 - 12.16', status: 'normal' },
        c4dc_c5oh_c8_ratio: { value: 1.5, normal: '1.38 - 12.6', status: 'normal' },
        c8_c10_ratio: { value: 0.83, normal: '0.4 - 2.3', status: 'normal' },
        c8_c2_ratio: { value: 0.01, normal: '0 - 0.01', status: 'normal' },
        c5dc_c6oh_c8_ratio: { value: 0.29, normal: '0.14 - 9', status: 'normal' },
        c16_c18_1_c2_ratio: { value: 0.26, normal: '0.16 - 0.89', status: 'normal' }
      },
      doctorConclusion: ''
    },
    {
      id: 5,
      testCode: 'y12345682',
      patientName: 'Bùi Hoàng N',
      birthDate: '03/11/2025',
      testDate: '03/10/2025',
      result: 'positive',
      phone: '0971 843 622',
      branch: 'Chi nhánh Hà Nội',
      analysisDate: '03/10/2025',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      diagnosis: 'Isovaleric acidemia (isovaleryl-CoA dehydrogenase)',
      diseaseCode: 'D004',
      biomarkers: {
        ala: { value: 213, normal: '117 - 541', status: 'normal' },
        arg: { value: 6, normal: '0.9 - 32', status: 'normal' },
        cit: { value: 9.6, normal: '4 - 29', status: 'normal' },
        gln: { value: 446, normal: '88 - 901', status: 'normal' },
        glu: { value: 395, normal: '62 - 797', status: 'normal' },
        gly: { value: 382, normal: '184 - 837', status: 'normal' },
        leu: { value: 103, normal: '53 - 260', status: 'normal' },
        met: { value: 15.4, normal: '5.6 - 40.1', status: 'normal' },
        orn: { value: 70, normal: '14 - 194', status: 'normal' },
        phe: { value: 42, normal: '23 - 97', status: 'normal' },
        pro: { value: 137, normal: '73 - 264', status: 'normal' },
        tyr: { value: 76, normal: '15 - 358', status: 'normal' },
        val: { value: 93, normal: '51 - 212', status: 'normal' },
        c0: { value: 27.4, normal: '7.5 - 59', status: 'normal' },
        c2: { value: 18.6, normal: '4.6 - 52', status: 'normal' },
        c3: { value: 2.02, normal: '0.36 - 4.93', status: 'normal' },
        c3dc_c4oh: { value: 0.04, normal: '0 - 0.33', status: 'normal' },
        c4: { value: 0.19, normal: '0.05 - 0.7', status: 'normal' },
        c4dc_c5oh: { value: 0.06, normal: '0.07 - 0.45', status: 'low' },
        c5: { value: 0.35, normal: '0.03 - 0.33', status: 'high' },
        c5dc_c6oh: { value: 0.07, normal: '0.02 - 0.18', status: 'normal' },
        c5_1: { value: 0.02, normal: '0 - 0.08', status: 'normal' },
        c6: { value: 0.032, normal: '0.007 - 0.12', status: 'normal' },
        c6dc: { value: 0.06, normal: '0.02 - 0.25', status: 'normal' },
        c8: { value: 0.043, normal: '0.013 - 0.21', status: 'normal' },
        c8_1: { value: 0.03, normal: '0 - 0.22', status: 'normal' },
        c10: { value: 0.056, normal: '0.015 - 0.24', status: 'normal' },
        c10_1: { value: 0.04, normal: '0 - 0.08', status: 'normal' },
        c10_2: { value: 0.008, normal: '0 - 0.08', status: 'normal' },
        c12: { value: 0.079, normal: '0.017 - 0.29', status: 'normal' },
        c12_1: { value: 0.03, normal: '0.01 - 0.27', status: 'normal' },
        c14: { value: 0.22, normal: '0.06 - 0.5', status: 'normal' },
        c14_1: { value: 0.09, normal: '0.02 - 0.37', status: 'normal' },
        c14_2: { value: 0.03, normal: '0 - 0.06', status: 'normal' },
        c14oh: { value: 0.007, normal: '0 - 0.04', status: 'normal' },
        c16: { value: 3.4, normal: '0.8 - 6.7', status: 'normal' },
        c16_1: { value: 0.22, normal: '0.04 - 0.54', status: 'normal' },
        c16_1oh: { value: 0.05, normal: '0.01 - 0.13', status: 'normal' },
        c16oh: { value: 0.02, normal: '0 - 0.06', status: 'normal' },
        c18: { value: 1.12, normal: '0.23 - 1.97', status: 'normal' },
        c18_1: { value: 1.3, normal: '0.5 - 2.5', status: 'normal' },
        c18_1oh: { value: 0.03, normal: '0 - 0.05', status: 'normal' },
        c18_2: { value: 0.3, normal: '0.06 - 0.56', status: 'normal' },
        c18oh: { value: 0.01, normal: '0 - 0.03', status: 'normal' },
        c18_2oh: { value: 0.02, normal: '0 - 0.04', status: 'normal' },
        c20: { value: 0.02, normal: '0.01 - 0.11', status: 'normal' },
        c22: { value: 0.01, normal: '0 - 0.02', status: 'normal' },
        c24: { value: 0.01, normal: '0 - 0.06', status: 'normal' },
        c26: { value: 0.01, normal: '0 - 0.03', status: 'normal' },
        ado: { value: 0.71, normal: '0.21 - 3.14', status: 'normal' },
        d_ado: { value: 0.04, normal: '0 - 0.05', status: 'normal' },
        c20_0_lpc: { value: 0.31, normal: '0.05 - 1.77', status: 'normal' },
        c22_0_lpc: { value: 0.34, normal: '0.03 - 1.5', status: 'normal' },
        c24_0_lpc: { value: 1.07, normal: '0.08 - 2.78', status: 'normal' },
        c26_0_lpc: { value: 0.25, normal: '0.03 - 0.75', status: 'normal' },
        lv_pt_ratio: { value: 1.67, normal: '0.66 - 2.72', status: 'normal' },
        cit_arg_ratio: { value: 1.6, normal: '0.3 - 19.9', status: 'normal' },
        cit_phe_ratio: { value: 0.23, normal: '0.07 - 0.72', status: 'normal' },
        carnitine_cit_ratio: { value: 6.43, normal: '1.53 - 8.75', status: 'normal' },
        c14_1_c12_1_ratio: { value: 2.49, normal: '0.9 - 5', status: 'normal' },
        leu_phe_ratio: { value: 2.44, normal: '0.63 - 3.74', status: 'normal' },
        met_leu_ratio: { value: 0.15, normal: '0.02 - 0.66', status: 'normal' },
        met_phe_ratio: { value: 0.36, normal: '0.17 - 0.74', status: 'normal' },
        phe_tyr_ratio: { value: 0.56, normal: '0.16 - 1.6', status: 'normal' },
        tyr_leu_ratio: { value: 0.73, normal: '0.13 - 2.64', status: 'normal' },
        tyr_met_ratio: { value: 4.89, normal: '1.86 - 16.06', status: 'normal' },
        val_phe_ratio: { value: 2.06, normal: '0.58 - 3.5', status: 'normal' },
        c3_met_ratio: { value: 0.12, normal: '0.01 - 0.25', status: 'normal' },
        c3_c2_ratio: { value: 0.12, normal: '0.01 - 0.34', status: 'normal' },
        c3_c16_ratio: { value: 0.59, normal: '0.19 - 1.35', status: 'normal' },
        c3dc_c4oh_c8_ratio: { value: 0.85, normal: '0.29 - 5.25', status: 'normal' },
        c0_c16_c18_ratio: { value: 5.84, normal: '1.88 - 12.16', status: 'normal' },
        c4dc_c5oh_c8_ratio: { value: 6.76, normal: '1.38 - 12.6', status: 'normal' },
        c8_c10_ratio: { value: 0.83, normal: '0.4 - 2.3', status: 'normal' },
        c8_c2_ratio: { value: 0.002, normal: '0 - 0.01', status: 'normal' },
        c5dc_c6oh_c8_ratio: { value: 1.32, normal: '0.14 - 9', status: 'normal' },
        c16_c18_1_c2_ratio: { value: 0.23, normal: '0.16 - 0.89', status: 'normal' }
      },
      doctorConclusion: ''
    },
    {
      id: 6,
      testCode: 'y12345683',
      patientName: 'Trần Thị Hồng VV',
      birthDate: '03/12/2025',
      testDate: '03/10/2025',
      result: 'negative',
      phone: '0936 794 201',
      branch: 'Chi nhánh Hà Nội',
      analysisDate: '03/10/2025',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      diagnosis: 'Bình thường',
      diseaseCode: null,
      biomarkers: {
        ala: { value: 271, normal: '117 - 541', status: 'normal' },
        arg: { value: 1.8, normal: '0.9 - 32', status: 'normal' },
        cit: { value: 12.8, normal: '4 - 29', status: 'normal' },
        gln: { value: 176, normal: '88 - 901', status: 'normal' },
        glu: { value: 455, normal: '62 - 797', status: 'normal' },
        gly: { value: 380, normal: '184 - 837', status: 'normal' },
        leu: { value: 165, normal: '53 - 260', status: 'normal' },
        met: { value: 16.9, normal: '5.6 - 40.1', status: 'normal' },
        orn: { value: 136, normal: '14 - 194', status: 'normal' },
        phe: { value: 46, normal: '23 - 97', status: 'normal' },
        pro: { value: 153, normal: '73 - 264', status: 'normal' },
        tyr: { value: 110, normal: '15 - 358', status: 'normal' },
        val: { value: 165, normal: '51 - 212', status: 'normal' },
        c0: { value: 38.9, normal: '7.5 - 59', status: 'normal' },
        c2: { value: 15.7, normal: '4.6 - 52', status: 'normal' },
        c3: { value: 2.43, normal: '0.36 - 4.93', status: 'normal' },
        c3dc_c4oh: { value: 0.06, normal: '0 - 0.33', status: 'normal' },
        c4: { value: 0.16, normal: '0.05 - 0.7', status: 'normal' },
        c4dc_c5oh: { value: 0.1, normal: '0.07 - 0.45', status: 'normal' },
        c5: { value: 0.17, normal: '0.03 - 0.33', status: 'normal' },
        c5dc_c6oh: { value: 0.07, normal: '0.02 - 0.18', status: 'normal' },
        c5_1: { value: 0.02, normal: '0 - 0.08', status: 'normal' },
        c6: { value: 0.024, normal: '0.007 - 0.12', status: 'normal' },
        c6dc: { value: 0.06, normal: '0.02 - 0.25', status: 'normal' },
        c8: { value: 0.031, normal: '0.013 - 0.21', status: 'normal' },
        c8_1: { value: 0.06, normal: '0 - 0.22', status: 'normal' },
        c10: { value: 0.037, normal: '0.015 - 0.24', status: 'normal' },
        c10_1: { value: 0.03, normal: '0 - 0.08', status: 'normal' },
        c10_2: { value: 0.008, normal: '0 - 0.08', status: 'normal' },
        c12: { value: 0.071, normal: '0.017 - 0.29', status: 'normal' },
        c12_1: { value: 0.02, normal: '0.01 - 0.27', status: 'normal' },
        c14: { value: 0.19, normal: '0.06 - 0.5', status: 'normal' },
        c14_1: { value: 0.05, normal: '0.02 - 0.37', status: 'normal' },
        c14_2: { value: 0.02, normal: '0 - 0.06', status: 'normal' },
        c14oh: { value: 0.006, normal: '0 - 0.04', status: 'normal' },
        c16: { value: 1.4, normal: '0.8 - 6.7', status: 'normal' },
        c16_1: { value: 0.11, normal: '0.04 - 0.54', status: 'normal' },
        c16_1oh: { value: 0.02, normal: '0.01 - 0.13', status: 'normal' },
        c16oh: { value: 0.01, normal: '0 - 0.06', status: 'normal' },
        c18: { value: 0.39, normal: '0.23 - 1.97', status: 'normal' },
        c18_1: { value: 0.7, normal: '0.5 - 2.5', status: 'normal' },
        c18_1oh: { value: 0.02, normal: '0 - 0.05', status: 'normal' },
        c18_2: { value: 0.23, normal: '0.06 - 0.56', status: 'normal' },
        c18oh: { value: 0.01, normal: '0 - 0.03', status: 'normal' },
        c18_2oh: { value: 0.02, normal: '0 - 0.04', status: 'normal' },
        c20: { value: 0.01, normal: '0.01 - 0.11', status: 'normal' },
        c22: { value: 0, normal: '0 - 0.02', status: 'normal' },
        c24: { value: 0.01, normal: '0 - 0.06', status: 'normal' },
        c26: { value: 0, normal: '0 - 0.03', status: 'normal' },
        ado: { value: 1.09, normal: '0.21 - 3.14', status: 'normal' },
        d_ado: { value: 0.03, normal: '0 - 0.05', status: 'normal' },
        c20_0_lpc: { value: 0.99, normal: '0.05 - 1.77', status: 'normal' },
        c22_0_lpc: { value: 0.59, normal: '0.03 - 1.5', status: 'normal' },
        c24_0_lpc: { value: 0.54, normal: '0.08 - 2.78', status: 'normal' },
        c26_0_lpc: { value: 0.2, normal: '0.03 - 0.75', status: 'normal' },
        lv_pt_ratio: { value: 2.2, normal: '0.66 - 2.72', status: 'normal' },
        cit_arg_ratio: { value: 11, normal: '0.3 - 19.9', status: 'normal' },
        cit_phe_ratio: { value: 0.22, normal: '0.07 - 0.72', status: 'normal' },
        carnitine_cit_ratio: { value: 2.8, normal: '1.53 - 8.75', status: 'normal' },
        c14_1_c12_1_ratio: { value: 1.82, normal: '0.9 - 5', status: 'normal' },
        leu_phe_ratio: { value: 2.19, normal: '0.63 - 3.74', status: 'normal' },
        met_leu_ratio: { value: 0.13, normal: '0.02 - 0.66', status: 'normal' },
        met_phe_ratio: { value: 0.29, normal: '0.17 - 0.74', status: 'normal' },
        phe_tyr_ratio: { value: 1.31, normal: '0.16 - 1.6', status: 'normal' },
        tyr_leu_ratio: { value: 0.35, normal: '0.13 - 2.64', status: 'normal' },
        tyr_met_ratio: { value: 2.65, normal: '1.86 - 16.06', status: 'normal' },
        val_phe_ratio: { value: 1.6, normal: '0.58 - 3.5', status: 'normal' },
        c3_met_ratio: { value: 0.03, normal: '0.01 - 0.25', status: 'normal' },
        c3_c2_ratio: { value: 0.2, normal: '0.01 - 0.34', status: 'normal' },
        c3_c16_ratio: { value: 0.22, normal: '0.19 - 1.35', status: 'normal' },
        c3dc_c4oh_c8_ratio: { value: 1.9, normal: '0.29 - 5.25', status: 'normal' },
        c0_c16_c18_ratio: { value: 5.64, normal: '1.88 - 12.16', status: 'normal' },
        c4dc_c5oh_c8_ratio: { value: 9.93, normal: '1.38 - 12.6', status: 'normal' },
        c8_c10_ratio: { value: 0.8, normal: '0.4 - 2.3', status: 'normal' },
        c8_c2_ratio: { value: 0.006, normal: '0 - 0.01', status: 'normal' },
        c5dc_c6oh_c8_ratio: { value: 1.24, normal: '0.14 - 9', status: 'normal' },
        c16_c18_1_c2_ratio: { value: 0.89, normal: '0.16 - 0.89', status: 'normal' }
      },
      doctorConclusion: ''
    },
    {
      id: 7,
      testCode: 'y12345684',
      patientName: 'Quách Thị LL',
      birthDate: '03/13/2025',
      testDate: '03/10/2025',
      result: 'negative',
      phone: '0916 234 705',
      branch: 'Chi nhánh Hà Nội',
      analysisDate: '03/10/2025',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      diagnosis: 'Bình thường',
      diseaseCode: null,
      biomarkers: {
        ala: { value: 364, normal: '117 - 541', status: 'normal' },
        arg: { value: 1.5, normal: '0.9 - 32', status: 'normal' },
        cit: { value: 16.4, normal: '4 - 29', status: 'normal' },
        gln: { value: 138, normal: '88 - 901', status: 'normal' },
        glu: { value: 536, normal: '62 - 797', status: 'normal' },
        gly: { value: 690, normal: '184 - 837', status: 'normal' },
        leu: { value: 170, normal: '53 - 260', status: 'normal' },
        met: { value: 22.4, normal: '5.6 - 40.1', status: 'normal' },
        orn: { value: 127, normal: '14 - 194', status: 'normal' },
        phe: { value: 78, normal: '23 - 97', status: 'normal' },
        pro: { value: 155, normal: '73 - 264', status: 'normal' },
        tyr: { value: 59, normal: '15 - 358', status: 'normal' },
        val: { value: 131, normal: '51 - 212', status: 'normal' },
        c0: { value: 27.8, normal: '7.5 - 59', status: 'normal' },
        c2: { value: 4.6, normal: '4.6 - 52', status: 'normal' },
        c3: { value: 0.82, normal: '0.36 - 4.93', status: 'normal' },
        c3dc_c4oh: { value: 0.07, normal: '0 - 0.33', status: 'normal' },
        c4: { value: 0.12, normal: '0.05 - 0.7', status: 'normal' },
        c4dc_c5oh: { value: 0.19, normal: '0.07 - 0.45', status: 'normal' },
        c5: { value: 0.06, normal: '0.03 - 0.33', status: 'normal' },
        c5dc_c6oh: { value: 0.05, normal: '0.02 - 0.18', status: 'normal' },
        c5_1: { value: 0.02, normal: '0 - 0.08', status: 'normal' },
        c6: { value: 0.008, normal: '0.007 - 0.12', status: 'normal' },
        c6dc: { value: 0.04, normal: '0.02 - 0.25', status: 'normal' },
        c8: { value: 0.032, normal: '0.013 - 0.21', status: 'normal' },
        c8_1: { value: 0.02, normal: '0 - 0.22', status: 'normal' },
        c10: { value: 0.043, normal: '0.015 - 0.24', status: 'normal' },
        c10_1: { value: 0.03, normal: '0 - 0.08', status: 'normal' },
        c10_2: { value: 0.005, normal: '0 - 0.08', status: 'normal' },
        c12: { value: 0.056, normal: '0.017 - 0.29', status: 'normal' },
        c12_1: { value: 0.04, normal: '0.01 - 0.27', status: 'normal' },
        c14: { value: 0.16, normal: '0.06 - 0.5', status: 'normal' },
        c14_1: { value: 0.06, normal: '0.02 - 0.37', status: 'normal' },
        c14_2: { value: 0.01, normal: '0 - 0.06', status: 'normal' },
        c14oh: { value: 0.008, normal: '0 - 0.04', status: 'normal' },
        c16: { value: 3.6, normal: '0.8 - 6.7', status: 'normal' },
        c16_1: { value: 0.2, normal: '0.04 - 0.54', status: 'normal' },
        c16_1oh: { value: 0.05, normal: '0.01 - 0.13', status: 'normal' },
        c16oh: { value: 0.02, normal: '0 - 0.06', status: 'normal' },
        c18: { value: 1.06, normal: '0.23 - 1.97', status: 'normal' },
        c18_1: { value: 1, normal: '0.5 - 2.5', status: 'normal' },
        c18_1oh: { value: 0.02, normal: '0 - 0.05', status: 'normal' },
        c18_2: { value: 0.12, normal: '0.06 - 0.56', status: 'normal' },
        c18oh: { value: 0.01, normal: '0 - 0.03', status: 'normal' },
        c18_2oh: { value: 0.02, normal: '0 - 0.04', status: 'normal' },
        c20: { value: 0.02, normal: '0.01 - 0.11', status: 'normal' },
        c22: { value: 0, normal: '0 - 0.02', status: 'normal' },
        c24: { value: 0.01, normal: '0 - 0.06', status: 'normal' },
        c26: { value: 0.01, normal: '0 - 0.03', status: 'normal' },
        ado: { value: 0.91, normal: '0.21 - 3.14', status: 'normal' },
        d_ado: { value: 0.02, normal: '0 - 0.05', status: 'normal' },
        c20_0_lpc: { value: 0.17, normal: '0.05 - 1.77', status: 'normal' },
        c22_0_lpc: { value: 0.22, normal: '0.03 - 1.5', status: 'normal' },
        c24_0_lpc: { value: 0.54, normal: '0.08 - 2.78', status: 'normal' },
        c26_0_lpc: { value: 0.2, normal: '0.03 - 0.75', status: 'normal' },
        lv_pt_ratio: { value: 2.2, normal: '0.66 - 2.72', status: 'normal' },
        cit_arg_ratio: { value: 11, normal: '0.3 - 19.9', status: 'normal' },
        cit_phe_ratio: { value: 0.22, normal: '0.07 - 0.72', status: 'normal' },
        carnitine_cit_ratio: { value: 2.8, normal: '1.53 - 8.75', status: 'normal' },
        c14_1_c12_1_ratio: { value: 1.82, normal: '0.9 - 5', status: 'normal' },
        leu_phe_ratio: { value: 2.19, normal: '0.63 - 3.74', status: 'normal' },
        met_leu_ratio: { value: 0.13, normal: '0.02 - 0.66', status: 'normal' },
        met_phe_ratio: { value: 0.29, normal: '0.17 - 0.74', status: 'normal' },
        phe_tyr_ratio: { value: 1.31, normal: '0.16 - 1.6', status: 'normal' },
        tyr_leu_ratio: { value: 0.35, normal: '0.13 - 2.64', status: 'normal' },
        tyr_met_ratio: { value: 2.65, normal: '1.86 - 16.06', status: 'normal' },
        val_phe_ratio: { value: 1.6, normal: '0.58 - 3.5', status: 'normal' },
        c3_met_ratio: { value: 0.03, normal: '0.01 - 0.25', status: 'normal' },
        c3_c2_ratio: { value: 0.2, normal: '0.01 - 0.34', status: 'normal' },
        c3_c16_ratio: { value: 0.22, normal: '0.19 - 1.35', status: 'normal' },
        c3dc_c4oh_c8_ratio: { value: 1.9, normal: '0.29 - 5.25', status: 'normal' },
        c0_c16_c18_ratio: { value: 5.64, normal: '1.88 - 12.16', status: 'normal' },
        c4dc_c5oh_c8_ratio: { value: 9.93, normal: '1.38 - 12.6', status: 'normal' },
        c8_c10_ratio: { value: 0.8, normal: '0.4 - 2.3', status: 'normal' },
        c8_c2_ratio: { value: 0.006, normal: '0 - 0.01', status: 'normal' },
        c5dc_c6oh_c8_ratio: { value: 1.24, normal: '0.14 - 9', status: 'normal' },
        c16_c18_1_c2_ratio: { value: 0.89, normal: '0.16 - 0.89', status: 'normal' }
      },
      doctorConclusion: ''
    }
  ]);
  const doctorPhone = '0987 654 321'; // Số điện thoại mặc định

  const handleReAnalyze = (testResult: any) => {
    toast({
      title: "Phân tích lại",
      description: `Đang phân tích lại xét nghiệm ${testResult.testCode}`,
    });
    console.log('Re-analyzing test:', testResult.testCode);
  };

  // --- BẮT ĐẦU: HÀM LẤY DỮ LIỆU BỆNH NHI BỔ SUNG ---
  // Hàm này giả lập việc lấy dữ liệu chi tiết hơn cho bệnh nhi
  const getAdditionalPatientData = (testCode: string) => {
    if (testCode === 'y12345678') {
      return { gender: 'Nữ', gestationalAge: 39, birthWeight: 3800, twinStatus: 'Sinh đơn', ivfStatus: 'Có', address: 'Hà Nội', antibioticUse: 'Không', breastfeeding: 'Có', sampleCode: testCode, sampleCollectionDate: '03/05/2025', sampleReceiptDate: '03/05/2025' };
    } else if (testCode === 'y12345679') {
      return { gender: 'Nữ', gestationalAge: 39, birthWeight: 3700, twinStatus: 'Sinh đơn', ivfStatus: 'Có', address: 'Hà Nội', antibioticUse: 'Không', breastfeeding: 'Có', sampleCode: testCode, sampleCollectionDate: '03/06/2025', sampleReceiptDate: '03/06/2025', doctorPhone: '0908 631 472' };
    }
    // Dữ liệu mặc định cho các xét nghiệm khác
    return { gender: 'Nam', gestationalAge: 38, birthWeight: 3500, twinStatus: 'Sinh đơn', ivfStatus: 'Không', address: 'Hà Nội', antibioticUse: 'Không', breastfeeding: 'Có', sampleCode: testCode, sampleCollectionDate: 'N/A', sampleReceiptDate: 'N/A' };
  };
  // --- KẾT THÚC: HÀM LẤY DỮ LIỆU BỆNH NHI BỔ SUNG ---

  // Dán đoạn code này vào file TestResultManagement.tsx để thay thế hàm handleDownloadReport cũ

const handleDownloadReport = async (testResult: any) => {
  // --- Bắt đầu quá trình chuẩn bị dữ liệu cho PdfGenerator ---

  // 1. Lấy dữ liệu bệnh nhi bổ sung
  const additionalPatientData = getAdditionalPatientData(testResult.testCode);

  // 2. Tạo danh sách đầy đủ 77 chỉ số
  const fullBiomarkers = generateDefaultBiomarkers();
  Object.keys(testResult.biomarkers).forEach(key => {
    if (fullBiomarkers[key]) {
      fullBiomarkers[key] = testResult.biomarkers[key];
    }
  });

  // 3. Chuẩn bị mảng biomarkers để truyền vào hàm formatBiomarkers
  const biomarkersForPdf = BIOMARKER_LIST.map(biomarker => {
    const key = biomarker.code.toLowerCase();
    const marker = fullBiomarkers[key];
    return {
      name: biomarker.name,
      value: marker.value || '--',
      unit: '', // Bạn có thể thêm đơn vị ở đây nếu cần
      normalRange: marker.normal || 'N/A',
      status: marker.status === 'high' ? 'Tăng' : marker.status === 'low' ? 'Giảm' : 'Trong ngưỡng',
    };
  });

  // 4. Lọc ra các chỉ số Tăng/Giảm để hiển thị riêng
  const highBiomarkers = BIOMARKER_LIST.filter(b => fullBiomarkers[b.code.toLowerCase()]?.status === 'high');
  const lowBiomarkers = BIOMARKER_LIST.filter(b => fullBiomarkers[b.code.toLowerCase()]?.status === 'low');
  
  // --- Kết thúc quá trình chuẩn bị dữ liệu ---

  try {
    // Khởi tạo lớp PdfGenerator
    const pdfGen = new PdfGenerator();
    
    // Bắt đầu xây dựng nội dung HTML cho file PDF
    pdfGen.addTitle('BÁO CÁO XÉT NGHIỆM CHI TIẾT');
    
    // Mục A: Thông tin xét nghiệm
    pdfGen.addSectionHeader('A. THÔNG TIN XÉT NGHIỆM');
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
    
    // Mục B: Bảng chi tiết 77 chỉ số
    // Truyền dữ liệu đã được định dạng vào hàm formatBiomarkers
    pdfGen.formatBiomarkers(biomarkersForPdf);
    
    // Mục C: Kết quả phân tích tóm tắt
    pdfGen.addSectionHeader('C. KẾT QUẢ PHÂN TÍCH');
    pdfGen.addText('DANH SÁCH CÁC CHỈ SỐ TĂNG:');
    if (highBiomarkers.length > 0) {
      highBiomarkers.forEach(biomarker => {
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
      lowBiomarkers.forEach(biomarker => {
        const key = biomarker.code.toLowerCase();
        const marker = fullBiomarkers[key];
        pdfGen.addText(`- ${biomarker.name}: ${marker.value} (BT: ${marker.normal})`);
      });
    } else {
      pdfGen.addText('Không có chỉ số nào giảm thấp');
    }
    pdfGen.addSpace();
  
    // Mục D: Kết quả chẩn đoán
    pdfGen.addSectionHeader('D. KẾT QUẢ CHẨN ĐOÁN');
    pdfGen.addLabelValue('Kết quả xét nghiệm', testResult.result === 'positive' ? 'Dương tính' : 'Âm tính');
    pdfGen.addLabelValue('Chẩn đoán', testResult.diagnosis);
    if (testResult.diseaseCode) {
      pdfGen.addLabelValue('Mã bệnh', testResult.diseaseCode);
    }
    pdfGen.addSpace();
  
    // Mục E: Kết luận bác sĩ
    pdfGen.addSectionHeader('E. KẾT LUẬN CỦA BÁC SĨ');
    pdfGen.addText(testResult.doctorConclusion || 'Chưa có kết luận từ bác sĩ');
    
    // Gọi hàm downloadPdf để bắt đầu quá trình tạo ảnh và tải về
    await pdfGen.downloadPdf(`BaoCao_ChiTiet_${testResult.testCode}.pdf`);
  
    toast({ title: "Tải xuống thành công", description: `Báo cáo chi tiết ${testResult.testCode} đã được tải xuống PDF` });
    
  } catch (error) {
    console.error('Lỗi khi tạo PDF:', error);
    toast({ title: "Lỗi tạo PDF", description: "Không thể tạo file PDF. Vui lòng thử lại.", variant: "destructive" });
  }
};

  const handleViewTestDetails = (testResult: any) => {
    setSelectedTest(testResult);
  };

  const filteredTestResults = testResults.filter(test => {
    const matchesSearch = test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testCode.toLowerCase().includes(searchTerm.toLowerCase());
    if (isCollaborator) {
      return matchesSearch && test.accountCode === 'COL001';
    }
    return matchesSearch;
  });

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

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã số mẫu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

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
              {filteredTestResults.map((test) => (
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
                        onClick={() => handleDownloadReport(test)} // <-- SỬ DỤNG HÀM MỚI TẠI ĐÂY
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
        </CardContent>
      </Card>

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