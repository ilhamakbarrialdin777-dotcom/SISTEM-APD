/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  XSquare, 
  RotateCcw, 
  PenTool, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  FileText,
  BadgeAlert,
  Sliders,
  Check
} from 'lucide-react';
import { PengajuanAPD, PengembalianAPD } from '../types';

interface AssessmentHseViewProps {
  pengajuanList: PengajuanAPD[];
  setPengajuanList: React.Dispatch<React.SetStateAction<PengajuanAPD[]>>;
  pengembalianList: PengembalianAPD[];
  setPengembalianList: React.Dispatch<React.SetStateAction<PengembalianAPD[]>>;
  addAuditLog: (aktivitas: string, rincian: string, status?: 'Berhasil' | 'Gagal') => void;
  currentUser: string;
}

export default function AssessmentHseView({
  pengajuanList,
  setPengajuanList,
  pengembalianList,
  setPengembalianList,
  addAuditLog,
  currentUser
}: AssessmentHseViewProps) {
  // Tabs: 'pengajuan' | 'pengembalian'
  const [activeTab, setActiveTab] = React.useState<'pengajuan' | 'pengembalian'>('pengajuan');

  // Currently reviewed items
  const [selectedRequest, setSelectedRequest] = React.useState<PengajuanAPD | null>(null);
  const [selectedReturn, setSelectedReturn] = React.useState<PengembalianAPD | null>(null);

  // Review Input states
  const [hseRekomendasi, setHseRekomendasi] = React.useState<'Disetujui' | 'Ditolak' | 'Revisi'>('Disetujui');
  const [hseCatatan, setHseCatatan] = React.useState('');
  const [hseSignatureData, setHseSignatureData] = React.useState('IlhamAkbar_HSE_OK');
  const [isSigned, setIsSigned] = React.useState(false);

  // Return validation details
  const [returnStatus, setReturnStatus] = React.useState<'Diterima' | 'Ditolak' | 'Assessment Lanjutan'>('Diterima');
  const [returnCatatan, setReturnCatatan] = React.useState('');

  // Sorter
  const pendingRequests = pengajuanList.filter(p => p.statusAlur === 'Verifikasi HSE');
  const pendingReturns = pengembalianList.filter(r => r.statusVerifikasi === 'Menunggu Verifikasi');

  // Approve Request Flow (Progress to GA verification)
  const handleApproveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    if (!hseCatatan.trim()) {
      alert('Sistem Menolak: Mohon tulis catatan hasil assessment kelayakan APD.');
      return;
    }

    setPengajuanList(prev => prev.map(p => {
      if (p.id === selectedRequest.id) {
        // Progress to "Persetujuan GA" on successful verification
        return {
          ...p,
          statusAlur: hseRekomendasi === 'Revisi' ? 'Verifikasi HSE' : hseRekomendasi === 'Ditolak' ? 'Verifikasi HSE' : 'Persetujuan GA', // Custom routing based on decision
          verifikasiHse: {
            petugas: "Ilham Akbar Rialdin (HSE Coordinator)",
            rekomendasi: hseRekomendasi,
            catatan: hseCatatan,
            tanggal: "2026-05-30",
            ttd: hseSignatureData
          }
        };
      }
      return p;
    }));

    addAuditLog(
      "Verifikasi HSE Selesai", 
      `HSE Ilham Akbar Rialdin meminimalkan risiko pengajuan ${selectedRequest.nomorPengajuan} dengan rekomendasi: ${hseRekomendasi}.`
    );

    setSelectedRequest(null);
    setHseCatatan('');
    setIsSigned(false);
    alert(`VERIFIKASI TERSIMPAN!\nStatus Pengajuan telah bergeser ke: Persetujuan Logistik Gudang (GA Heri Tan).`);
  };

  // Verify Return Fluid State
  const handleVerifyReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturn) return;
    if (!returnCatatan.trim()) {
      alert('Tulis catatan verifikasi kondisi barang yang dipulangkan.');
      return;
    }

    setPengembalianList(prev => prev.map(r => {
      if (r.id === selectedReturn.id) {
        return {
          ...r,
          statusVerifikasi: returnStatus,
          catatanVerifikasi: returnCatatan,
          petugasHse: "Ilham Akbar Rialdin (HSE Coordinator)",
          tanggalVerifikasi: "2026-05-30"
        };
      }
      return r;
    }));

    addAuditLog(
      "Verifikasi Retur APD", 
      `Ilham Akbar Rialdin mem-verifikasi retur ${selectedReturn.nomorPengembalian} dengan status ${returnStatus}.`
    );

    setSelectedReturn(null);
    setReturnCatatan('');
    alert(`AUDIT RETUR TERSIMPAN!\nBarang berhasil dibukukan dengan status: ${returnStatus}.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck size={22} className="text-emerald-500" />
            Terminal Verifikasi & Assessment HSE
          </h1>
          <p className="text-xs text-slate-400 mt-1">Uji kelayakan APD usang, pastikan ketaatan PPE standard operasional penambang PT. WPA.</p>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-bold font-mono">
          Petugas: Ilham Akbar Rialdin
        </span>
      </div>

      {/* Selector Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => { setActiveTab('pengajuan'); setSelectedRequest(null); }}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider relative transition-all ${
            activeTab === 'pengajuan' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-500'
          }`}
        >
          Verifikasi Pengajuan APD ({pendingRequests.length})
        </button>
        <button
          onClick={() => { setActiveTab('pengembalian'); setSelectedReturn(null); }}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider relative transition-all ${
            activeTab === 'pengembalian' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-500'
          }`}
        >
          Verifikasi Pengembalian/Bangkai ({pendingReturns.length})
        </button>
      </div>

      {/* Main split dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Items Queue */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Antrean Dokumen Menunggu Audit</p>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {activeTab === 'pengajuan' ? (
              pendingRequests.map((req) => (
                <div 
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedRequest?.id === req.id 
                      ? 'bg-orange-500/10 border-orange-500 shadow-md' 
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-orange-400 font-bold">{req.nomorPengajuan}</span>
                    <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold uppercase">HSE Pending</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">{req.namaKaryawan}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{req.jabatan} • {req.departemen}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/40 text-[10px] text-slate-400">
                    <span>Masa Kerja: {req.masaKerja}</span>
                    <span className="font-bold text-slate-300">{req.items.length} Item APD</span>
                  </div>
                </div>
              ))
            ) : (
              pendingReturns.map((ret) => (
                <div 
                  key={ret.id}
                  onClick={() => setSelectedReturn(ret)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedReturn?.id === ret.id 
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-md' 
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{ret.nomorPengembalian}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 rounded font-bold uppercase">Uji Bangkai</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">{ret.namaKaryawan}</h4>
                  <p className="text-[10px] text-slate-400">{ret.jenisApd}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/40 text-[10px]">
                    <span className="text-rose-400 font-bold">Kondisi: {ret.kondisi}</span>
                    <span className="text-slate-500">{ret.tanggalPengembalian}</span>
                  </div>
                </div>
              ))
            )}

            {((activeTab === 'pengajuan' && pendingRequests.length === 0) || 
              (activeTab === 'pengembalian' && pendingReturns.length === 0)) && (
              <div className="text-center py-10">
                <CheckCircle2 className="mx-auto text-emerald-500 animate-pulse mb-2" size={32} />
                <p className="text-xs text-slate-400">Kerja Bagus! Seluruh antrean draf HSE saat ini bersih tuntas.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Approval Interface */}
        <div className="lg:col-span-2">
          {activeTab === 'pengajuan' && selectedRequest && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Meninjau Berkas Pengajuan</span>
                  <h3 className="text-base font-black text-white">{selectedRequest.nomorPengajuan}</h3>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="text-slate-500 hover:text-white">
                  <XSquare size={20} />
                </button>
              </div>

              {/* Employee Summary block */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500">Nama Pekerja / NIK:</p>
                  <p className="font-bold text-white mt-0.5">{selectedRequest.namaKaryawan} / {selectedRequest.karyawanNik}</p>
                  <p className="text-slate-400 mt-1">Masa Kerja: <strong className="text-emerald-400">{selectedRequest.masaKerja}</strong></p>
                </div>
                <div>
                  <p className="text-slate-500">Alasan Kebutuhan APD:</p>
                  <p className="font-semibold text-orange-400 mt-0.5">{selectedRequest.alasanPengajuan}</p>
                  <p className="text-slate-500 mt-1">Jabatan: <span className="text-white">{selectedRequest.jabatan}</span></p>
                </div>
              </div>

              {/* Requested APD items list */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Item APD yang Diminta:</p>
                <div className="divide-y divide-slate-800 text-xs text-slate-300">
                  {selectedRequest.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 text-xs">
                      <div>
                        - <strong className="text-white">{item.kategori}</strong> ({item.detail})
                      </div>
                      <span className="font-mono bg-slate-950 px-2 py-0.5 rounded font-bold text-white">{item.jumlah} Pcs</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* HSE verification form */}
              <form onSubmit={handleApproveRequest} className="space-y-4 pt-3 border-t border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1.5">Rekomendasi HSE*</label>
                    <select
                      value={hseRekomendasi}
                      onChange={(e) => setHseRekomendasi(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg focus:border-orange-500"
                    >
                      <option value="Disetujui">DISETUJUI (Layak dipenuhi gudang)</option>
                      <option value="Ditolak">DITOLAK (Daftar APD tidak sesuai risiko)</option>
                      <option value="Revisi">REVISI (Karyawan harus input ulang ukuran)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1.5">Tanda Tangan Digital Pemeriksa</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-950 px-3 py-2 border border-slate-850 rounded-lg text-emerald-400 font-mono text-xs flex items-center justify-between">
                        <span>{isSigned ? hseSignatureData : 'BELUM DITANDATANGANI'}</span>
                        {isSigned && <Check size={14} className="text-emerald-400" />}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSigned(true);
                          setHseSignatureData(`ILHAM_HSE_${selectedRequest.id}_OK`);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-xs text-white px-3 border border-slate-700 rounded-lg flex items-center gap-1"
                      >
                        <PenTool size={12} className="text-orange-500" />
                        Bubuhkan
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Catatan Verifikasi & Assessment Kerusakan APD*</label>
                  <textarea
                    required
                    placeholder="Contoh: Telah dicek bangkai wearpack lama sobek karena kerja, dan helm safety retak akibat benturan kecil. Layak diganti baru demi keselamatan kerja."
                    value={hseCatatan}
                    onChange={(e) => setHseCatatan(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-white rounded-lg h-24 resize-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Sertakan analisis kesesuaian risiko k3 sebelum menyerahkan ke admin logistik gudang.</p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => {
                      if (window.confirm(`Apakah Anda yakin ingin menghapus berkas dokumen pengajuan ini (${selectedRequest.nomorPengajuan}) secara permanen?`)) {
                        setPengajuanList(prev => prev.filter(p => p.id !== selectedRequest.id));
                        addAuditLog("Hapus Dokumen Pengajuan", `HSE menghapus dokumen pengajuan ${selectedRequest.nomorPengajuan} milik Karyawan ${selectedRequest.namaKaryawan}.`);
                        setSelectedRequest(null);
                        alert('[SUKSES] Dokumen pengajuan berhasil dihapus secara permanen.');
                      }
                    }} 
                    className="bg-red-650 hover:bg-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg mr-auto flex items-center gap-1.5 transition-all"
                  >
                    <span>🗑️ Hapus Dokumen</span>
                  </button>
                  <button type="button" onClick={() => setSelectedRequest(null)} className="bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-lg">Batal</button>
                  <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow font-semibold">Kirim Hasil Assessment HSE</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'pengembalian' && selectedReturn && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Audit Bangkai Barang Masuk</span>
                  <h3 className="text-base font-black text-white">{selectedReturn.nomorPengembalian}</h3>
                </div>
                <button onClick={() => setSelectedReturn(null)} className="text-slate-500 hover:text-white">
                  <XSquare size={20} />
                </button>
              </div>

              {/* Info panel of the return */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-xs">
                  <p className="text-slate-400"><strong>Pekerja Penyerah:</strong> {selectedReturn.namaKaryawan} ({selectedReturn.karyawanNik})</p>
                  <p className="text-slate-400"><strong>Item APD:</strong> {selectedReturn.jenisApd}</p>
                  <p className="text-slate-400"><strong>Klaim Kondisi Awal:</strong> <strong className="text-rose-400">{selectedReturn.kondisi}</strong></p>
                  <p className="text-slate-400"><strong>Waktu Retur:</strong> {selectedReturn.tanggalPengembalian}</p>
                </div>
                
                {/* Images view */}
                <div className="flex gap-2">
                  <div className="flex-1 text-center">
                    <p className="text-[10px] text-slate-500 mb-1">Foto Sisa APD</p>
                    <div className="h-24 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                      <img src={selectedReturn.fotoApd} alt="APD" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-[10px] text-slate-500 mb-1">Foto Bukti Bangkai</p>
                    <div className="h-24 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                      <img src={selectedReturn.fotoBangkaiApd} alt="Bangkai" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* HSE return verification form */}
              <form onSubmit={handleVerifyReturn} className="space-y-4 pt-4 border-t border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1.5">Hasil Audit HSE</label>
                    <select
                      value={returnStatus}
                      onChange={(e) => setReturnStatus(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg"
                    >
                      <option value="Diterima">DITERIMA (Sesuai & bangkai diarsip)</option>
                      <option value="Ditolak">DITOLAK (Bangkai palsu / tidak cocok)</option>
                      <option value="Assessment Lanjutan">ASSESSMENT LANJUTAN (Uji lab K3)</option>
                    </select>
                  </div>
                  <div className="flex items-end text-xs text-slate-500 pb-2">
                    Verifikator HSE bertanggung jawab penuh atas pencatatan inventaris usang.
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Investigasi / Catatan Audit*</label>
                  <textarea
                    required
                    placeholder="Tulis rincian fisik bangkai, contoh: Terverifikasi. Wearpack orisinal PT. WPA, logo sobek di lengan kiri bawah, diserahkan dalam keadaan tercuci."
                    value={returnCatatan}
                    onChange={(e) => setReturnCatatan(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-white rounded-lg h-22 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => {
                      if (window.confirm(`Apakah Anda yakin ingin menghapus dokumen pengembalian ini (${selectedReturn.nomorPengembalian}) secara permanen?`)) {
                        setPengembalianList(prev => prev.filter(r => r.id !== selectedReturn.id));
                        addAuditLog("Hapus Dokumen Pengembalian", `HSE menghapus berkas retur ${selectedReturn.nomorPengembalian} milik Karyawan ${selectedReturn.namaKaryawan}.`);
                        setSelectedReturn(null);
                        alert('[SUKSES] Dokumen pengembalian berhasil dihapus secara permanen.');
                      }
                    }} 
                    className="bg-red-650 hover:bg-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg mr-auto flex items-center gap-1.5 transition-all"
                  >
                    <span>🗑️ Hapus Dokumen</span>
                  </button>
                  <button type="button" onClick={() => setSelectedReturn(null)} className="bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-lg">Batal</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow">Simpan Hasil Audit Retur</button>
                </div>
              </form>
            </div>
          )}

          {!selectedRequest && !selectedReturn && (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-xl p-10 text-center text-slate-500 text-xs">
              <Sliders className="mx-auto text-slate-700 mb-2.5" size={32} />
              <p>Pilih berkas pengajuan atau pengembalian APD di panel samping kiri untuk memulai assessment ketaatan k3.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
