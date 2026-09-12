export type Language = 'en' | 'hi' | 'kn';

export interface PatientRegistration {
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  height?: number; // cm
  phone: string;
  email: string;
  address: string;
  preferredLanguage: Language;
  abhaId?: string;
  emergencyContact?: string;
  department: string;
  ayushMode: boolean;
}

export interface ClinicalQuestionOption {
  label: string;
  value: string;
  icon?: string;
}

export interface ClinicalQuestion {
  id: string;
  questionText: Record<Language, string>;
  category: 'complaint' | 'hpi' | 'pmh' | 'psh' | 'meds' | 'allergies' | 'ros' | 'ayush';
  options?: ClinicalQuestionOption[];
  allowVoice: boolean;
  allowTouch: boolean;
  audioPrompt?: Record<Language, string>;
}

export interface ClinicalAnswerRecord {
  questionId: string;
  questionText: string;
  answerText: string;
  inputMethod: 'voice' | 'touch' | 'audio';
  category: string;
  language: Language;
  confidence?: number;
  isClarified?: boolean;
  isUnclear?: boolean;
}

export interface ExtractedDocumentData {
  documentType: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Scan/Image' | 'General';
  documentDate?: string;
  hospitalName?: string;
  physicianName?: string;
  diagnoses?: string[];
  medications?: Array<{ name: string; dosage?: string; frequency?: string }>;
  investigations?: Array<{ name: string; result?: string; referenceRange?: string; isAbnormal?: boolean }>;
  notes?: string;
  confidence: number;
}

export interface RedFlagAlert {
  id?: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  category: string;
  triggerText: string;
  message: string;
}

export interface AyushDashavidhaData {
  prakriti?: string;
  vikriti?: string;
  sara?: string;
  samhanana?: string;
  pramana?: string;
  satmya?: string;
  sattva?: string;
  aharaShakti?: string;
  vyayamaShakti?: string;
  vaya?: string;
  agni?: string;
  koshtha?: string;
  nidana?: string;
  lifestyle?: string;
  doshicAnalysis?: string;
  formulations?: Array<{ name: string; indication: string; dosage: string; dravyaguna: string }>;
  pathya?: string[];
  apathya?: string[];
  herbDrugSafety?: string;
}

export interface TriageRiskScore {
  score: number; // 0 - 100
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  urgency: string; // "Immediate Emergency Evaluation" | "Priority OPD Consult" | "Standard OPD Consult"
  keyRiskFactors: string[];
  clinicalRationale: string;
}

export interface StructuredAiSummary {
  patientOverview: {
    fullName: string;
    age: number;
    gender: string;
    height?: number;
    language: string;
    chiefComplaint: string;
  };
  historyOfPresentIllness: string;
  aiClinicalDescription: string;
  triageRisk: TriageRiskScore;
  associatedSymptoms: string[];
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  familyHistory: string[];
  personalHistory: {
    diet?: string;
    sleep?: string;
    tobaccoAlcohol?: string;
    occupation?: string;
    lifestyle?: string;
  };
  reviewOfSystems: Record<string, string>;
  documentsReviewed: Array<{
    fileName: string;
    fileType: string;
    extractedSummary: string;
  }>;
  reportedAbnormalFindings: string[];
  patientOwnWords: string[];
  missingUncertainInformation: string[];
  redFlags: RedFlagAlert[];
  ayushAssessment?: AyushDashavidhaData;
  disclaimer: string;
}
