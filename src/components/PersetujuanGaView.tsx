/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  CheckSquare, 
  XSquare, 
  PenTool, 
  Package, 
  Warehouse, 
  AlertTriangle, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { PengajuanAPD, StockItem } from '../types';

interface PersetujuanGaViewProps {
  pengajuanList: PengajuanAPD[];
  setPengajuanList: React.Dispatch<React.SetStateAction<PengajuanAPD[]>>;
  stockList: StockItem[];
  setStockList: React.Dispatch<React.SetStateAction<StockItem[]>>;
  addAuditLog: (aktivitas: string, rincian: string, status?: 'Berhasil' | 'Gagal') => void;
  currentUser: string;
}

export default function PersetujuanGaView({
  pengajuanList,
  setPengajuanList,
  stockList,
  setStockList,
  addAuditLog,
  currentUser
}: PersetujuanGaViewProps) {
  const [selectedReq, setSelectedReq] = React.useState<PengajuanAPD | null>(null);

  // GA input states
  const [statusStok, setStatusStok] = React.useState<PengajuanAPD['pemeriksaanGa']['statusStok']>('Stok Available');
  const [gaCatatan, setGaCatatan] = React.useState('');
  const [nomorStokKeluar, setNomorStokKeluar] = React.useState('');
  const [gaSignature, setGaSignature] = React.useState('HeriTan_GA_Approved');
  const [isSigned, setIsSigned] = React.useState(false);

  // List of requests waiting GA approval
  const pendingRequests = pengajuanList.filter(p => p.statusAlur === 'Persetujuan GA');

  // Auto generate stock out number when a request is opened
  React.useEffect(() => {
    if (selectedReq) {
      const randNo = Math.floor(10000 + Math.random() * 90000);
      setNomorStokKeluar(`STK-OUT-2026-${randNo}`);
      setGaCatatan('Seluruh APD sesuai ukuran telah disiapkan di konter logistik gudang.');
    }
  }, [selectedReq]);

  // Submit GA stock verification
  const handleGaApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    if (!nomorStokKeluar.trim()) {
      alert('Tolong input Nomor Pengeluaran Stok/Gudang.');
      return;
    }

    // Decrement stock levels if "Stok Available"
    if (statusStok === 'Stok Available') {
      setStockList(prevStock => {
        return prevStock.map(st => {
          // Attempt to find matching stock item based on categories
          const matchingReqItem = selectedReq.items.find(ri => {
            return ri.kategori === st.kategori && st.namaBarang.includes(ri.detail);
          });
          
          if (matchingReqItem) {
            const nextQty = Math.max(0, st.jumlahStok - matchingReqItem.jumlah);
            const nextStatus = nextQty === 0 ? 'Habis' : nextQty <= st.minimumStok ? 'Stok Rendah' : 'Aman';
            return {
              ...st,
              jumlahStok: nextQty,
              statusStok: nextStatus as any,
              tanggalKeluar: "2026-05-30"
            };
          }
          return st;
        });
      });
    }

    // Update Request State: progresses to 'Pelaporan HRD' or 'Serah Terima'
    setPengajuanList(prev => prev.map(p => {
      if (p.id === selectedReq.id) {
        return {
          ...p,
          statusAlur: "Pelaporan HRD", // Forward to Moh. Irfan (HRD) to index records
          pemeriksaanGa: {
            petugas: "Heri Tan (GA Warehouse Supervisor)",
            statusStok: statusStok,
            catatan: gaCatatan,
            nomorStokKeluar: nomorStokKeluar,
            tanggal: "2026-05-30",
            ttd: gaSignature
          }
        };
      }
      return p;
    }));

    addAuditLog(
      "Persetujuan Stok GA", 
      `GA Heri Tan mengeluarkan APD nomor logistik ${nomorStokKeluar} untuk pengajuan ${selectedReq.nomorPengajuan}. Status Stok: ${statusStok}.`
    );

    setSelectedReq(null);
    setIsSigned(false);
    alert(`LOGISTIK DIAUTORISASI!\nPengeluaran disetujui. Berkas dipidahkan ke "Pelaporan HRD" untuk pengarsipan oleh Moh. Irfan.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Warehouse size={22} className="text-amber-500" />
            Persetujuan Stok & Logistik GA
          </h1>
          <p className="text-xs text-slate-400 mt-1">Kelola sirkulasi barang tambang, validasi sisa stok real-time, dan potong inventaris secara digital.</p>
        </div>
        <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-lg font-bold font-mono">
          Petugas: Heri Tan
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side queue */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Menunggu Validasi Gudang</p>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedReq?.id === req.id 
                    ? 'bg-amber-500/10 border-amber-500 shadow-md' 
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-500 font-bold">{req.nomorPengajuan}</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase">HSE OK</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1.5">{req.namaKaryawan}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{req.jabatan}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/40 text-[10px] text-slate-400">
                  <span className="truncate max-w-[120px]">Rekomendasi: {req.verifikasiHse?.rekomendasi}</span>
                  <span className="font-bold text-slate-300">{req.items.length} Item</span>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
                <p className="text-xs">Umpan logistik bersih. Belum ada antrean disetujui HSE.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side form */}
        <div className="lg:col-span-2">
          {selectedReq ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Memproses Stok Outbound</span>
                  <h3 className="text-base font-black text-white">{selectedReq.nomorPengajuan}</h3>
                </div>
                <button onClick={() => setSelectedReq(null)} className="text-slate-500 hover:text-white">
                  <XSquare size={20} />
                </button>
              </div>

              {/* HSE Assessment brief */}
              <div className="p-3 bg-emerald-500/5 text-emerald-300 border border-emerald-500/10 rounded-lg text-xs space-y-1">
                <p className="font-bold">✓ Rekomendasi Karun HSE (Ilham Akbar Rialdin):</p>
                <p className="text-[11px] text-emerald-400 italic">"{selectedReq.verifikasiHse?.catatan}"</p>
              </div>

              {/* Required apparel items */}
              <div className="space-y-2.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cek Ketersediaan Fisik Barang:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {selectedReq.items.map((item, idx) => {
                    // Match visual stock helpers
                    const matchIndex = stockList.findIndex(st => st.kategori === item.kategori && st.namaBarang.includes(item.detail));
                    const matchStock = matchIndex > -1 ? stockList[matchIndex].jumlahStok : 0;
                    
                    return (
                      <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-850/80 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{item.kategori}</p>
                          <p className="text-[10px] text-slate-500">Detail: {item.detail}</p>
                          <p className="text-[10px] mt-1">Stok Tersedia: <b className={matchStock === 0 ? 'text-red-500 animate-pulse' : matchStock <= 5 ? 'text-amber-500' : 'text-emerald-400'}>{matchStock} Pcs</b></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-500">Dibutuhkan</p>
                          <p className="font-mono font-bold text-base text-orange-500">{item.jumlah} Pcs</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GA execution form */}
              <form onSubmit={handleGaApproval} className="space-y-4 pt-3 border-t border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1.5">Status Pengeluaran Gudang</label>
                    <select
                      value={statusStok}
                      onChange={(e) => setStatusStok(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg focus:border-orange-500"
                    >
                      <option value="Stok Available">Stok Tersedia (Siap dikeluarkan)</option>
                      <option value="Stok Unavailable">Stok Tidak Tersedia (Kosong)</option>
                      <option value="Pengadaan Diperlukan">Pengadaan Diperlukan (Order vendor baru)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Nomor Pengeluaran Stok (Auto-Gen)*</label>
                    <input
                      type="text"
                      required
                      placeholder="Spt: STK-OUT-2026-9031"
                      value={nomorStokKeluar}
                      onChange={(e) => setNomorStokKeluar(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-emerald-400 font-mono rounded-lg focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Catatan Outflow GA*</label>
                    <textarea
                      required
                      placeholder="Tulis ulasan ketersediaan..."
                      value={gaCatatan}
                      onChange={(e) => setGaCatatan(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-white rounded-lg h-20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1.5">Otorisasi Heri Tan (GA Ttd)</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-950 px-3 py-2.5 border border-slate-850 rounded-lg text-amber-500 font-mono text-xs flex items-center justify-between">
                        <span>{isSigned ? gaSignature : 'BELUM DITANDATANGANI'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSigned(true);
                          setGaSignature(`HERITAN_GA_OUT_${selectedReq.id}_OK`);
                        }}
                        className="bg-slate-800 hover:bg-slate-750 text-xs text-slate-300 px-3 rounded-lg border border-slate-700 flex items-center gap-1"
                      >
                        <PenTool size={12} className="text-amber-500" />
                        Ttd
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setSelectedReq(null)} className="bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-lg">Batal</button>
                  <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow">Setujui & Kurangi Stok</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-xl p-10 text-center text-slate-500 text-xs">
              <Package className="mx-auto text-slate-700 mb-2.5animate-pulse" size={32} />
              <p>Pilih tumpukan berkas yang telah diverifikasi HSE di sebelah kiri untuk melakukan review kuantitas sisa barang tambang.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
