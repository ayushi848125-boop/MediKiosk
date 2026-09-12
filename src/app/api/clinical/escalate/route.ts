import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      patientId,
      reason = 'manual_request', // 'manual_request' | 'low_confidence_loop'
      stuckStep = 'interview',
      currentQuestionText = 'Intake Question'
    } = body;

    if (!patientId) {
      return NextResponse.json({ success: false, error: 'Patient ID is required for escalation' }, { status: 400 });
    }

    // Update Patient Status in Database
    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: { status: 'NEEDS_ASSISTANCE' },
    });

    // Create Audit Log Event
    await prisma.auditEvent.create({
      data: {
        patientId,
        eventType: 'ASSISTANCE_REQUESTED',
        description: `Nurse assistance requested via ${reason === 'manual_request' ? 'Manual Help Button' : '3x Low-Confidence Loop'} at step: "${stuckStep}" (${currentQuestionText})`,
        actor: 'PATIENT',
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPatient,
      message: 'Escalation recorded successfully. Nurse staff alerted.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
