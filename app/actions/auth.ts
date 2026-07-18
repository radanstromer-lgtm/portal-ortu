// app/actions/auth.ts
'use server';

import { supabase } from '@/app/lib/supabase';
import { createSession, deleteSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';

export type LoginState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = formData.get('identifier') as string;
  const password = formData.get('password') as string;

  // Validasi input
  if (!identifier || !password) {
    return { error: 'Nomor HP/Username dan password harus diisi.' };
  }

  try {
    // Cari siswa berdasarkan no_hp, nis, atau nama_siswa
    const { data: siswaList, error } = await supabase
      .from('tb_siswa')
      .select('id_siswa, nis, nama_siswa, no_hp, unique_code')
      .or(`no_hp.eq.${identifier},nis.eq.${identifier},nama_siswa.ilike.${identifier}`)
      .is('deleted_at', null);

    if (error) {
      console.error('Supabase error:', error);
      return { error: 'Terjadi kesalahan pada server. Silakan coba lagi.' };
    }

    if (!siswaList || siswaList.length === 0) {
      return { error: 'Akun tidak ditemukan. Periksa kembali nomor HP, NIS, atau nama Anda.' };
    }

    // Cek password (unique_code) dari semua siswa yang cocok
    const siswa = siswaList.find(s => s.unique_code === password);

    if (!siswa) {
      return { error: 'Password salah. Gunakan kode unik siswa sebagai password.' };
    }

    // Login berhasil — buat session
    await createSession({
      userId: siswa.id_siswa,
      nama: siswa.nama_siswa,
      noHp: siswa.no_hp,
    });

  } catch (err) {
    console.error('Login error:', err);
    return { error: 'Terjadi kesalahan. Silakan coba lagi.' };
  }

  // Redirect di luar try-catch karena redirect melempar error internal Next.js
  redirect('/');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
