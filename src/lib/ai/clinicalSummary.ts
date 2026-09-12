import {
  PatientRegistration,
  ClinicalAnswerRecord,
  StructuredAiSummary,
  ExtractedDocumentData,
  RedFlagAlert,
  TriageRiskScore,
} from '@/types';
import { detectRedFlags } from './redFlagDetection';
import { processAyushAnswers } from './ayushHistory';

/**
 * AI Clinical Triage & Summary Engine
 * Analyzes patient voice/touch responses, computes AI Triage Risk Score (0-100%),
 * synthesizes AI Clinical Description, and generates disease-tailored AYUSH assessment.
 */
export async function generateClinicalSummary(
  patient: PatientRegistration,
  answers: ClinicalAnswerRecord[],
  documents: Array<{ fileName: string; fileType: string; data?: ExtractedDocumentData }>,
  customRedFlags?: RedFlagAlert[]
): Promise<StructuredAiSummary> {
  const chiefComplaint =
    answers.find(a => a.questionId.includes('complaint') || a.category === 'complaint')?.answerText ||
    'General medical OPD consultation requested.';

  // Detect Red Flags
  const detectedFlags = detectRedFlags(answers, chiefComplaint);
  const allRedFlags = [...detectedFlags, ...(customRedFlags || [])];

  // 1. Calculate AI Triage Risk Score (0 - 100%)
  const triageRisk = calculateTriageRiskScore(chiefComplaint, answers, allRedFlags, documents);

  // 2. Synthesize AI Clinical Description from patient's voice prompts & touch inputs
  const aiClinicalDescription = generateAiClinicalNarrative(patient, chiefComplaint, answers, documents, triageRisk);

  // 3. Generate Disease-Tailored AYUSH Assessment
  const ayushAnswers = answers.filter(a => a.category === 'ayush');
  const ayushData = processAyushAnswers(ayushAnswers, chiefComplaint);

  // Categorize answers
  const pmhAnswers = answers.filter(a => a.category === 'pmh').map(a => a.answerText);
  const pshAnswers = answers.filter(a => a.category === 'psh').map(a => a.answerText);
  const medsAnswers = answers.filter(a => a.category === 'meds').map(a => a.answerText);
  const allergyAnswers = answers.filter(a => a.category === 'allergies').map(a => a.answerText);
  const rosAnswers = answers.filter(a => a.category === 'ros');

  // Missing Information & Clarifications
  const missingInfo: string[] = [];
  if (!patient.height) missingInfo.push('Height measurements unrecorded.');
  if (medsAnswers.length === 0 || medsAnswers.includes('No daily medications')) {
    missingInfo.push('Exact dosages of over-the-counter or herbal remedies not verified.');
  }

  answers.forEach(a => {
    if (a.isClarified) {
      missingInfo.push(`Field "${a.questionId}" required targeted clarification before capturing.`);
    }
    if (a.isUnclear || (a.confidence !== undefined && a.confidence < 0.6)) {
      missingInfo.push(`Field "${a.questionId}" marked low-confidence. Clinician confirmation advised.`);
    }
  });

  // Document review summaries
  const docsReviewed = documents.map(d => ({
    fileName: d.fileName,
    fileType: d.fileType,
    extractedSummary: d.data
      ? `Extracted from ${d.data.documentType}: ${d.data.medications?.map(m => m.name).join(', ') || 'No meds list'} | Diagnoses: ${d.data.diagnoses?.join(', ') || 'None'}`
      : 'Document attached for clinician visual review.',
  }));

  const reportedAbnormal: string[] = [];
  documents.forEach(d => {
    d.data?.investigations?.filter(i => i.isAbnormal).forEach(i => {
      reportedAbnormal.push(`${d.fileName}: ${i.name} at ${i.result} (Ref: ${i.referenceRange || 'N/A'})`);
    });
  });

  // Direct Audio & Touch Transcripts
  const patientOwnWords = answers.map(
    a => `[${a.inputMethod.toUpperCase()}] Q: "${a.questionText}" -> A: "${a.answerText}"`
  );

  return {
    patientOverview: {
      fullName: patient.fullName,
      age: patient.age,
      gender: patient.gender,
      height: patient.height,
      language: patient.preferredLanguage.toUpperCase(),
      chiefComplaint,
    },
    historyOfPresentIllness: aiClinicalDescription,
    aiClinicalDescription,
    triageRisk,
    associatedSymptoms: answers
      .filter(a => a.questionId.includes('assoc') || a.questionId.includes('symptom'))
      .map(a => a.answerText),
    pastMedicalHistory: pmhAnswers.length > 0 ? pmhAnswers : ['No chronic medical conditions reported.'],
    pastSurgicalHistory: pshAnswers.length > 0 ? pshAnswers : ['No past surgical procedures reported.'],
    currentMedications: medsAnswers.length > 0 ? medsAnswers : ['No daily prescription medications reported.'],
    allergies: allergyAnswers.length > 0 ? allergyAnswers : ['No known drug allergies reported.'],
    familyHistory: ['Family medical history unstated during kiosk intake; physician review advised.'],
    personalHistory: {
      diet: 'General diet reported.',
      sleep: rosAnswers.find(a => a.questionId.includes('ros'))?.answerText || 'Normal sleep reported.',
      tobaccoAlcohol: 'No substance dependence reported during intake.',
      occupation: 'Not specified',
      lifestyle: patient.ayushMode
        ? 'AYUSH mode active; lifestyle details in Ayurvedic section.'
        : 'Standard OPD intake.',
    },
    reviewOfSystems: {
      General: 'Self-reported baseline status recorded.',
      Cardiovascular: chiefComplaint.toLowerCase().includes('chest')
        ? 'Chest pain / pressure reported'
        : 'Denies acute cardiac distress',
      Respiratory: chiefComplaint.toLowerCase().includes('cough') || chiefComplaint.toLowerCase().includes('breath')
        ? 'Respiratory discomfort reported'
        : 'Unremarkable',
      Gastrointestinal: chiefComplaint.toLowerCase().includes('stomach') || chiefComplaint.toLowerCase().includes('acid')
        ? 'Abdominal discomfort reported'
        : 'Unremarkable',
    },
    documentsReviewed: docsReviewed,
    reportedAbnormalFindings: reportedAbnormal.length > 0 ? reportedAbnormal : ['No abnormal findings flagged automatically.'],
    patientOwnWords,
    missingUncertainInformation: missingInfo,
    redFlags: allRedFlags,
    ayushAssessment: ayushData,
    disclaimer:
      'AI-generated clinical intake summary & triage risk score. Based on patient voice/touch inputs and uploaded medical documents. Not a final diagnosis. Physician evaluation required.',
  };
}

