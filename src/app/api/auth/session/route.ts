import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('medikiosk_doctor_token');

  if (token && token.value === 'authenticated_doctor_session') {
    return NextResponse.json({ authenticated: true, role: 'doctor' });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
