import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const relativePath = searchParams.get('file');
    const customName = searchParams.get('name');

    if (!relativePath) {
      return NextResponse.json({ success: false, error: 'File path parameter is required' }, { status: 400 });
    }

    // Security check: ensure path is within public/uploads/
    const normalizedPath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
    if (!normalizedPath.startsWith('/uploads/') && !normalizedPath.startsWith('uploads/')) {
      return NextResponse.json({ success: false, error: 'Unauthorized file path' }, { status: 403 });
    }

    const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
    const fullPath = path.join(process.cwd(), 'public', cleanPath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ success: false, error: 'File not found on server' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const fileName = customName || path.basename(fullPath);

    // Determine basic MIME type
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.pptx') contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    else if (ext === '.ppt') contentType = 'application/vnd.ms-powerpoint';
    else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (ext === '.doc') contentType = 'application/msword';
    else if (ext === '.txt') contentType = 'text/plain';

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
