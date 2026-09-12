import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MediKiosk database with realistic demo records...');

  // Clean existing demo data
  await prisma.patient.deleteMany();

  // 1. Red-Flag Cardiac Emergency Patient
  const p1 = await prisma.patient.create({
    data: {
      patientId: 'MK-2026-000101',
      fullName: 'Rameshwar Prasad Patel',
      age: 58,
      gender: 'Male',
      height: 172,
      phone: '+91 98765 43210',
      email: 'rameshwar.patel@example.com',
      address: 'Village Pipariya, Hoshangabad, MP',
      preferredLanguage: 'hi',
      abhaId: '91-4829-1039-4412',
      emergencyContact: '+91 98765 43211 (Son: Suresh)',
      department: 'Cardiology OPD',
      ayushMode: false,
      status: 'Awaiting Doctor Review',
      sessions: {
        create: {
          status: 'COMPLETED',
          mode: 'STANDARD',
          answers: {
            create: [
              {
                questionId: 'q_onset',
                questionText: 'When did your problem or pain start?',
                answerText: 'Today morning around 6:00 AM during walk',
                inputMethod: 'voice',
                category: 'complaint',
                originalLanguage: 'hi',
              },
              {
                questionId: 'q_location',
                questionText: 'Where exactly is the pain or discomfort located?',
                answerText: 'Chest area radiating to left shoulder and jaw',
                inputMethod: 'voice',
                category: 'complaint',
                originalLanguage: 'hi',
              },
              {
                questionId: 'q_severity',
                questionText: 'How severe is your discomfort right now?',
                answerText: 'Severe (8/10)',
                inputMethod: 'touch',
                category: 'complaint',
                originalLanguage: 'hi',
              },
              {
                questionId: 'q_character',
                questionText: 'How would you describe the feeling of the problem?',
                answerText: 'Heavy crushing pressure on chest',
                inputMethod: 'voice',
                category: 'hpi',
                originalLanguage: 'hi',
              },
              {
                questionId: 'q_associated',
                questionText: 'Do you have fever, nausea, vomiting, dizziness, or weakness?',
                answerText: 'Shortness of breath and profuse cold sweating',
                inputMethod: 'voice',
                category: 'hpi',
                originalLanguage: 'hi',
              },
              {
                questionId: 'q_aggravating',
                questionText: 'Does walking, eating, lying down, or breathing make it worse?',
                answerText: 'Worse with walking or exertion',
                inputMethod: 'touch',
                category: 'hpi',
                originalLanguage: 'hi',
              },
              {
                questionId: 'q_relieving',
                questionText: 'What gives you relief from this symptom?',
                answerText: 'Slightly relieved by sitting still',
                inputMethod: 'voice',
                category: 'hpi',
                originalLanguage: 'hi',
              },
              {
                questionId: 'q_pmh',
                questionText: 'Do you have long-term conditions like Diabetes, BP, Asthma, or Heart Disease?',
                answerText: 'High Blood Pressure and Diabetes Mellitus for 8 years',
                inputMethod: 'touch',
                category: 'pmh',
                originalLanguage: 'hi',
              },
              {
                questionId: 'q_psh',
                questionText: 'Have you had any major surgeries or hospitalizations in the past?',
                answerText: 'No past surgeries',
                inputMethod: 'touch',
                category: 'psh',
                originalLanguage: 'hi',
              },
              {
                questionId: 'q_medications',
                questionText: 'Are you currently taking any daily medicines or home remedies?',
                answerText: 'Tab Amlodipine 5mg and Tab Metformin 500mg daily',
                inputMethod: 'voice',
                category: 'meds',
                originalLanguage: 'hi',
              },
            ],
          },
        },
      },
      redFlags: {
        create: [
          {
            severity: 'CRITICAL',
            category: 'Cardiovascular Safety Alert',
            triggerText: 'Acute Chest Pain radiating to left arm/jaw reported',
            message: 'Potential acute coronary syndrome reported. Priority 1 Triage & STAT ECG advised.',
          },
        ],
      },
      summaries: {
        create: {
          model: 'gpt-4o-mini-heuristic',
          summaryJson: JSON.stringify({
            patientOverview: {
              fullName: 'Rameshwar Prasad Patel',
              age: 58,
              gender: 'Male',
              height: 172,
              language: 'HI',
              chiefComplaint: 'Acute heavy crushing chest discomfort for 4 hours radiating to left shoulder',
            },
            historyOfPresentIllness:
              'Patient reports sudden onset of heavy crushing chest discomfort beginning today at 6 AM while walking. Pain radiates to left shoulder and jaw with severity rated 8/10. Aggravated by exertion, mild relief when sitting stationary.',
            associatedSymptoms: ['Shortness of breath reported', 'Profuse cold diaphoresis reported'],
            pastMedicalHistory: ['Hypertension (8 yrs)', 'Diabetes Mellitus (8 yrs)'],
            pastSurgicalHistory: ['None reported'],
            currentMedications: ['Amlodipine 5mg OD', 'Metformin 500mg BD'],
            allergies: ['No known drug allergies reported'],
            familyHistory: ['Father had history of heart disease'],
            personalHistory: { diet: 'Vegetarian', sleep: 'Regular', tobaccoAlcohol: 'Former smoker (quit 5 yrs ago)' },
            reviewOfSystems: { Cardiovascular: 'Severe acute chest pressure', Respiratory: 'Dyspnea on exertion' },
            documentsReviewed: [],
            reportedAbnormalFindings: [],
            patientOwnWords: [
              '[VOICE] "छाती में बहुत भारी दबाव और पसीना आ रहा है"',
              '[TOUCH] Severe (8/10)',
              '[VOICE] "बीपी और शुगर की दवा लेता हूँ"',
            ],
            missingUncertainInformation: ['Recent ECG or Cardiac Enzyme baseline not available in OPD file.'],
            redFlags: [
              {
                severity: 'CRITICAL',
                category: 'Cardiovascular Safety Alert',
                triggerText: 'Acute Chest Pain radiating to left arm/jaw reported',
                message: 'Potential acute coronary syndrome reported. Priority 1 Triage & STAT ECG advised.',
              },
            ],
            disclaimer:
              'AI-generated clinical intake summary. Based on patient-provided information and uploaded documents. Not a diagnosis. Physician verification required.',
          }),
        },
      },
      consents: {
        create: {
          consentStatus: 'GRANTED',
          consentVersion: 'v1.0-DPDP-ABDM',
          purpose: 'Clinical Intake and Triage Assessment',
        },
      },
    },
  });

  // 2. AYUSH Mode Patient
  const p2 = await prisma.patient.create({
    data: {
      patientId: 'MK-2026-000102',
      fullName: 'Ananya S. Bhat',
      age: 34,
      gender: 'Female',
      height: 161,
      phone: '+91 91234 56789',
      email: 'ananya.bhat@example.com',
      address: 'Malleshwaram 7th Cross, Bengaluru, KA',
      preferredLanguage: 'kn',
      abhaId: '91-3312-9011-5589',
      department: 'AYUSH / Ayurvedic OPD',
      ayushMode: true,
      status: 'Awaiting Doctor Review',
      sessions: {
        create: {
          status: 'COMPLETED',
          mode: 'AYUSH',
          answers: {
            create: [
              {
                questionId: 'q_onset',
                questionText: 'When did your problem or pain start?',
                answerText: '3-4 Weeks ago',
                inputMethod: 'touch',
                category: 'complaint',
                originalLanguage: 'kn',
              },
              {
                questionId: 'q_location',
                questionText: 'Where exactly is the pain or discomfort located?',
                answerText: 'Stomach / Abdomen and joints',
                inputMethod: 'touch',
                category: 'complaint',
                originalLanguage: 'kn',
              },
              {
                questionId: 'q_severity',
                questionText: 'How severe is your discomfort right now?',
                answerText: 'Moderate (5/10)',
                inputMethod: 'touch',
                category: 'complaint',
                originalLanguage: 'kn',
              },
              {
                questionId: 'ayush_prakriti_vitiation',
                questionText: 'AYUSH Assessment: Do you experience excessive body heat, dryness, coldness, or heaviness?',
                answerText: 'Heat & Acidity (Pitta) with hyperacidity after spicy food',
                inputMethod: 'voice',
                category: 'ayush',
                originalLanguage: 'kn',
              },
              {
                questionId: 'ayush_agni_digestive',
                questionText: 'AYUSH Ahara Shakti: How is your digestive fire (Agni) and appetite after meals?',
                answerText: 'Tikshnagni (Intense burning appetite)',
                inputMethod: 'touch',
                category: 'ayush',
                originalLanguage: 'kn',
              },
              {
                questionId: 'ayush_koshtha_bowel',
                questionText: 'AYUSH Koshtha: What is the nature of your bowel habit (Koshtha)?',
                answerText: 'Mridu Koshtha (Soft stool twice daily)',
                inputMethod: 'touch',
                category: 'ayush',
                originalLanguage: 'kn',
              },
              {
                questionId: 'ayush_sattva_psyche',
                questionText: 'AYUSH Sattva: How do you handle stress, anxiety, or emotional strain?',
                answerText: 'Madhyama Sattva (Moderate resilience)',
                inputMethod: 'touch',
                category: 'ayush',
                originalLanguage: 'kn',
              },
              {
                questionId: 'q_pmh',
                questionText: 'Do you have long-term conditions like Diabetes, BP, Asthma, or Heart Disease?',
                answerText: 'No chronic diseases',
                inputMethod: 'touch',
                category: 'pmh',
                originalLanguage: 'kn',
              },
              {
                questionId: 'q_psh',
                questionText: 'Have you had any major surgeries or hospitalizations in the past?',
                answerText: 'No past surgeries',
                inputMethod: 'touch',
                category: 'psh',
                originalLanguage: 'kn',
              },
              {
                questionId: 'q_medications',
                questionText: 'Are you currently taking any daily medicines or home remedies?',
                answerText: 'Ayurvedic Avipattikar Churna occasionally',
                inputMethod: 'voice',
                category: 'meds',
                originalLanguage: 'kn',
              },
            ],
          },
        },
      },
      summaries: {
        create: {
          model: 'gpt-4o-mini-heuristic',
          summaryJson: JSON.stringify({
            patientOverview: {
              fullName: 'Ananya S. Bhat',
              age: 34,
              gender: 'Female',
              height: 161,
              language: 'KN',
              chiefComplaint: 'Post-prandial hyperacidity and burning epigastric discomfort for 3 weeks',
            },
            historyOfPresentIllness:
              'Patient reports epigastric burning sensation worsening after meals for 3-4 weeks. Describes Pitta-predominant symptoms with acidity and mild joint stiffness.',
            associatedSymptoms: ['Acid reflux reported', 'Mild sleep disturbance due to discomfort'],
            pastMedicalHistory: ['No chronic medical conditions reported'],
            pastSurgicalHistory: ['None'],
            currentMedications: ['Home Ayurvedic herbal powder (Avipattikar Churna)'],
            allergies: ['No known drug allergies'],
            familyHistory: ['Mother has history of gastritis'],
            personalHistory: { diet: 'Spicy South Indian vegetarian', sleep: '6 hours', lifestyle: 'Active IT Professional' },
            reviewOfSystems: { Gastrointestinal: 'Hyperacidity, Pitta vitiation symptoms' },
            documentsReviewed: [],
            reportedAbnormalFindings: [],
            patientOwnWords: ['[VOICE] "ಊಟದ ನಂತರ ಎದೆಯುರಿ ಮತ್ತು ಹೊಟ್ಟೆಯಲ್ಲಿ ಶಾಖ ಹೆಚ್ಚಾಗುತ್ತದೆ"'],
            missingUncertainInformation: ['Serum H. Pylori status unverified.'],
            redFlags: [],
            ayushAssessment: {
              prakriti: 'Pitta-Vata (Self-reported Pitta dominance)',
              vikriti: 'Pitta Dosha Vitiation (Amlapitta clinical presentation)',
              sara: 'Madhyama Sara',
              samhanana: 'Madhyama Samhanana',
              pramana: 'Normal anthropometry (161 cm)',
              satmya: 'Satmya to rice & curd diet',
              sattva: 'Madhyama Sattva (Moderate emotional strength)',
              aharaShakti: 'Tikshnagni (Intense digestive fire with hyperacidity)',
              vyayamaShakti: 'Madhyama (Moderate physical endurance)',
              vaya: 'Yuvavastha (Adult)',
              agni: 'Tikshnagni',
              koshtha: 'Mridu Koshtha',
            },
            disclaimer:
              'AI-generated clinical intake summary. Based on patient-provided information and uploaded documents. Not a diagnosis. Physician verification required.',
          }),
        },
      },
      consents: {
        create: {
          consentStatus: 'GRANTED',
          consentVersion: 'v1.0-DPDP-ABDM',
          purpose: 'AYUSH Clinical Assessment',
        },
      },
    },
  });

  // 3. Document Upload & Doctor Suggestion Completed Patient
  const p3 = await prisma.patient.create({
    data: {
      patientId: 'MK-2026-000103',
      fullName: 'Gurpreet Singh Gill',
      age: 62,
      gender: 'Male',
      height: 178,
      phone: '+91 94123 88990',
      email: 'gurpreet.gill@example.com',
      address: 'GT Road, Ludhiana, PB',
      preferredLanguage: 'en',
      abhaId: '91-1189-4402-9912',
      department: 'General Internal Medicine',
      ayushMode: false,
      status: 'Doctor Suggestion Available',
      sessions: {
        create: {
          status: 'COMPLETED',
          mode: 'STANDARD',
          answers: {
            create: [
              {
                questionId: 'q_onset',
                questionText: 'When did your problem or pain start?',
                answerText: '2-3 Days Ago',
                inputMethod: 'touch',
                category: 'complaint',
                originalLanguage: 'en',
              },
              {
                questionId: 'q_location',
                questionText: 'Where exactly is the pain or discomfort located?',
                answerText: 'Head / Neck with fatigue',
                inputMethod: 'touch',
                category: 'complaint',
                originalLanguage: 'en',
              },
              {
                questionId: 'q_severity',
                questionText: 'How severe is your discomfort right now?',
                answerText: 'Moderate (5/10)',
                inputMethod: 'touch',
                category: 'complaint',
                originalLanguage: 'en',
              },
              {
                questionId: 'q_pmh',
                questionText: 'Do you have long-term conditions like Diabetes, BP, Asthma, or Heart Disease?',
                answerText: 'Diabetes / Sugar and High Blood Pressure',
                inputMethod: 'touch',
                category: 'pmh',
                originalLanguage: 'en',
              },
              {
                questionId: 'q_psh',
                questionText: 'Have you had any major surgeries or hospitalizations in the past?',
                answerText: 'No past surgeries',
                inputMethod: 'touch',
                category: 'psh',
                originalLanguage: 'en',
              },
              {
                questionId: 'q_medications',
                questionText: 'Are you currently taking any daily medicines or home remedies?',
                answerText: 'Tab Metformin 1000mg and Tab Telmisartan 40mg',
                inputMethod: 'voice',
                category: 'meds',
                originalLanguage: 'en',
              },
              {
                questionId: 'q_allergies',
                questionText: 'Do you have allergies to any medicines like Penicillin or Painkillers?',
                answerText: 'Penicillin Allergy reported',
                inputMethod: 'touch',
                category: 'allergies',
                originalLanguage: 'en',
              },
              {
                questionId: 'q_ros_habits',
                questionText: 'How is your daily sleep, bowel movement, and digestion?',
                answerText: 'Good & Regular',
                inputMethod: 'touch',
                category: 'ros',
                originalLanguage: 'en',
              },
            ],
          },
        },
      },
      documents: {
        create: [
          {
            fileName: 'recent_blood_report_jan2026.pdf',
            filePath: '/uploads/recent_blood_report_jan2026.pdf',
            fileType: 'lab_report',
            documentDate: '2026-01-20',
            ocrStatus: 'COMPLETED',
            ocrText: 'Apex Labs HbA1c: 8.4% (High), Fasting Glucose: 168 mg/dL, Serum Creatinine: 1.1 mg/dL',
            extractions: {
              create: [
                {
                  extractedData: JSON.stringify({
                    documentType: 'Lab Report',
                    documentDate: '2026-01-20',
                    hospitalName: 'Apex Diagnostics',
                    investigations: [
                      { name: 'HbA1c', result: '8.4 %', referenceRange: '< 5.7 %', isAbnormal: true },
                      { name: 'Fasting Blood Glucose', result: '168 mg/dL', referenceRange: '70-99 mg/dL', isAbnormal: true },
                    ],
                  }),
                  confidence: 0.94,
                  verificationStatus: 'VERIFIED',
                },
              ],
            },
          },
        ],
      },
      summaries: {
        create: {
          model: 'gpt-4o-mini-heuristic',
          summaryJson: JSON.stringify({
            patientOverview: {
              fullName: 'Gurpreet Singh Gill',
              age: 62,
              gender: 'Male',
              height: 178,
              language: 'EN',
              chiefComplaint: 'Occasional morning occipital headache and sub-optimal glycemic control',
            },
            historyOfPresentIllness:
              '62-year-old male with known Type 2 Diabetes and Hypertension presenting for routine follow-up. Reports mild morning headaches for 3 days.',
            associatedSymptoms: ['Mild fatigue'],
            pastMedicalHistory: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
            pastSurgicalHistory: ['None'],
            currentMedications: ['Tab Metformin 1000 mg BD', 'Tab Telmisartan 40 mg OD'],
            allergies: ['Penicillin (causes skin rash)'],
            familyHistory: ['Strong family history of Type 2 Diabetes'],
            personalHistory: { diet: 'Non-vegetarian', sleep: '7 hours', lifestyle: 'Retired teacher' },
            reviewOfSystems: { Endocrine: 'Elevated HbA1c (8.4%) noted on recent lab upload' },
            documentsReviewed: [
              {
                fileName: 'recent_blood_report_jan2026.pdf',
                fileType: 'lab_report',
                extractedSummary: 'Extracted Lab Report: HbA1c 8.4% (High), Fasting Glucose 168 mg/dL',
              },
            ],
            reportedAbnormalFindings: ['recent_blood_report_jan2026.pdf: HbA1c reported at 8.4 % (Ref: < 5.7 %)'],
            patientOwnWords: ['[TOUCH] Occasional morning headache', '[TOUCH] Penicillin Allergy reported'],
            missingUncertainInformation: ['Urine Microalbumin / Creatinine ratio test pending.'],
            redFlags: [],
            disclaimer:
              'AI-generated clinical intake summary. Based on patient-provided information and uploaded documents. Not a diagnosis. Physician verification required.',
          }),
        },
      },
      suggestions: {
        create: [
          {
            doctorId: 'dr_sharma',
            suggestion:
              'HbA1c is elevated at 8.4%. Continue Metformin 1000mg BD. Add Teneligliptin 20mg once daily after breakfast. Continue Telmisartan 40mg OD.',
            instructions: '1. Monitor fasting blood sugar weekly.\n2. Maintain 30-minute daily walking routine.\n3. Reduce carb intake.',
            followUpDate: '2026-03-25',
            sentToPatient: true,
            sentAt: new Date(),
          },
        ],
      },
      consents: {
        create: {
          consentStatus: 'GRANTED',
          consentVersion: 'v1.0-DPDP-ABDM',
          purpose: 'OPD Intake & Consultation',
        },
      },
    },
  });

  console.log('Seed completed successfully! 3 fictional demo patients created.');
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
