// app/raport/page.tsx
import React from 'react';
import { getSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/app/components/logout-button';
import { BottomNav } from '@/app/components/bottom-nav';
import { getRaportSiswa } from '@/app/lib/raport-service';
import { RaportView } from './raport-view';

export default async function RaportSiswaPage() {
  // 1. Cek sesi aktif di server
  const session = await getSession();

  // 2. Jika tidak ada sesi login, redirect ke halaman login
  if (!session) {
    redirect('/login');
  }

  // Fetch data raport (otomatis mengecek flag process.env.NEXT_PUBLIC_USE_MOCK_RAPORT)
  const { summary, groupedByMapel, isMock } = await getRaportSiswa(session.userId);

  // Helper inisial nama untuk avatar
  const getInitials = (nama: string) => {
    return nama
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-lg relative pb-20">
        
        {/* Header App - Menampilkan Nama User & Navigasi Raport */}
        <header className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white p-5 sticky top-0 z-10 rounded-b-xl shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Raport Siswa</h1>
              <p className="text-sm text-emerald-100 mt-1">Rumah Belajar L 253</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Avatar dengan inisial */}
              <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-sm font-bold">
                {getInitials(session.nama)}
              </div>
              <LogoutButton />
            </div>
          </div>
          {/* Info user */}
          <div className="mt-3 pt-3 border-t border-emerald-500/30">
            <p className="text-sm text-emerald-100">
              📘 Hasil Perkembangan & Capaian <span className="font-semibold text-white">{session.nama}</span>
            </p>
          </div>
        </header>

        {/* Konten Halaman Raport */}
        <RaportView
          summary={summary}
          groupedByMapel={groupedByMapel}
          isMock={isMock}
        />

      </div>

      {/* Bottom Navigation Menu */}
      <BottomNav />
    </main>
  );
}
