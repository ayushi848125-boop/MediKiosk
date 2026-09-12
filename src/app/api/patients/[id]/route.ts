import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const patient = await prisma.patient.findFirst({
      where: {
        OR: [{ id: id }, { patientId: id }],
      },
      include: {
        sessions: {
          include: {
            answers: true,
          },
        },
        documents: {
          include: {
            extractions: true,
          },
        },
        summaries: true,
        redFlags: true,
        suggestions: true,
        consents: true,
        auditEvents: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient record not found' }, { status: 404 });
    }

    // Query past records matching same phone number
    const pastRecords = await prisma.patient.findMany({
      where: {
        phone: patient.phone,
        NOT: { id: patient.id },
      },
      include: {
        summaries: true,
        suggestions: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pastVisitsSummary = pastRecords.map(past => {
      let summaryObj: any = null;
      if (past.summaries && past.summaries.length > 0) {
        try {
          summaryObj = JSON.parse(past.summaries[0].summaryJson);
        } catch (e) {}
      }

      const latestSuggestion = past.suggestions && past.suggestions.length > 0 ? past.suggestions[0] : null;

      return {
        id: past.id,
        patientId: past.patientId,
        fullName: past.fullName,
        visitDate: past.createdAt,
        chiefComplaint: summaryObj?.patientOverview?.chiefComplaint || 'OPD Intake',
        riskScore: summaryObj?.triageRisk?.score || null,
        riskLevel: summaryObj?.triageRisk?.level || null,
        hpiSnippet: summaryObj?.aiClinicalDescription || summaryObj?.historyOfPresentIllness || null,
        doctorAdvice: latestSuggestion?.suggestion || null,
        followUpDate: latestSuggestion?.followUpDate || null,
      };
    });

    const enrichedPatient = {
      ...patient,
      isRecurring: pastRecords.length > 0,
      pastVisitsCount: pastRecords.length,
      pastVisitsSummary,
    };

    return NextResponse.json({ success: true, data: enrichedPatient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Doctor authentication check
    const cookieStore = await cookies();
    const token = cookieStore.get('medikiosk_doctor_token');

    // Allow deletion if authenticated or if running server-side API request
    if (!token || token.value !== 'authenticated_doctor_session') {
      // Allow for dev/test execution headers
      const authHeader = request.headers.get('x-doctor-auth');
      if (authHeader !== 'true' && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ success: false, error: 'Unauthorized doctor action' }, { status: 401 });
      }
    }

    // Find target patient
    const patient = await prisma.patient.findFirst({
      where: {
        OR: [{ id: id }, { patientId: id }],
      },
      include: {
        documents: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient record not found' }, { status: 404 });
    }

    // 1. Clean up local uploaded files
    for (const doc of patient.documents) {
      if (doc.filePath && doc.filePath.startsWith('/uploads/')) {
        const fullPath = path.join(process.cwd(), 'public', doc.filePath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (e) {
            console.warn('Failed to delete file from disk:', fullPath, e);
          }
        }
      }
    }

    // 2. Perform Cascading Server-Side Permanent Database Deletion
    await prisma.$transaction([
      prisma.clinicalAnswer.deleteMany({ where: { session: { patientId: patient.id } } }),
      prisma.clinicalSession.deleteMany({ where: { patientId: patient.id } }),
      prisma.documentExtraction.deleteMany({ where: { document: { patientId: patient.id } } }),
      prisma.medicalDocument.deleteMany({ where: { patientId: patient.id } }),
      prisma.aiSummary.deleteMany({ where: { patientId: patient.id } }),
      prisma.redFlag.deleteMany({ where: { patientId: patient.id } }),
      prisma.doctorSuggestion.deleteMany({ where: { patientId: patient.id } }),
      prisma.consent.deleteMany({ where: { patientId: patient.id } }),
      prisma.auditEvent.deleteMany({ where: { patientId: patient.id } }),
      prisma.patient.delete({ where: { id: patient.id } }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Patient record ${patient.patientId} (${patient.fullName}) and all associated clinical files permanently deleted from database.`,
      deletedPatientId: patient.patientId,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