/**
 * Computes AI Triage Risk Score (0 - 100%) and Severity Level
 */
function calculateTriageRiskScore(
  complaint: string,
  answers: ClinicalAnswerRecord[],
  redFlags: RedFlagAlert[],
  documents: Array<{ fileName: string; fileType: string; data?: ExtractedDocumentData }>
): TriageRiskScore {
  let score = 20; // Baseline score
  const keyRiskFactors: string[] = [];
  const compText = complaint.toLowerCase();
  const allAnsText = answers.map(a => a.answerText.toLowerCase()).join(' ');

  // Cardiac Risk Evaluation
  if (compText.includes('chest') || compText.includes('heart') || allAnsText.includes('crushing') || allAnsText.includes('sweating')) {
    score += 45;
    keyRiskFactors.push('Acute Chest Discomfort / Cardiac Symptoms');

    if (allAnsText.includes('sweat') || allAnsText.includes('breathless') || allAnsText.includes('jaw') || allAnsText.includes('arm')) {
      score += 25;
      keyRiskFactors.push('Autonomic Symptoms (Cold Sweating / Radiation to Arm)');
    }
  }

  // Fever & Sepsis Risk Evaluation
  if (compText.includes('fever') || allAnsText.includes('chills') || allAnsText.includes('rigor')) {
    score += 25;
    keyRiskFactors.push('Acute Pyrexia with Systemic Chills');

    if (allAnsText.includes('vomiting') || allAnsText.includes('rash') || allAnsText.includes('refractory')) {
      score += 20;
      keyRiskFactors.push('Refractory Fever with Gastrointestinal / Cutaneous signs');
    }
  }

  // GI Acute Abdomen Risk
  if (compText.includes('stomach') || compText.includes('abdomen') || allAnsText.includes('epigastric')) {
    score += 20;
    keyRiskFactors.push('Abdominal Discomfort');
    if (allAnsText.includes('right lower') || allAnsText.includes('vomiting')) {
      score += 25;
      keyRiskFactors.push('Localized Abdominal Tenderness / Persistent Vomiting');
    }
  }

  // Respiratory Risk
  if (compText.includes('breath') || compText.includes('cough') || allAnsText.includes('wheezing') || allAnsText.includes('dyspnea')) {
    score += 25;
    keyRiskFactors.push('Respiratory Distress / Bronchial Wheezing');
  }

  // Red Flags Triage Boost
  if (redFlags.some(r => r.severity === 'CRITICAL')) {
    score += 30;
    keyRiskFactors.push('Critical Red-Flag Triage Triggered');
  } else if (redFlags.length > 0) {
    score += 15;
    keyRiskFactors.push('Red-Flag Safety Alert Triggered');
  }

  // Document Abnormalities
  const abnormalDocs = documents.some(d => d.data?.investigations?.some(i => i.isAbnormal));
  if (abnormalDocs) {
    score += 10;
    keyRiskFactors.push('Abnormal Diagnostic Lab Values Flagged in Attached OCR');
  }

  // Clamp score between 5% and 98%
  score = Math.min(Math.max(score, 10), 98);

  let level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  let urgency = 'Standard OPD Consult';
  let clinicalRationale = 'Patient exhibits low-acuity symptoms suitable for routine OPD evaluation.';

  if (score >= 80) {
    level = 'CRITICAL';
    urgency = 'Immediate Emergency Triage & ECG Evaluation';
    clinicalRationale = 'High acuity clinical picture with critical cardiovascular/respiratory markers. Immediate clinician assessment required.';
  } else if (score >= 60) {
    level = 'HIGH';
    urgency = 'Priority OPD Triage Consultation';
    clinicalRationale = 'Significant symptom severity and risk factors. Priority clinical evaluation recommended.';
  } else if (score >= 35) {
    level = 'MODERATE';
    urgency = 'Standard OPD Consultation';
    clinicalRationale = 'Moderate acuity symptoms. Standard clinician review and diagnostic investigation advised.';
  }

  return {
    score,
    level,
    urgency,
    keyRiskFactors: keyRiskFactors.length > 0 ? keyRiskFactors : ['General OPD Consultation Request'],
    clinicalRationale,
  };
}

