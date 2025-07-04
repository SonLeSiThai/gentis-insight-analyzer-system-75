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
