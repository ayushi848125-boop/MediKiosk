import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateClinicalSummary } from '@/lib/ai/clinicalSummary';
import { detectRedFlags } from '@/lib/ai/redFlagDetection';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, answers = [] } = body;

    if (!patientId) {
      return NextResponse.json({ success: false, error: 'Missing patient ID' }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        documents: {
          include: { extractions: true },
        },
        sessions: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    // 1. Store clinical answers in database
    const session = patient.sessions[0];
    if (session) {
      await prisma.clinicalSession.update({
        where: { id: session.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      for (const ans of answers) {
        await prisma.clinicalAnswer.create({
          data: {
            sessionId: session.id,
            questionId: ans.questionId,
            questionText: ans.questionText,
            answerText: ans.answerText,
            originalLanguage: patient.preferredLanguage,
            inputMethod: ans.inputMethod || 'touch',
            category: ans.category || 'general',
          },
        });
      }
    }

    // 2. Run Red Flag detection
    const chiefComplaint = answers.find((a: any) => a.category === 'complaint')?.answerText || 'OPD Intake';
    const redFlags = detectRedFlags(answers, chiefComplaint);

    for (const flag of redFlags) {
      await prisma.redFlag.create({
        data: {
          patientId: patient.id,
          sessionId: session?.id,
          severity: flag.severity,
          category: flag.category,
          triggerText: flag.triggerText,
          message: flag.message,
        },
      });
    }

    // 3. Prepare attached documents for summary processing
    const formattedDocs = patient.documents.map(d => ({
      fileName: d.fileName,
      fileType: d.fileType,
      data: d.extractions[0] ? JSON.parse(d.extractions[0].extractedData) : undefined,
    }));

    // 4. Generate Physician-Ready Structured AI Summary
    const summary = await generateClinicalSummary(
      {
        fullName: patient.fullName,
        age: patient.age,
        gender: patient.gender as any,
        height: patient.height || undefined,
        phone: patient.phone,
        email: patient.email,
        address: patient.address,
        preferredLanguage: patient.preferredLanguage as any,
        department: patient.department,
        ayushMode: patient.ayushMode,
      },
      answers,
      formattedDocs,
      redFlags
    );

    await prisma.aiSummary.create({
      data: {
        patientId: patient.id,
        summaryJson: JSON.stringify(summary),
        model: 'gpt-4o-mini-heuristic',
      },
    });

    // 5. Update patient status to Awaiting Doctor Review
    await prisma.patient.update({
      where: { id: patient.id },
      data: {
        status: 'Awaiting Doctor Review',
      },
    });

    await prisma.auditEvent.create({
      data: {
        patientId: patient.id,
        eventType: 'INTAKE_COMPLETED',
        description: `Clinical history intake completed. ${answers.length} answers recorded. ${redFlags.length} red flags detected.`,
        actor: 'PATIENT',
      },
    });

    return NextResponse.json({
      success: true,
      patientId: patient.patientId,
      redFlagsDetected: redFlags.length > 0,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
