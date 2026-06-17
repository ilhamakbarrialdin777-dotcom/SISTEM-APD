/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  Users, 
  FileSpreadsheet, 
  ArrowUpRight, 
  RotateCcw, 
  AlertTriangle, 
  Archive, 
  ClipboardCheck, 
  Clock, 
  UserPlus, 
  UserMinus,
  ShieldCheck, 
  TrendingUp, 
  Package,
  Calendar,
  Layers,
  ChevronRight,
  Search,
  Edit2,
  Trash2,
  Save,
  X,
  Plus,
  CheckCircle2,
  Database
} from 'lucide-react';
import { Karyawan, StockItem, PengajuanAPD, PengembalianAPD } from '../types';

interface DashboardViewProps {
  karyawan: Karyawan[];
  setKaryawan: React.Dispatch<React.SetStateAction<Karyawan[]>>;
  stock: StockItem[];
  setStock: React.Dispatch<React.SetStateAction<StockItem[]>>;
  pengajuan: PengajuanAPD[];
  setPengajuan: React.Dispatch<React.SetStateAction<PengajuanAPD[]>>;
  pengembalian: PengembalianAPD[];
  setPengembalian: React.Dispatch<React.SetStateAction<PengembalianAPD[]>>;
  setCurrentMenu: (menu: string) => void;
  addAuditLog: (aktivitas: string, rincian: string, status?: 'Berhasil' | 'Gagal' | 'Sistem') => void;
}

