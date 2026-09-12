import { PatientRegistration, StructuredAiSummary } from '@/types';

/**
 * ABDM FHIR R4 Adapter Layer
 * Transforms internal MediKiosk intake data into compliant FHIR resources.
 */
export function mapToFhirBundle(patientId: string, patient: PatientRegistration, summary: StructuredAiSummary) {
  const fhirPatientResource = {
    resourceType: 'Patient',
    id: patientId,
    identifier: [
      {
        system: 'https://healthid.ndhm.gov.in',
        value: patient.abhaId || `MK-TEMP-${patientId.slice(0, 8)}`,
      },
    ],
    name: [
      {
        text: patient.fullName,
      },
    ],
    telecom: [
      { system: 'phone', value: patient.phone },
      { system: 'email', value: patient.email },
    ],
    gender: patient.gender.toLowerCase() === 'male' ? 'male' : patient.gender.toLowerCase() === 'female' ? 'female' : 'other',
    address: [{ text: patient.address }],
    communication: [{ language: { text: patient.preferredLanguage } }],
  };

  const fhirEncounterResource = {
    resourceType: 'Encounter',
    id: `enc-${patientId}`,
    status: 'in-progress',
    class: { code: 'AMB', display: 'ambulatory' },
    subject: { reference: `Patient/${patientId}` },
    reasonCode: [{ text: summary.patientOverview.chiefComplaint }],
  };

  const fhirConditionResource = {
    resourceType: 'Condition',
    id: `cond-${patientId}`,
    clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
    verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'unconfirmed' }] },
    category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-category', code: 'encounter-diagnosis' }] }],
    code: { text: summary.patientOverview.chiefComplaint },
    subject: { reference: `Patient/${patientId}` },
    note: [{ text: summary.historyOfPresentIllness }],
  };

  return {
    resourceType: 'Bundle',
    type: 'document',
    timestamp: new Date().toISOString(),
    entry: [
      { resource: fhirPatientResource },
      { resource: fhirEncounterResource },
      { resource: fhirConditionResource },
    ],
  };
}
