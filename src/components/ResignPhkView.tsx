/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  UserX, 
  XSquare, 
  PenTool, 
  CheckCircle, 
  AlertTriangle,
  FolderLock,
  ChevronRight,
  Info
} from 'lucide-react';
import { Karyawan, ExitClearance } from '../types';

interface ResignPhkViewProps {
  karyawanList: Karyawan[];
  setKaryawanList: React.Dispatch<React.SetStateAction<Karyawan[]>>;
  exitClearanceList: ExitClearance[];
  setExitClearanceList: React.Dispatch<React.SetStateAction<ExitClearance[]>>;
  addAuditLog: (aktivitas: string, rincian: string, status?: 'Berhasil' | 'Gagal') => void;
  currentUser: string;
}

export default function ResignPhkView({
  karyawanList,
  setKaryawanList,
  exitClearanceList,
  setExitClearanceList,
  addAuditLog,
  currentUser
}: ResignPhkViewProps) {
  const [selectedClearance, setSelectedClearance] = React.useState<ExitClearance | null>(null);

  // Buffer state to hold customized items check
  const [localItemsChecklist, setLocalItemsChecklist] = React.useState<ExitClearance['itemsChecklist']>([]);
  
  // Verification flags
  const [hseApproved, setHseApproved] = React.useState(false);
  const [gaApproved, setGaApproved] = React.useState(false);
  const [hrdApproved, setHrdApproved] = React.useState(false);
  const [catatanText, setCatatanText] = React.useState('');

  React.useEffect(() => {
    if (selectedClearance) {
      setLocalItemsChecklist([...selectedClearance.itemsChecklist]);
      setHseApproved(!!selectedClearance.verifikasiHse?.status);
      setGaApproved(!!selectedClearance.verifikasiGa?.status);
      setHrdApproved(!!selectedClearance.verifikasiHrd?.status);
      setCatatanText(selectedClearance.verifikasiHse?.catatan || selectedClearance.verifikasiGa?.catatan || '');
    }
  }, [selectedClearance]);

  const handleUpdateItemStatus = (index: number, newStatus: any) => {
    const updated = [...localItemsChecklist];
    updated[index].status = newStatus;
    setLocalItemsChecklist(updated);
  };

  const handleUpdateItemCatatan = (index: number, val: string) => {
    const updated = [...localItemsChecklist];
    updated[index].catatan = val;
    setLocalItemsChecklist(updated);
  };

  const handleSaveClearance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClearance) return;

    // Check if every item is cleared
    const allApdCleared = localItemsChecklist.every(it => 
      it.status === 'Sudah Dikembalikan' || it.status === 'Tidak Memiliki'
    );

    const fullCleared = allApdCleared && hseApproved && gaApproved && hrdApproved;

    const nextStatus: ExitClearance['statusClearance'] = fullCleared 
      ? 'Clearance Lengkap' 
      : 'Belum Lengkap';

    setExitClearanceList(prev => prev.map(ex => {
      if (ex.id === selectedClearance.id) {
        return {
          ...ex,
          itemsChecklist: localItemsChecklist,
          statusClearance: nextStatus,
          verifikasiHse: hseApproved ? {
            petugas: "Ilham Akbar Rialdin (HSE)",
            status: true,
            catatan: catatanText || "Seluruh APD diverifikasi hobi.",
            ttd: "ILHAM_HSE_EXIT_OK",
            tanggal: "2026-05-30"
          } : null,
          verifikasiGa: gaApproved ? {
            petugas: "Heri Tan (GA)",
            status: true,
            catatan: "Inventaris logistik aman.",
            ttd: "HERITAN_GA_EXIT_OK",
            tanggal: "2026-05-30"
          } : null,
          verifikasiHrd: hrdApproved ? {
            petugas: "Moh. Irfan (HRD)",
            status: true,
            catatan: "Selesai diindex berkas pegawai.",
            ttd: "MOH_IRFAN_HRD_EXIT_OK",
            tanggal: "2026-05-30"
          } : null
        };
      }
      return ex;
    }));

    // Update main employee status to reflect their resignation/discharge
    if (fullCleared) {
      setKaryawanList(prevK => prevK.map(k => {
        if (k.nik === selectedClearance.karyawanNik) {
          return {
            ...k,
            statusAktif: selectedClearance.alasanKeluar
          };
        }
        return k;
      }));
    }

    addAuditLog(
      "Update Exit Clearance", 
      `Meng-update status Exit Clearance ${selectedClearance.namaKaryawan} (${selectedClearance.karyawanNik}). Status Akhir: ${nextStatus}.`
    );

    setSelectedClearance(null);
    alert(`BERKAS KLIRING DISIMPAN!\nProtokol K3 terupdate secara real-time.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <UserX size={22} className="text-orange-500" />
          Exit Clearance APD (Resign & PHK)
        </h1>
        <p className="text-xs text-slate-400 mt-1">Garis pertahanan penyerahan alat pelindung diri sebelum penerbitan surat kliring resmi PT. Watu Perkasa Abadi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Antrean */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Daftar Kliring Kepegawaian</p>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {exitClearanceList.map(ex => (
              <div
                key={ex.id}
                onClick={() => setSelectedClearance(ex)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedClearance?.id === ex.id 
                    ? 'bg-orange-500/10 border-orange-500 shadow-md' 
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-750'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded font-mono font-bold text-slate-400">{ex.karyawanNik}</span>
                  <span className={`text-[9px] px-1.5 rounded font-bold uppercase ${
                    ex.statusClearance === 'Clearance Lengkap' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-550 border border-red-505/20'
                  }`}>
                    {ex.statusClearance}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1.5">{ex.namaKaryawan}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{ex.jabatan} • {ex.departemen}</p>
                <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-800/40 mt-2">
                  <span className="text-orange-500">Alasan: {ex.alasanKeluar}</span>
                  <span className="text-slate-500">{ex.tanggalKeluar}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Card */}
        <div className="lg:col-span-2">
          {selectedClearance ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Kliring Aset & Inventaris</span>
                  <h3 className="text-base font-black text-white">{selectedClearance.namaKaryawan}</h3>
                </div>
                <button onClick={() => setSelectedClearance(null)} className="text-slate-400">
                  <XSquare size={18} />
                </button>
              </div>

              {/* Dynamic APD items audit lines */}
              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verifikasi Fisik Setiap Item APD:</p>
                
                <div className="space-y-2">
                  {localItemsChecklist.map((it, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-850/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="min-w-[120px]">
                        <p className="font-bold text-white">{it.item}</p>
                        <p className="text-[10px] text-slate-500">Catatan: {it.catatan || '-'}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {['Sudah Dikembalikan', 'Belum Dikembalikan', 'Tidak Memiliki', 'Hilang'].map(st => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleUpdateItemStatus(idx, st as any)}
                            className={`px-2 py-1 rounded text-[10px] font-bold ${
                              it.status === st 
                                ? st === 'Sudah Dikembalikan' ? 'bg-emerald-650 text-white' : 'bg-red-650 text-white'
                                : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <input 
                        type="text" 
                        placeholder="Ubah catatan detail..."
                        value={it.catatan}
                        onChange={(e) => handleUpdateItemCatatan(idx, e.target.value)}
                        className="p-1 px-2.5 bg-slate-900/60 border border-slate-800 text-[10px] text-slate-300 rounded max-w-[140px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Approvals */}
              <div className="space-y-2 pt-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Persetujuan Otorisasi Kepala Divisi:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                  
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold">1. HSE Coordinator (Ilham)</p>
                    <button
                      type="button"
                      onClick={() => setHseApproved(!hseApproved)}
                      className={`w-full py-1.5 rounded font-bold text-xs ${
                        hseApproved ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {hseApproved ? 'APPROVED' : 'APPROVE'}
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold">2. GA Logistik (Heri Tan)</p>
                    <button
                      type="button"
                      onClick={() => setGaApproved(!gaApproved)}
                      className={`w-full py-1.5 rounded font-bold text-xs ${
                        gaApproved ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {gaApproved ? 'APPROVED' : 'APPROVE'}
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold">3. HRD Admin (Moh. Irfan)</p>
                    <button
                      type="button"
                      onClick={() => setHrdApproved(!hrdApproved)}
                      className={`w-full py-1.5 rounded font-bold text-xs ${
                        hrdApproved ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {hrdApproved ? 'APPROVED' : 'APPROVE'}
                    </button>
                  </div>

                </div>
              </div>

              {/* General notes */}
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Catatan Tambahan untuk File Personil</label>
                <textarea
                  placeholder="Catatan verifikasi kepemilikan APD..."
                  value={catatanText}
                  onChange={(e) => setCatatanText(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-white rounded-lg h-16 resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => {
                    if (window.confirm(`Apakah Anda yakin ingin menghapus data Karyawan ini (${selectedClearance.namaKaryawan}) beserta seluruh status clearancenya secara PERMANEN dari sistem PT. WPA?`)) {
                      // Remove from employee list
                      setKaryawanList(prevK => prevK.filter(k => k.nik !== selectedClearance.karyawanNik));
                      // Remove from clearance list
                      setExitClearanceList(prevEx => prevEx.filter(ex => ex.id !== selectedClearance.id));
                      addAuditLog(
                        "Hapus Data Karyawan & Clearance",
                        `Menghapus karyawan ${selectedClearance.namaKaryawan} (${selectedClearance.karyawanNik}) dari master data system.`
                      );
                      setSelectedClearance(null);
                      alert(`[BERHASIL] Karyawan "${selectedClearance.namaKaryawan}" dan data Clearance telah dihapus permanen dari seluruh sistem.`);
                    }
                  }}
                  className="bg-red-650 hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded shadow mr-auto flex items-center gap-1 transition-all"
                >
                  <span>🗑️ Hapus Data Karyawan</span>
                </button>
                <button type="button" onClick={() => setSelectedClearance(null)} className="bg-slate-850 px-4 py-2 rounded text-xs font-semibold text-slate-350">Batal</button>
                <button onClick={handleSaveClearance} className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 py-2 rounded shadow">
                  Simpan Exit Clearance
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-xl p-10 text-center text-slate-500 text-xs">
              <FolderLock className="mx-auto text-slate-750 mb-2" size={32} />
              <p>Pilih salah satu personil kliring di sebelah kiri untuk meninjau ketaatan pemulangan inventaris perusahaan.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
