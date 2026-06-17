/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  FileText, 
  XSquare, 
  ClipboardCheck, 
  Archive, 
  CheckCircle, 
  Library, 
  ChevronRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { PengajuanAPD } from '../types';

interface PelaporanHrdViewProps {
  pengajuanList: PengajuanAPD[];
  setPengajuanList: React.Dispatch<React.SetStateAction<PengajuanAPD[]>>;
  addAuditLog: (aktivitas: string, rincian: string, status?: 'Berhasil' | 'Gagal') => void;
  currentUser: string;
}

export default function PelaporanHrdView({
  pengajuanList,
  setPengajuanList,
  addAuditLog,
  currentUser
}: PelaporanHrdViewProps) {
  const [selectedReq, setSelectedReq] = React.useState<PengajuanAPD | null>(null);

  // HR Input details
  const [archiveNo, setArchiveNo] = React.useState('');
  const [hrdNotes, setHrdNotes] = React.useState('');

  const pendingRequests = pengajuanList.filter(p => p.statusAlur === 'Pelaporan HRD');

  // Auto generate folder archive number
  React.useEffect(() => {
    if (selectedReq) {
      const randNo = Math.floor(1000 + Math.random() * 9000);
      setArchiveNo(`ARSIP/DIG/WPA/2026-${randNo}`);
      setHrdNotes('Telah dibukukan ke dalam riwayat inventaris sirkulasi individu karyawan.');
    }
  }, [selectedReq]);

  const handleHrRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    if (!archiveNo.trim()) {
      alert('Tolong input Nomor Arsip Digital.');
      return;
    }

    setPengajuanList(prev => prev.map(p => {
      if (p.id === selectedReq.id) {
        return {
          ...p,
          statusAlur: "Serah Terima", // Out for delivery
          pelaporanHrd: {
            petugas: "Moh. Irfan (HRD Administrator)",
            tanggal: "2026-05-30",
            statusArsip: archiveNo,
            catatan: hrdNotes
          }
        };
      }
      return p;
    }));

    addAuditLog(
      "Pengarsipan HRD", 
      `HR Moh. Irfan mengarsipkan pengajuan ${selectedReq.nomorPengajuan} dengan No Seri Berkas: ${archiveNo}.`
    );

    setSelectedReq(null);
    alert(`BERKAS DIARSIPKAN!\nSirkulasi digital dibukukan. Berkas bergeser ke: "Serah Terima APD" kepada Pekerja.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileText size={22} className="text-sky-450" />
            Terminal Pengarsipan & Pelaporan HRD
          </h1>
          <p className="text-xs text-slate-400 mt-1">Pembukuan digital riwayat sirkulasi APD dalam berkas kepegawaian PT Watu Perkasa Abadi.</p>
        </div>
        <span className="text-xs bg-sky-500/10 text-sky-450 border border-sky-500/20 px-3 py-1.5 rounded-lg font-bold font-mono">
          Petugas: Moh. Irfan
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Waiting HR index */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Antrean Riwayat Menunggu Indexing</p>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedReq?.id === req.id 
                    ? 'bg-sky-500/10 border-sky-500 shadow-md' 
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-sky-400 font-bold">{req.nomorPengajuan}</span>
                  <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded font-bold uppercase">Ready Archive</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1.5">{req.namaKaryawan}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{req.jabatan}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/40 text-[10px] text-slate-400">
                  <span>GA Log: {req.pemeriksaanGa?.nomorStokKeluar}</span>
                  <span className="font-bold text-white">{req.items.length} APD</span>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
                <p className="text-xs">Umpan aman. Seluruh berkas logistik terindex sempurna di kepegawaian.</p>
              </div>
            )}
          </div>
        </div>

        {/* HR indexing form */}
        <div className="lg:col-span-2">
          {selectedReq ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Index Berkas Pegawai</span>
                  <h3 className="text-base font-black text-white">{selectedReq.nomorPengajuan}</h3>
                </div>
                <button onClick={() => setSelectedReq(null)} className="text-slate-500 hover:text-white">
                  <XSquare size={20} />
                </button>
              </div>

              {/* HSE / GA details audit trail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-850">
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[9px]">Sertifikasi K3 HSE (Ilham):</p>
                  <p className="text-emerald-400 mt-0.5 font-medium">✓ DISYAHKAN ({selectedReq.verifikasiHse?.rekomendasi})</p>
                  <p className="text-slate-400 italic text-[11px] mt-0.5">"{selectedReq.verifikasiHse?.catatan}"</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[9px]">Otorisasi Logistik GA (Heri):</p>
                  <p className="text-amber-400 mt-0.5 font-medium">✓ DISIAPKAN ({selectedReq.pemeriksaanGa?.statusStok})</p>
                  <p className="text-slate-440 font-mono text-[11px] mt-0.5">Stok Ref: {selectedReq.pemeriksaanGa?.nomorStokKeluar}</p>
                </div>
              </div>

              {/* Item quantities */}
              <div className="space-y-1 bg-slate-950/30 p-2.5 border border-slate-850 rounded text-xs text-slate-400">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detail Item Inventaris Baru:</p>
                {selectedReq.items.map((it, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-900/60 text-[11px]">
                    <span>{it.kategori} ({it.detail})</span>
                    <span className="font-bold text-slate-205">{it.jumlah} Pcs</span>
                  </div>
                ))}
              </div>

              {/* HR submission form */}
              <form onSubmit={handleHrRecord} className="space-y-4 pt-3 border-t border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Nomor Folder Arsip Digital*</label>
                    <input
                      type="text"
                      required
                      placeholder="Spt: ARSIP/DIG/WPA/2026-912"
                      value={archiveNo}
                      onChange={(e) => setArchiveNo(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-sky-400 font-mono font-bold rounded-lg"
                    />
                  </div>
                  <div className="flex items-end text-[11px] text-slate-500 pb-1.5 leading-relaxed">
                    Arsip digital terintegrasi langsung dengan KPI kepegawaian dan kepatuhan audit internal.
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-semibold">Ulasan / Catatan HRD*</label>
                  <textarea
                    required
                    placeholder="Masukkan ulasan riwayat pengarsipan..."
                    value={hrdNotes}
                    onChange={(e) => setHrdNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-white rounded-lg h-20 resize-none animate-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setSelectedReq(null)} className="bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-lg">Batal</button>
                  <button type="submit" className="bg-sky-650 hover:bg-sky-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow">Selesaikan Index & Serahkan APD</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-xl p-10 text-center text-slate-500 text-xs">
              <Library className="mx-auto text-slate-700 mb-2.5" size={32} />
              <p>Pilih berkas yang telah dirilis gudang di samping kiri untuk meng-index ke database riwayat individu.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
