/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  RotateCcw, 
  Search, 
  Upload, 
  CheckCircle, 
  Info, 
  FileCheck2, 
  Plus, 
  X,
  Camera
} from 'lucide-react';
import { Karyawan, PengembalianAPD } from '../types';

interface PengembalianViewProps {
  karyawanList: Karyawan[];
  pengembalianList: PengembalianAPD[];
  setPengembalianList: React.Dispatch<React.SetStateAction<PengembalianAPD[]>>;
  addAuditLog: (aktivitas: string, rincian: string, status?: 'Berhasil' | 'Gagal') => void;
  currentUser: string;
}

export default function PengembalianView({
  karyawanList,
  pengembalianList,
  setPengembalianList,
  addAuditLog,
  currentUser
}: PengembalianViewProps) {
  // Input resolver
  const [targetNik, setTargetNik] = React.useState('');
  const [selectedKaryawan, setSelectedKaryawan] = React.useState<Karyawan | null>(null);

  // Form Inputs
  const [jenisApd, setJenisApd] = React.useState('Wearpack Orange (2 stel)');
  const [kondisi, setKondisi] = React.useState<PengembalianAPD['kondisi']>('Rusak Berat');
  const [fotoApdUrl, setFotoApdUrl] = React.useState('https://images.unsplash.com/photo-1540821922493-0095513ab87a?q=80&w=300'); // defaults
  const [fotoBangkaiUrl, setFotoBangkaiUrl] = React.useState('https://images.unsplash.com/photo-1540821922493-0095513ab87a?q=80&w=300');
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const [cameraType, setCameraType] = React.useState<'normal' | 'bangkai'>('normal');

  // Handle Search Employee
  const handleSearchNik = () => {
    const found = karyawanList.find(k => k.nik.toUpperCase() === targetNik.trim().toUpperCase());
    if (found) {
      setSelectedKaryawan(found);
    } else {
      alert('NIK Karyawan tidak ditemukan.');
      setSelectedKaryawan(null);
    }
  };

  // Submit Return Form
  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKaryawan) {
      alert('Silahkan pilih karyawan terlebih dahulu.');
      return;
    }

    const nextSeq = pengembalianList.length + 1;
    const padSeq = String(nextSeq).padStart(4, '0');
    const autoNomor = `RET/WPA/2026/05/${padSeq}`;

    const newReturn: PengembalianAPD = {
      id: `RET-${padSeq}`,
      nomorPengembalian: autoNomor,
      tanggalPengembalian: "2026-05-30",
      karyawanNik: selectedKaryawan.nik,
      namaKaryawan: selectedKaryawan.namaLengkap,
      jabatan: selectedKaryawan.jabatan,
      departemen: selectedKaryawan.departemen,
      jenisApd: jenisApd,
      kondisi: kondisi,
      fotoApd: fotoApdUrl,
      fotoBangkaiApd: fotoBangkaiUrl,
      statusVerifikasi: "Menunggu Verifikasi", // Goes to HSE approval queue
      catatanVerifikasi: '',
      petugasHse: '',
      tanggalVerifikasi: ''
    };

    setPengembalianList(prev => [newReturn, ...prev]);
    addAuditLog("Pengembalian APD Baru", `Mencatat retur APD ${autoNomor} (${jenisApd}) dari ${selectedKaryawan.namaLengkap}. Status: Menunggu HSE.`);
    
    // Clear
    setSelectedKaryawan(null);
    setTargetNik('');
    alert(`BERHASIL DISUBMIT!\nNomor Pengembalian: ${autoNomor}\nMenunggu verifikasi dan audit kelayakan oleh Koordinator HSE: Ilham Akbar Rialdin.`);
  };

  // Mock snapshot from camera
  const triggerCameraSnapshot = (type: 'normal' | 'bangkai') => {
    setCameraType(type);
    setIsCameraActive(true);
    setTimeout(() => {
      const mockResult = `https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?q=80&w=300&h=200&fit=crop`;
      if (type === 'normal') {
        setFotoApdUrl(mockResult);
      } else {
        setFotoBangkaiUrl(mockResult);
      }
      setIsCameraActive(false);
      alert('Kamera Berhasil Menangkap: Snapshot foto APD tersimpan secara digital.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Upper header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <RotateCcw size={22} className="text-orange-500" />
          Registrasi Pengembalian / Retur APD Lama
        </h1>
        <p className="text-xs text-slate-400 mt-1">Gunakan formulir ini untuk merekam pemulangan helm, dumi-baju, sepatu aus, atau radio HT yang rusak sebelum audit harian.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <span className="w-1.5 h-3 bg-orange-500 rounded-sm"></span>
            Langkah 1: Profil & Item Retur APD
          </h3>

          <form onSubmit={handleSubmitReturn} className="space-y-4">
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">Cari NIK Pekerja:</span>
                <input 
                  type="text" 
                  placeholder="Isi NIK (Spt: WPA-23112)"
                  value={targetNik}
                  onChange={(e) => setTargetNik(e.target.value)}
                  className="w-full text-xs pl-26 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:border-orange-500 focus:outline"
                />
              </div>
              <button 
                type="button" 
                onClick={handleSearchNik}
                className="bg-slate-850 hover:bg-slate-800 text-orange-500 font-bold text-xs px-4 rounded-lg border border-slate-700 transition-all flex items-center gap-1"
              >
                <Search size={14} />
                Hubungkan
              </button>
            </div>

            {selectedKaryawan && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Nama Karyawan</p>
                  <p className="font-bold text-white mt-0.5">{selectedKaryawan.namaLengkap}</p>
                  <p className="text-[10px] font-mono text-orange-500 font-bold">{selectedKaryawan.nik}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Jabatan / Dept</p>
                  <p className="text-slate-300 mt-0.5">{selectedKaryawan.jabatan}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedKaryawan.departemen}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Ukuran Standard</p>
                  <p className="text-slate-300 mt-0.5">Baju: <strong>Size {selectedKaryawan.ukuranBaju}</strong></p>
                  <p className="text-slate-300">Sepatu: <strong>Boot {selectedKaryawan.ukuranSepatu}</strong></p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">Jenis APD yang Dikembalikan</label>
                <input 
                  type="text" 
                  placeholder="Spt: Wearpack Orange Reflector / Helm Kuning"
                  value={jenisApd}
                  onChange={(e) => setJenisApd(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">Kondisi Fisik APD</label>
                <select
                  value={kondisi}
                  onChange={(e) => setKondisi(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg"
                >
                  <option value="Baik">Baik (Dapat disirkulasi ulang)</option>
                  <option value="Rusak Ringan">Rusak Ringan (Perlu jahit/pembersihan)</option>
                  <option value="Rusak Berat">Rusak Berat (Sol lepas / robek parah)</option>
                  <option value="Tidak Layak Pakai">Tidak Layak Pakai (Bangkai hancur)</option>
                  <option value="Hilang">Hilang (Akan dikenakan denda/BA hilang)</option>
                </select>
              </div>
            </div>

            {/* Simulated Photo upload tools (using beautiful snapshot card layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-3 relative overflow-hidden text-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-left">Foto APD Utama</p>
                <div className="h-32 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={fotoApdUrl} alt="Preview Bukti" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => triggerCameraSnapshot('normal')}
                    className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700 hover:border-orange-500 text-[10px] flex items-center gap-1.5 font-semibold"
                  >
                    <Camera size={12} className="text-orange-500" />
                    Tangkap Kamera
                  </button>
                  <label className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded border border-slate-700 text-[10px] flex items-center gap-1.5 font-semibold cursor-pointer">
                    <Upload size={12} className="text-sky-400" />
                    Pilih File
                    <input type="file" className="hidden" onChange={(e: any) => e.target.files[0] && setFotoApdUrl(URL.createObjectURL(e.target.files[0]))} />
                  </label>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-3 relative overflow-hidden text-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-left">Foto Bangkai APD Rusak (Bukti)</p>
                <div className="h-32 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={fotoBangkaiUrl} alt="Preview Bangkai" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => triggerCameraSnapshot('bangkai')}
                    className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700 hover:border-orange-500 text-[10px] flex items-center gap-1.5 font-semibold"
                  >
                    <Camera size={12} className="text-orange-500" />
                    Tangkap Kamera
                  </button>
                  <label className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded border border-slate-700 text-[10px] flex items-center gap-1.5 font-semibold cursor-pointer">
                    <Upload size={12} className="text-sky-400" />
                    Pilih File
                    <input type="file" className="hidden" onChange={(e: any) => e.target.files[0] && setFotoBangkaiUrl(URL.createObjectURL(e.target.files[0]))} />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedKaryawan}
              className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                selectedKaryawan 
                  ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg cursor-pointer' 
                  : 'bg-slate-950 border border-slate-850 text-slate-600 cursor-not-allowed'
              }`}
            >
              <FileCheck2 size={14} />
              Kirim Registrasi Pengembalian APD
            </button>

          </form>
        </div>

        {/* Info panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Info size={16} className="text-orange-500" />
            Aturan Pengembalian APD
          </h3>

          <div className="space-y-3.5 text-xs text-slate-400">
            <p>
              Setiap penukaran atau pengeluaran APD baru **WAJIB** menyerahkan barang lama (bangkai APD) kepada verifikator HSE selaku bukti fisik pertanggungjawaban.
            </p>

            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 space-y-2 text-[11px]">
              <p className="font-bold text-slate-300 uppercase">Tingkatan Penilaian:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-emerald-400">Baik</strong>: Disimpan kembali ke rak sirkulasi.</li>
                <li><strong className="text-amber-500">Rusak Ringan</strong>: Dilakukan perbaikan logistik.</li>
                <li><strong className="text-red-400">Rusak Berat</strong>: Dihancurkan & dicatat pemusnahannya.</li>
                <li><strong className="text-rose-500">Hilang</strong>: Disertai B.A. Hilang dari Leader/KTT.</li>
              </ul>
            </div>

            <div className="p-3 bg-orange-500/5 text-orange-300 rounded-lg border border-orange-500/10 text-[11px] leading-relaxed">
              <strong>Penanggung Jawab HSE:</strong><br />
              Seluruh sirkulasi pengembalian barang dan uji bangkai dikomparasi secara digital oleh koordinator HSE **Ilham Akbar Rialdin**.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
