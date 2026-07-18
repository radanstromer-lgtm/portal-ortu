// app/page.tsx
import React from 'react';
import { getSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/app/components/logout-button';

// ... (interface Pembayaran dan mockData tetap sama) ...
interface Pembayaran {
  id_pembayaran: number;
  bulan: number;
  tahun: number;
  nominal: number;
  status: 'Belum Bayar' | 'Lunas' | 'Terlambat';
  tanggal_bayar: string | null;
  metode_bayar: string | null;
}

export default async function RiwayatPembayaran() {
  // 1. Cek sesi aktif di server
  const session = await getSession();

  // 2. Jika tidak ada sesi login, redirect ke halaman login
  if (!session) {
    redirect('/login');
  }

  // Nantinya, no_hp pengguna bisa digunakan untuk fetch data API:
  // const userPhone = session.noHp;
  // const dataPembayaran = await getRiwayatByPhone(userPhone);

  // Mock data: Nantinya ini diganti dengan fetch() ke REST API CodeIgniter Anda
const mockData: Pembayaran[] = [
  {
    id_pembayaran: 12,
    bulan: 7,
    tahun: 2026,
    nominal: 150000.00,
    status: 'Lunas',
    tanggal_bayar: '2026-07-12T14:08:50',
    metode_bayar: 'Cash',
  },
  {
    id_pembayaran: 11,
    bulan: 6,
    tahun: 2026,
    nominal: 150000.00,
    status: 'Lunas',
    tanggal_bayar: '2026-06-10T09:15:00',
    metode_bayar: 'Transfer',
  },
  {
    id_pembayaran: 10,
    bulan: 5,
    tahun: 2026,
    nominal: 150000.00,
    status: 'Belum Bayar',
    tanggal_bayar: null,
    metode_bayar: null,
  }
];

const namaBulan = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // Fungsi format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Fungsi format Tanggal
  const formatTanggal = (isoString: string | null) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Ambil inisial nama untuk avatar
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
      <div className="w-full max-w-md bg-white min-h-screen shadow-lg relative pb-10">
        
        {/* Header App - Menampilkan Nama User */}
        <header className="bg-blue-600 text-white p-5 sticky top-0 z-10 rounded-b-xl shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Portal Orang Tua</h1>
              <p className="text-sm text-blue-100 mt-1">Rumah Belajar L 253</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Avatar dengan inisial */}
              <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-blue-300 flex items-center justify-center text-sm font-bold">
                {getInitials(session.nama)}
              </div>
              <LogoutButton />
            </div>
          </div>
          {/* Info user */}
          <div className="mt-3 pt-3 border-t border-blue-500/30">
            <p className="text-sm text-blue-100">
              👋 Halo, orang tua dari <span className="font-semibold text-white">{session.nama}</span>
            </p>
          </div>
        </header>

        {/* Konten Halaman */}
        <div className="p-4 mt-2">
          <h2 className="text-gray-800 font-semibold mb-4 text-lg">Riwayat Pembayaran</h2>

          <div className="space-y-4">
            {mockData.map((item) => (
              <div 
                key={item.id_pembayaran} 
                className={`p-4 rounded-xl border-l-4 shadow-sm bg-white border ${
                  item.status === 'Lunas' ? 'border-l-green-500' : 'border-l-red-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Bulan {namaBulan[item.bulan]} {item.tahun}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.tanggal_bayar ? formatTanggal(item.tanggal_bayar) : 'Menunggu Pembayaran'}
                    </p>
                  </div>
                  
                  {/* Badge Status */}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Lunas' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Metode</p>
                    <p className="text-sm font-medium text-gray-700">
                      {item.metode_bayar || '-'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Nominal</p>
                    <p className="text-base font-bold text-gray-900">
                      {formatRupiah(item.nominal)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </main>
  );
}