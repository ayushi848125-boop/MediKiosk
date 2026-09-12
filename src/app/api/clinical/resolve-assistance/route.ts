import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, action = 'assisted_in_person' } = body;

    if (!patientId) {
      return NextResponse.json({ success: false, error: 'Patient ID is required' }, { status: 400 });
    }

    const newStatus = action === 'completed' ? 'Awaiting Doctor Review' : 'Intake In Progress';

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: { status: newStatus },
    });

    await prisma.auditEvent.create({
      data: {
        patientId,
        eventType: 'ASSISTANCE_RESOLVED',
        description: `Nurse assistance marked resolved (${action}) by staff. Patient status set to ${newStatus}`,
        actor: 'DOCTOR',
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPatient,
      message: 'Assistance resolved successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
