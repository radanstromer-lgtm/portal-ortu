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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pb-20 sm:pb-4 backdrop-blur-md animate-[fadeIn_0.2s_ease-out] overflow-y-auto">
      <div className="relative w-full max-w-md sm:max-w-lg max-h-[82vh] sm:max-h-[85vh] flex flex-col bg-gradient-to-b from-slate-950 via-emerald-950 to-teal-950 border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl shadow-emerald-950/60 overflow-hidden text-white my-auto">
        
        {/* Header decoration */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button (X) */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          aria-label="Tutup"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header content */}
        <div className="px-5 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4 text-center border-b border-white/10 flex-shrink-0">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-2xl shadow-lg shadow-emerald-600/30 mb-2 sm:mb-3">
            <span className="text-xl sm:text-2xl">👋</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Selamat Datang!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
            Orang tua dari <span className="font-semibold text-white">{namaSiswa}</span>
          </p>
        </div>

        {/* Scrollable Body content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
              <div className="space-y-2.5">
                <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
                  Fitur Portal Aplikasi
                </h3>

                {/* Feature 1: Pembayaran */}
                <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white/[0.05] border border-white/10 rounded-xl sm:rounded-2xl">
                  <div className="p-2 sm:p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">Riwayat & Status Pembayaran</h4>
                    <p className="text-[11px] sm:text-xs text-slate-300/70 mt-0.5 leading-relaxed">
                      Cek status SPP, rincian pembayaran lunas, maupun tagihan aktif anak Anda secara real-time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Options for Next Session */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs font-medium text-emerald-200/90 mb-2.5">
                  💡 Pilihan Akses Cepat untuk Login Berikutnya:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Option 1: Gmail */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('link-gmail')}
                    className="flex items-center justify-between p-2.5 sm:p-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-left transition-all text-xs font-medium group"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                      <span>Tautkan Gmail</span>
                    </div>
                    {hasGoogleEmail && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Aktif</span>
                    )}
                  </button>

                  {/* Option 2: Set Password */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('set-password')}
                    className="flex items-center justify-between p-2.5 sm:p-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-left transition-all text-xs font-medium group"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121 7.5z" />
                      </svg>
                      <span>Atur Password</span>
                    </div>
                    {hasCustomPassword && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Aktif</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Tab: Set Password */}
          {activeTab === 'set-password' && (
            <form onSubmit={handleSavePassword} className="space-y-3.5 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121 7.5z" />
                  </svg>
                  Buat Password Pribadi
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="text-xs text-emerald-300/70 hover:text-white"
                >
                  ← Kembali
                </button>
              </div>

              <p className="text-xs text-slate-300/70">
                Password ini dapat Anda gunakan untuk masuk ke portal pada sesi berikutnya.
              </p>

              {passwordError && (
                <div className="p-2.5 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Password berhasil disimpan!
                </div>
              )}

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] sm:text-xs text-slate-300/80 mb-1">Password Baru</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs text-slate-300/80 mb-1">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password baru"
                    className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs transition-colors shadow-lg shadow-emerald-600/25 disabled:opacity-50"
                >
                  {isSubmittingPassword ? 'Menyimpan...' : 'Simpan Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {/* Form Tab: Link Gmail */}
          {activeTab === 'link-gmail' && (
            <form onSubmit={handleSaveGmail} className="space-y-3.5 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  Tautkan Akun Google (Gmail)
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="text-xs text-emerald-300/70 hover:text-white"
                >
                  ← Kembali
                </button>
              </div>

              <p className="text-xs text-slate-300/70">
                Masukkan alamat email Gmail yang akan digunakan untuk masuk ke portal ini.
              </p>

              {gmailError && (
                <div className="p-2.5 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                  {gmailError}
                </div>
              )}

              {gmailSuccess && (
                <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Email Gmail berhasil ditautkan!
                </div>
              )}

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] sm:text-xs text-slate-300/80 mb-1">Alamat Gmail Anda</label>
                  <input
                    type="email"
                    required
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    placeholder="contoh: ortusiswa@gmail.com"
                    className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div className="relative flex py-0.5 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-white/40 uppercase">Atau</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* Direct Google Sign In Button */}
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl: '/?welcome=true' })}
                  className="w-full py-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
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

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmittingGmail}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl text-xs transition-colors shadow-lg shadow-rose-600/25 disabled:opacity-50"
                >
                  {isSubmittingGmail ? 'Tautkan...' : 'Simpan Email'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-black/30 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 flex-shrink-0">
          <p className="text-[10px] sm:text-[11px] text-slate-400 text-center sm:text-left">
            Anda dapat menutup popup ini kapan saja.
          </p>
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-95 text-center"
          >
            Lain Kali / Langsung Pembayaran →
          </button>
        </div>

      </div>
    </div>
  );
}
