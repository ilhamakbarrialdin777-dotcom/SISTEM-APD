/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Karyawan, StockItem, PengajuanAPD, PengembalianAPD, ExitClearance, AuditTrail } from './types';

// Helper function to calculate duration of work based on join date in local format (Tahun, Bulan, Hari)
export function getMasaKerja(tanggalBergabung: string, curDateStr = '2026-05-30'): string {
  const join = new Date(tanggalBergabung);
  const cur = new Date(curDateStr);
  
  if (isNaN(join.getTime())) return '-';
  
  let years = cur.getFullYear() - join.getFullYear();
  let months = cur.getMonth() - join.getMonth();
  let days = cur.getDate() - join.getDate();
  
  if (days < 0) {
    months--;
    const prevMonth = new Date(cur.getFullYear(), cur.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  let result = '';
  if (years > 0) result += `${years} Tahun `;
  if (months > 0) result += `${months} Bulan `;
  if (days > 0 || result === '') result += `${days} Hari`;
  
  return result.trim();
}

export const initialKaryawan: Karyawan[] = [
  {
    nik: "WPA-21045",
    namaLengkap: "Rian Hidayat",
    tempatLahir: "Samarinda",
    tanggalLahir: "1994-08-12",
    jenisKelamin: "Laki-laki",
    nomorHp: "081234567812",
    alamat: "Jl. Mulawarman No. 45, Samarinda, Kaltim",
    jabatan: "Operator Dump Truck",
    departemen: "Mining Production",
    site: "Site WPA-A (Sanga-Sanga)",
    atasanLangsung: "Supriyadi (Foreman)",
    statusKaryawan: "PKWTT",
    tanggalBergabung: "2021-04-15",
    nomorBpjsKesehatan: "0001234567891",
    nomorBpjsKetenagakerjaan: "210987654321",
    ukuranBaju: "L",
    ukuranSepatu: "42",
    fotoKaryawan: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop",
    statusAktif: "Aktif",
    arsip: false,
    historyPerubahan: [
      {
        tanggal: "2021-04-15",
        petugas: "Moh. Irfan (HRD)",
        aktivitas: "Registrasi Karyawan",
        detail: "Mendaftarkan karyawan baru dengan NIK WPA-21045."
      },
      {
        tanggal: "2024-05-10",
        petugas: "M. Irfan (HR) & Ilham (HSE)",
        aktivitas: "Update Ukuran APD",
        detail: "Penyesuaian ukuran baju dari M ke L."
      }
    ]
  },
  {
    nik: "WPA-23112",
    namaLengkap: "Adi Wijaya",
    tempatLahir: "Balikpapan",
    tanggalLahir: "1996-03-22",
    jenisKelamin: "Laki-laki",
    nomorHp: "081198765432",
    alamat: "Sepinggan Baru Blok G9, Balikpapan",
    jabatan: "Mechanic Heavy Equipment",
    departemen: "Engineering Maintenance",
    site: "Site WPA-A (Sanga-Sanga)",
    atasanLangsung: "Sujatmono (Supervisor)",
    statusKaryawan: "PKWT",
    tanggalBergabung: "2023-11-01",
    nomorBpjsKesehatan: "0001244558832",
    nomorBpjsKetenagakerjaan: "230876122453",
    ukuranBaju: "XL",
    ukuranSepatu: "43",
    fotoKaryawan: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=200&h=200&fit=crop",
    statusAktif: "Aktif",
    arsip: false,
    historyPerubahan: [
      {
        tanggal: "2023-11-01",
        petugas: "Moh. Irfan (HRD)",
        aktivitas: "Karyawan Bergabung",
        detail: "Data PKWT pertama diinput."
      }
    ]
  },
  {
    nik: "WPA-22008",
    namaLengkap: "Eka Setiowati",
    tempatLahir: "Tenggarong",
    tanggalLahir: "1998-05-30",
    jenisKelamin: "Perempuan",
    nomorHp: "081345678129",
    alamat: "Perum Rapak Indah No. 22, Samarinda",
    jabatan: "Grade Control Engineer",
    departemen: "Geology & Pit Control",
    site: "Site WPA-A (Sanga-Sanga)",
    atasanLangsung: "Bambang Pamungkas (Chief Geologist)",
    statusKaryawan: "PKWTT",
    tanggalBergabung: "2022-02-10",
    nomorBpjsKesehatan: "0004567891230",
    nomorBpjsKetenagakerjaan: "220938475618",
    ukuranBaju: "M",
    ukuranSepatu: "39",
    fotoKaryawan: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop",
    statusAktif: "Aktif",
    arsip: false,
    historyPerubahan: []
  },
  {
    nik: "WPA-24018",
    namaLengkap: "Rahmat Santoso",
    tempatLahir: "Banyuwangi",
    tanggalLahir: "1992-11-04",
    jenisKelamin: "Laki-laki",
    nomorHp: "082155667789",
    alamat: "Mess Refinery PT WPA, Sanga-Sanga",
    jabatan: "Blaster (Juru Ledak)",
    departemen: "Drill & Blast Operational",
    site: "Site WPA-A (Sanga-Sanga)",
    atasanLangsung: "Dwi Prasetyanto (Superintendent)",
    statusKaryawan: "PKWT",
    tanggalBergabung: "2024-01-18",
    nomorBpjsKesehatan: "0003421199882",
    nomorBpjsKetenagakerjaan: "240833221155",
    ukuranBaju: "XXL",
    ukuranSepatu: "44",
    fotoKaryawan: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
    statusAktif: "Aktif",
    arsip: false,
    historyPerubahan: []
  },
  {
    nik: "WPA-25005",
    namaLengkap: "Arif Kurniawan",
    tempatLahir: "Bontang",
    tanggalLahir: "2002-01-15",
    jenisKelamin: "Laki-laki",
    nomorHp: "085299881122",
    alamat: "Jl. Imam Bonjol Gg. VII No. 34, Bontang",
    jabatan: "Junior Safety Inspector",
    departemen: "HSE Department",
    site: "Site WPA-B (Berau)",
    atasanLangsung: "Ilham Akbar Rialdin (HSE Coordinator)",
    statusKaryawan: "Magang",
    tanggalBergabung: "2025-01-15",
    nomorBpjsKesehatan: "0009988776655",
    nomorBpjsKetenagakerjaan: "250112233445",
    ukuranBaju: "S",
    ukuranSepatu: "41",
    fotoKaryawan: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&h=200&fit=crop",
    statusAktif: "Aktif",
    arsip: false,
    historyPerubahan: []
  },
  // Karyawan Resign & PHK untuk audit / exit clearance
  {
    nik: "WPA-20119",
    namaLengkap: "Budi Santoso",
    tempatLahir: "Kediri",
    tanggalLahir: "1990-07-07",
    jenisKelamin: "Laki-laki",
    nomorHp: "081211112222",
    alamat: "Jl. KH Wahid Hasyim No. 9, Samarinda",
    jabatan: "Driller Operator",
    departemen: "Drill & Blast Operational",
    site: "Site WPA-A (Sanga-Sanga)",
    atasanLangsung: "Dwi Prasetyanto (Superintendent)",
    statusKaryawan: "PKWTT",
    tanggalBergabung: "2020-03-10",
    nomorBpjsKesehatan: "0001222333444",
    nomorBpjsKetenagakerjaan: "200987654311",
    ukuranBaju: "M",
    ukuranSepatu: "40",
    fotoKaryawan: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&fit=crop", // generic placeholder
    statusAktif: "Resign",
    arsip: false,
    historyPerubahan: [
      {
        tanggal: "2026-05-15",
        petugas: "Moh. Irfan (HRD)",
        aktivitas: "Pengajuan Resign",
        detail: "Menerima pengajuan resign terhitung mulai 30 Mei 2026. Menunggu penyelesaian proses Exit Clearance APD."
      }
    ]
  },
  {
    nik: "WPA-23049",
    namaLengkap: "Hendriyanto",
    tempatLahir: "Kutai Kartanegara",
    tanggalLahir: "1995-12-10",
    jenisKelamin: "Laki-laki",
    nomorHp: "081390908123",
    alamat: "Desa Loa Ulu RT 05, Kutai Kartanegara",
    jabatan: "Surveyor Assistant",
    departemen: "Geology & Pit Control",
    site: "Site WPA-A (Sanga-Sanga)",
    atasanLangsung: "Bambang Pamungkas (Chief Geologist)",
    statusKaryawan: "Kontraktor",
    tanggalBergabung: "2023-04-10",
    nomorBpjsKesehatan: "0001928374656",
    nomorBpjsKetenagakerjaan: "230987112234",
    ukuranBaju: "XL",
    ukuranSepatu: "42",
    fotoKaryawan: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&fit=crop",
    statusAktif: "PHK",
    arsip: false,
    historyPerubahan: [
      {
        tanggal: "2026-05-20",
        petugas: "Moh. Irfan (HRD)",
        aktivitas: "Pemutusan Hubungan Kerja",
        detail: "Kontrak kerja berakhir dan tidak diperpanjang per 28 Mei 2026. Kewajiban pengembalian APD."
      }
    ]
  }
];

export const initialStock: StockItem[] = [
  // Helm Safety
  {
    id: "STK-H01",
    kodeBarang: "APD-HLM-WHT",
    namaBarang: "Helm Safety White (Staff & Supervisor)",
    kategori: "Helm Safety",
    lokasiPenyimpanan: "Gudang Logistik Utama (Site A)",
    jumlahStok: 45,
    minimumStok: 10,
    tanggalMasuk: "2026-01-10",
    tanggalKeluar: "2026-05-28",
    statusStok: "Aman"
  },
  {
    id: "STK-H02",
    kodeBarang: "APD-HLM-YLW",
    namaBarang: "Helm Safety Yellow (Operator & Helper)",
    kategori: "Helm Safety",
    lokasiPenyimpanan: "Gudang Logistik Utama (Site A)",
    jumlahStok: 85,
    minimumStok: 15,
    tanggalMasuk: "2026-01-10",
    tanggalKeluar: "2026-05-29",
    statusStok: "Aman"
  },
  {
    id: "STK-H03",
    kodeBarang: "APD-HLM-BLU",
    namaBarang: "Helm Safety Blue (Contractor & Advisor)",
    kategori: "Helm Safety",
    lokasiPenyimpanan: "Gudang Logistik Utama (Site A)",
    jumlahStok: 4,
    minimumStok: 10,
    tanggalMasuk: "2026-02-15",
    tanggalKeluar: "2026-05-25",
    statusStok: "Stok Rendah"
  },
  {
    id: "STK-H04",
    kodeBarang: "APD-HLM-GRN",
    namaBarang: "Helm Safety Green (HSE Officers & Inspector)",
    kategori: "Helm Safety",
    lokasiPenyimpanan: "Gudang Logistik Utama (Site A)",
    jumlahStok: 12,
    minimumStok: 5,
    tanggalMasuk: "2026-02-15",
    tanggalKeluar: "2026-05-20",
    statusStok: "Aman"
  },
  {
    id: "STK-H05",
    kodeBarang: "APD-HLM-RED",
    namaBarang: "Helm Safety Red (Fire Force & Emergency)",
    kategori: "Helm Safety",
    lokasiPenyimpanan: "Gudang Logistik Utama (Site A)",
    jumlahStok: 0,
    minimumStok: 5,
    tanggalMasuk: "2026-02-15",
    tanggalKeluar: "2026-05-18",
    statusStok: "Habis"
  },
  // Pakaian Kerja / Wearpack
  {
    id: "STK-W01",
    kodeBarang: "APD-WPK-ORG-M",
    namaBarang: "Pakaian Kerja Wearpack Orange (Reflector) - M",
    kategori: "Pakaian Kerja",
    lokasiPenyimpanan: "Gudang Logistik Utama (Site A)",
    jumlahStok: 24,
    minimumStok: 8,
    tanggalMasuk: "2026-03-01",
    tanggalKeluar: "2026-05-26",
    statusStok: "Aman"
  },
  {
    id: "STK-W02",
    kodeBarang: "APD-WPK-ORG-L",
    namaBarang: "Pakaian Kerja Wearpack Orange (Reflector) - L",
    kategori: "Pakaian Kerja",
    lokasiPenyimpanan: "Gudang Logistik Utama (Site A)",
    jumlahStok: 35,
    minimumStok: 8,
    tanggalMasuk: "2026-03-01",
    tanggalKeluar: "2026-05-29",
    statusStok: "Aman"
  },
  {
    id: "STK-W03",
    kodeBarang: "APD-WPK-ORG-XL",
    namaBarang: "Pakaian Kerja Wearpack Orange (Reflector) - XL",
    kategori: "Pakaian Kerja",
    lokasiPenyimpanan: "Gudang Logistik Utama (Site A)",
    jumlahStok: 18,
    minimumStok: 8,
    tanggalMasuk: "2026-03-01",
    tanggalKeluar: "2026-05-29",
    statusStok: "Aman"
  },
  {
    id: "STK-W04",
    kodeBarang: "APD-WPK-ORG-XXL",
    namaBarang: "Pakaian Kerja Wearpack Orange (Reflector) - XXL",
    kategori: "Pakaian Kerja",
    lokasiPenyimpanan: "Gudang Logistik Utama (Site A)",
    jumlahStok: 3,
    minimumStok: 5,
    tanggalMasuk: "2026-03-01",
    tanggalKeluar: "2026-05-20",
    statusStok: "Stok Rendah"
  },
  // Kacamata Safety
  {
    id: "STK-K01",
    kodeBarang: "APD-KCM-CLR",
    namaBarang: "Kacamata Safety Lexan - Clear Lens",
    kategori: "Kacamata Safety",
    lokasiPenyimpanan: "Rak Logistik Bagian A2",
    jumlahStok: 60,
    minimumStok: 15,
    tanggalMasuk: "2026-04-12",
    tanggalKeluar: "2026-05-28",
    statusStok: "Aman"
  },
  {
    id: "STK-K02",
    kodeBarang: "APD-KCM-DRK",
    namaBarang: "Kacamata Safety Lexan - Dark Smoke Lens (Field)",
    kategori: "Kacamata Safety",
    lokasiPenyimpanan: "Rak Logistik Bagian A2",
    jumlahStok: 52,
    minimumStok: 15,
    tanggalMasuk: "2026-04-12",
    tanggalKeluar: "2026-05-29",
    statusStok: "Aman"
  },
  // Sarung Tangan
  {
    id: "STK-S01",
    kodeBarang: "APD-GLV-KTN",
    namaBarang: "Sarung Tangan Rajut Katun Bintik Karet",
    kategori: "Sarung Tangan",
    lokasiPenyimpanan: "Rak Logistik Bagian C3",
    jumlahStok: 120,
    minimumStok: 30,
    tanggalMasuk: "2026-05-01",
    tanggalKeluar: "2026-05-29",
    statusStok: "Aman"
  },
  {
    id: "STK-S02",
    kodeBarang: "APD-GLV-KRT",
    namaBarang: "Sarung Tangan Safety Coating Latex (Karet)",
    kategori: "Sarung Tangan",
    lokasiPenyimpanan: "Rak Logistik Bagian C3",
    jumlahStok: 8,
    minimumStok: 20,
    tanggalMasuk: "2026-05-01",
    tanggalKeluar: "2026-05-27",
    statusStok: "Stok Rendah"
  },
  {
    id: "STK-S03",
    kodeBarang: "APD-GLV-LTH",
    namaBarang: "Sarung Tangan Kulit Full Leather (Heavy Duty)",
    kategori: "Sarung Tangan",
    lokasiPenyimpanan: "Rak Logistik Bagian C3",
    jumlahStok: 42,
    minimumStok: 15,
    tanggalMasuk: "2026-05-01",
    tanggalKeluar: "2026-05-25",
    statusStok: "Aman"
  },
  // Sepatu Safety
  {
    id: "STK-SP01",
    kodeBarang: "APD-SPT-41",
    namaBarang: "Sepatu Safety Kulit High-Wall Impact Steel Toe - 41",
    kategori: "Sepatu Safety",
    lokasiPenyimpanan: "Gudang Sepatu Blk D",
    jumlahStok: 16,
    minimumStok: 5,
    tanggalMasuk: "2026-02-20",
    tanggalKeluar: "2026-05-24",
    statusStok: "Aman"
  },
  {
    id: "STK-SP02",
    kodeBarang: "APD-SPT-42",
    namaBarang: "Sepatu Safety Kulit High-Wall Impact Steel Toe - 42",
    kategori: "Sepatu Safety",
    lokasiPenyimpanan: "Gudang Sepatu Blk D",
    jumlahStok: 22,
    minimumStok: 5,
    tanggalMasuk: "2026-02-20",
    tanggalKeluar: "2026-05-28",
    statusStok: "Aman"
  },
  {
    id: "STK-SP03",
    kodeBarang: "APD-SPT-43",
    namaBarang: "Sepatu Safety Kulit High-Wall Impact Steel Toe - 43",
    kategori: "Sepatu Safety",
    lokasiPenyimpanan: "Gudang Sepatu Blk D",
    jumlahStok: 2,
    minimumStok: 5,
    tanggalMasuk: "2026-02-20",
    tanggalKeluar: "2026-05-28",
    statusStok: "Stok Rendah"
  },
  {
    id: "STK-SP04",
    kodeBarang: "APD-SPT-44",
    namaBarang: "Sepatu Safety Kulit High-Wall Impact Steel Toe - 44",
    kategori: "Sepatu Safety",
    lokasiPenyimpanan: "Gudang Sepatu Blk D",
    jumlahStok: 14,
    minimumStok: 5,
    tanggalMasuk: "2026-02-20",
    tanggalKeluar: "2026-05-20",
    statusStok: "Aman"
  },
  // Radio HT
  {
    id: "STK-HT01",
    kodeBarang: "APD-TEL-HTD",
    namaBarang: "Radio Komunikasi Motorola HT Digital XTS",
    kategori: "Radio/HT",
    lokasiPenyimpanan: "Rak Logistik Bagian E1 (Elektronik)",
    jumlahStok: 15,
    minimumStok: 5,
    tanggalMasuk: "2026-04-10",
    tanggalKeluar: "2026-05-29",
    statusStok: "Aman"
  },
  {
    id: "STK-HT02",
    kodeBarang: "APD-TEL-HTA",
    namaBarang: "Radio Komunikasi standard HT Analog Icom",
    kategori: "Radio/HT",
    lokasiPenyimpanan: "Rak Logistik Bagian E1 (Elektronik)",
    jumlahStok: 28,
    minimumStok: 5,
    tanggalMasuk: "2026-04-10",
    tanggalKeluar: "2026-05-24",
    statusStok: "Aman"
  }
];

export const initialPengajuan: PengajuanAPD[] = [
  {
    id: "REQ-00012",
    nomorPengajuan: "REQ/WPA/2026/05/0012",
    tanggalPengajuan: "2026-05-28",
    karyawanNik: "WPA-21045",
    namaKaryawan: "Rian Hidayat",
    jabatan: "Operator Dump Truck",
    departemen: "Mining Production",
    masaKerja: "5 Tahun 1 Bulan 15 Hari",
    alasanPengajuan: "Penggantian Rusak",
    checklist: {
      bangkaiDiserahkan: true,
      hilangDiaporkan: true,
      rusakDiassess: true,
      persetujuanAtasan: true
    },
    items: [
      { id: "ri-1", kategori: "Pakaian Kerja", detail: "Size L", jumlah: 2 },
      { id: "ri-2", kategori: "Sepatu Safety", detail: "Ukuran 42", jumlah: 1 }
    ],
    statusAlur: "Selesai",
    verifikasiHse: {
      petugas: "Ilham Akbar Rialdin (HSE Coordinator)",
      rekomendasi: "Disetujui",
      catatan: "Bangkai Wearpack lama sobek karena tersangkut, sepatu sol mengelupas. Layak dilakukan penggantian.",
      tanggal: "2026-05-28",
      ttd: "IlhamAR_HSE_2026"
    },
    pemeriksaanGa: {
      petugas: "Heri Tan (GA Gudang)",
      statusStok: "Stok Available",
      catatan: "Ukuran L dan Sepatu 42 tersedia lengkap di Rak D dan Wearpack Blok B.",
      nomorStokKeluar: "STK-OUT-2026-05221",
      tanggal: "2026-05-29",
      ttd: "HeriT_GA_2026"
    },
    pelaporanHrd: {
      petugas: "Moh. Irfan (HRD Administrator)",
      tanggal: "2026-05-29",
      statusArsip: "ARSIP/DIG/WPA/0052",
      catatan: "Data riwayat APD ter-update di file sirkulasi karyawan WPA-21045."
    },
    serahTerima: {
      tanggal: "2026-05-30",
      penerimaTtd: "RianHidayat_WPA",
      fotoSerahTerima: "https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?q=80&w=300&h=200&fit=crop", // placeholder of mining construction worker holding equipment
      qrCode: "QR-WPA-REQ-00012-DONE"
    }
  },
  {
    id: "REQ-00013",
    nomorPengajuan: "REQ/WPA/2026/05/0013",
    tanggalPengajuan: "2026-05-29",
    karyawanNik: "WPA-23112",
    namaKaryawan: "Adi Wijaya",
    jabatan: "Mechanic Heavy Equipment",
    departemen: "Engineering Maintenance",
    masaKerja: "2 Tahun 6 Bulan 29 Hari",
    alasanPengajuan: "Penggantian Rusak",
    checklist: {
      bangkaiDiserahkan: true,
      hilangDiaporkan: false, // Hilang is false, but bangkai diserahkan is true, so valid for replacement
      rusakDiassess: true,
      persetujuanAtasan: true
    },
    items: [
      { id: "ri-3", kategori: "Kacamata Safety", detail: "Clear Lens", jumlah: 1 },
      { id: "ri-4", kategori: "Sarung Tangan", detail: "Coating Latex (Karet)", jumlah: 1 }
    ],
    statusAlur: "Persetujuan GA",
    verifikasiHse: {
      petugas: "Ilham Akbar Rialdin (HSE Coordinator)",
      rekomendasi: "Disetujui",
      catatan: "Kacamata safety baret parah akibat cipratan gram besi. Sarung tangan latex sobek robek oli. Verifikasi ok.",
      tanggal: "2026-05-29",
      ttd: "IlhamAR_HSE_2026"
    },
    pemeriksaanGa: null,
    pelaporanHrd: null,
    serahTerima: null
  },
  {
    id: "REQ-00014",
    nomorPengajuan: "REQ/WPA/2026/05/0014",
    tanggalPengajuan: "2026-05-30",
    karyawanNik: "WPA-24018",
    namaKaryawan: "Rahmat Santoso",
    jabatan: "Blaster (Juru Ledak)",
    departemen: "Drill & Blast Operational",
    masaKerja: "2 Tahun 4 Bulan 12 Hari",
    alasanPengajuan: "APD Baru",
    checklist: {
      bangkaiDiserahkan: false,
      hilangDiaporkan: true, // Hilang dilaporkan, checked.
      rusakDiassess: true,
      persetujuanAtasan: true
    },
    items: [
      { id: "ri-5", kategori: "Radio/HT", detail: "HT Digital Motorola", jumlah: 1 }
    ],
    statusAlur: "Verifikasi HSE",
    verifikasiHse: null,
    pemeriksaanGa: null,
    pelaporanHrd: null,
    serahTerima: null
  }
];

export const initialPengembalian: PengembalianAPD[] = [
  {
    id: "RET-00001",
    nomorPengembalian: "RET/WPA/2026/05/0001",
    tanggalPengembalian: "2026-05-27",
    karyawanNik: "WPA-21045",
    namaKaryawan: "Rian Hidayat",
    jabatan: "Operator Dump Truck",
    departemen: "Mining Production",
    jenisApd: "Wearpack Orange & Sepatu Safety",
    kondisi: "Rusak Berat",
    fotoApd: "https://images.unsplash.com/photo-1540821922493-0095513ab87a?q=80&w=300",
    fotoBangkaiApd: "https://images.unsplash.com/photo-1540821922493-0095513ab87a?q=80&w=300",
    statusVerifikasi: "Diterima",
    catatanVerifikasi: "Bangkai wearpack sobek dan sepatu bolong sol baja. Sesuai kriteria rusak berat operasional.",
    petugasHse: "Ilham Akbar Rialdin (HSE Coordinator)",
    tanggalVerifikasi: "2026-05-28"
  },
  {
    id: "RET-00002",
    nomorPengembalian: "RET/WPA/2026/05/0002",
    tanggalPengembalian: "2026-05-30",
    karyawanNik: "WPA-23112",
    namaKaryawan: "Adi Wijaya",
    jabatan: "Mechanic Heavy Equipment",
    departemen: "Engineering Maintenance",
    jenisApd: "Helm Safety Kuning",
    kondisi: "Rusak Ringan",
    fotoApd: "https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?q=80&w=300",
    fotoBangkaiApd: "https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?q=80&w=300",
    statusVerifikasi: "Menunggu Verifikasi",
    catatanVerifikasi: "",
    petugasHse: "",
    tanggalVerifikasi: ""
  }
];

export const initialExitClearance: ExitClearance[] = [
  {
    id: "CLR-00001",
    karyawanNik: "WPA-20119",
    namaKaryawan: "Budi Santoso",
    jabatan: "Driller Operator",
    departemen: "Drill & Blast Operational",
    tanggalKeluar: "2026-05-30",
    alasanKeluar: "Resign",
    itemsChecklist: [
      { item: "Helm Safety", status: "Sudah Dikembalikan", catatan: "Kondisi Baik - Helm Kuning" },
      { item: "Pakaian Kerja", status: "Sudah Dikembalikan", catatan: "Kondisi Layak - 2 pasang" },
      { item: "Kacamata Safety", status: "Sudah Dikembalikan", catatan: "Baret Ringan" },
      { item: "Sarung Tangan", status: "Sudah Dikembalikan", catatan: "Hancur Fisik diserahkan" },
      { item: "Sepatu Safety", status: "Sudah Dikembalikan", catatan: "Kondisi Aus tapak bawah" },
      { item: "Radio/HT", status: "Sudah Dikembalikan", catatan: "HT Motorola dengan Charger lengkap" }
    ],
    statusClearance: "Clearance Lengkap",
    verifikasiHse: {
      petugas: "Ilham Akbar Rialdin (HSE)",
      status: true,
      catatan: "Seluruh APD operasional drill & blast telah dikembalikan ke pos HSE & dilakukan serah terima.",
      ttd: "IlhamAR_HSE_2026",
      tanggal: "2026-05-29"
    },
    verifikasiGa: {
      petugas: "Heri Tan (GA)",
      status: true,
      catatan: "Radio HT & kelengkapan inventaris GA terverifikasi aman.",
      ttd: "HeriT_GA_2026",
      tanggal: "2026-05-29"
    },
    verifikasiHrd: {
      petugas: "Moh. Irfan (HRD)",
      status: true,
      catatan: "Clearance disetujui. Dapat memproses pencairan kas bonus akhir.",
      ttd: "MohIrfan_HRD_2026",
      tanggal: "2026-05-30"
    }
  },
  {
    id: "CLR-00002",
    karyawanNik: "WPA-23049",
    namaKaryawan: "Hendriyanto",
    jabatan: "Surveyor Assistant",
    departemen: "Geology & Pit Control",
    tanggalKeluar: "2026-05-28",
    alasanKeluar: "PHK",
    itemsChecklist: [
      { item: "Helm Safety", status: "Sudah Dikembalikan", catatan: "Helm Biru" },
      { item: "Pakaian Kerja", status: "Sudah Dikembalikan", catatan: "Masa pakai sobek" },
      { item: "Kacamata Safety", status: "Belum Dikembalikan", catatan: "Tertinggal di mess" },
      { item: "Sarung Tangan", status: "Tidak Memiliki", catatan: "" },
      { item: "Sepatu Safety", status: "Belum Dikembalikan", catatan: "Sedang dijemur di mess" },
      { item: "Radio/HT", status: "Tidak Memiliki", catatan: "" }
    ],
    statusClearance: "Belum Lengkap",
    verifikasiHse: {
      petugas: "Ilham Akbar Rialdin (HSE)",
      status: false,
      catatan: "Kacamata dan Sepatu belum diserahkan ke kontainer HSE. Mohon segera disusulkan.",
      ttd: "IlhamAR_HSE_2026",
      tanggal: "2026-05-28"
    },
    verifikasiGa: {
      petugas: "Heri Tan (GA)",
      status: true,
      catatan: "Tidak memegang radio atau barang inventaris GA.",
      ttd: "HeriT_GA_2026",
      tanggal: "2026-05-28"
    },
    verifikasiHrd: null
  }
];

export const initialAuditTrail: AuditTrail[] = [
  {
    id: "AUD-001",
    timestamp: "2026-05-28 08:30:15",
    user: "System Daemon",
    role: "Admin",
    aktivitas: "Inisialisasi Database",
    rincian: "Database APD dan Master Karyawan PT Watu Perkasa Abadi berhasil disinkronisasi.",
    status: "Berhasil"
  },
  {
    id: "AUD-002",
    timestamp: "2026-05-28 10:15:22",
    user: "Ilham Akbar Rialdin (HSE Coordinator)",
    role: "HSE",
    aktivitas: "Persetujuan Assessment APD",
    rincian: "Melakukan verifikasi kerusakan wearpack NIK WPA-21045 dengan rekomendasi Disetujui.",
    status: "Berhasil"
  },
  {
    id: "AUD-003",
    timestamp: "2026-05-29 11:42:01",
    user: "Heri Tan (GA Gudang)",
    role: "GA",
    aktivitas: "Pengeluaran Stok Logistik",
    rincian: "Mengeluarkan item Wearpack L (2) dan Sepatu 42 (1) untuk pengajuan REQ-00012.",
    status: "Berhasil"
  },
  {
    id: "AUD-004",
    timestamp: "2026-05-29 14:15:30",
    user: "Moh. Irfan (HRD Admin)",
    role: "HRD",
    aktivitas: "Pengarsipan Riwayat APD",
    rincian: "Mencatat nomor arsip ARSIP/DIG/WPA/0052 ke dalam sistem riwayat digital karyawan.",
    status: "Berhasil"
  },
  {
    id: "AUD-005",
    timestamp: "2026-05-30 08:12:05",
    user: "Ilham Akbar Rialdin",
    role: "HSE",
    aktivitas: "Serah Terima APD",
    rincian: "Merekam tanda tangan digital serah terima karyawan Rian Hidayat dengan scan QR Code.",
    status: "Berhasil"
  }
];