export default function DashboardView({
  karyawan,
  setKaryawan,
  stock,
  setStock,
  pengajuan,
  setPengajuan,
  pengembalian,
  setPengembalian,
  setCurrentMenu,
  addAuditLog
}: DashboardViewProps) {
  // 1. Interactive Dashboard Console States
  const [consoleTab, setConsoleTab] = React.useState<'karyawan' | 'stock' | 'pengajuan' | 'pengembalian'>('karyawan');
  const [consoleSearch, setConsoleSearch] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  // Buffers for edits
  const [editKaryawanFields, setEditKaryawanFields] = React.useState({
    namaLengkap: '',
    jabatan: '',
    departemen: '',
    ukuranBaju: 'L' as any,
    ukuranSepatu: '42' as any,
    statusAktif: 'Aktif' as any
  });

  const [editStockFields, setEditStockFields] = React.useState({
    namaBarang: '',
    kategori: '',
    jumlahStok: 0,
    minimumStok: 0,
    lokasiPenyimpanan: ''
  });

  const [editPengajuanFields, setEditPengajuanFields] = React.useState({
    namaKaryawan: '',
    jabatan: '',
    departemen: '',
    statusAlur: 'Verifikasi HSE' as any
  });

  const [editPengembalianFields, setEditPengembalianFields] = React.useState({
    namaKaryawan: '',
    jenisApd: '',
    kondisi: 'Baik' as any,
    statusVerifikasi: 'Menunggu Verifikasi' as any
  });

  // Adding panel states
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [newKaryawanField, setNewKaryawanField] = React.useState({
    nik: '',
    namaLengkap: '',
    jabatan: '',
    departemen: '',
    ukuranBaju: 'L' as any,
    ukuranSepatu: '42' as any
  });

  const [newStockField, setNewStockField] = React.useState({
    kodeBarang: '',
    namaBarang: '',
    kategori: 'Helm Safety',
    jumlahStok: 50,
    minimumStok: 10,
    lokasiPenyimpanan: 'Rak Utama A'
  });

  const [newPengajuanField, setNewPengajuanField] = React.useState({
    nomorPengajuan: '',
    karyawanName: '',
    alasan: 'APD Baru' as any,
    kategoriApd: 'Helm Safety' as any,
    detailItem: 'Warna Putih'
  });

  const [newPengembalianField, setNewPengembalianField] = React.useState({
    nomorPengembalian: '',
    karyawanName: '',
    jenisApd: 'Helm Safety',
    kondisi: 'Baik' as any
  });

  // Handlers to trigger edits
  const handleStartEditKaryawan = (k: Karyawan) => {
    setEditingId(k.nik);
    setEditKaryawanFields({
      namaLengkap: k.namaLengkap,
      jabatan: k.jabatan,
      departemen: k.departemen,
      ukuranBaju: k.ukuranBaju,
      ukuranSepatu: k.ukuranSepatu,
      statusAktif: k.statusAktif
    });
  };

  const handleStartEditStock = (s: StockItem) => {
    setEditingId(s.id);
    setEditStockFields({
      namaBarang: s.namaBarang,
      kategori: s.kategori,
      jumlahStok: s.jumlahStok,
      minimumStok: s.minimumStok,
      lokasiPenyimpanan: s.lokasiPenyimpanan
    });
  };

  const handleStartEditPengajuan = (p: PengajuanAPD) => {
    setEditingId(p.id);
    setEditPengajuanFields({
      namaKaryawan: p.namaKaryawan,
      jabatan: p.jabatan,
      departemen: p.departemen,
      statusAlur: p.statusAlur
    });
  };

  const handleStartEditPengembalian = (pe: PengembalianAPD) => {
    setEditingId(pe.id);
    setEditPengembalianFields({
      namaKaryawan: pe.namaKaryawan,
      jenisApd: pe.jenisApd,
      kondisi: pe.kondisi,
      statusVerifikasi: pe.statusVerifikasi
    });
  };

  // Actions for modifications
  const handleSaveKaryawan = (nik: string) => {
    setKaryawan(prev => prev.map(k => {
      if (k.nik === nik) {
        return {
          ...k,
          namaLengkap: editKaryawanFields.namaLengkap,
          jabatan: editKaryawanFields.jabatan,
          departemen: editKaryawanFields.departemen,
          ukuranBaju: editKaryawanFields.ukuranBaju,
          ukuranSepatu: editKaryawanFields.ukuranSepatu,
          statusAktif: editKaryawanFields.statusAktif,
          historyPerubahan: [
            {
              tanggal: new Date().toISOString().substring(0, 10),
              petugas: "System Administrator",
              aktivitas: "Edit Cepat Dashboard",
              detail: `Mengubah biodata / kelengkapan via Panel Kendali Cepat.`
            },
            ...k.historyPerubahan
          ]
        };
      }
      return k;
    }));
    addAuditLog("Edit Karyawan Dashboard", `Mengubah data karyawan ${editKaryawanFields.namaLengkap} (${nik}) secara real-time.`);
    setEditingId(null);
  };

  const handleSaveStock = (id: string) => {
    setStock(prev => prev.map(s => {
      if (s.id === id) {
        const total = Number(editStockFields.jumlahStok);
        const minVal = Number(editStockFields.minimumStok);
        return {
          ...s,
          namaBarang: editStockFields.namaBarang,
          kategori: editStockFields.kategori,
          jumlahStok: total,
          minimumStok: minVal,
          lokasiPenyimpanan: editStockFields.lokasiPenyimpanan,
          statusStok: total === 0 ? 'Habis' : total <= minVal ? 'Stok Rendah' : 'Aman'
        };
      }
      return s;
    }));
    addAuditLog("Edit Stok Dashboard", `Mengubah kapasitas / atribut barang ${editStockFields.namaBarang} secara real-time.`);
    setEditingId(null);
  };

  const handleSavePengajuan = (id: string) => {
    setPengajuan(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          namaKaryawan: editPengajuanFields.namaKaryawan,
          jabatan: editPengajuanFields.jabatan,
          departemen: editPengajuanFields.departemen,
          statusAlur: editPengajuanFields.statusAlur
        };
      }
      return p;
    }));
    addAuditLog("Edit Pengajuan Dashboard", `Mengubah alur sirkulasi pengajuan #${id} (${editPengajuanFields.namaKaryawan}) secara real-time.`);
    setEditingId(null);
  };

  const handleSavePengembalian = (id: string) => {
    setPengembalian(prev => prev.map(pe => {
      if (pe.id === id) {
        return {
          ...pe,
          namaKaryawan: editPengembalianFields.namaKaryawan,
          jenisApd: editPengembalianFields.jenisApd,
          kondisi: editPengembalianFields.kondisi,
          statusVerifikasi: editPengembalianFields.statusVerifikasi
        };
      }
      return pe;
    }));
    addAuditLog("Edit Pengembalian Dashboard", `Mengubah data pengembalian APD lama #${id} secara real-time.`);
    setEditingId(null);
  };

  // Actions for Deletes
  const handleDeleteKaryawan = (nik: string, nama: string) => {
    if (confirm(`Konfirmasi Hapus: Apakah Anda yakin ingin mematikan / menghapus karyawan ${nama} (${nik})? Tindakan ini akan tersimpan otomatis.`)) {
      setKaryawan(prev => prev.filter(k => k.nik !== nik));
      addAuditLog("Hapus Karyawan Dashboard", `Menghapus karyawan ${nama} (${nik}) dari database master.`);
    }
  };

  const handleDeleteStock = (id: string, nama: string) => {
    if (confirm(`Konfirmasi Hapus: Apakah Anda yakin ingin menghapus barang ${nama} dari rak logistik? Tindakan ini akan tersimpan otomatis.`)) {
      setStock(prev => prev.filter(s => s.id !== id));
      addAuditLog("Hapus Stok Dashboard", `Menghapus inventaris ${nama} (ID: ${id}) dari database.`);
    }
  };

  const handleDeletePengajuan = (id: string, nomor: string) => {
    if (confirm(`Konfirmasi Hapus: Apakah Anda yakin ingin membatalkan/menghapus berkas transaksi pengajuan ${nomor}? Tindakan ini akan tersimpan otomatis.`)) {
      setPengajuan(prev => prev.filter(p => p.id !== id));
      addAuditLog("Hapus Pengajuan Dashboard", `Menghapus dokumen pengajuan ${nomor} dari sistem.`);
    }
  };

  const handleDeletePengembalian = (id: string, nomor: string) => {
    if (confirm(`Konfirmasi Hapus: Apakah Anda yakin ingin mematikan berkas transaksi pengembalian APD ${nomor}? Tindakan ini akan tersimpan otomatis.`)) {
      setPengembalian(prev => prev.filter(pe => pe.id !== id));
      addAuditLog("Hapus Pengembalian Dashboard", `Menghapus berkas pengembalian ${nomor} dari sistem.`);
    }
  };

  // Actions for Additions
  const handleAddNewKaryawan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKaryawanField.nik || !newKaryawanField.namaLengkap) {
      alert('NIK dan Nama Lengkap wajib diisi!');
      return;
    }
    const duplicate = karyawan.find(k => k.nik === newKaryawanField.nik);
    if (duplicate) {
      alert('Gagal: NIK karyawan sudah terdaftar dalam sistem!');
      return;
    }

    const newItem: Karyawan = {
      nik: newKaryawanField.nik,
      namaLengkap: newKaryawanField.namaLengkap,
      tempatLahir: "Samarinda",
      tanggalLahir: "1995-10-10",
      jenisKelamin: "Laki-laki",
      nomorHp: "081234567890",
      alamat: "Mess Site Sanga-Sanga",
      jabatan: newKaryawanField.jabatan || "Helper Lapangan",
      departemen: newKaryawanField.departemen || "Produksi",
      site: "Site WPA-A (Sanga-Sanga)",
      atasanLangsung: "Supervisor",
      statusKaryawan: "PKWT",
      tanggalBergabung: new Date().toISOString().substring(0, 10),
      nomorBpjsKesehatan: "0001928373",
      nomorBpjsKetenagakerjaan: "260982345",
      ukuranBaju: newKaryawanField.ukuranBaju,
      ukuranSepatu: newKaryawanField.ukuranSepatu,
      fotoKaryawan: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150",
      statusAktif: "Aktif",
      arsip: false,
      historyPerubahan: []
    };

    setKaryawan(prev => [...prev, newItem]);
    addAuditLog("Tambah Karyawan Dashboard", `Menambahkan karyawan baru ${newItem.namaLengkap} (${newItem.nik}) secara cepat.`);
    setNewKaryawanField({
      nik: '',
      namaLengkap: '',
      jabatan: '',
      departemen: '',
      ukuranBaju: 'L',
      ukuranSepatu: '42'
    });
    setIsAddingNew(false);
  };

  const handleAddNewStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockField.kodeBarang || !newStockField.namaBarang) {
      alert('Kode Barang dan Nama Barang wajib diisi!');
      return;
    }
    const duplicate = stock.find(s => s.kodeBarang === newStockField.kodeBarang);
    if (duplicate) {
      alert('Gagal: Kode barang sudah terdaftar!');
      return;
    }

    const newItem: StockItem = {
      id: `stk-${Date.now()}`,
      kodeBarang: newStockField.kodeBarang,
      namaBarang: newStockField.namaBarang,
      kategori: newStockField.kategori,
      lokasiPenyimpanan: newStockField.lokasiPenyimpanan,
      jumlahStok: Number(newStockField.jumlahStok),
      minimumStok: Number(newStockField.minimumStok),
      tanggalMasuk: new Date().toISOString().substring(0, 10),
      tanggalKeluar: '-',
      statusStok: Number(newStockField.jumlahStok) <= Number(newStockField.minimumStok) ? 'Stok Rendah' : 'Aman'
    };

    setStock(prev => [...prev, newItem]);
    addAuditLog("Tambah Stok Dashboard", `Menambahkan item stock baru ${newItem.namaBarang} (${newItem.kodeBarang}).`);
    setNewStockField({
      kodeBarang: '',
      namaBarang: '',
      kategori: 'Helm Safety',
      jumlahStok: 50,
      minimumStok: 10,
      lokasiPenyimpanan: 'Rak Utama A'
    });
    setIsAddingNew(false);
  };

  const handleAddNewPengajuan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPengajuanField.nomorPengajuan || !newPengajuanField.karyawanName) {
      alert('Nomor Pengajuan dan Karyawan wajib diisi/dipilih!');
      return;
    }

    const selectedEmployee = karyawan.find(k => k.namaLengkap === newPengajuanField.karyawanName);
    const nik = selectedEmployee ? selectedEmployee.nik : 'WPA-MOCK';

    const newItem: PengajuanAPD = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      nomorPengajuan: newPengajuanField.nomorPengajuan,
      tanggalPengajuan: new Date().toISOString().substring(0, 10),
      karyawanNik: nik,
      namaKaryawan: newPengajuanField.karyawanName,
      jabatan: selectedEmployee?.jabatan || "Karyawan Lapangan",
      departemen: selectedEmployee?.departemen || "Produksi",
      masaKerja: "1 Tahun",
      alasanPengajuan: newPengajuanField.alasan,
      checklist: {
        bangkaiDiserahkan: true,
        hilangDiaporkan: false,
        rusakDiassess: true,
        persetujuanAtasan: true
      },
      items: [
        {
          id: `it-${Date.now().toString().slice(-3)}`,
          kategori: newPengajuanField.kategoriApd,
          detail: newPengajuanField.detailItem,
          jumlah: 1
        }
      ],
      statusAlur: "Verifikasi HSE",
      verifikasiHse: null,
      pemeriksaanGa: null,
      pelaporanHrd: null,
      serahTerima: null
    };

    setPengajuan(prev => [...prev, newItem]);
    addAuditLog("Tambah Pengajuan Dashboard", `Membuat pengajuan APD cepat #${newItem.nomorPengajuan}.`);
    setNewPengajuanField({
      nomorPengajuan: '',
      karyawanName: '',
      alasan: 'APD Baru',
      kategoriApd: 'Helm Safety',
      detailItem: 'Warna Putih'
    });
    setIsAddingNew(false);
  };

  const handleAddNewPengembalian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPengembalianField.nomorPengembalian || !newPengembalianField.karyawanName) {
      alert('Nomor Pengembalian dan Karyawan wajib diisi!');
      return;
    }

    const selectedEmployee = karyawan.find(k => k.namaLengkap === newPengembalianField.karyawanName);
    const nik = selectedEmployee ? selectedEmployee.nik : 'WPA-MOCK';

    const newItem: PengembalianAPD = {
      id: `RET-${Date.now().toString().slice(-4)}`,
      nomorPengembalian: newPengembalianField.nomorPengembalian,
      tanggalPengembalian: new Date().toISOString().substring(0, 10),
      karyawanNik: nik,
      namaKaryawan: newPengembalianField.karyawanName,
      jabatan: selectedEmployee?.jabatan || "Operator Lapangan",
      departemen: selectedEmployee?.departemen || "Produksi",
      jenisApd: newPengembalianField.jenisApd,
      kondisi: newPengembalianField.kondisi,
      fotoApd: "https://images.unsplash.com/photo-1599819861519-c5b47a21cef7?q=80&w=200",
      fotoBangkaiApd: "https://images.unsplash.com/photo-1599819861519-c5b47a21cef7?q=80&w=200",
      statusVerifikasi: "Menunggu Verifikasi",
      catatanVerifikasi: "Pengembalian cepat via dashboard",
      petugasHse: "Ilham Akbar Rialdin (HSE)",
      tanggalVerifikasi: "-"
    };

    setPengembalian(prev => [...prev, newItem]);
    addAuditLog("Tambah Pengembalian Dashboard", `Membuat transaksi pengembalian cepat #${newItem.nomorPengembalian}.`);
    setNewPengembalianField({
      nomorPengembalian: '',
      karyawanName: '',
      jenisApd: 'Helm Safety',
      kondisi: 'Baik'
    });
    setIsAddingNew(false);
  };

  // 2. Calculations based on active collection states
  const totalKaryawanAktif = karyawan.filter(k => k.statusAktif === 'Aktif').length;
  const totalPengajuan = pengajuan.length;
  
  // Calculate total items issued (sum of items in "Selesai" status)
  const totalApdDikeluarkan = pengajuan
    .filter(p => p.statusAlur === 'Selesai')
    .reduce((sum, p) => sum + p.items.reduce((iSum, item) => iSum + item.jumlah, 0), 0);

  // Total items returned
  const totalApdDikembalikan = pengembalian.length;

  // Total damaged APD items (Kondisi Rusak Ringan, Rusak Berat, Tidak Layak Pakai)
  const totalApdRusakBangkai = pengembalian.filter(r => 
    r.kondisi === 'Rusak Berat' || r.kondisi === 'Rusak Ringan' || r.kondisi === 'Tidak Layak Pakai'
  ).length;

  // Sum of available safety stock
  const totalStokTersedia = stock.reduce((sum, s) => sum + s.jumlahStok, 0);

  // Pending approvals (status "Verifikasi HSE" or "Persetujuan GA")
  const pengajuanMenungguPersetujuan = pengajuan.filter(p => 
    p.statusAlur === 'Verifikasi HSE' || p.statusAlur === 'Persetujuan GA'
  ).length;

  // Completed requests
  const pengajuanSelesai = pengajuan.filter(p => p.statusAlur === 'Selesai').length;

  // Inactive / separated employees
  const karyawanResign = karyawan.filter(k => k.statusAktif === 'Resign').length;
  const karyawanPhk = karyawan.filter(k => k.statusAktif === 'PHK').length;

  // --- Sub KPIs dashboards data ---
  // Compliance rate (items returned out of expected replacement requests)
  const complianceRate = totalPengajuan > 0 
    ? Math.round(((totalApdDikembalikan + 5) / (totalPengajuan + 5)) * 100) 
    : 85;

  // Dynamically compute stock levels per category for Chart B
  const getStockMetric = (keyword: string) => {
    const matched = stock.filter(s => {
      const catLower = s.kategori.toLowerCase();
      const nameLower = s.namaBarang.toLowerCase();
      const kwLower = keyword.toLowerCase();
      return catLower.includes(kwLower) || nameLower.includes(kwLower);
    });
    const available = matched.reduce((sum, s) => sum + s.jumlahStok, 0);
    const min = matched.reduce((sum, s) => sum + s.minimumStok, 0);
    return { available: available || 30, min: min || 10 }; // Fallback to safe defaults if database is emptied
  };

  const chartBData = [
    { cat: 'Helm Safety', ...getStockMetric('Helm'), col: 'bg-orange-500' },
    { cat: 'Pakaian Kerja / Wearpack', ...getStockMetric('Pakaian'), col: 'bg-emerald-500' },
    { cat: 'Kacamata Safety', ...getStockMetric('Kacamata'), col: 'bg-sky-500' },
    { cat: 'Sarung Tangan Kulit/Karet', ...getStockMetric('Sarung'), col: 'bg-indigo-500' },
    { cat: 'Sepatu Safety Steel-Toe', ...getStockMetric('Sepatu'), col: 'bg-amber-500' },
    { cat: 'Radio Komunikasi HT', ...getStockMetric('Radio'), col: 'bg-rose-500' }
  ];

  // Dynamically compute size distribution for Chart C (Pakaian & Sepatu)
  const shirtSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;
  const numShirtKaryawan = karyawan.filter(k => k.statusAktif === 'Aktif' && k.ukuranBaju).length || 1;
  const wearpackCounts = shirtSizes.map(sz => {
    const count = karyawan.filter(k => k.ukuranBaju === sz && k.statusAktif === 'Aktif').length;
    return { sz, count, pct: Math.min(100, Math.max(5, Math.round((count / numShirtKaryawan) * 100))) };
  });

  const shoeSizes = ['39', '40', '41', '42', '43', '44', '45'] as const;
  const numShoeKaryawan = karyawan.filter(k => k.statusAktif === 'Aktif' && k.ukuranSepatu).length || 1;
  const shoeCounts = shoeSizes.map(sz => {
    const count = karyawan.filter(k => {
      const sizeNum = parseInt(k.ukuranSepatu);
      const isSizeMatch = k.ukuranSepatu === sz || (sz === '45' && !isNaN(sizeNum) && sizeNum >= 45);
      return isSizeMatch && k.statusAktif === 'Aktif';
    }).length;
    return { sz: sz === '45' ? '45+' : sz, count, pct: Math.min(100, Math.max(5, Math.round((count / numShoeKaryawan) * 100))) };
  });

  return (
    <div className="space-y-6">
      {/* Upper Jumbotron Title bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest">HSE Command Center</p>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
              PT. Watu Perkasa Abadi
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Dashboard Manajemen Alat Pelindung Diri terintegrasi untuk Kepatuhan HSE, Kontrol Stok Gudang, dan Audit HRD.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tanggal Kerja</p>
              <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Calendar size={14} className="text-orange-500" />
                30 Mei 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- TEN (10) DYNAMIC METRICS BOXES IN A HIGH CONTRAST BENTO GRID --- */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Layers size={14} className="text-orange-500" />
          Statistik & Indikator Utama APD
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. Total Karyawan Aktif */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-900 shadow-sm relative overflow-hidden group">
            <div className="absolute right-3 top-3 text-sky-500/10 group-hover:text-sky-500/20 transition-all">
              <Users size={32} />
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate uppercase tracking-widest">Karyawan Aktif</p>
            <h3 className="text-2xl font-black text-white mt-2 font-mono tracking-tight">{totalKaryawanAktif}</h3>
            <div className="flex items-center gap-1 mt-1 text-slate-500 text-[10px]">
              <span className="text-sky-400 font-bold flex items-center">PKWT & PKWTT</span>
            </div>
          </div>

          {/* 2. Total Pengajuan APD */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-900 shadow-sm relative overflow-hidden group" id="kpi-pengajuan">
            <div className="absolute right-3 top-3 text-orange-500/10 group-hover:text-orange-500/20 transition-all">
              <FileSpreadsheet size={32} />
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate uppercase tracking-widest">Total Pengajuan</p>
            <h3 className="text-2xl font-black text-white mt-2 font-mono tracking-tight">{totalPengajuan}</h3>
            <div className="flex items-center gap-1 mt-1 text-slate-500 text-[10px]">
              <span className="text-orange-400 font-bold">Seluruh Alur</span>
            </div>
          </div>

          {/* 3. APD Dikeluarkan */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-900 shadow-sm relative overflow-hidden group">
            <div className="absolute right-3 top-3 text-emerald-500/10 group-hover:text-emerald-500/20 transition-all">
              <ArrowUpRight size={32} />
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate uppercase tracking-widest">APD Dikeluarkan</p>
            <h3 className="text-2xl font-black text-white mt-2 font-mono tracking-tight">{totalApdDikeluarkan} <span className="text-slate-400 text-xs">Pcs</span></h3>
            <div className="flex items-center gap-1 mt-1 text-emerald-400 text-[10px]">
              <span>Tersalurkan ke Site</span>
            </div>
          </div>

          {/* 4. APD Dikembalikan */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-900 shadow-sm relative overflow-hidden group">
            <div className="absolute right-3 top-3 text-indigo-500/10 group-hover:text-indigo-500/20 transition-all">
              <RotateCcw size={32} />
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate uppercase tracking-widest">APD Dikembalikan</p>
            <h3 className="text-2xl font-black text-white mt-2 font-mono tracking-tight">{totalApdDikembalikan} <span className="text-slate-400 text-xs">Pcs</span></h3>
            <div className="flex items-center gap-1 mt-1 text-indigo-400 text-[10px]">
              <span>Masuk Gudang / HSE</span>
            </div>
          </div>

          {/* 5. APD Rusak / Bangkai */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-900 shadow-sm relative overflow-hidden group">
            <div className="absolute right-3 top-3 text-rose-500/10 group-hover:text-rose-500/20 transition-all">
              <AlertTriangle size={32} />
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate uppercase tracking-widest">Bangkai APD Rusak</p>
            <h3 className="text-2xl font-black text-white mt-2 font-mono tracking-tight">{totalApdRusakBangkai} <span className="text-slate-400 text-xs">Unit</span></h3>
            <div className="flex items-center gap-1 mt-1 text-rose-400 text-[10px]">
              <span>Hasil Assessment HSE</span>
            </div>
          </div>

          {/* 6. Stok APD Tersedia */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-900 shadow-sm relative overflow-hidden group">
            <div className="absolute right-3 top-3 text-teal-500/10 group-hover:text-teal-500/20 transition-all">
              <Package size={32} />
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate uppercase tracking-widest">Stok Tersedia</p>
            <h3 className="text-2xl font-black text-white mt-2 font-mono tracking-tight">{totalStokTersedia} <span className="text-slate-400 text-xs">Item</span></h3>
            <div className="flex items-center gap-1 mt-1 text-teal-400 text-[10px]">
              <span>Sirkulasi Gudang GA</span>
            </div>
          </div>

          {/* 7. Pengajuan Menunggu */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-900 shadow-sm relative overflow-hidden group">
            <div className="absolute right-3 top-3 text-pink-500/10 group-hover:text-pink-500/20 transition-all">
              <Clock size={32} />
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate uppercase tracking-widest">Antrean Menunggu</p>
            <h3 className="text-2xl font-black text-amber-400 mt-2 font-mono tracking-tight">{pengajuanMenungguPersetujuan} <span className="text-slate-400 text-xs">Form</span></h3>
            <div className="flex items-center gap-1 mt-1 text-amber-500 text-[10px] font-semibold">
              <span>HSE & GA Approval</span>
            </div>
          </div>

          {/* 8. Pengajuan Selesai */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-900 shadow-sm relative overflow-hidden group">
            <div className="absolute right-3 top-3 text-emerald-500/10 group-hover:text-emerald-500/20 transition-all">
              <ClipboardCheck size={32} />
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate uppercase tracking-widest">Pengajuan Selesai</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-2 font-mono tracking-tight">{pengajuanSelesai}</h3>
            <div className="flex items-center gap-1 mt-1 text-slate-500 text-[10px]">
              <span>Telah Handover & QR</span>
            </div>
          </div>

          {/* 9. Karyawan Resign */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-900 shadow-sm relative overflow-hidden group">
            <div className="absolute right-3 top-3 text-slate-500/10 group-hover:text-slate-500/20 transition-all">
              <UserMinus size={32} />
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate uppercase tracking-widest">Resign (Keluar)</p>
            <h3 className="text-2xl font-black text-slate-300 mt-2 font-mono tracking-tight">{karyawanResign} <span className="text-slate-400 text-xs">Pekerja</span></h3>
            <div className="flex items-center gap-1 mt-1 text-slate-500 text-[10px]">
              <span>Tahun Berjalan 2026</span>
            </div>
          </div>

          {/* 10. Karyawan PHK */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:bg-slate-900 shadow-sm relative overflow-hidden group">
            <div className="absolute right-3 top-3 text-slate-500/10 group-hover:text-slate-500/20 transition-all">
              <Archive size={32} />
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate uppercase tracking-widest">Karyawan PHK</p>
            <h3 className="text-2xl font-black text-rose-300 mt-2 font-mono tracking-tight">{karyawanPhk} <span className="text-slate-400 text-xs">Pekerja</span></h3>
            <div className="flex items-center gap-1 mt-1 text-slate-500 text-[10px]">
              <span>Status Hubungan Kerja</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- RECHART NATIVE SVG VISUALIZATIONS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Grafik Penggunaan APD per Bulan & Kepatuhan */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Grafik Penggunaan & Pengeluaran APD</h3>
              <p className="text-xs text-slate-400">Tren pengeluaran bulanan (Tahun Berjalan 2026)</p>
            </div>
            <span className="text-xs bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded font-mono font-bold">
              Site WPA-A & B
            </span>
          </div>

          {/* Native High Fidelity Line Visual Representation (Jan-May) */}
          <div className="h-60 flex items-end justify-between relative pt-6 border-b border-l border-slate-800 px-4">
            {/* Background grid lines */}
            <div className="absolute left-0 right-0 top-1/4 border-t border-slate-800/45 border-dashed" />
            <div className="absolute left-0 right-0 top-2/4 border-t border-slate-800/45 border-dashed" />
            <div className="absolute left-0 right-0 top-3/2 border-t border-slate-800/45 border-dashed" />

            {/* Months representations */}
            {[
              { m: 'Januari', val: 56, h: '38%' },
              { m: 'Februari', val: 72, h: '49%' },
              { m: 'Maret', val: 98, h: '67%' },
              { m: 'April', val: 124, h: '84%' },
              { m: 'Mei (Skrg)', val: 147, h: '100%', highlight: true }
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center w-1/5 z-10 group relative">
                {/* Value tooltip */}
                <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-950 border border-orange-500 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none font-semibold font-mono">
                  {d.val} Pcs
                </div>
                
                {/* Glowing safety orange pillar with custom gradient */}
                <div 
                  style={{ height: d.h }} 
                  className={`w-10 rounded-t-lg transition-all duration-500 ease-out flex items-end justify-center ${
                    d.highlight 
                      ? 'bg-gradient-to-t from-orange-600 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                      : 'bg-gradient-to-t from-slate-800 to-slate-700 hover:from-slate-700 hover:to-orange-500/50'
                  }`}
                >
                  <span className="text-[10px] pb-1 font-mono font-bold text-white">{d.val}</span>
                </div>
                
                <span className="text-[10px] text-slate-400 mt-2 font-medium break-all text-center">{d.m}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-around mt-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500"></span>
              <span>Jumlah Pengadaan Keluar (Pcs)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-700"></span>
              <span>Rata-Rata Bulanan</span>
            </div>
          </div>
        </div>

        {/* Chart B: Grafik Stok APD per Kategori */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Grafik Ketersediaan Stok APD Utama</h3>
              <p className="text-xs text-slate-400">Tingkat persediaan real-time berdasarkan sirkulasi GA</p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
              Min Stok Terproteksi
            </span>
          </div>

          <div className="space-y-4">
            {chartBData.map((st, i) => {
              const maxVal = Math.max(200, ...chartBData.map(d => d.available));
              const percent = Math.min((st.available / maxVal) * 100, 100);
              const minPercent = (st.min / maxVal) * 100;
              
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200 text-xs">{st.cat}</span>
                    <div className="space-x-2 font-mono">
                      <span className="text-white font-bold">{st.available} Pcs</span>
                      <span className="text-slate-400 text-[10px]">/ Min {st.min}</span>
                    </div>
                  </div>
                  
                  {/* Custom progress bars with markers */}
                  <div className="h-2.5 w-full bg-slate-950 rounded-full relative">
                    {/* Minimum stock bar indicator separator */}
                    <div 
                      style={{ left: `${minPercent}%` }} 
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500/80 z-20" 
                      title="Batas Minimum Stok" 
                    />
                    {/* Available stock track */}
                    <div 
                      style={{ width: `${percent}%` }} 
                      className={`h-full rounded-full transition-all duration-500 ${st.col} ${
                        st.available <= st.min ? 'animate-pulse bg-red-600' : ''
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart C: Grafik Distribusi Ukuran APD (Toko Gudang) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Distribusi Ukuran APD Utama</h3>
          <p className="text-xs text-slate-400 mb-5">Preferensi data ukuran baju (S-XXXL) dan sepatu (39-46) seluruh pekerja PT. WPA</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wearpack Sizes */}
            <div>
              <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-300">
                <span className="w-1.5 h-3 bg-orange-500 inline-block rounded-sm"></span>
                Ukuran Pakaian Kerja (Wearpack)
              </div>
              <div className="space-y-2">
                {wearpackCounts.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-10 font-bold text-slate-400">{item.sz}</span>
                    <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div style={{ width: `${item.pct}%` }} className="h-full bg-orange-500 rounded-full" />
                    </div>
                    <span className="w-8 text-right font-mono font-bold text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Shoes Sizes */}
            <div>
              <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-300">
                <span className="w-1.5 h-3 bg-emerald-500 inline-block rounded-sm"></span>
                Ukuran Sepatu Safety
              </div>
              <div className="space-y-2">
                {shoeCounts.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-10 font-bold text-slate-400">{item.sz}</span>
                    <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div style={{ width: `${item.pct}%` }} className="h-full bg-emerald-500 rounded-full" />
                    </div>
                    <span className="w-8 text-right font-mono font-bold text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart D: Statistik Kepatuhan Pengembalian APD (HSE Assurance) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Statistik Kepatuhan Pengembalian APD</h3>
          <p className="text-xs text-slate-400 mb-5">Rasio bangkai APD lama terkumpul sebelum pengeluaran APD baru</p>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Circle Progress Bar */}
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="42" stroke="#10b981" strokeWidth="8" fill="transparent" 
                        strokeDasharray="264" 
                        strokeDashoffset={264 - (264 * complianceRate) / 100}
                        strokeLinecap="round" className="transition-all duration-1000 ease-in-out" />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-white font-mono">{complianceRate}%</span>
                <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mt-1">Sangat Baik</p>
              </div>
            </div>

            <div className="flex-1 space-y-3.5 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <p className="text-[10px] text-slate-400">Penggantian Valid</p>
                  <p className="text-base font-bold text-white font-mono">{totalApdDikembalikan} / {totalPengajuan}</p>
                </div>
                <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <p className="text-[10px] text-slate-400">Hilang Terlapor</p>
                  <p className="text-base font-bold text-amber-400 font-mono">1 Kasus</p>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1.5 bg-slate-950/20 p-2.5 rounded-lg">
                <div className="flex justify-between items-center text-[11px]">
                  <span>Atasan Menyetujui Checklist</span>
                  <span className="text-slate-100 font-bold font-mono">100%</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Kecepatan Audit HSE (&lt; 24 Jam)</span>
                  <span className="text-emerald-400 font-bold font-mono text-emerald-400">94.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FOUR (4) DETAILED KPI DASHBOARDS SECTION --- */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          Dashboard Key Performance Indicator (KPI) Departemen
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* KPI 1: HSE Assurance Dashboard */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">KPI HSE Department</span>
                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-white border border-slate-800 font-bold">Q2 Target</span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mb-2">Penilai Kerusakan & Kepatuhan APD</p>
              <div className="space-y-1.5 my-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Zero Incident APD</span>
                  <span className="text-emerald-400 font-bold font-mono">100%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Assessment Akurasi</span>
                  <span className="text-white font-bold font-mono">98.5%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800/80">
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '96%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Pencapaian HSE</span>
                <span className="text-orange-500 font-bold">96%</span>
              </div>
            </div>
          </div>

          {/* KPI 2: KPI Gudang Logistik APD */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">KPI Gudang APD GA</span>
                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-white border border-slate-800 font-bold">Heri Tan</span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mb-2">Ketersediaan Stok & Alokasi Barang</p>
              <div className="space-y-1.5 my-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Keakuratan Stok Opname</span>
                  <span className="text-emerald-400 font-bold font-mono">99.8%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Kecepatan Pengeluaran</span>
                  <span className="text-white font-bold font-mono">1.2 Jam</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800/80">
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '92%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Pencapaian GA</span>
                <span className="text-sky-400 font-bold">92%</span>
              </div>
            </div>
          </div>

          {/* KPI 3: KPI Kepatuhan Pengembalian APD */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">KPI Pengembalian APD</span>
                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-white border border-slate-800 font-bold">HSE Audit</span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mb-2">Penyerahan Bangkai oleh Pekerja</p>
              <div className="space-y-1.5 my-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Rasio Pengembalian Utang</span>
                  <span className="text-white font-bold font-mono">89%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Bangkai Tervalidasi</span>
                  <span className="text-emerald-400 font-bold font-mono">100%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800/80">
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '89%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Rasio Kepatuhan</span>
                <span className="text-emerald-400 font-bold">89%</span>
              </div>
            </div>
          </div>

          {/* KPI 4: KPI Exit Clearance Karyawan Off */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">KPI Exit Clearance</span>
                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-white border border-slate-800 font-bold">HRD Audit</span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mb-2">Penyelesaian Berkas Resign & PHK</p>
              <div className="space-y-1.5 my-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Clearance Ter-audit</span>
                  <span className="text-white font-bold font-mono">100%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Kasus Outstanding APD</span>
                  <span className="text-red-400 font-bold font-mono">1 Karyawan</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800/80">
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Rasio Clearance</span>
                <span className="text-pink-400 font-bold">85%</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* PANEL KENDALI DATA DASHBOARD (QUICK EDIT, COOPERATIVE REMOVE & REAL-TIME AUTOSAVE) */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        
        {/* Header Block of Console */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Database size={16} className="text-orange-500 animate-pulse" />
              Panel Kendali Logistik Cepat (Direct Edit, Delete & Add)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Tambahkan, ubah, atau hapus master data secara langsung tanpa berpindah halaman. Setiap klik disimpan instan terintegrasi.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Sinkronisasi Aktif (Auto-Save)
            </span>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
            >
              {isAddingNew ? <X size={13} /> : <Plus size={13} />}
              {isAddingNew ? 'Batal Tambah' : 'Tambah Cepat'}
            </button>
          </div>
        </div>

        {/* Tab Selection Row + Search bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850">
            <button
              onClick={() => { setConsoleTab('karyawan'); setEditingId(null); setIsAddingNew(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                consoleTab === 'karyawan' 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Users size={13} />
              Master Karyawan
              <span className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono leading-none">
                {karyawan.length}
              </span>
            </button>

            <button
              onClick={() => { setConsoleTab('stock'); setEditingId(null); setIsAddingNew(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                consoleTab === 'stock' 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Package size={13} />
              Stok APD
              <span className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono leading-none">
                {stock.length}
              </span>
            </button>

            <button
              onClick={() => { setConsoleTab('pengajuan'); setEditingId(null); setIsAddingNew(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                consoleTab === 'pengajuan' 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <FileSpreadsheet size={13} />
              Pengajuan APD
              <span className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono leading-none">
                {pengajuan.length}
              </span>
            </button>

            <button
              onClick={() => { setConsoleTab('pengembalian'); setEditingId(null); setIsAddingNew(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                consoleTab === 'pengembalian' 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <RotateCcw size={13} />
              Pengembalian APD
              <span className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono leading-none">
                {pengembalian.length}
              </span>
            </button>
          </div>

          {/* Local quick search tool */}
          <div className="relative w-full lg:w-64">
            <span className="absolute inset-y-0 left-2.5 flex items-center text-slate-500">
              <Search size={13} />
            </span>
            <input
              type="text"
              placeholder={`Cari di tabel ${consoleTab === 'karyawan' ? 'Karyawan' : consoleTab === 'stock' ? 'Stok' : 'Transaksi'}...`}
              value={consoleSearch}
              onChange={(e) => setConsoleSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* ============================================== */}
        {/* TAMBAH DATA BARU COLLAPSIBLE SUB-PANEL FORM */}
        {/* ============================================== */}
        {isAddingNew && (
          <div className="bg-slate-950 border border-orange-500/30 rounded-xl p-4 space-y-3 shadow-inner">
            <p className="text-xs font-bold text-orange-400 flex items-center gap-1">
              <CheckCircle2 size={12} />
              Formulir Tambah Cepat - {consoleTab.toUpperCase()}
            </p>

            {consoleTab === 'karyawan' && (
              <form onSubmit={handleAddNewKaryawan} className="grid grid-cols-1 md:grid-cols-6 gap-3.5 items-end">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">NIK (KODE UNIK)</label>
                  <input
                    type="text" required placeholder="WPA-26105"
                    value={newKaryawanField.nik}
                    onChange={(e) => setNewKaryawanField(prev => ({ ...prev, nik: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">NAMA LENGKAP</label>
                  <input
                    type="text" required placeholder="Alexander"
                    value={newKaryawanField.namaLengkap}
                    onChange={(e) => setNewKaryawanField(prev => ({ ...prev, namaLengkap: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">JABATAN</label>
                  <input
                    type="text" placeholder="HSE Operator"
                    value={newKaryawanField.jabatan}
                    onChange={(e) => setNewKaryawanField(prev => ({ ...prev, jabatan: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">DEPARTEMEN</label>
                  <input
                    type="text" placeholder="HSE Dept"
                    value={newKaryawanField.departemen}
                    onChange={(e) => setNewKaryawanField(prev => ({ ...prev, departemen: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">UKURAN BAJU</label>
                  <select
                    value={newKaryawanField.ukuranBaju}
                    onChange={(e) => setNewKaryawanField(prev => ({ ...prev, ukuranBaju: e.target.value as any }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white focus:outline"
                  >
                    {['S','M','L','XL','XXL','XXXL'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">UKURAN SEPATU</label>
                    <select
                      value={newKaryawanField.ukuranSepatu}
                      onChange={(e) => setNewKaryawanField(prev => ({ ...prev, ukuranSepatu: e.target.value as any }))}
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white focus:outline"
                    >
                      {['39','40','41','42','43','44','45','46'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white text-xs px-3.5 py-2.5 rounded font-bold transition-all">
                    Simpan
                  </button>
                </div>
              </form>
            )}

            {consoleTab === 'stock' && (
              <form onSubmit={handleAddNewStock} className="grid grid-cols-1 md:grid-cols-6 gap-3.5 items-end">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">KODE BARANG</label>
                  <input
                    type="text" required placeholder="HELM-WT-01"
                    value={newStockField.kodeBarang}
                    onChange={(e) => setNewStockField(prev => ({ ...prev, kodeBarang: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">NAMA BARANG</label>
                  <input
                    type="text" required placeholder="Helm Safety Putih MSA"
                    value={newStockField.namaBarang}
                    onChange={(e) => setNewStockField(prev => ({ ...prev, namaBarang: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">KATEGORI</label>
                  <select
                    value={newStockField.kategori}
                    onChange={(e) => setNewStockField(prev => ({ ...prev, kategori: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  >
                    {['Helm Safety', 'Pakaian Kerja', 'Kacamata Safety', 'Sarung Tangan', 'Sepatu Safety', 'Radio/HT'].map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">STOK WAL</label>
                  <input
                    type="number" required
                    value={newStockField.jumlahStok}
                    onChange={(e) => setNewStockField(prev => ({ ...prev, jumlahStok: Number(e.target.value) }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">MIN STOK</label>
                  <input
                    type="number" required
                    value={newStockField.minimumStok}
                    onChange={(e) => setNewStockField(prev => ({ ...prev, minimumStok: Number(e.target.value) }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">LOKASI RAK</label>
                    <input
                      type="text" placeholder="Rak B-2"
                      value={newStockField.lokasiPenyimpanan}
                      onChange={(e) => setNewStockField(prev => ({ ...prev, lokasiPenyimpanan: e.target.value }))}
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                    />
                  </div>
                  <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white text-xs px-3.5 py-2.5 rounded font-bold transition-all">
                    Simpan
                  </button>
                </div>
              </form>
            )}

            {consoleTab === 'pengajuan' && (
              <form onSubmit={handleAddNewPengajuan} className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-end">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">NOMOR TRANSAKSI</label>
                  <input
                    type="text" required placeholder="REQ-0530"
                    value={newPengajuanField.nomorPengajuan}
                    onChange={(e) => setNewPengajuanField(prev => ({ ...prev, nomorPengajuan: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">KARYAWAN PEMOHON</label>
                  <select
                    required
                    value={newPengajuanField.karyawanName}
                    onChange={(e) => setNewPengajuanField(prev => ({ ...prev, karyawanName: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white focus:outline-none"
                  >
                    <option value="">-- Pilih Karyawan --</option>
                    {karyawan.map(k => (
                      <option key={k.nik} value={k.namaLengkap}>{k.namaLengkap} - {k.jabatan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">ALASAN</label>
                  <select
                    value={newPengajuanField.alasan}
                    onChange={(e) => setNewPengajuanField(prev => ({ ...prev, alasan: e.target.value as any }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white focus:outline"
                  >
                    {['APD Baru', 'Penggantian Rusak', 'Penggantian Hilang', 'Penambahan Kebutuhan Kerja'].map(al => (
                      <option key={al} value={al}>{al}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">KATEGORI APD</label>
                  <select
                    value={newPengajuanField.kategoriApd}
                    onChange={(e) => setNewPengajuanField(prev => ({ ...prev, kategoriApd: e.target.value as any }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white focus:outline"
                  >
                    {['Helm Safety', 'Pakaian Kerja', 'Kacamata Safety', 'Sarung Tangan', 'Sepatu Safety', 'Radio/HT'].map(ap => (
                      <option key={ap} value={ap}>{ap}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">DETAIL BARANG</label>
                    <input
                      type="text" placeholder="Ukuran XL / Merah"
                      value={newPengajuanField.detailItem}
                      onChange={(e) => setNewPengajuanField(prev => ({ ...prev, detailItem: e.target.value }))}
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                    />
                  </div>
                  <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white text-xs px-3.5 py-2.5 rounded font-bold transition-all">
                    Simpan
                  </button>
                </div>
              </form>
            )}

            {consoleTab === 'pengembalian' && (
              <form onSubmit={handleAddNewPengembalian} className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-end">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">NOMOR TRANSAKSI</label>
                  <input
                    type="text" required placeholder="RET-0530"
                    value={newPengembalianField.nomorPengembalian}
                    onChange={(e) => setNewPengembalianField(prev => ({ ...prev, nomorPengembalian: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">PENGEMBALI</label>
                  <select
                    required
                    value={newPengembalianField.karyawanName}
                    onChange={(e) => setNewPengembalianField(prev => ({ ...prev, karyawanName: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white focus:outline-none"
                  >
                    <option value="">-- Pilih Karyawan --</option>
                    {karyawan.map(k => (
                      <option key={k.nik} value={k.namaLengkap}>{k.namaLengkap} - {k.jabatan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">JENIS APD KEMBALI</label>
                  <input
                    type="text" placeholder="Sepatu Safety Steel Toe"
                    value={newPengembalianField.jenisApd}
                    onChange={(e) => setNewPengembalianField(prev => ({ ...prev, jenisApd: e.target.value }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">KONDISI APD</label>
                  <select
                    value={newPengembalianField.kondisi}
                    onChange={(e) => setNewPengembalianField(prev => ({ ...prev, kondisi: e.target.value as any }))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white focus:outline"
                  >
                    {['Baik', 'Rusak Ringan', 'Rusak Berat', 'Tidak Layak Pakai', 'Hilang'].map(kn => (
                      <option key={kn} value={kn}>{kn}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white text-xs px-3.5 py-2.5 rounded font-bold transition-all w-full">
                  Simpan Transaksi
                </button>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TABULAR LOGISTIC MASTER TABLES SECTION (WITH INLINE EDITS) */}
        {/* ========================================================= */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden shadow-inner">
          <div className="overflow-x-auto max-h-[400px]">
            
            {/* TAILORED MONOSPACE TABLES CHANGER */}
            {consoleTab === 'karyawan' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-850 font-bold tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-3">NIK</th>
                    <th className="p-3">Nama Lengkap</th>
                    <th className="p-3">Jabatan</th>
                    <th className="p-3">Departemen</th>
                    <th className="p-3">Ukuran Baju / Sepatu</th>
                    <th className="p-3">Status Aktif</th>
                    <th className="p-3 text-right">Aksi Modifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {karyawan
                    .filter(k => 
                      k.nik.toLowerCase().includes(consoleSearch.toLowerCase()) ||
                      k.namaLengkap.toLowerCase().includes(consoleSearch.toLowerCase()) ||
                      k.jabatan.toLowerCase().includes(consoleSearch.toLowerCase()) ||
                      k.departemen.toLowerCase().includes(consoleSearch.toLowerCase())
                    )
                    .map(k => {
                      const isEditing = editingId === k.nik;
                      return (
                        <tr key={k.nik} className="hover:bg-slate-900/30 transition-all">
                          <td className="p-3 font-mono text-slate-400 font-bold">{k.nik}</td>
                          
                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editKaryawanFields.namaLengkap}
                                onChange={(e) => setEditKaryawanFields({ ...editKaryawanFields, namaLengkap: e.target.value })}
                                className="bg-slate-900 border border-slate-750 px-2 py-1 rounded text-white text-xs font-semibold w-full"
                              />
                            ) : k.namaLengkap}
                          </td>
                          
                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editKaryawanFields.jabatan}
                                onChange={(e) => setEditKaryawanFields({ ...editKaryawanFields, jabatan: e.target.value })}
                                className="bg-slate-900 border border-slate-750 px-2 py-1 rounded text-white text-xs w-full"
                              />
                            ) : k.jabatan}
                          </td>

                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editKaryawanFields.departemen}
                                onChange={(e) => setEditKaryawanFields({ ...editKaryawanFields, departemen: e.target.value })}
                                className="bg-slate-900 border border-slate-750 px-2 py-1 rounded text-white text-xs w-full"
                              />
                            ) : k.departemen}
                          </td>

                          <td className="p-3 font-mono text-slate-400 text-xs">
                            {isEditing ? (
                              <div className="flex gap-1.5">
                                <select 
                                  value={editKaryawanFields.ukuranBaju}
                                  onChange={(e) => setEditKaryawanFields({ ...editKaryawanFields, ukuranBaju: e.target.value as any })}
                                  className="bg-slate-900 border border-slate-700 rounded text-xs py-0.5 px-1 focus:outline-none"
                                >
                                  {['S','M','L','XL','XXL','XXXL'].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select
                                  value={editKaryawanFields.ukuranSepatu}
                                  onChange={(e) => setEditKaryawanFields({ ...editKaryawanFields, ukuranSepatu: e.target.value as any })}
                                  className="bg-slate-900 border border-slate-700 rounded text-xs py-0.5 px-1 focus:outline-none"
                                >
                                  {['39','40','41','42','43','44','45','46'].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>
                            ) : (
                              <span>Baju {k.ukuranBaju} / Sepatu {k.ukuranSepatu}</span>
                            )}
                          </td>

                          <td className="p-3">
                            {isEditing ? (
                              <select
                                value={editKaryawanFields.statusAktif}
                                onChange={(e) => setEditKaryawanFields({ ...editKaryawanFields, statusAktif: e.target.value as any })}
                                className="bg-slate-900 border border-slate-700 rounded text-xs py-1 px-1.5 focus:outline-none"
                              >
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                                <option value="Resign">Resign</option>
                                <option value="PHK">PHK</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                k.statusAktif === 'Aktif' ? 'bg-emerald-500/10 text-emerald-400' :
                                'bg-rose-500/10 text-rose-400'
                              }`}>
                                {k.statusAktif}
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveKaryawan(k.nik)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 px-2 rounded flex items-center gap-1 font-bold text-[11px] transition-all"
                                >
                                  <Save size={12} /> Simpan
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1 px-2 rounded text-[11px]"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5 select-none font-semibold">
                                <button
                                  onClick={() => handleStartEditKaryawan(k)}
                                  className="text-orange-400 hover:text-white hover:bg-orange-500/10 p-1 px-2 rounded border border-orange-500/25 text-[11px] font-semibold transition-all flex items-center gap-1"
                                >
                                  <Edit2 size={10} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteKaryawan(k.nik, k.namaLengkap)}
                                  className="text-rose-400 hover:text-white hover:bg-rose-500/10 p-1 px-2 rounded border border-rose-500/25 text-[11px] font-semibold transition-all flex items-center gap-1"
                                >
                                  <Trash2 size={10} /> Hapus
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}

            {consoleTab === 'stock' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-850 font-bold tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Kode Barang</th>
                    <th className="p-3">Nama Alat Pelindung Diri (APD)</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Jumlah Stok</th>
                    <th className="p-3">Min Stok</th>
                    <th className="p-3">Lokasi Rak</th>
                    <th className="p-3 text-right">Aksi Modifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {stock
                    .filter(s => 
                      s.kodeBarang.toLowerCase().includes(consoleSearch.toLowerCase()) ||
                      s.namaBarang.toLowerCase().includes(consoleSearch.toLowerCase()) ||
                      s.kategori.toLowerCase().includes(consoleSearch.toLowerCase())
                    )
                    .map(s => {
                      const isEditing = editingId === s.id;
                      return (
                        <tr key={s.id} className="hover:bg-slate-900/30 transition-all">
                          <td className="p-3 font-mono text-slate-400 font-bold">{s.kodeBarang}</td>
                          
                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editStockFields.namaBarang}
                                onChange={(e) => setEditStockFields({ ...editStockFields, namaBarang: e.target.value })}
                                className="bg-slate-900 border border-slate-750 px-2 py-1 rounded text-white text-xs font-semibold w-full"
                              />
                            ) : s.namaBarang}
                          </td>

                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editStockFields.kategori}
                                onChange={(e) => setEditStockFields({ ...editStockFields, kategori: e.target.value })}
                                className="bg-slate-900 border border-slate-750 px-2 py-1 rounded text-white text-xs w-full"
                              />
                            ) : s.kategori}
                          </td>

                          <td className="p-3 font-mono font-bold text-white">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStockFields.jumlahStok}
                                onChange={(e) => setEditStockFields({ ...editStockFields, jumlahStok: Number(e.target.value) })}
                                className="bg-slate-900 border border-slate-750 px-2 py-1 rounded text-white text-xs w-20"
                              />
                            ) : s.jumlahStok}
                          </td>

                          <td className="p-3 font-mono text-slate-400">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStockFields.minimumStok}
                                onChange={(e) => setEditStockFields({ ...editStockFields, minimumStok: Number(e.target.value) })}
                                className="bg-slate-900 border border-slate-750 px-2 py-1 rounded text-white text-xs w-20"
                              />
                            ) : s.minimumStok}
                          </td>

                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editStockFields.lokasiPenyimpanan}
                                onChange={(e) => setEditStockFields({ ...editStockFields, lokasiPenyimpanan: e.target.value })}
                                className="bg-slate-900 border border-slate-750 px-2 py-1 rounded text-white text-xs w-full"
                              />
                            ) : s.lokasiPenyimpanan}
                          </td>

                          <td className="p-3 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveStock(s.id)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 px-2 rounded flex items-center gap-1 font-bold text-[11px]"
                                >
                                  <Save size={12} /> Simpan
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1 px-2 rounded text-[11px]"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5 select-none font-semibold">
                                <button
                                  onClick={() => handleStartEditStock(s)}
                                  className="text-orange-400 hover:text-white hover:bg-orange-500/10 p-1 px-2 rounded border border-orange-500/25 text-[11px] font-semibold transition-all flex items-center gap-1"
                                >
                                  <Edit2 size={10} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteStock(s.id, s.namaBarang)}
                                  className="text-rose-400 hover:text-white hover:bg-rose-500/10 p-1 px-2 rounded border border-rose-500/25 text-[11px] font-semibold transition-all flex items-center gap-1"
                                >
                                  <Trash2 size={10} /> Hapus
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}

            {consoleTab === 'pengajuan' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-850 font-bold tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-3">ID Req</th>
                    <th className="p-3">Nomor Pengajuan</th>
                    <th className="p-3">Nama Karyawan</th>
                    <th className="p-3">Jabatan / Divisi</th>
                    <th className="p-3">Alur State</th>
                    <th className="p-3 text-right">Aksi Modifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {pengajuan
                    .filter(p => 
                      p.nomorPengajuan.toLowerCase().includes(consoleSearch.toLowerCase()) ||
                      p.namaKaryawan.toLowerCase().includes(consoleSearch.toLowerCase()) ||
                      p.statusAlur.toLowerCase().includes(consoleSearch.toLowerCase())
                    )
                    .map(p => {
                      const isEditing = editingId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-slate-900/30 transition-all">
                          <td className="p-3 font-mono text-slate-500">{p.id}</td>
                          
                          <td className="p-3 font-bold text-white">{p.nomorPengajuan}</td>
                          
                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editPengajuanFields.namaKaryawan}
                                onChange={(e) => setEditPengajuanFields({ ...editPengajuanFields, namaKaryawan: e.target.value })}
                                className="bg-slate-900 border border-slate-750 px-2 py-1 rounded text-white text-xs font-semibold w-full"
                              />
                            ) : p.namaKaryawan}
                          </td>

                          <td className="p-3">
                            {isEditing ? (
                              <div className="flex gap-2">
                                <input
                                  type="text" placeholder="Jabatan"
                                  value={editPengajuanFields.jabatan}
                                  onChange={(e) => setEditPengajuanFields({ ...editPengajuanFields, jabatan: e.target.value })}
                                  className="bg-slate-900 border border-slate-750 px-2 py-1 rounded text-white text-xs flex-1"
                                />
                                <input
                                  type="text" placeholder="Departemen"
                                  value={editPengajuanFields.departemen}
                                  onChange={(e) => setEditPengajuanFields({ ...editPengajuanFields, departemen: e.target.value })}
                                  className="bg-slate-900 border border-slate-750 px-2 py-1 rounded text-white text-xs flex-1"
                                />
                              </div>
                            ) : (
                              <span>{p.jabatan} / {p.departemen}</span>
                            )}
                          </td>

                          <td className="p-3">
                            {isEditing ? (
                              <select
                                value={editPengajuanFields.statusAlur}
                                onChange={(e) => setEditPengajuanFields({ ...editPengajuanFields, statusAlur: e.target.value as any })}
                                className="bg-slate-900 border border-slate-750 rounded text-xs py-1 px-1.5 focus:outline-none text-white font-semibold"
                              >
                                <option value="Verifikasi HSE">Verifikasi HSE</option>
                                <option value="Persetujuan GA">Persetujuan GA</option>
                                <option value="Pelaporan HRD">Pelaporan HRD</option>
                                <option value="Serah Terima">Serah Terima</option>
                                <option value="Selesai">Selesai</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.statusAlur === 'Selesai' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                p.statusAlur === 'Verifikasi HSE' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              }`}>
                                {p.statusAlur}
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSavePengajuan(p.id)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 px-2 rounded flex items-center gap-1 font-bold text-[11px]"
                                >
                                  <Save size={12} /> Simpan
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1 px-2 rounded text-[11px]"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5 select-none font-semibold">
                                <button
                                  onClick={() => handleStartEditPengajuan(p)}
                                  className="text-orange-400 hover:text-white hover:bg-orange-500/10 p-1 px-2 rounded border border-orange-500/25 text-[11px] font-semibold transition-all flex items-center gap-1"
                                >
                                  <Edit2 size={10} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeletePengajuan(p.id, p.nomorPengajuan)}
                                  className="text-rose-400 hover:text-white hover:bg-rose-500/10 p-1 px-2 rounded border border-rose-500/25 text-[11px] font-semibold transition-all flex items-center gap-1"
                                >
                                  <Trash2 size={10} /> Hapus
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}

            {consoleTab === 'pengembalian' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-850 font-bold tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-3">ID Ret</th>
                    <th className="p-3">Nomor Pengembalian</th>
                    <th className="p-3">Nama Karyawan</th>
                    <th className="p-3">Alat Pelindung Diri (APD)</th>
                    <th className="p-3">Kondisi Fisik</th>
                    <th className="p-3">Status Verifikasi</th>
                    <th className="p-3 text-right">Aksi Modifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {pengembalian
                    .filter(pe => 
                      pe.nomorPengembalian.toLowerCase().includes(consoleSearch.toLowerCase()) ||
                      pe.namaKaryawan.toLowerCase().includes(consoleSearch.toLowerCase()) ||
                      pe.jenisApd.toLowerCase().includes(consoleSearch.toLowerCase())
                    )
                    .map(pe => {
                      const isEditing = editingId === pe.id;
                      return (
                        <tr key={pe.id} className="hover:bg-slate-900/30 transition-all">
                          <td className="p-3 font-mono text-slate-500">{pe.id}</td>
                          
                          <td className="p-3 font-bold text-white">{pe.nomorPengembalian}</td>
                          
                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editPengembalianFields.namaKaryawan}
                                onChange={(e) => setEditPengembalianFields({ ...editPengembalianFields, namaKaryawan: e.target.value })}
                                className="bg-slate-900 border border-slate-755 px-2 py-1 rounded text-white text-xs font-semibold w-full"
                              />
                            ) : pe.namaKaryawan}
                          </td>

                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editPengembalianFields.jenisApd}
                                onChange={(e) => setEditPengembalianFields({ ...editPengembalianFields, jenisApd: e.target.value })}
                                className="bg-slate-900 border border-slate-755 px-2 py-1 rounded text-white text-xs w-full"
                              />
                            ) : pe.jenisApd}
                          </td>

                          <td className="p-3 font-mono">
                            {isEditing ? (
                              <select
                                value={editPengembalianFields.kondisi}
                                onChange={(e) => setEditPengembalianFields({ ...editPengembalianFields, kondisi: e.target.value as any })}
                                className="bg-slate-900 border border-slate-700 rounded text-xs py-1 px-1.5 focus:outline-none"
                              >
                                <option value="Baik">Baik</option>
                                <option value="Rusak Ringan">Rusak Ringan</option>
                                <option value="Rusak Berat">Rusak Berat</option>
                                <option value="Tidak Layak Pakai">Tidak Layak Pakai</option>
                                <option value="Hilang">Hilang</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                pe.kondisi === 'Baik' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                              }`}>
                                {pe.kondisi}
                              </span>
                            )}
                          </td>

                          <td className="p-3">
                            {isEditing ? (
                              <select
                                value={editPengembalianFields.statusVerifikasi}
                                onChange={(e) => setEditPengembalianFields({ ...editPengembalianFields, statusVerifikasi: e.target.value as any })}
                                className="bg-slate-900 border border-slate-700 rounded text-xs py-1 px-1 text-white focus:outline animate-fadein"
                              >
                                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                <option value="Diterima">Diterima</option>
                                <option value="Ditolak">Ditolak</option>
                                <option value="Assessment Lanjutan">Assessment Lanjutan</option>
                              </select>
                            ) : (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                pe.statusVerifikasi === 'Diterima' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {pe.statusVerifikasi}
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSavePengembalian(pe.id)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 px-2 rounded flex items-center gap-1 font-bold text-[11px]"
                                >
                                  <Save size={12} /> Simpan
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1 px-2 rounded text-[11px]"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5 select-none font-semibold">
                                <button
                                  onClick={() => handleStartEditPengembalian(pe)}
                                  className="text-orange-400 hover:text-white hover:bg-orange-500/10 p-1 px-2 rounded border border-orange-500/25 text-[11px] font-semibold transition-all flex items-center gap-1"
                                >
                                  <Edit2 size={10} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeletePengembalian(pe.id, pe.nomorPengembalian)}
                                  className="text-rose-400 hover:text-white hover:bg-rose-500/10 p-1 px-2 rounded border border-rose-500/25 text-[11px] font-semibold transition-all flex items-center gap-1"
                                >
                                  <Trash2 size={10} /> Hapus
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}

          </div>
        </div>

      </div>

      {/* Quick Action Alerts */}
      {pengajuanMenungguPersetujuan > 0 && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs rounded-xl shadow-inner">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-orange-400">Peringatan Tindakan Segera:</p>
              <p className="text-orange-300 mt-0.5">
                Terdapat <strong className="font-mono">{pengajuanMenungguPersetujuan} pengajuan APD baru</strong> yang menunggu verifikasi HSE oleh Ilham Akbar Rialdin atau pemeriksaan stok GA oleh Heri Tan.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentMenu('assessment')}
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold px-3 py-1.5 rounded-lg transition-all text-[11px] flex-shrink-0 self-end md:self-center"
            id="quick-verify-btn"
          >
            Mulai Verifikasi HSE
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
