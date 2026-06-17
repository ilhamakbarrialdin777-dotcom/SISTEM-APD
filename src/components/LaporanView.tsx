/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  FilePieChart, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  CheckCircle, 
  BarChart4, 
  TrendingUp, 
  Users, 
  AlertOctagon, 
  ClipboardList
} from 'lucide-react';
import { PengajuanAPD, Karyawan, StockItem } from '../types';

interface LaporanViewProps {
  karyawanList: Karyawan[];
  pengajuanList: PengajuanAPD[];
  stockList: StockItem[];
}

export default function LaporanView({
  karyawanList,
  pengajuanList,
  stockList
}: LaporanViewProps) {
  const [filterBulan, setFilterBulan] = React.useState('Mei 2026');

  const totalSirkulasiCount = pengajuanList.length;
  const completedDeliveries = pengajuanList.filter(p => p.statusAlur === 'Serah Terima' || p.serahTerima !== null).length;
  const pendingApprovals = pengajuanList.filter(p => p.statusAlur !== 'Serah Terima' && p.serahTerima === null).length;

  const handleDownload = (tipe: string) => {
    alert(`Berkas Laporan Kepatuhan APD PT Watu Perkasa Abadi (${filterBulan}) berhasil diunduh dalam format: ${tipe}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FilePieChart size={22} className="text-orange-500" />
            Laporan Kepatuhan & Analisis Distribusi APD
          </h1>
          <p className="text-xs text-slate-400 mt-1">Laporan berkas kepatuhan HSE terpadu untuk kebutuhan internal kementerian ESDM dan manajemen internal.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Periode Laporan:</span>
          <select
            value={filterBulan}
            onChange={(e) => setFilterBulan(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-800 text-slate-200 py-1.5 px-3 rounded-lg focus:outline-none"
          >
            <option value="Mei 2026">Mei 2026 (Triwulan berjalan)</option>
            <option value="April 2026">April 2026</option>
            <option value="Maret 2026">Maret 2026</option>
          </select>
        </div>
      </div>

      {/* Main KPI blocks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Total Sesi Sirkulasi</p>
          <p className="text-2xl font-black text-white mt-1">{totalSirkulasiCount} Berkas</p>
          <div className="text-[10px] text-emerald-400 font-semibold mt-1">✓ Berjalan Lancar</div>
        </div>
        <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Tingkat Penyaluran Selesai</p>
          <p className="text-2xl font-black text-white mt-1">{completedDeliveries} Penerima</p>
          <div className="text-[10px] text-orange-500 font-semibold mt-1">94% Tingkat Kecepatan</div>
        </div>
        <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Proses Persetujuan Aktif</p>
          <p className="text-2xl font-black text-white mt-1">{pendingApprovals} Berkas</p>
          <div className="text-[10px] text-slate-400 font-semibold mt-1">Review Berjenjang Aktif</div>
        </div>
        <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Keaslian Audit Bangkai</p>
          <p className="text-2xl font-black text-white mt-1">100% Valid</p>
          <div className="text-[10px] text-emerald-400 font-semibold mt-1">Sesuai Aturan APD</div>
        </div>
      </div>

      {/* Analytics details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Statistics 1: Category usage counts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1 border-b border-slate-800 pb-2">
            <BarChart4 size={14} className="text-orange-500" />
            Distribusi Frekuensi Item Terbanyak
          </h3>

          <div className="space-y-3 pt-2 text-xs text-slate-400">
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-white">Pakaian Kerja (Wearpack)</span>
                <span>82 Unit</span>
              </div>
              <div className="h-2 bg-slate-950 rounded overflow-hidden">
                <div className="h-full bg-orange-500 rounded" style={{ width: '82%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-white">Helm Safety</span>
                <span>45 Unit</span>
              </div>
              <div className="h-2 bg-slate-950 rounded overflow-hidden">
                <div className="h-full bg-amber-500 rounded" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-white">Sepatu Boots</span>
                <span>38 Unit</span>
              </div>
              <div className="h-2 bg-slate-950 rounded overflow-hidden">
                <div className="h-full bg-emerald-500 rounded" style={{ width: '38%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-white">Sarung Tangan Kulit</span>
                <span>90 Unit</span>
              </div>
              <div className="h-2 bg-slate-950 rounded overflow-hidden">
                <div className="h-full bg-sky-500 rounded" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics 2: HSE Compliance rates */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1 border-b border-slate-800 pb-2">
            <TrendingUp size={14} className="text-emerald-500" />
            Statistik Kepatuhan Pengembalian APD
          </h3>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4 text-xs">
            <div className="text-center">
              <p className="text-3xl font-black text-emerald-400">98.2%</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Tingkat Penyerahan Bangkai Fisik</p>
            </div>

            <div className="space-y-2 border-t border-slate-900 pt-3 text-[11px] text-slate-400">
              <p className="flex justify-between">
                <span>Rata-rata Waktu Clear:</span>
                <span className="font-bold text-slate-200">1.2 Hari Kerja</span>
              </p>
              <p className="flex justify-between">
                <span>Total APD Hilang:</span>
                <span className="font-bold text-red-400">3 Pcs</span>
              </p>
              <p className="flex justify-between">
                <span>Pemusnahan Bangkai APD:</span>
                <span className="font-bold text-sky-400">12 Batch</span>
              </p>
            </div>
          </div>
        </div>

        {/* Statistics 3: Trigger PDF reports compilation and printable logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1 border-b border-slate-800 pb-2">
            <ClipboardList size={14} className="text-blue-500" />
            Cetak Berkas Laporan Resmi
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Hasilkan lembar rekapan sirkulasi APD yang disetujui, siap diserahkan kepada KTT (Kepala Teknik Tambang) atau auditor eksternal.
          </p>

          <div className="space-y-2 pt-2">
            <button 
              onClick={() => handleDownload('Excel (.xlsx)')}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 rounded-lg border border-slate-800 text-xs font-bold text-emerald-400 flex items-center justify-center gap-2 transition-all"
            >
              <Download size={14} /> Download Rekap Excel (.xlsx)
            </button>
            <button 
              onClick={() => handleDownload('Word (.docx)')}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 rounded-lg border border-slate-800 text-xs font-bold text-sky-400 flex items-center justify-center gap-2 transition-all"
            >
              <Download size={14} /> Download Rekap Word (.docx)
            </button>
            <button 
              onClick={() => handleDownload('PDF format')}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 rounded-lg border border-slate-800 text-xs font-bold text-rose-500 flex items-center justify-center gap-2 transition-all"
            >
              <Printer size={14} /> Ekspor Dokumen Resmi (PDF)
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
