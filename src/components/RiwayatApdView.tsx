/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  History, 
  Search, 
  FileSpreadsheet, 
  FileDown, 
  Printer, 
  User, 
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { Karyawan, PengajuanAPD } from '../types';

interface RiwayatApdViewProps {
  karyawanList: Karyawan[];
  pengajuanList: PengajuanAPD[];
}

export default function RiwayatApdView({
  karyawanList,
  pengajuanList
}: RiwayatApdViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedKaryawan, setSelectedKaryawan] = React.useState<Karyawan | null>(karyawanList[0] || null);

  // Search filtered autocomplete
  const filteredKaryawanList = karyawanList.filter(k => 
    k.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.nik.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pull matching issued history (completed sirkulasi APD)
  const employeeHistory = pengajuanList
    .filter(p => p.karyawanNik === selectedKaryawan?.nik)
    .sort((a,b) => b.tanggalPengajuan.localeCompare(a.tanggalPengajuan));

  const handleExport = (format: string) => {
    if (!selectedKaryawan) return;
    alert(`Mengekspor Riwayat APD ${selectedKaryawan.namaLengkap} ke format: file_riwayat_apd_${selectedKaryawan.nik}.${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <History size={22} className="text-orange-500" />
          Kartu Kontrol Riwayat APD Karyawan (Continuous Card)
        </h1>
        <p className="text-xs text-slate-400 mt-1">Audit sirkulasi digital, lacak masa berlaku pemakaian, denda kehilangan, dan log kepatuhan setiap personil tambang PT. WPA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left selector: Karyawan list autocomplete */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pilih Karyawan Tambang</p>
          
          <div className="relative">
            <span className="absolute inset-y-0 left-2.5 flex items-center text-slate-500">
              <Search size={14} />
            </span>
            <input 
              type="text" 
              placeholder="Cari Nama / NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-300 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[50vh] pr-1 custom-scrollbar">
            {filteredKaryawanList.map(k => (
              <div
                key={k.nik}
                onClick={() => setSelectedKaryawan(k)}
                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                  selectedKaryawan?.nik === k.nik 
                    ? 'bg-orange-500/10 border-orange-500' 
                    : 'bg-slate-950/25 border-slate-850 hover:border-slate-800'
                }`}
              >
                <img src={k.fotoKaryawan} alt="" className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 truncate">{k.namaLengkap}</h4>
                  <p className="text-[10px] font-mono text-orange-500 font-bold">{k.nik}</p>
                </div>
                <span className={`text-[9px] px-1.5 rounded-full ${
                  k.statusAktif === 'Aktif' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
                }`}>
                  {k.statusAktif}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Detailed historical safety card */}
        <div className="lg:col-span-2">
          {selectedKaryawan ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              
              {/* Employee brief & Export triggers */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3.5">
                  <img src={selectedKaryawan.fotoKaryawan} alt="" className="w-14 h-14 rounded-full border border-slate-700 object-cover" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] bg-slate-950 border border-slate-850 px-2 py-0.5 rounded font-mono font-bold text-orange-500">{selectedKaryawan.nik}</span>
                    <h3 className="text-base font-black text-white">{selectedKaryawan.namaLengkap}</h3>
                    <p className="text-xs text-slate-400">{selectedKaryawan.jabatan} • <strong className="text-slate-300">{selectedKaryawan.departemen}</strong></p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 self-end">
                  <button onClick={() => handleExport('xlsx')} className="p-2 bg-slate-950 hover:bg-slate-800 rounded border border-slate-850 text-emerald-500 text-[10px] flex items-center gap-1 font-bold">
                    <FileSpreadsheet size={12} /> Excel
                  </button>
                  <button onClick={() => handleExport('docx')} className="p-2 bg-slate-950 hover:bg-slate-800 rounded border border-slate-850 text-sky-500 text-[10px] flex items-center gap-1 font-bold">
                    <FileDown size={12} /> Word
                  </button>
                  <button onClick={() => handleExport('pdf')} className="p-2 bg-slate-950 hover:bg-slate-800 rounded border border-slate-850 text-rose-500 text-[10px] flex items-center gap-1 font-bold">
                    <Printer size={12} /> PDF
                  </button>
                  <button onClick={handlePrint} className="p-2 bg-slate-950 hover:bg-slate-800 rounded border border-slate-850 text-slate-300 text-[10px] flex items-center gap-1 font-bold">
                    Cetak Card
                  </button>
                </div>
              </div>

              {/* Clothes & Boot Sizes Standardizations */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Ukuran Pakaian</p>
                  <p className="text-sm font-bold text-white mt-0.5">Size {selectedKaryawan.ukuranBaju}</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Standard Sepatu</p>
                  <p className="text-sm font-bold text-white mt-0.5 font-mono">Ukuran {selectedKaryawan.ukuranSepatu}</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Status Kepegawaian</p>
                  <p className="text-xs font-bold text-slate-200 mt-1">{selectedKaryawan.statusKaryawan}</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Lokasi/Site Kerja</p>
                  <p className="text-[10px] font-bold text-emerald-400 mt-1 truncate">{selectedKaryawan.site}</p>
                </div>
              </div>

              {/* History Timeline */}
              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Histori Alur Penerimaan Alat Pelindung Diri:</p>
                
                <div className="space-y-3.5">
                  {employeeHistory.length > 0 ? (
                    employeeHistory.map((h, i) => (
                      <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2.5">
                        
                        <div className="flex justify-between items-center text-[11px] border-b border-slate-900 pb-1.5">
                          <span className="font-mono font-bold text-orange-400">{h.nomorPengajuan}</span>
                          <span className="text-slate-500 font-mono">{h.tanggalPengajuan}</span>
                        </div>

                        {/* Items in that batch */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                          {h.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="text-orange-500 font-mono">•</span>
                              <span>{item.kategori} ({item.detail})</span>
                              <strong className="text-white font-mono bg-slate-900 px-1.5 rounded">x{item.jumlah}</strong>
                            </div>
                          ))}
                        </div>

                        {/* Lifecycle steps verified details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-[10px] text-slate-400">
                          <div className="p-1 px-2 rounded bg-slate-900/60 border border-slate-850">
                            <span className="text-slate-500 block">Assessment HSE:</span>
                            <span className="text-emerald-400 font-bold leading-tight">Ilham [OK]</span>
                          </div>
                          <div className="p-1 px-2 rounded bg-slate-900/60 border border-slate-850">
                            <span className="text-slate-500 block">Warehouse GA:</span>
                            <span className="text-amber-400 font-bold leading-tight">Heri [OK]</span>
                          </div>
                          <div className="p-1 px-2 rounded bg-slate-900/60 border border-slate-850">
                            <span className="text-slate-500 block">Index HRD:</span>
                            <span className="text-sky-400 font-bold leading-tight">Irfan [OK]</span>
                          </div>
                          <div className="p-1 px-2 rounded bg-slate-900/60 border border-slate-855">
                            <span className="text-slate-500 block">Status Fisik:</span>
                            <span className="text-white font-bold leading-tight uppercase font-mono">{h.statusAlur}</span>
                          </div>
                        </div>

                        {/* Delivery Handover proof if completed */}
                        {h.serahTerima && (
                          <div className="p-2.5 bg-emerald-500/5 text-emerald-400 text-[10px] rounded border border-emerald-500/10 flex items-center justify-between">
                            <span>✓ Serah Terima Selesai: Tanda Tangan [{h.serahTerima.penerimaTtd}]</span>
                            <span className="text-slate-500">Log: {h.serahTerima.tanggal}</span>
                          </div>
                        )}

                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-550 text-xs bg-slate-950/20 border border-dashed border-slate-850 rounded-xl">
                      <HelpCircle className="mx-auto text-slate-700 mb-2" size={24} />
                      Belum ada catatan sirkulasi APD terekam untuk pekerja ini.
                    </div>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-xl p-10 text-center text-slate-500 text-xs">
              <FolderOpen className="mx-auto text-slate-755 mb-2 animate-bounce" size={32} />
              <p>Pilih salah satu pekerja tambang di panel kiri untuk menarik kartu continuous sirkulasi logistik APD mereka.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
