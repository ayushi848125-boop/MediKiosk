import { AyushDashavidhaData, ClinicalQuestion } from '@/types';

export const AYUSH_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'ayush_prakriti_vitiation',
    category: 'ayush',
    allowVoice: true,
    allowTouch: true,
    questionText: {
      en: 'AYUSH Assessment: Do you experience excessive body heat, dryness, coldness, or heaviness?',
      hi: 'आयुष मूल्यांकन: क्या आपको शरीर में अत्यधिक गर्मी, सूखापन, ठंड या भारीपन महसूस होता है?',
      kn: 'ಆಯುಷ್ ಮೌಲ್ಯಮಾಪನ: ನಿಮಗೆ ಅತಿಯಾದ ದೇಹದ ಶಾಖ, ಒಣಗುವಿಕೆ, ಶೀತ ಅಥವಾ ಭಾರವೆನಿಸುತ್ತದೆಯೇ?',
    },
    options: [
      { label: 'Heat & Acidity (Pitta)', value: 'Pitta / Heat dominance' },
      { label: 'Dryness & Joint Pain (Vata)', value: 'Vata / Dryness dominance' },
      { label: 'Heaviness & Mucus (Kapha)', value: 'Kapha / Heavy dominance' },
      { label: 'Balanced / Normal', value: 'Sama / Balanced' },
    ],
  },
  {
    id: 'ayush_agni_digestive',
    category: 'ayush',
    allowVoice: true,
    allowTouch: true,
    questionText: {
      en: 'AYUSH Ahara Shakti: How is your digestive fire (Agni) and appetite after meals?',
      hi: 'आयुष आहार शक्ति: भोजन के बाद आपकी पाचन अग्नि और भूख कैसी रहती है?',
      kn: 'ಆಯುಷ್ ಆಹಾರ ಶಕ್ತಿ: ಊಟದ ನಂತರ ನಿಮ್ಮ ಜೀರ್ಣಾಗ್ನಿ ಮತ್ತು ಹಸಿವು ಹೇಗಿರುತ್ತದೆ?',
    },
    options: [
      { label: 'Irregular / Gas (Vishamagni)', value: 'Vishamagni (Irregular)' },
      { label: 'Intense / Burning (Tikshnagni)', value: 'Tikshnagni (Intense)' },
      { label: 'Slow / Heavy (Mandagni)', value: 'Mandagni (Sluggish)' },
      { label: 'Normal & Timely (Samagni)', value: 'Samagni (Optimal)' },
    ],
  },
  {
    id: 'ayush_koshtha_bowel',
    category: 'ayush',
    allowVoice: true,
    allowTouch: true,
    questionText: {
      en: 'AYUSH Koshtha: What is the nature of your bowel habit (Koshtha)?',
      hi: 'आयुष कोष्ठ: आपकी मल निष्कासन की स्थिति (कोष्ठ) कैसी है?',
      kn: 'ಆಯುಷ್ ಕೊಷ್ಠ: ನಿಮ್ಮ ಮಲವಿಸರ್ಜನೆಯ ಸ್ವಭಾವ (ಕೊಷ್ಠ) ಹೇಗಿದೆ?',
    },
    options: [
      { label: 'Hard / Constipating (Krura Koshtha)', value: 'Krura Koshtha (Hard)' },
      { label: 'Soft / Loose (Mridu Koshtha)', value: 'Mridu Koshtha (Soft)' },
      { label: 'Medium / Regular (Madhyama Koshtha)', value: 'Madhyama Koshtha (Regular)' },
    ],
  },
  {
    id: 'ayush_sattva_psyche',
    category: 'ayush',
    allowVoice: true,
    allowTouch: true,
    questionText: {
      en: 'AYUSH Sattva: How do you handle stress, anxiety, or emotional strain?',
      hi: 'आयुष सत्व: आप मानसिक तनाव, चिंता या भावनाओं को कैसे संभालते हैं?',
      kn: 'ಆಯುಷ್ ಸತ್ವ: ನೀವು ಮಾನಸಿಕ ಒತ್ತಡ ಅಥವಾ ಆತಂಕವನ್ನು ಹೇಗೆ ಎದುರಿಸುತ್ತೀರಿ?',
    },
    options: [
      { label: 'Strong & Resilient (Pravara Sattva)', value: 'Pravara Sattva (Strong mental resilience)' },
      { label: 'Moderate Stability (Madhyama Sattva)', value: 'Madhyama Sattva (Moderate resilience)' },
      { label: 'Easily Anxious / Weak (Avara Sattva)', value: 'Avara Sattva (Sensitive / High anxiety)' },
    ],
  },
];

/**
 * Parses answered AYUSH questions into structured Dashavidha & Ashtavidha parameters
 * and provides complete classical Ayurvedic formulations, diet (Pathya/Apathya), and safety analysis.
 */
