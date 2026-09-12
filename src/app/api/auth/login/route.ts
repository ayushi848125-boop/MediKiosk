import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const expectedPassword = process.env.DOCTOR_PASSWORD || 'DOCTOR 1234';

    if (password === expectedPassword) {
      const response = NextResponse.json({ success: true, message: 'Authentication successful' });
      response.cookies.set('medikiosk_doctor_token', 'authenticated_doctor_session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12, // 12 hours
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid doctor authentication credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server authentication error' }, { status: 500 });
  }
}
