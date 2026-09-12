import { RedFlagAlert } from '@/types';

/**
 * Scans patient answers and text for immediate life-threatening emergency indicators.
 * Does NOT diagnose. Generates urgent clinical safety alerts for triage staff.
 */
export function detectRedFlags(answers: Array<{ questionText: string; answerText: string }>, complaint: string): RedFlagAlert[] {
  const flags: RedFlagAlert[] = [];
  const textToScan = (complaint + ' ' + answers.map(a => a.answerText).join(' ')).toLowerCase();

  // Cardiac Red Flags
  if (
    textToScan.includes('chest pain') ||
    textToScan.includes('chest tightness') ||
    textToScan.includes('pain radiating') ||
    textToScan.includes('pain in left arm') ||
    textToScan.includes('crushing chest')
  ) {
    flags.push({
      severity: 'CRITICAL',
      category: 'Cardiovascular Safety Alert',
      triggerText: 'Acute Chest Pain / Radiating Discomfort reported',
      message: 'Potential acute cardiac event reported. Requires immediate clinical triage and ECG evaluation.',
    });
  }

  // Respiratory Red Flags
  if (
    textToScan.includes('gasping') ||
    textToScan.includes('cannot breathe') ||
    textToScan.includes('severe shortness of breath') ||
    textToScan.includes('turning blue') ||
    textToScan.includes('stridor')
  ) {
    flags.push({
      severity: 'CRITICAL',
      category: 'Respiratory Distress Alert',
      triggerText: 'Severe Respiratory Distress reported',
      message: 'Severe respiratory compromise reported. Immediate oxygenation and airway evaluation required.',
    });
  }

  // Neurological Red Flags
  if (
    textToScan.includes('sudden weakness') ||
    textToScan.includes('face drooping') ||
    textToScan.includes('slurred speech') ||
    textToScan.includes('unconscious') ||
    textToScan.includes('passed out') ||
    textToScan.includes('fainted') ||
    textToScan.includes('seizure')
  ) {
    flags.push({
      severity: 'HIGH',
      category: 'Neurological / Stroke Alert',
      triggerText: 'Sudden weakness / Loss of consciousness reported',
      message: 'Reported symptoms warrant immediate neurological deficit / stroke assessment.',
    });
  }

  // Hemorrhagic / Trauma Red Flags
  if (
    textToScan.includes('coughing blood') ||
    textToScan.includes('vomiting blood') ||
    textToScan.includes('black stool') ||
    textToScan.includes('uncontrolled bleeding')
  ) {
    flags.push({
      severity: 'CRITICAL',
      category: 'Acute Hemorrhage Alert',
      triggerText: 'Significant active bleeding reported',
      message: 'Acute active bleeding reported. Immediate hemodynamic assessment and blood typing warranted.',
    });
  }

  // Anaphylaxis Red Flags
  if (
    textToScan.includes('swallowing difficulty after medication') ||
    textToScan.includes('swelling of lips') ||
    textToScan.includes('anaphylaxis') ||
    textToScan.includes('throat closing')
  ) {
    flags.push({
      severity: 'CRITICAL',
      category: 'Anaphylaxis / Severe Allergy Alert',
      triggerText: 'Airway swelling / Severe allergic reaction reported',
      message: 'Potential anaphylactic reaction reported. Emergency epinephrine protocol readiness indicated.',
    });
  }

  return flags;
}
