import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { processMedicalDocument } from '@/lib/ocr/documentExtractor';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const patientId = formData.get('patientId') as string;

    if (!file || !patientId) {
      return NextResponse.json({ success: false, error: 'File and patient ID are required' }, { status: 400 });
    }

    const patient = await prisma.patient.findFirst({
      where: { OR: [{ id: patientId }, { patientId }] },
    });

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    // Save file locally to /public/uploads/
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePathOnDisk = path.join(uploadDir, cleanFileName);
    fs.writeFileSync(filePathOnDisk, buffer);

    const relativePath = `/uploads/${cleanFileName}`;

    // Perform Document OCR & Classification
    const extractedData = await processMedicalDocument(filePathOnDisk, file.name);

    // Save to Database
    const docRecord = await prisma.medicalDocument.create({
      data: {
        patientId: patient.id,
        fileName: file.name,
        filePath: relativePath,
        fileType: extractedData.documentType.toLowerCase().replace(/\s+/g, '_'),
        documentDate: extractedData.documentDate || new Date().toISOString().split('T')[0],
        ocrStatus: 'COMPLETED',
        ocrText: extractedData.notes,
        extractions: {
          create: {
            extractedData: JSON.stringify(extractedData),
            confidence: extractedData.confidence,
            verificationStatus: 'UNVERIFIED',
          },
        },
      },
      include: {
        extractions: true,
      },
    });

    return NextResponse.json({
      success: true,
      document: docRecord,
      extraction: extractedData,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
