import { NextResponse } from 'next/server';
import {
  getNextClinicalQuestion,
  evaluateAnswerConfidence,
  getClarificationQuestion,
  getMissingClinicalFields,
  QUESTION_BANK,
  CONFIDENCE_THRESHOLD,
  MAX_FIELD_CLARIFICATION_RETRIES,
  MAX_CONSECUTIVE_LOW_CONFIDENCE_TURNS,
} from '@/lib/ai/clinicalInterview';
import { AYUSH_QUESTIONS } from '@/lib/ai/ayushHistory';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      answeredIds = [],
      lastAnswer = null,
      complaint = '',
      ayushMode = true,
      language = 'en',
      consecutiveLowConfidence = 0,
      fieldRetries = {},
      patientId = null,
    } = body;

    const missing_fields = getMissingClinicalFields(answeredIds);
    let confidence = 0.95;
    let currentConsecutiveLow = consecutiveLowConfidence;
    let updatedFieldRetries = { ...fieldRetries };

    // Evaluate last answer if provided
    if (lastAnswer && lastAnswer.answerText) {
      const qId = lastAnswer.questionId.replace(/^clarify_/, '');
      confidence = evaluateAnswerConfidence(lastAnswer.answerText, lastAnswer.inputMethod, qId);

      if (confidence < CONFIDENCE_THRESHOLD) {
        currentConsecutiveLow += 1;

        // Auto-escalation trigger if 3 consecutive turns come back low-confidence
        if (currentConsecutiveLow >= MAX_CONSECUTIVE_LOW_CONFIDENCE_TURNS) {
          if (patientId) {
            await prisma.patient.update({
              where: { id: patientId },
              data: { status: 'NEEDS_ASSISTANCE' },
            }).catch(() => {});

            await prisma.auditEvent.create({
              data: {
                patientId,
                eventType: 'ASSISTANCE_REQUESTED',
                description: `Automatic escalation triggered after ${currentConsecutiveLow} consecutive low-confidence turns at question ${qId}`,
                actor: 'SYSTEM',
              },
            }).catch(() => {});
          }

          return NextResponse.json({
            success: true,
            autoEscalate: true,
            escalationReason: 'low_confidence_loop',
            confidence,
            missing_fields,
            consecutiveLowConfidence: currentConsecutiveLow,
            fieldRetries: updatedFieldRetries,
          });
        }

        // Targeted Clarification Question Trigger if retries < 2
        const retries = updatedFieldRetries[qId] || 0;
        if (retries < MAX_FIELD_CLARIFICATION_RETRIES) {
          updatedFieldRetries[qId] = retries + 1;
          const targetQ = QUESTION_BANK.find(q => q.id === qId) || QUESTION_BANK[0];
          const clarificationQ = getClarificationQuestion(targetQ, language);

          return NextResponse.json({
            success: true,
            question: clarificationQ,
            isClarification: true,
            confidence,
            missing_fields,
            consecutiveLowConfidence: currentConsecutiveLow,
            fieldRetries: updatedFieldRetries,
            autoEscalate: false,
          });
        }
      } else {
        // High confidence answer -> Reset consecutive low confidence counter
        currentConsecutiveLow = 0;
      }
    }

    // AYUSH Mode Check
    if (ayushMode) {
      const remainingAyush = AYUSH_QUESTIONS.filter(q => !answeredIds.includes(q.id));
      if (remainingAyush.length > 0 && answeredIds.length >= 8) {
        return NextResponse.json({
          success: true,
          question: remainingAyush[0],
          isComplete: false,
          currentCount: answeredIds.length + 1,
          confidence,
          missing_fields,
          consecutiveLowConfidence: currentConsecutiveLow,
          fieldRetries: updatedFieldRetries,
          autoEscalate: false,
        });
      }
    }

    // Advance to Next Question
    const result = getNextClinicalQuestion(answeredIds, complaint, ayushMode, lastAnswer?.answerText);

    return NextResponse.json({
      success: true,
      question: result.question,
      isComplete: result.isComplete,
      currentCount: result.currentCount,
      confidence,
      missing_fields,
      consecutiveLowConfidence: currentConsecutiveLow,
      fieldRetries: updatedFieldRetries,
      autoEscalate: false,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
