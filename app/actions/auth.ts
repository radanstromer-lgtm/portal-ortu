// app/actions/auth.ts
'use server';

import { getSupabase } from '@/app/lib/supabase';
import { createSession, deleteSession, getSession } from '@/app/lib/session';
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
    return { error: 'Nomor HP/Username/Email dan password harus diisi.' };
  }

  try {
    // Cari siswa berdasarkan no_hp, nis, nama_siswa, atau email_google
    const { data: siswaList, error } = await getSupabase()
      .from('tb_siswa')
      .select('id_siswa, nis, nama_siswa, no_hp, unique_code, custom_password, email_google')
      .or(`no_hp.eq.${identifier},nis.eq.${identifier},nama_siswa.ilike.${identifier},email_google.eq.${identifier}`)
      .is('deleted_at', null);

    if (error) {
      console.error('Supabase error:', error);
      return { error: 'Terjadi kesalahan pada server. Silakan coba lagi.' };
    }

    if (!siswaList || siswaList.length === 0) {
      return { error: 'Akun tidak ditemukan. Periksa kembali Nomor HP, NIS, Nama, atau Email Anda.' };
    }

    // Cek password dari custom_password terlebih dahulu, lalu fallback ke unique_code
    const siswa = siswaList.find(
      s => (s.custom_password && s.custom_password === password) || s.unique_code === password
    );

    if (!siswa) {
      return { error: 'Password salah. Gunakan password pilihan Anda atau kode unik siswa.' };
    }

    // Login berhasil — buat session
    await createSession({
      userId: siswa.id_siswa,
      nama: siswa.nama_siswa,
      noHp: siswa.no_hp || '',
    });

  } catch (err) {
    console.error('Login error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return { error: `Terjadi kesalahan: ${message}` };
  }

  // Redirect di luar try-catch karena redirect melempar error internal Next.js
  redirect('/');
}

export async function setCustomPassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Sesi Anda telah berakhir. Silakan login kembali.' };
  }

  if (!newPassword || newPassword.trim().length < 6) {
    return { success: false, error: 'Password minimal harus 6 karakter.' };
  }

  try {
    const { error } = await getSupabase()
      .from('tb_siswa')
      .update({ custom_password: newPassword.trim() })
      .eq('id_siswa', session.userId);

    if (error) {
      console.error('Error updating custom password:', error);
      return { success: false, error: 'Gagal menyimpan password baru. Silakan coba lagi.' };
    }

    return { success: true };
  } catch (err) {
    console.error('setCustomPassword error:', err);
    return { success: false, error: 'Terjadi kesalahan pada server.' };
  }
}

export async function linkGoogleAccount(email: string): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Sesi Anda telah berakhir. Silakan login kembali.' };
  }

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Email Google tidak valid.' };
  }

  try {
    // Cek apakah akun siswa sudah punya email_google terdaftar
    const { data: siswa, error: fetchErr } = await getSupabase()
      .from('tb_siswa')
      .select('email_google')
      .eq('id_siswa', session.userId)
      .single();

    if (fetchErr) {
      console.error('Error fetching student data:', fetchErr);
      return { success: false, error: 'Gagal mengambil data siswa.' };
    }

    // Jika belum ada email_google, simpan email baru
    if (!siswa.email_google) {
      const { error: updateErr } = await getSupabase()
        .from('tb_siswa')
        .update({ email_google: email.trim().toLowerCase() })
        .eq('id_siswa', session.userId);

      if (updateErr) {
        console.error('Error linking google email:', updateErr);
        return { success: false, error: 'Gagal menautkan email Google.' };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('linkGoogleAccount error:', err);
    return { success: false, error: 'Terjadi kesalahan pada server.' };
  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
