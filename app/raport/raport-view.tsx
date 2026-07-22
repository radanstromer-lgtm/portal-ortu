'use client';

// app/raport/raport-view.tsx
import React, { useState } from 'react';
import { RaportByMapel, RaportSummaryStats, NILAI_CONFIG } from '@/app/types/raport';

interface RaportViewProps {
  summary: RaportSummaryStats;
  groupedByMapel: RaportByMapel[];
  isMock: boolean;
}

export function RaportView({ summary, groupedByMapel, isMock }: RaportViewProps) {
  const [selectedMapel, setSelectedMapel] = useState<string>('Semua');

  const mapelList = ['Semua', ...groupedByMapel.map((g) => g.mapel)];

  const filteredMapel = selectedMapel === 'Semua'
    ? groupedByMapel
    : groupedByMapel.filter((g) => g.mapel === selectedMapel);

  const formatTanggal = (isoString: string) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Banner Indicator Mock Data */}
      {isMock && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-3 text-amber-800 shadow-sm animate-fade-in">
          <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs">
            <p className="font-semibold">Mode Sampel Data (Mock)</p>
            <p className="text-amber-700/80 mt-0.5">Tabel database masih kosong. Menampilkan sampel data capaian siswa. Set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">NEXT_PUBLIC_USE_MOCK_RAPORT=false</code> saat database siap.</p>
          </div>
        </div>
      )}

      {/* Card Ringkasan Capaian / Progress Summary */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-bold">Ringkasan Evaluasi</h2>
            <p className="text-xs text-blue-100">Total {summary.total} Indikator Pembelajaran</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
            {summary.persentaseSangatMenguasai}% Tuntas
          </div>
        </div>

        {/* Progress Bar Visual */}
        <div className="w-full bg-blue-900/40 rounded-full h-2.5 overflow-hidden mb-4 p-0.5 border border-white/10">
          <div className="flex h-full rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 transition-all duration-500"
              style={{ width: `${summary.total > 0 ? (summary.sangatMenguasai / summary.total) * 100 : 0}%` }}
              title="Sangat Menguasai"
            />
            <div
              className="bg-amber-300 transition-all duration-500"
              style={{ width: `${summary.total > 0 ? (summary.mulaiMenguasai / summary.total) * 100 : 0}%` }}
              title="Mulai Menguasai"
            />
            <div
              className="bg-rose-400 transition-all duration-500"
              style={{ width: `${summary.total > 0 ? (summary.belumMenguasai / summary.total) * 100 : 0}%` }}
              title="Belum Menguasai"
            />
          </div>
        </div>

        {/* Grid Counter Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/10">
            <div className="flex items-center justify-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] text-blue-100">Sangat</span>
            </div>
            <p className="text-lg font-extrabold mt-0.5">{summary.sangatMenguasai}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/10">
            <div className="flex items-center justify-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-300"></span>
              <span className="text-[11px] text-blue-100">Mulai</span>
            </div>
            <p className="text-lg font-extrabold mt-0.5">{summary.mulaiMenguasai}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/10">
            <div className="flex items-center justify-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span className="text-[11px] text-blue-100">Belum</span>
            </div>
            <p className="text-lg font-extrabold mt-0.5">{summary.belumMenguasai}</p>
          </div>
        </div>
      </div>

      {/* Filter Chips Mata Pelajaran */}
      <div className="flex overflow-x-auto pb-1 space-x-2 scrollbar-none no-scrollbar">
        {mapelList.map((mapel) => {
          const isSelected = selectedMapel === mapel;
          return (
            <button
              key={mapel}
              onClick={() => setSelectedMapel(mapel)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {mapel}
            </button>
          );
        })}
      </div>

      {/* List Penilaian Per Mapel & Set */}
      <div className="space-y-4">
        {filteredMapel.length === 0 ? (
          <div className="bg-white border rounded-2xl p-8 text-center text-gray-500 shadow-sm">
            <p className="font-medium text-gray-700">Tidak ada data penilaian</p>
            <p className="text-xs text-gray-400 mt-1">Belum ada nilai yang dimasukkan untuk mata pelajaran ini.</p>
          </div>
        ) : (
          filteredMapel.map((group) => (
            <div key={group.mapel} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header Mapel */}
              <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </span>
                  <h3 className="font-bold text-gray-800 text-sm">{group.mapel}</h3>
                </div>
                <span className="text-[11px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {group.sets.reduce((acc, s) => acc + s.items.length, 0)} indikator
                </span>
              </div>

              {/* Set Penilaian */}
              <div className="p-4 space-y-4">
                {group.sets.map((setGroup) => (
                  <div key={setGroup.nama_set} className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-1">
                      {setGroup.nama_set}
                    </h4>

                    <div className="space-y-2.5">
                      {setGroup.items.map((item) => {
                        const config = NILAI_CONFIG[item.nilai] || NILAI_CONFIG['belum menguasai'];
                        return (
                          <div
                            key={item.id}
                            className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-100 transition-all duration-200"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <p className="text-sm font-semibold text-gray-800 leading-snug">
                                {item.label_materi}
                              </p>
                              {/* Status Badge */}
                              <span
                                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center space-x-1.5 ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${config.dotBg}`} />
                                <span>{config.label}</span>
                              </span>
                            </div>

                            {/* Catatan / Keterangan Guru jika ada */}
                            {item.keterangan && (
                              <div className="mt-2 pt-2 border-t border-gray-200/60 text-xs text-gray-600 bg-white/60 rounded-lg p-2 flex items-start space-x-2">
                                <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <div>
                                  <span className="font-medium text-gray-700">Catatan Pengajar: </span>
                                  <span className="italic">{item.keterangan}</span>
                                </div>
                              </div>
                            )}

                            <div className="mt-2 flex justify-between items-center text-[10px] text-gray-400">
                              <span>Tanggal Evaluasi</span>
                              <span>{formatTanggal(item.tanggal)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
