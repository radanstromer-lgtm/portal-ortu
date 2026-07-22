// app/components/welcome-modal.tsx
'use client';

import React, { useState } from 'react';
import { setCustomPassword, linkGoogleAccount } from '@/app/actions/auth';
import { signIn } from 'next-auth/react';

interface WelcomeModalProps {
  namaSiswa: string;
  hasGoogleEmail: boolean;
  hasCustomPassword: boolean;
  isOpenInitial?: boolean;
}

export function WelcomeModal({
  namaSiswa,
  hasGoogleEmail,
  hasCustomPassword,
  isOpenInitial = true,
}: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(isOpenInitial);
  const [activeTab, setActiveTab] = useState<'overview' | 'set-password' | 'link-gmail'>('overview');

  // Form password state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Form Gmail state
  const [gmail, setGmail] = useState('');
  const [gmailError, setGmailError] = useState('');
  const [gmailSuccess, setGmailSuccess] = useState(false);
  const [isSubmittingGmail, setIsSubmittingGmail] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    // Hapus query parameter 'welcome' dari URL tanpa refresh penuh
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('welcome');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (password.length < 6) {
      setPasswordError('Password minimal harus 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsSubmittingPassword(true);
    const res = await setCustomPassword(password);
    setIsSubmittingPassword(false);

    if (res.success) {
      setPasswordSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setActiveTab('overview'), 1800);
    } else {
      setPasswordError(res.error || 'Gagal menyimpan password.');
    }
  };

  const handleSaveGmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setGmailError('');
    setGmailSuccess(false);

    if (!gmail || !gmail.includes('@')) {
      setGmailError('Masukkan alamat Gmail yang valid.');
      return;
    }

    setIsSubmittingGmail(true);
    const res = await linkGoogleAccount(gmail);
    setIsSubmittingGmail(false);

    if (res.success) {
      setGmailSuccess(true);
      setGmail('');
      setTimeout(() => setActiveTab('overview'), 1800);
    } else {
      setGmailError(res.error || 'Gagal menautkan Gmail.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border border-white/10 rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden text-white">
        
        {/* Header decoration */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button (X) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          aria-label="Tutup"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header content */}
        <div className="px-6 pt-7 pb-4 text-center border-b border-white/10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-3">
            <span className="text-2xl">👋</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Selamat Datang!
          </h2>
          <p className="text-sm text-blue-200/80 mt-1">
            Orang tua dari <span className="font-semibold text-white">{namaSiswa}</span>
          </p>
        </div>

        {/* Body content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-300/70">
                  Fitur Portal Aplikasi Ini
                </h3>

                {/* Feature 1: Pembayaran */}
                <div className="flex items-start gap-3.5 p-3.5 bg-white/[0.05] border border-white/10 rounded-2xl">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Riwayat & Status Pembayaran</h4>
                    <p className="text-xs text-slate-300/70 mt-0.5 leading-relaxed">
                      Cek status SPP, rincian pembayaran lunas, maupun tagihan aktif anak Anda secara real-time.
                    </p>
                  </div>
                </div>

                {/* Feature 2: Raport */}
                <div className="flex items-start gap-3.5 p-3.5 bg-white/[0.05] border border-white/10 rounded-2xl">
                  <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Raport & Evaluasi Belajar</h4>
                    <p className="text-xs text-slate-300/70 mt-0.5 leading-relaxed">
                      Lihat laporan perkembangan akademik, catatan guru, dan nilai siswa secara transparan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Options for Next Session */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs font-medium text-blue-200/80 mb-3">
                  💡 Pilihan Akses Cepat untuk Login Berikutnya:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Gmail */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('link-gmail')}
                    className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-left transition-all text-xs font-medium group"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                      <span>Tautkan Gmail</span>
                    </div>
                    {hasGoogleEmail && (
                      <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">Aktif</span>
                    )}
                  </button>

                  {/* Option 2: Set Password */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('set-password')}
                    className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-left transition-all text-xs font-medium group"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121 7.5z" />
                      </svg>
                      <span>Atur Password</span>
                    </div>
                    {hasCustomPassword && (
                      <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">Aktif</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Tab: Set Password */}
          {activeTab === 'set-password' && (
            <form onSubmit={handleSavePassword} className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121 7.5z" />
                  </svg>
                  Buat Password Pribadi
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="text-xs text-blue-300/70 hover:text-white"
                >
                  ← Kembali
                </button>
              </div>

              <p className="text-xs text-slate-300/70">
                Password ini dapat Anda gunakan untuk masuk ke portal pada sesi berikutnya.
              </p>

              {passwordError && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-xs">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-xs flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Password berhasil disimpan!
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300/80 mb-1">Password Baru</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3.5 py-2.5 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300/80 mb-1">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password baru"
                    className="w-full px-3.5 py-2.5 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-xs transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50"
                >
                  {isSubmittingPassword ? 'Menyimpan...' : 'Simpan Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {/* Form Tab: Link Gmail */}
          {activeTab === 'link-gmail' && (
            <form onSubmit={handleSaveGmail} className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  Tautkan Akun Google (Gmail)
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="text-xs text-blue-300/70 hover:text-white"
                >
                  ← Kembali
                </button>
              </div>

              <p className="text-xs text-slate-300/70">
                Masukkan alamat email Gmail yang akan digunakan untuk masuk ke portal ini.
              </p>

              {gmailError && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-xs">
                  {gmailError}
                </div>
              )}

              {gmailSuccess && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-xs flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Email Gmail berhasil ditautkan!
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300/80 mb-1">Alamat Gmail Anda</label>
                  <input
                    type="email"
                    required
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    placeholder="contoh: ortusiswa@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-white/40 uppercase">Atau</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* Direct Google Sign In Button */}
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl: '/?welcome=true' })}
                  className="w-full py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Masuk dengan Akun Google
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingGmail}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl text-xs transition-colors shadow-lg shadow-red-500/25 disabled:opacity-50"
                >
                  {isSubmittingGmail ? 'Tautkan...' : 'Simpan Email'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-black/20 border-t border-white/10 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            Anda dapat menutup popup ini kapan saja.
          </p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95"
          >
            Lain Kali / Langsung Pembayaran →
          </button>
        </div>

      </div>
    </div>
  );
}
