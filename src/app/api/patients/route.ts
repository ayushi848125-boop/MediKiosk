import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const statusFilter = searchParams.get('status') || 'ALL';
    const ayushOnly = searchParams.get('ayush') === 'true';
    const redFlagOnly = searchParams.get('redflag') === 'true';

    const whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { fullName: { contains: query } },
        { phone: { contains: query } },
        { patientId: { contains: query } },
        { email: { contains: query } },
      ];
    }

    if (statusFilter !== 'ALL') {
      whereClause.status = statusFilter;
    }

    if (ayushOnly) {
      whereClause.ayushMode = true;
    }

    const patients = await prisma.patient.findMany({
      where: whereClause,
      include: {
        sessions: {
          include: {
            answers: true,
          },
        },
        documents: true,
        summaries: true,
        redFlags: true,
        suggestions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let filtered = patients;
    if (redFlagOnly) {
      filtered = patients.filter(p => p.redFlags.length > 0);
    }

    // Query all patients to build recurring phone history mapping
    const allPatients = await prisma.patient.findMany({
      include: {
        summaries: true,
        suggestions: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enrichedData = filtered.map(p => {
      const pastRecords = allPatients.filter(
        other =>
          other.phone.trim().replaceAll(' ', '') === p.phone.trim().replaceAll(' ', '') &&
          other.id !== p.id
      );

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

      return {
        ...p,
        isRecurring: pastRecords.length > 0,
        pastVisitsCount: pastRecords.length,
        pastVisitsSummary,
      };
    });

    return NextResponse.json({ success: true, data: enrichedData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      age,
      gender,
      height,
      phone,
      email,
      address,
      preferredLanguage,
      abhaId,
      emergencyContact,
      department,
      ayushMode,
    } = body;

    // Strict Mandatory Field Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid full name before continuing.' },
        { status: 400 }
      );
    }

    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid age before continuing.' },
        { status: 400 }
      );
    }

    if (!gender || !['Male', 'Female', 'Other', 'Prefer not to say'].includes(gender)) {
      return NextResponse.json(
        { success: false, error: 'Please select a gender option before continuing.' },
        { status: 400 }
      );
    }

    if (!phone || phone.trim().length < 8) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid phone number before continuing.' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address before continuing.' },
        { status: 400 }
      );
    }

    if (!address || address.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Please complete your address details before continuing.' },
        { status: 400 }
      );
    }

    // Generate guaranteed unique Patient Identifier MK-2026-XXXXXX
    const count = await prisma.patient.count();
    let nextNum = count + 101;
    let candidateId = `MK-2026-${String(nextNum).padStart(6, '0')}`;
    let existingPatient = await prisma.patient.findUnique({ where: { patientId: candidateId } });
    while (existingPatient) {
      nextNum++;
      candidateId = `MK-2026-${String(nextNum).padStart(6, '0')}`;
      existingPatient = await prisma.patient.findUnique({ where: { patientId: candidateId } });
    }
    const patientId = candidateId;

    const newPatient = await prisma.patient.create({
      data: {
        patientId,
        fullName: fullName.trim(),
        age: ageNum,
        gender,
        height: height ? Number(height) : null,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        preferredLanguage: preferredLanguage || 'en',
        abhaId: abhaId ? abhaId.trim() : null,
        emergencyContact: emergencyContact ? emergencyContact.trim() : null,
        department: department || 'General OPD',
        ayushMode: ayushMode !== undefined ? Boolean(ayushMode) : true,
        status: 'Intake In Progress',
        consents: {
          create: {
            consentStatus: 'GRANTED',
            consentVersion: 'v1.0-DPDP-ABDM',
            purpose: 'Clinical Intake and Physician Review',
          },
        },
        sessions: {
          create: {
            status: 'IN_PROGRESS',
            mode: ayushMode ? 'AYUSH' : 'STANDARD',
          },
        },
        auditEvents: {
          create: {
            eventType: 'PATIENT_CREATED',
            description: `Patient registration created with ID ${patientId}`,
            actor: 'PATIENT',
          },
        },
      },
      include: {
        sessions: true,
        consents: true,
      },
    });

    return NextResponse.json({ success: true, data: newPatient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
