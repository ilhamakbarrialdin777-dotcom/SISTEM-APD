/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  TrendingUp, 
  AlertOctagon, 
  ClipboardCheck, 
  CheckSquare, 
  Calendar, 
  Search, 
  Package, 
  User, 
  RefreshCcw,
  Sparkles,
  X
} from 'lucide-react';
import { StockItem } from '../types';

interface MonitoringStokViewProps {
  stockList: StockItem[];
  setStockList: React.Dispatch<React.SetStateAction<StockItem[]>>;
  addAuditLog: (aktivitas: string, rincian: string, status?: 'Berhasil' | 'Gagal') => void;
}

export default function MonitoringStokView({
  stockList,
  setStockList,
  addAuditLog
}: MonitoringStokViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterKategori, setFilterKategori] = React.useState('Semua');

  // Input states for mock manual replenishment
  const [replenishItem, setReplenishItem] = React.useState<StockItem | null>(null);
  const [addonQty, setAddonQty] = React.useState(50);

  // States for Editing Stock Item Names
  const [editingStockId, setEditingStockId] = React.useState<string | null>(null);
  const [editingStockName, setEditingStockName] = React.useState('');

  const handleDeleteStock = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus barang "${name}" dari catatan inventaris secara PERMANEN?`)) {
      setStockList(prev => prev.filter(s => s.id !== id));
      addAuditLog("Hapus Barang Stok", `Menghapus item inventaris ${name} dari daftar stock monitoring.`);
      alert(`[SUKSES] Barang ${name} berhasil dihapus dari sistem.`);
    }
  };

  const handleSaveStockName = (id: string) => {
    if (!editingStockName.trim()) {
      alert("Nama barang tidak boleh kosong.");
      return;
    }
    setStockList(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, namaBarang: editingStockName.trim() };
      }
      return s;
    }));
    addAuditLog("Edit Nama Barang Stok", `Mengubah nama barang stok menjadi "${editingStockName.trim()}".`);
    setEditingStockId(null);
  };

  // List of items under limit
  const alertItems = stockList.filter(s => s.jumlahStok <= s.minimumStok);

  const filterKategories = ['Semua', ...Array.from(new Set(stockList.map(s => s.kategori)))];

  const filteredStock = stockList.filter(s => {
    const matchSearch = s.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) || s.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterKategori === 'Semua' || s.kategori === filterKategori;
    return matchSearch && matchCat;
  });

  const handleReplenishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replenishItem) return;

    setStockList(prev => prev.map(s => {
      if (s.id === replenishItem.id) {
        const nextQty = s.jumlahStok + addonQty;
        return {
          ...s,
          jumlahStok: nextQty,
          statusStok: nextQty <= s.minimumStok ? 'Stok Rendah' : 'Aman',
          tanggalMasuk: "2026-05-30"
        };
      }
      return s;
    }));

    addAuditLog("Sirkulasi Terima Barang", `Bekerja melakukan penambahan stok ${replenishItem.namaBarang} sebanyak ${addonQty} unit.`);
    setReplenishItem(null);
    alert('Penambahan stok diotorisasi secara instan!');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <TrendingUp size={22} className="text-orange-500" />
          Sirkulasi & Monitoring Stok APD Real-time
        </h1>
        <p className="text-xs text-slate-400 mt-1">Status ketersediaan inventaris keselamatan tambang terintegrasi langsung dengan pemotongan otomatis oleh GA.</p>
      </div>

      {/* Critical Stock Alerts banner */}
      {alertItems.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <AlertOctagon size={16} className="text-rose-500 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">Alarm Stok Kritis / Di bawah Minimum Peringatan ({alertItems.length} APD)</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Sistem mendeteksi {alertItems.length} item pengaman di bawah spesifikasi mitigasi kecelakaan. Mohon ajukan pengadaan baru ke divisi procurement PT. WPA sesegera mungkin.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {alertItems.map((item, idx) => (
              <span key={idx} className="bg-slate-950 border border-rose-500/40 text-[10px] px-2.5 py-1 rounded font-mono font-bold text-slate-200">
                ⚠️ {item.namaBarang}: Tinggal {item.jumlahStok} Pcs left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Predictive engine metrics box */}
      <div className="bg-gradient-to-r from-orange-600/10 to-indigo-600/10 border border-slate-800 rounded-2xl p-5 shadow-inner">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-orange-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-200">Prediksi Kebutuhan APD (Historical ML-Predictive Core)</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Berdasarkan histori pemakaian sirkulasi APD PT Watu Perkasa Abadi pada triwulan pertama, berikut adalah analisis estimasi pengadaan menjelang Q3 2026:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Helm Safety Putih/Kuning</p>
            <p className="text-sm font-bold text-white mt-1">Estimasi Kebutuhan <span className="text-orange-500 font-mono font-bold">50 Unit</span></p>
            <p className="text-[10px] text-emerald-400 mt-1">Tingkat akurasi data 91%</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Pakaian Kerja XL & L size</p>
            <p className="text-sm font-bold text-white mt-1">Estimasi Kebutuhan <span className="text-orange-500 font-mono font-bold">85 Stel</span></p>
            <p className="text-[10px] text-emerald-400 mt-1">Tren meningkat 14% karena karyawan baru</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Sarung Tangan Kulit Lapangan</p>
            <p className="text-sm font-bold text-white mt-1">Estimasi Kebutuhan <span className="text-orange-500 font-mono font-bold">120 Pcs</span></p>
            <p className="text-[10px] text-slate-400 mt-1">Masa pakai habis rata-rata 3 mgg</p>
          </div>
        </div>
      </div>

      {/* Grid search and table list */}
      <div className="space-y-3">
        <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
              <Search size={14} />
            </span>
            <input 
              type="text" 
              placeholder="Cari Kode Barang, Nama, Lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Kategori APD:</span>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-800 text-slate-200 py-1.5 px-3 rounded-lg focus:outline-none"
            >
              {filterKategories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-time Inventory list table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[10px]">
                <tr>
                  <th className="p-3">Kode Barang</th>
                  <th className="p-3">Nama Alat Pelindung Diri</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Lokasi Penyimpanan</th>
                  <th className="p-3 text-center">Stok Fisik</th>
                  <th className="p-3 text-center">Minimum</th>
                  <th className="p-3">Tanggal Masuk</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Aksi Gudang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStock.map((item) => {
                  const isCrit = item.jumlahStok <= item.minimumStok;
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-950/25">
                      <td className="p-3 font-mono font-bold text-orange-400">{item.kodeBarang}</td>
                      <td className="p-3 font-semibold text-white">
                        {editingStockId === item.id ? (
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="text" 
                              value={editingStockName} 
                              onChange={(e) => setEditingStockName(e.target.value)}
                              className="text-xs p-1 px-1.5 bg-slate-950 border border-orange-500 rounded text-white font-semibold flex-1 min-w-[120px]"
                            />
                            <button 
                              onClick={() => handleSaveStockName(item.id)}
                              className="text-emerald-400 hover:text-emerald-300 font-extrabold text-sm p-0.5 px-1 bg-slate-950 border border-slate-850 rounded"
                              title="Simpan"
                            >
                              ✓
                            </button>
                            <button 
                              onClick={() => setEditingStockId(null)}
                              className="text-rose-500 hover:text-rose-400 font-extrabold text-sm p-0.5 px-1.5 bg-slate-950 border border-slate-850 rounded"
                              title="Batal"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{item.namaBarang}</span>
                            <button 
                              onClick={() => {
                                setEditingStockId(item.id);
                                setEditingStockName(item.namaBarang);
                              }}
                              className="opacity-60 hover:opacity-100 text-xs transition-opacity"
                              title="Edit Nama Barang"
                            >
                              ✏️
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-slate-400">{item.kategori}</td>
                      <td className="p-3 text-slate-500 italic text-[11px]">{item.lokasiPenyimpanan}</td>
                      <td className="p-3 text-center font-bold font-mono text-white text-sm bg-slate-950/20">{item.jumlahStok}</td>
                      <td className="p-3 text-center font-bold font-mono text-slate-500">{item.minimumStok}</td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{item.tanggalMasuk}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.jumlahStok === 0 ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          isCrit ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {item.jumlahStok === 0 ? 'Habis' : isCrit ? 'Stok Rendah' : 'Aman'}
                        </span>
                      </td>
                      <td className="p-3 text-center flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setReplenishItem(item)}
                          className="bg-slate-800 hover:bg-slate-700 text-[10px] text-orange-500 border border-slate-700 px-2 py-1 rounded hover:text-white hover:bg-orange-600 transition-all font-semibold cursor-pointer"
                        >
                          Isi Stok
                        </button>
                        <button
                          onClick={() => handleDeleteStock(item.id, item.namaBarang)}
                          className="bg-red-650/15 hover:bg-red-600 text-[10px] text-red-400 border border-red-500/20 px-2 py-1 rounded hover:text-white transition-all font-semibold cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Stock Replenishment Modal */}
      {replenishItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-850">
              <h2 className="text-xs font-bold text-white flex items-center gap-1">
                <RefreshCcw size={14} className="text-orange-500 animate-spin" />
                Tambah Pasokan Logistik
              </h2>
              <button onClick={() => setReplenishItem(null)} className="text-slate-400">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleReplenishSubmit} className="mt-4 space-y-4">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-850 text-xs">
                <p className="text-slate-500">Item Pengisi:</p>
                <p className="font-bold text-white mt-0.5">{replenishItem.namaBarang}</p>
                <p className="text-[10px] text-orange-400 font-mono mt-0.5">{replenishItem.kodeBarang}</p>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Jumlah Unit Tambahan</label>
                <input
                  type="number"
                  min={1}
                  value={addonQty}
                  onChange={(e) => setAddonQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded text-amber-500 font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs pt-3 border-t border-slate-850">
                <button type="button" onClick={() => setReplenishItem(null)} className="bg-slate-800 px-3 py-1.5 rounded">Batal</button>
                <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-1.5 rounded">Konfirmasi Input</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
