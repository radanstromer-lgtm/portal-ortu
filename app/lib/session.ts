// app/lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

function getEncodedKey() {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secretKey);
}

export interface SessionPayload {
  userId: number;
  nama: string;
  noHp: string;
  expiresAt: Date;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload, expiresAt: payload.expiresAt.toISOString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getEncodedKey());
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    console.log('Failed to verify session');
    return null;
  }
}

export async function createSession(data: { userId: number; nama: string; noHp: string }) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 hari
  const session = await encrypt({ ...data, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