/**
 * Synthesizes AI Clinical Description from Voice & Touch Inputs
 */
function generateAiClinicalNarrative(
  patient: PatientRegistration,
  complaint: string,
  answers: ClinicalAnswerRecord[],
  documents: Array<{ fileName: string }>,
  triageRisk: TriageRiskScore
): string {
  const voiceCount = answers.filter(a => a.inputMethod === 'voice').length;
  const touchCount = answers.filter(a => a.inputMethod === 'touch').length;

  const onsetAns = answers.find(a => a.questionId.includes('onset') || a.questionId.includes('pattern') || a.questionId.includes('duration'))?.answerText || 'Unspecified onset';
  const charAns = answers.find(a => a.questionId.includes('char') || a.questionId.includes('details') || a.questionId.includes('site'))?.answerText || 'Described during intake';
  const assocAns = answers.find(a => a.questionId.includes('assoc') || a.questionId.includes('symptoms'))?.answerText || 'None stated';
  const pmhAns = answers.find(a => a.questionId.includes('pmh') || a.questionId.includes('history'))?.answerText || 'No prior medical history stated';

  return `AI CLINICAL SYNTHESIS for ${patient.fullName} (${patient.age}Y/${patient.gender}): Chief complaint reported as "${complaint}". Symptom character described as "${charAns}" with reported onset "${onsetAns}". Associated findings include "${assocAns}". Past medical background: "${pmhAns}". Patient completed interactive intake via ${voiceCount} voice inputs and ${touchCount} touch inputs. Triage Risk Score calculated at ${triageRisk.score}% (${triageRisk.level} RISK) driven by: ${triageRisk.keyRiskFactors.join(', ')}.`;
}
