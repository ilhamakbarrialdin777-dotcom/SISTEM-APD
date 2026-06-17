/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PerubahanKaryawan {
  tanggal: string;
  petugas: string;
  aktivitas: string;
  detail: string;
}

export interface Karyawan {
  nik: string; // NIK as unique key
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  nomorHp: string;
  alamat: string;
  jabatan: string;
  departemen: string;
  site: string;
  atasanLangsung: string;
  statusKaryawan: 'PKWT' | 'PKWTT' | 'Kontraktor' | 'Magang';
  tanggalBergabung: string;
  nomorBpjsKesehatan: string;
  nomorBpjsKetenagakerjaan: string;
  ukuranBaju: 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
  ukuranSepatu: '39' | '40' | '41' | '42' | '43' | '44' | '45' | '46';
  fotoKaryawan: string; // Base64 or standard asset url
  statusAktif: 'Aktif' | 'Nonaktif' | 'Resign' | 'PHK';
  arsip: boolean;
  historyPerubahan: PerubahanKaryawan[];
}

export interface RequestItem {
  id: string;
  kategori: string;
  detail: string; // Detail like Putih, Kuning, S, M, Clear, Katun, etc.
  jumlah: number;
}

export interface PengajuanAPD {
  id: string;
  nomorPengajuan: string;
  tanggalPengajuan: string;
  karyawanNik: string;
  namaKaryawan: string;
  jabatan: string;
  departemen: string;
  masaKerja: string;
  alasanPengajuan: 'APD Baru' | 'Penggantian Rusak' | 'Penggantian Hilang' | 'Penambahan Kebutuhan Kerja' | 'Mutasi Jabatan' | 'Karyawan Baru';
  checklist: {
    bangkaiDiserahkan: boolean;
    hilangDiaporkan: boolean;
    rusakDiassess: boolean;
    persetujuanAtasan: boolean;
  };
  items: RequestItem[];
  statusAlur: 'Verifikasi HSE' | 'Persetujuan GA' | 'Pelaporan HRD' | 'Serah Terima' | 'Selesai';
  // Tahap 2: HSE
  verifikasiHse: {
    petugas: string; // Ilham Akbar Rialdin
    rekomendasi: 'Disetujui' | 'Ditolak' | 'Revisi';
    catatan: string;
    tanggal: string;
    ttd: string;
  } | null;
  // Tahap 3: GA
  pemeriksaanGa: {
    petugas: string; // Heri Tan
    statusStok: 'Stok Available' | 'Stok Unavailable' | 'Pengadaan Diperlukan';
    catatan: string;
    nomorStokKeluar: string;
    tanggal: string;
    ttd: string;
  } | null;
  // Tahap 4: HRD
  pelaporanHrd: {
    petugas: string; // Moh. Irfan
    tanggal: string;
    statusArsip: string;
    catatan: string;
  } | null;
  // Tahap 5: Serah Terima
  serahTerima: {
    tanggal: string;
    penerimaTtd: string;
    fotoSerahTerima: string;
    qrCode: string;
  } | null;
}

export interface PengembalianAPD {
  id: string;
  nomorPengembalian: string;
  tanggalPengembalian: string;
  karyawanNik: string;
  namaKaryawan: string;
  jabatan: string;
  departemen: string;
  jenisApd: string;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Tidak Layak Pakai' | 'Hilang';
  fotoApd: string;
  fotoBangkaiApd: string;
  statusVerifikasi: 'Menunggu Verifikasi' | 'Diterima' | 'Ditolak' | 'Assessment Lanjutan';
  catatanVerifikasi: string;
  petugasHse: string; // Ilham Akbar Rialdin
  tanggalVerifikasi: string;
}

export interface StockItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  lokasiPenyimpanan: string;
  jumlahStok: number;
  minimumStok: number;
  tanggalMasuk: string;
  tanggalKeluar: string;
  statusStok: 'Aman' | 'Stok Rendah' | 'Habis';
}

export interface ExitClearance {
  id: string;
  karyawanNik: string;
  namaKaryawan: string;
  jabatan: string;
  departemen: string;
  tanggalKeluar: string;
  alasanKeluar: 'Resign' | 'PHK';
  itemsChecklist: {
    item: string;
    status: 'Sudah Dikembalikan' | 'Belum Dikembalikan' | 'Tidak Memiliki' | 'Hilang';
    catatan: string;
  }[];
  statusClearance: 'Clearance Lengkap' | 'Belum Lengkap' | 'Menunggu Pengembalian APD';
  verifikasiHse: {
    petugas: string;
    status: boolean;
    catatan: string;
    ttd: string;
    tanggal: string;
  } | null;
  verifikasiGa: {
    petugas: string;
    status: boolean;
    catatan: string;
    ttd: string;
    tanggal: string;
  } | null;
  verifikasiHrd: {
    petugas: string;
    status: boolean;
    catatan: string;
    ttd: string;
    tanggal: string;
  } | null;
}

export interface AuditTrail {
  id: string;
  timestamp: string;
  user: string;
  role: 'Admin' | 'HSE' | 'GA' | 'HRD' | 'Karyawan';
  aktivitas: string;
  rincian: string;
  status: 'Berhasil' | 'Gagal' | 'Sistem';
}

export interface HseKpi {
  complianceRate: number;
  unreturnedCount: number;
  assessmentCount: number;
}
