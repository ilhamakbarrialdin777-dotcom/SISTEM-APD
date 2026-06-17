/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  Users, 
  XSquare, 
  QrCode, 
  Camera, 
  PenTool, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { PengajuanAPD } from '../types';

interface SerahTerimaViewProps {
  pengajuanList: PengajuanAPD[];
  setPengajuanList: React.Dispatch<React.SetStateAction<PengajuanAPD[]>>;
  addAuditLog: (aktivitas: string, rincian: string, status?: 'Berhasil' | 'Gagal') => void;
  currentUser: string;
}

export default function SerahTerimaView({
  pengajuanList,
  setPengajuanList,
  addAuditLog,
  currentUser
}: SerahTerimaViewProps) {
  const [selectedReq, setSelectedReq] = React.useState<PengajuanAPD | null>(null);

  // Serah Terima states
  const [receipientSign, setReceipientSign] = React.useState('Karyawan_Ttd_Penerimaan');
  const [isSigned, setIsSigned] = React.useState(false);
  const [cameraSnap, setCameraSnap] = React.useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300'); // mock safety guy pic
  const [snapshotTaken, setSnapshotTaken] = React.useState(false);

  // Retrieve pending delivery requests
  const deliveryRequests = pengajuanList.filter(p => p.statusAlur === 'Serah Terima');

  const handleTakeSnapshot = () => {
    setSnapshotTaken(true);
    setCameraSnap('https://images.unsplash.com/photo-1579684389782-64d84b5e901d?q=80&w=300&h=200&fit=crop');
    alert('Gambar Berhasil Diambil: Kamera menguji penyerahan rompi/helm baru.');
  };

  const handleCompleteHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    if (!isSigned) {
      alert('Karyawan WAJIB membubuhkan tanda tangan penerimaan digital.');
      return;
    }
    if (!snapshotTaken) {
      alert('Ambil foto serah terima APD dengan menekan tombol kamera.');
      return;
    }

    setPengajuanList(prev => prev.map(p => {
      if (p.id === selectedReq.id) {
        return {
          ...p,
          statusAlur: "Selesai", // Completed Transaction!
          serahTerima: {
            petugasHse: "Ilham Akbar Rialdin (HSE)",
            penerimaTtd: receipientSign,
            fotoBukti: cameraSnap,
            tanggal: "2026-05-30"
          }
        };
      }
      return p;
    }));

    addAuditLog(
      "Serah Terima APD", 
      `Serah terima APD ${selectedReq.nomorPengajuan} kepada karyawan ${selectedReq.namaKaryawan} selesai ditandatangani.`
    );

    setSelectedReq(null);
    setIsSigned(false);
    setSnapshotTaken(false);
    alert(`TRANSAKSI SELESAI!\nSirkulasi APD telah ditutup. Riwayat kepegawaian tervalidasi 100%.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CheckCircle size={22} className="text-emerald-500 animate-pulse" />
            Langkah 5: Serah Terima APD & Bukti Foto
          </h1>
          <p className="text-xs text-slate-400 mt-1">Langkah akhir penutupan sirkulasi APD PT Watu Perkasa Abadi bertandatangan penerima.</p>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-bold">
          Handover Terminal
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Unfinished deliverable logs */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Antrean Handover Selesai HRD</p>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {deliveryRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedReq?.id === req.id 
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-md' 
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{req.nomorPengajuan}</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase">Ready Handover</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1.5">{req.namaKaryawan}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{req.jabatan}</p>
                <div className="flex items-center justify-between mt-3 pt-2 text-[10px] border-t border-slate-800">
                  <span className="text-slate-400 font-medium">Arsip HR: {req.pelaporanHrd?.statusArsip}</span>
                  <span className="font-bold text-white">{req.items.length} APD</span>
                </div>
              </div>
            ))}

            {deliveryRequests.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
                <p className="text-xs">Hebat! Seluruh serah terima lapangan hari ini selesai didistribusikan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Deliver form panel */}
        <div className="lg:col-span-2">
          {selectedReq ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Verifikasi Tanda Terima Fisik</span>
                  <h3 className="text-base font-black text-white">{selectedReq.nomorPengajuan}</h3>
                </div>
                <button onClick={() => setSelectedReq(null)} className="text-slate-500 hover:text-white">
                  <XSquare size={20} />
                </button>
              </div>

              {/* Items to handover and QR Code generation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="md:col-span-2 bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2 text-xs">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Item APD Baru yang Diserahkan:</p>
                  
                  <div className="divide-y divide-slate-900">
                    {selectedReq.items.map((it, i) => (
                      <div key={i} className="flex justify-between py-1.5 text-xs">
                        <span className="text-slate-300">- {it.kategori} ({it.detail})</span>
                        <span className="font-bold text-emerald-400 font-mono">{it.jumlah} Unit</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-900 leading-relaxed">
                    Petugas Handover: <strong>Ilham Akbar Rialdin (HSE)</strong>
                  </div>
                </div>

                {/* Handover QR Code */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-center flex flex-col items-center justify-center space-y-1">
                  <QrCode size={48} className="text-white mx-auto animate-pulse" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">QR Verification</p>
                  <p className="text-[8px] font-mono text-slate-500">{selectedReq.id}</p>
                </div>

              </div>

              {/* Recipient signature and physical photo capture */}
              <form onSubmit={handleCompleteHandover} className="space-y-4 pt-4 border-t border-slate-800">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Photo validation frame */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-2.5 text-center">
                    <p className="text-[11px] font-bold text-slate-400 uppercase block text-left">Dokumentasi Serah Terima APD*</p>
                    <div className="h-28 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={cameraSnap} alt="Snapshot Penerima" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={handleTakeSnapshot}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 rounded border border-slate-75 * hover:border-orange-500/40 flex items-center justify-center gap-1.5"
                    >
                      <Camera size={14} className="text-orange-500 animate-pulse" />
                      Ambil Foto Bukti (Kamera Aktif)
                    </button>
                  </div>

                  {/* Receipt Sign-off */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-4 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Tanda Tangan Digital Penerima*</p>
                      <p className="text-[10px] text-slate-500 mt-1">Karyawan wajib menandatangani layar untuk mengesahkan.</p>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <div className="flex-1 bg-slate-900 py-2.5 px-3 border border-slate-800 rounded-lg text-emerald-400 font-mono font-bold flex items-center justify-between">
                        <span>{isSigned ? receipientSign : 'MENUNGGU SIGN...'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSigned(true);
                          setReceipientSign(`TTD_KARYAWAN_${selectedReq.id}_OK`);
                        }}
                        className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-3.5 rounded border border-slate-700 flex items-center gap-1 font-semibold"
                      >
                        <PenTool size={12} className="text-orange-500" />
                        Ttd
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-850">
                  <button type="button" onClick={() => setSelectedReq(null)} className="bg-slate-850 px-4 py-2 text-xs font-semibold text-slate-300 rounded">Batal</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2 rounded-lg shadow">Konfirmasi Serah Terima APD</button>
                </div>

              </form>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-xl p-10 text-center text-slate-500 text-xs">
              <ShieldCheck className="mx-auto text-slate-760 mb-2.5 animate-bounce" size={32} />
              <p>Pilih berkas yang siap diserahterimakan di panel kiri untuk membuka formulir tanda terima bertanda tangan penerima.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