export function processAyushAnswers(answers: Array<{ questionId: string; answerText: string }>, chiefComplaint?: string): AyushDashavidhaData {
  const complaintStr = (chiefComplaint || '').toLowerCase();

  const ayushData: AyushDashavidhaData = {
    prakriti: 'Pitta-Vata Sama Prakriti (Baseline metabolic constitution)',
    vikriti: 'Moderate Vitiation in Agni & Srotas (Functional imbalance)',
    sara: 'Pravara Dhatu Sara (Good tissue integrity)',
    samhanana: 'Madhyama Samhanana (Compact body build)',
    pramana: 'Normal anthropometric proportion',
    satmya: 'Ojas & Savmya Satmya (Habituated to wholesome home diet)',
    sattva: 'Pravara Sattva (Strong mental resilience)',
    aharaShakti: 'Madhyama Ahara Shakti (Moderate digestive capacity)',
    vyayamaShakti: 'Madhyama Vyayama Shakti (Moderate physical capacity)',
    vaya: 'Madhyamavaya (Adult age group)',
    agni: 'Mandagni / Vishamagni (Sluggish or irregular digestive fire)',
    koshtha: 'Madhyama Koshtha (Regular bowel elimination)',
    nidana: 'Hetu: Irregular Ahara-Vihara (Dietary imbalance & routine strain)',
    lifestyle: 'Daily Dincharya, Ritucharya adherence, and Pathya Ahara recommended',
  };

  answers.forEach(a => {
    if (a.questionId.includes('prakriti')) {
      ayushData.prakriti = 'Prakriti Assessment: ' + a.answerText;
      ayushData.vikriti = 'Vitiation (Vikriti): ' + a.answerText;
    }
    if (a.questionId.includes('agni')) {
      ayushData.agni = a.answerText;
      ayushData.aharaShakti = 'Digestive Capacity: ' + a.answerText;
    }
    if (a.questionId.includes('koshtha')) {
      ayushData.koshtha = a.answerText;
    }
    if (a.questionId.includes('sattva')) {
      ayushData.sattva = a.answerText;
    }
  });

  // Doshic Analysis based on symptoms
  if (complaintStr.includes('fever') || complaintStr.includes('burning') || complaintStr.includes('acid') || complaintStr.includes('heat')) {
    ayushData.doshicAnalysis = 'Pitta Dosha Dominant Vitiation (Thermal elevation, Ushna/Tikshna Guna increase in Rasa & Rakta Dhatu).';
  } else if (complaintStr.includes('pain') || complaintStr.includes('joint') || complaintStr.includes('gas') || complaintStr.includes('headache')) {
    ayushData.doshicAnalysis = 'Vata Dosha Dominant Vitiation (Ruksha/Chala Guna increase causing Shoola and Vata Anulomana impairment).';
  } else if (complaintStr.includes('cough') || complaintStr.includes('cold') || complaintStr.includes('heavy') || complaintStr.includes('mucus')) {
    ayushData.doshicAnalysis = 'Kapha-Vata Vitiation (Manda/Snigdha Guna increase causing Pranavaha Srotas obstruction).';
  } else {
    ayushData.doshicAnalysis = 'Tridosha Samya Maintenance with mild Vata-Pitta Agnimandya imbalance.';
  }

  // Recommended Formulations (Classical Formulations)
  ayushData.formulations = [
    {
      name: 'Triphala Churna / Ghanvati',
      indication: 'Deepana, Pachana, and Mild Anulomana (Digestive & Bowel Regulator)',
      dosage: '3g - 5g at bedtime with warm water',
      dravyaguna: 'Rasa: Kashaya-Madhura-Amla | Virya: Anushna | Vipaka: Madhura',
    },
    {
      name: 'Guduchi Ghanvati (Tinospora cordifolia)',
      indication: 'Rasayana, Immunomodulator & Pitta-Kapha Shamana',
      dosage: '500mg twice daily post meals',
      dravyaguna: 'Rasa: Tikta-Kashaya | Virya: Ushna | Vipaka: Madhura',
    },
    {
      name: 'Sudarshan Vati / Sitopaladi Churna',
      indication: 'Jwarahara & Pranavaha Sroto-Shodhana (Respiratory & Fever relief)',
      dosage: '1 - 2 tablets twice daily with honey or warm water',
      dravyaguna: 'Rasa: Tikta-Katu | Virya: Sheeta/Ushna balanced | Vipaka: Katu',
    },
    {
      name: 'Ashwagandha Ghanvati (Withania somnifera)',
      indication: 'Balya, Brimhana & Sattvavajaya (Nervine tonic & stress reduction)',
      dosage: '1 tablet twice daily with lukewarm milk/water',
      dravyaguna: 'Rasa: Tikta-Kashaya-Madhura | Virya: Ushna | Vipaka: Madhura',
    },
  ];

  // Pathya (Wholesome / Recommended)
  ayushData.pathya = [
    'Warm, freshly cooked Kitchari (Rice & Mung Dal) prepared with Cow Ghee and Cumin.',
    'Warm water (Ushnodaka) for daily drinking to stimulate Agni.',
    'Seasonal sweet fruits (Pomegranates, Grapes, Stewed Apples).',
    'Adherence to regular meal times and minimum 7 hours of restorative sleep (Nidra).',
  ];

  // Apathya (Unwholesome / Avoid)
  ayushData.apathya = [
    'Refrigerated, cold, or stale food (Paryushita Ahara).',
    'Excessive intake of spicy, excessively salty, or deep-fried foods (Katu-Lavana-Amla).',
    'Late night sleeping (Ratri Jagarana) and day sleeping (Diva Swapna).',
    'Viruddhahara (Incompatible food combinations like milk with sour fruits or fish).',
  ];

  // Herb-Drug Safety & Integration Notes
  ayushData.herbDrugSafety = 'Integrative Safety Directive: Ayurvedic formulations listed above are natural classical supplements intended for supportive care. Co-prescribing with synthetic pharmaceutical agents should maintain a 30-minute interval. Avoid heavy mineral/bhasma preparations without explicit Panchakarma specialist supervision.';

  return ayushData;
}
