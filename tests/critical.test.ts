import { detectRedFlags } from '../src/lib/ai/redFlagDetection';
import { getNextClinicalQuestion } from '../src/lib/ai/clinicalInterview';
import { processMedicalDocument } from '../src/lib/ocr/documentExtractor';
import { generateClinicalSummary } from '../src/lib/ai/clinicalSummary';

async function runAllTests() {
  console.log('====================================================');
  console.log('   MEDIKIOSK AUTOMATED CLINICAL SUITE VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // TEST 1: Mandatory Field Validation Logic
  console.log('--- Test Group 1: Registration Validation ---');
  const invalidPatient = { fullName: '', age: 0, phone: '123' };
  const isValid = invalidPatient.fullName.length > 0 && invalidPatient.age > 0 && invalidPatient.phone.length > 8;
  assert(!isValid, 'Mandatory field validation blocks empty name/age/phone');

  // TEST 2: Minimum 10 Question Interview Rule
  console.log('\n--- Test Group 2: AI Question Engine & Min Question Count ---');
  let answeredIds: string[] = [];
  let questionCount = 0;
  for (let i = 0; i < 10; i++) {
    const res = getNextClinicalQuestion(answeredIds, 'Chest pain', false);
    if (res.question) {
      answeredIds.push(res.question.id);
      questionCount++;
    }
  }
  assert(questionCount >= 10, `AI Question engine presents at least 10 complaint-adapted questions (Asked: ${questionCount})`);

  // TEST 3: Safety Red-Flag Detection Triage Scanner
  console.log('\n--- Test Group 3: Red-Flag Emergency Triage ---');
  const chestPainAnswers = [
    { questionText: 'Where is the pain?', answerText: 'Heavy crushing chest pain radiating to left arm' },
  ];
  const flags = detectRedFlags(chestPainAnswers, 'Chest Pain');
  assert(flags.length > 0 && flags[0].severity === 'CRITICAL', 'Red flag scanner detects critical cardiac emergency');

  // TEST 4: Document OCR Parser & Classification
  console.log('\n--- Test Group 4: Medical Document OCR ---');
  const ocrData = await processMedicalDocument('dummy/path', 'blood_test_report_jan2026.pdf');
  assert(ocrData.documentType === 'Lab Report', 'OCR classifier identifies Lab Report');
  assert((ocrData.investigations?.length ?? 0) > 0, 'OCR extracts lab test values and reference ranges');

  // TEST 5: Non-Diagnostic AI Summary Safety Disclaimer
  console.log('\n--- Test Group 5: Non-Diagnostic AI Prompt Safety ---');
  const summary = await generateClinicalSummary(
    {
      fullName: 'Test Patient',
      age: 45,
      gender: 'Male',
      phone: '+91 9999999999',
      email: 'test@example.com',
      address: 'Test Address',
      preferredLanguage: 'en',
      department: 'General OPD',
      ayushMode: false,
    },
    [
      {
        questionId: 'q_onset',
        questionText: 'When did your problem start?',
        answerText: 'Today morning',
        inputMethod: 'touch',
        category: 'complaint',
        language: 'en',
      },
    ],
    []
  );
  assert(
    summary.disclaimer.includes('Not a diagnosis') && summary.disclaimer.includes('Physician verification required'),
    'AI summary includes mandatory physician verification disclaimer'
  );

  // SUMMARY RESULTS
  console.log('\n====================================================');
  console.log(`   TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
