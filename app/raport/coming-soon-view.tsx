// app/raport/coming-soon-view.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface ComingSoonViewProps {
  namaSiswa: string;
  customMessage?: string;
}

export function RaportComingSoonView({ namaSiswa, customMessage }: ComingSoonViewProps) {
  return (
    <div className="p-4 space-y-4 animate-[fadeIn_0.3s_ease-out]">
      {/* Hero Coming Soon Card */}
      <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 border border-white/15 rounded-3xl p-6 text-white text-center shadow-xl overflow-hidden">
        {/* Glow decorations */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Animated Badge Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-2xl shadow-lg shadow-emerald-600/40 animate-bounce">
            <span className="text-3xl">🚀</span>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Segera Hadir / Coming Soon
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              Raport Digital Siswa
            </h2>
            <p className="text-xs text-emerald-200/80 mt-1 max-w-xs mx-auto leading-relaxed">
              {customMessage || (
                <>
                  Fitur rekapitulasi nilai dan catatan perkembangan untuk <span className="font-semibold text-white">{namaSiswa}</span> sedang dalam tahap persiapan.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Feature Teaser Grid */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          Fitur yang Akan Datang
        </h3>

        <div className="space-y-3">
          {/* Feature 1 */}
          <div className="flex items-start gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
            <div className="p-2 bg-emerald-600 text-white rounded-lg flex-shrink-0 text-sm">
              📊
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-800">Capaian Indikator Belajar</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Pantau tingkat penguasaan materi per mata pelajaran secara transparan.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3 p-3 bg-teal-50/50 border border-teal-100 rounded-xl">
            <div className="p-2 bg-teal-600 text-white rounded-lg flex-shrink-0 text-sm">
              📝
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-800">Catatan Evaluasi Pengajar</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Ulasan komprehensif dari guru pendamping mengenai kebiasaan & sikap siswa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <Link
          href="/dashboard"
          className="w-full py-3 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98]"
        >
          <span>🏠 Kembali ke Beranda</span>
        </Link>
        <Link
          href="/pembayaran"
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>💳 Cek Riwayat Pembayaran</span>
        </Link>
      </div>
    </div>
  );
}
