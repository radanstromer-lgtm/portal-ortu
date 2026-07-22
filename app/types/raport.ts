// app/types/raport.ts

export type NilaiStatus = 'belum menguasai' | 'mulai menguasai' | 'sangat menguasai';

export interface PenilaianSet {
  id: number;
  nama_set: string;
  mapel: string;
}

export interface PenilaianItem {
  id: number;
  id_set: number;
  label_materi: string;
  penilaian_set?: PenilaianSet;
}

export interface RaportRecord {
  id: number;
  id_siswa: number;
  id_item: number;
  nilai: NilaiStatus;
  keterangan: string | null;
  tanggal: string;
  label_materi: string;
  nama_set: string;
  mapel: string;
}

export interface RaportByMapel {
  mapel: string;
  sets: {
    nama_set: string;
    items: RaportRecord[];
  }[];
}

export interface RaportSummaryStats {
  total: number;
  sangatMenguasai: number;
  mulaiMenguasai: number;
  belumMenguasai: number;
  persentaseSangatMenguasai: number;
}

export const NILAI_CONFIG: Record<NilaiStatus, {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotBg: string;
}> = {
  'sangat menguasai': {
    label: 'Sangat Menguasai',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    dotBg: 'bg-emerald-500',
  },
  'mulai menguasai': {
    label: 'Mulai Menguasai',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    dotBg: 'bg-amber-500',
  },
  'belum menguasai': {
    label: 'Belum Menguasai',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    dotBg: 'bg-rose-500',
  },
};
