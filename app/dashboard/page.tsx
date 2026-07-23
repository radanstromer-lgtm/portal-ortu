// app/dashboard/page.tsx
import React from 'react';
import { getSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/app/components/logout-button';
import { BottomNav } from '@/app/components/bottom-nav';
import { WelcomeModal } from '@/app/components/welcome-modal';
import { getSupabase } from '@/app/lib/supabase';
import { getRaportSiswa, getRaportFeatureStatus } from '@/app/lib/raport-service';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ welcome?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  // 1. Cek sesi aktif di server
  const session = await getSession();

  // 2. Jika tidak ada sesi login, redirect ke halaman login
  if (!session) {
    redirect('/login');
  }

  const resolvedSearchParams = await searchParams;
  const isWelcomeFlow = resolvedSearchParams?.welcome === 'true';

  // Fetch status email_google dan custom_password siswa dari Supabase
  const { data: siswaData } = await getSupabase()
    .from('tb_siswa')
    .select('email_google, custom_password, nis, no_hp')
    .eq('id_siswa', session.userId)
    .single();

  const hasGoogleEmail = !!siswaData?.email_google;
  const hasCustomPassword = !!siswaData?.custom_password;

  // Fetch data pembayaran terbaru untuk widget status
  const { data: latestPembayaran } = await getSupabase()
    .from('tb_pembayaran_siswa')
    .select('id_pembayaran, bulan, tahun, nominal, status, tanggal_bayar, metode_bayar')
    .eq('id_siswa', session.userId)
    .is('deleted_at', null)
    .order('tahun', { ascending: false })
    .order('bulan', { ascending: false })
    .limit(1)
    .single();

  // Cek status fitur raport (coming_soon vs active)
  const featureStatus = await getRaportFeatureStatus();

  // Fetch data rincian raport siswa jika fitur aktif
  let summary = { persentaseSangatMenguasai: 0 };
  let groupedByMapel: any[] = [];
  if (!featureStatus.isComingSoon) {
    const raportData = await getRaportSiswa(session.userId);
    summary = raportData.summary;
    groupedByMapel = raportData.groupedByMapel;
  }

  const namaBulan = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const getInitials = (nama: string) => {
    return nama
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center">
      {/* Popup Welcome jika datang dari flow khusus */}
      {isWelcomeFlow && (
        <WelcomeModal
          namaSiswa={session.nama}
          hasGoogleEmail={hasGoogleEmail}
          hasCustomPassword={hasCustomPassword}
          isOpenInitial={true}
        />
      )}

      <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-lg relative pb-24">
        
        {/* Header App */}
        <header className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sticky top-0 z-10 rounded-b-2xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-emerald-100">
                Portal Orang Tua
              </span>
              <h1 className="text-xl font-extrabold mt-1">Rumah Belajar L 253</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-sm font-bold shadow-sm backdrop-blur-md">
                {getInitials(session.nama)}
              </div>
              <LogoutButton />
            </div>
          </div>

          {/* User Welcome Card */}
          <div className="mt-4 pt-3.5 border-t border-white/20 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-100/90">Selamat Datang,</p>
              <h2 className="text-base font-bold text-white tracking-tight">
                Orang Tua dari {session.nama}
              </h2>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="p-4 space-y-4 mt-1">

          {/* Quick Menu Banner */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/pembayaran"
              className="p-4 bg-gradient-to-br from-rose-600 to-red-700 rounded-2xl text-white shadow-md hover:shadow-lg transition-all active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold">Pembayaran</h3>
              <p className="text-[11px] text-rose-100/80 mt-0.5">Cek tagihan & SPP</p>
            </Link>

            <Link
              href="/raport"
              className="p-4 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white shadow-md hover:shadow-lg transition-all active:scale-95 group relative overflow-hidden"
            >
              {featureStatus.isComingSoon && (
                <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider bg-amber-400/90 text-amber-950 px-2 py-0.5 rounded-full shadow-sm">
                  Segera Hadir
                </span>
              )}
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-sm font-bold">Raport Siswa</h3>
              <p className="text-[11px] text-emerald-100/80 mt-0.5">
                {featureStatus.isComingSoon ? 'Fitur Segera Hadir' : 'Hasil & nilai belajar'}
              </p>
            </Link>
          </div>

          {/* Status Pembayaran Terakhir Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Status SPP Terakhir
              </h3>
              <Link href="/pembayaran" className="text-xs text-emerald-600 font-semibold hover:underline">
                Lihat Semua →
              </Link>
            </div>

            {latestPembayaran ? (
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Bulan {namaBulan[latestPembayaran.bulan]} {latestPembayaran.tahun}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Nominal: <span className="font-semibold text-gray-700">{formatRupiah(latestPembayaran.nominal)}</span>
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  latestPembayaran.status === 'Lunas'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {latestPembayaran.status}
                </span>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Belum ada catatan pembayaran terbaru.</p>
            )}
          </div>

          {/* Ringkasan Raport Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Ringkasan Akademik
              </h3>
              <Link href="/raport" className="text-xs text-emerald-600 font-semibold hover:underline">
                {featureStatus.isComingSoon ? 'Info →' : 'Buka Raport →'}
              </Link>
            </div>

            {featureStatus.isComingSoon ? (
              <div className="p-3.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-100/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                    🚀
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Raport Digital Siswa</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Fitur evaluasi belajar sedang disiapkan.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-amber-400/90 text-amber-950 px-2 py-0.5 rounded-full flex-shrink-0">
                  Segera Hadir
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                  <p className="text-xl font-bold text-emerald-700">{summary.persentaseSangatMenguasai}%</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Sangat Menguasai</p>
                </div>
                <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl">
                  <p className="text-xl font-bold text-teal-700">{groupedByMapel.length}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Mata Pelajaran</p>
                </div>
              </div>
            )}
          </div>

          {/* Pengumuman Bimbel */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-700 rounded-xl flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.012-.15-.02-.303-.02-.456s.008-.306.02-.456M12 9v3.75m0 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase">Informasi Bimbel</h4>
                <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                  Semua informasi tagihan, pembayaran, dan hasil evaluasi siswa secara resmi dikelola melalui Portal Orang Tua Rumah Belajar L 253.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
