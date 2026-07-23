// app/lib/raport-service.ts
import { getSupabase } from '@/app/lib/supabase';
import { MOCK_RAPORT_DATA } from '@/app/lib/mock-raport';
import { RaportRecord, RaportByMapel, RaportSummaryStats, NilaiStatus } from '@/app/types/raport';

export async function getRaportFeatureStatus(): Promise<{
  isComingSoon: boolean;
  message?: string;
}> {
  // 1. Cek override via ENV variabel jika di-set secara eksplisit
  const envStatus = process.env.NEXT_PUBLIC_RAPORT_STATUS || process.env.RAPORT_STATUS;
  if (envStatus === 'active' || envStatus === 'aktif') {
    return { isComingSoon: false };
  }
  if (envStatus === 'coming_soon') {
    return { isComingSoon: true };
  }

  // 2. Cek status di Database Supabase (tabel `tb_pengaturan`)
  try {
    const { data, error } = await getSupabase()
      .from('tb_pengaturan')
      .select('value, keterangan')
      .eq('key', 'status_raport')
      .maybeSingle();

    if (!error && data) {
      const val = String(data.value).toLowerCase().trim();
      const isActive = val === 'active' || val === 'aktif' || val === 'enabled' || val === 'true';
      return {
        isComingSoon: !isActive,
        message: data.keterangan || undefined,
      };
    }
  } catch (e) {
    console.log('Catatan: Query tb_pengaturan fallback ke coming_soon status:', e);
  }

  // Default saat ini: Coming Soon (sesuai permintaan)
  return { isComingSoon: true };
}

export async function getRaportSiswa(idSiswa: number): Promise<{
  data: RaportRecord[];
  isMock: boolean;
  summary: RaportSummaryStats;
  groupedByMapel: RaportByMapel[];
}> {
  // Cek flag env apakah mode mock diaktifkan
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_RAPORT === 'true' || process.env.USE_MOCK_RAPORT === 'true';

  let rawRecords: RaportRecord[] = [];

  if (isMock) {
    rawRecords = MOCK_RAPORT_DATA;
  } else {
    try {
      const { data, error } = await getSupabase()
        .from('tb_raport')
        .select(`
          id,
          id_siswa,
          id_item,
          nilai,
          keterangan,
          tanggal,
          tb_penilaian_item!inner (
            id,
            label_materi,
            tb_penilaian_set!inner (
              id,
              nama_set,
              mapel
            )
          )
        `)
        .eq('id_siswa', idSiswa)
        .is('deleted_at', null)
        .order('tanggal', { ascending: false });

      if (error) {
        console.error('Error fetching raport from Supabase:', error);
        // Fallback ke mock data jika query error atau tabel belum ada
        rawRecords = MOCK_RAPORT_DATA;
      } else if (data && data.length > 0) {
        // Transformasi struktur nested Supabase ke flat RaportRecord
        rawRecords = data.map((item: any) => {
          const itemData = Array.isArray(item.tb_penilaian_item)
            ? item.tb_penilaian_item[0]
            : item.tb_penilaian_item;
          const setData = itemData?.tb_penilaian_set
            ? (Array.isArray(itemData.tb_penilaian_set) ? itemData.tb_penilaian_set[0] : itemData.tb_penilaian_set)
            : null;

          return {
            id: item.id,
            id_siswa: item.id_siswa,
            id_item: item.id_item,
            nilai: item.nilai as NilaiStatus,
            keterangan: item.keterangan,
            tanggal: item.tanggal,
            label_materi: itemData?.label_materi || 'Materi Tidak Diketahui',
            nama_set: setData?.nama_set || 'Set Tidak Diketahui',
            mapel: setData?.mapel || 'Umum',
          };
        });
      } else {
        // Jika tabel di database masih kosong tetapi mock mode tidak sengaja false
        rawRecords = MOCK_RAPORT_DATA;
      }
    } catch (e) {
      console.error('Unexpected error fetching raport:', e);
      rawRecords = MOCK_RAPORT_DATA;
    }
  }

  // HITUNG STATISTIK RINGKASAN
  const total = rawRecords.length;
  const sangatMenguasai = rawRecords.filter(r => r.nilai === 'sangat menguasai').length;
  const mulaiMenguasai = rawRecords.filter(r => r.nilai === 'mulai menguasai').length;
  const belumMenguasai = rawRecords.filter(r => r.nilai === 'belum menguasai').length;
  const persentaseSangatMenguasai = total > 0 ? Math.round((sangatMenguasai / total) * 100) : 0;

  const summary: RaportSummaryStats = {
    total,
    sangatMenguasai,
    mulaiMenguasai,
    belumMenguasai,
    persentaseSangatMenguasai,
  };

  // PENGELOMPOKAN BERDASARKAN MAPEL DAN NAMA_SET
  const mapelMap = new Map<string, Map<string, RaportRecord[]>>();

  rawRecords.forEach((record) => {
    if (!mapelMap.has(record.mapel)) {
      mapelMap.set(record.mapel, new Map());
    }
    const setMap = mapelMap.get(record.mapel)!;
    if (!setMap.has(record.nama_set)) {
      setMap.set(record.nama_set, []);
    }
    setMap.get(record.nama_set)!.push(record);
  });

  const groupedByMapel: RaportByMapel[] = Array.from(mapelMap.entries()).map(([mapel, setMap]) => ({
    mapel,
    sets: Array.from(setMap.entries()).map(([nama_set, items]) => ({
      nama_set,
      items,
    })),
  }));

  return {
    data: rawRecords,
    isMock,
    summary,
    groupedByMapel,
  };
}
