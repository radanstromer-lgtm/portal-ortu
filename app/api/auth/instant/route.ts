// app/api/auth/instant/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getSupabase } from '@/app/lib/supabase';
import { createSession } from '@/app/lib/session';

function getEncodedKey() {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secretKey);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=Token+login+tidak+ditemukan', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ['HS256'],
    });

    const userId = (payload.userId || payload.id_siswa || payload.idSiswa) as number;

    if (!userId) {
      return NextResponse.redirect(new URL('/login?error=Token+tidak+memiliki+ID+siswa', request.url));
    }

    // Ambil data siswa dari database Supabase
    const { data: siswa, error } = await getSupabase()
      .from('tb_siswa')
      .select('id_siswa, nama_siswa, no_hp')
      .eq('id_siswa', userId)
      .is('deleted_at', null)
      .single();

    if (error || !siswa) {
      console.error('Instant login error fetching student:', error);
      return NextResponse.redirect(new URL('/login?error=Siswa+tidak+ditemukan', request.url));
    }

    // Buat sesi login ortu
    await createSession({
      userId: siswa.id_siswa,
      nama: siswa.nama_siswa,
      noHp: siswa.no_hp || '',
    });

    // Redirect langsung ke Halaman Pembayaran dengan flag welcome=true
    const targetUrl = new URL('/pembayaran', request.url);
    targetUrl.searchParams.set('welcome', 'true');
    return NextResponse.redirect(targetUrl);

  } catch (err) {
    console.error('Instant login JWT verification failed:', err);
    return NextResponse.redirect(new URL('/login?error=Token+login+kadaluwarsa+atau+tidak+valid', request.url));
  }
}
