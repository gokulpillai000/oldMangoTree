import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, registerUser, getCurrentSession } from '@/lib/auth';

export async function GET() {
  const session = getCurrentSession();
  return NextResponse.json({ session });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, name } = body;

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, session: null });
      response.cookies.delete('omt_auth_session');
      return response;
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    let result;
    if (action === 'signup') {
      result = registerUser(email, password, name);
    } else {
      result = authenticateUser(email, password);
    }

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, session: result });
    response.cookies.set('omt_auth_session', JSON.stringify(result), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication error' }, { status: 500 });
  }
}
