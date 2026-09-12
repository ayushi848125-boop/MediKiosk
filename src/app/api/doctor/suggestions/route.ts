import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('medikiosk_doctor_token');

    // Doctor authentication guard
    if (!token || token.value !== 'authenticated_doctor_session') {
      const authHeader = request.headers.get('x-doctor-auth');
      if (authHeader !== 'true' && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ success: false, error: 'Unauthorized doctor action' }, { status: 401 });
      }
    }

    const body = await request.json();
    const { patientId, suggestion, instructions, followUpDate } = body;

    if (!patientId || !suggestion) {
      return NextResponse.json({ success: false, error: 'Patient ID and doctor suggestion text required' }, { status: 400 });
    }

    const patient = await prisma.patient.findFirst({
      where: { OR: [{ id: patientId }, { patientId }] },
    });

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    // Create Doctor Suggestion record
    const docSuggestion = await prisma.doctorSuggestion.create({
      data: {
        patientId: patient.id,
        doctorId: 'Dr. OPD Attending Physician',
        suggestion: suggestion.trim(),
        instructions: instructions ? instructions.trim() : null,
        followUpDate: followUpDate || null,
        sentToPatient: true,
        sentAt: new Date(),
      },
    });

    // Update patient status to Doctor Suggestion Available
    await prisma.patient.update({
      where: { id: patient.id },
      data: {
        status: 'Doctor Suggestion Available',
      },
    });

    await prisma.auditEvent.create({
      data: {
        patientId: patient.id,
        eventType: 'SUGGESTION_SENT',
        description: 'Doctor suggestion and follow-up advice dispatched to patient portal.',
        actor: 'DOCTOR',
      },
    });

    return NextResponse.json({
      success: true,
      message: "Doctor's suggestion sent successfully to patient portal.",
      suggestion: docSuggestion,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('patientId') || searchParams.get('phone') || searchParams.get('name') || '';

    if (!query.trim()) {
      return NextResponse.json({ success: false, error: 'Please enter a Patient Name, Phone Number, or Patient ID to search.' }, { status: 400 });
    }

    const rawQuery = query.trim();
    const cleanQuery = rawQuery.toLowerCase();

    // 1. Exact match search
    let patient = await prisma.patient.findFirst({
      where: {
        OR: [
          { patientId: { equals: rawQuery } },
          { phone: { equals: rawQuery } },
          { id: { equals: rawQuery } },
        ],
      },
      include: {
        suggestions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // 2. Flexible contains/case-insensitive search by Name, Phone, or Patient ID
    if (!patient) {
      const allPatients = await prisma.patient.findMany({
        include: {
          suggestions: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      patient = allPatients.find(p =>
        p.fullName.toLowerCase().includes(cleanQuery) ||
        p.phone.replaceAll(' ', '').includes(cleanQuery.replaceAll(' ', '')) ||
        p.patientId.toLowerCase().includes(cleanQuery) ||
        p.id.toLowerCase() === cleanQuery
      ) || null;
    }

    if (!patient) {
      return NextResponse.json({
        success: false,
        error: `No patient record found matching "${rawQuery}". Please verify patient Name, Phone Number, or Patient ID.`,
      }, { status: 404 });
    }

    // Retrieve suggestions
    const suggestions = patient.suggestions;

    if (suggestions.length === 0) {
      return NextResponse.json({
        success: true,
        hasSuggestion: false,
        patient: {
          fullName: patient.fullName,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          patientId: patient.patientId,
          department: patient.department,
          status: patient.status,
        },
        message: `Dr. OPD is currently reviewing the medical intake for ${patient.fullName}. Please check back shortly once your doctor dispatches your prescription.`,
      });
    }

    const latest = suggestions[0];

    return NextResponse.json({
      success: true,
      hasSuggestion: true,
      patient: {
        fullName: patient.fullName,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        patientId: patient.patientId,
        department: patient.department,
        status: patient.status,
      },
      suggestion: {
        id: latest.id,
        doctorId: latest.doctorId || 'Dr. OPD Attending Physician',
        suggestion: latest.suggestion,
        instructions: latest.instructions,
        followUpDate: latest.followUpDate,
        sentAt: latest.sentAt || latest.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
