/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  FileSpreadsheet, 
  CheckSquare, 
  Search, 
  Plus, 
  X, 
  FileCheck2, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  CornerDownRight, 
  Camera, 
  QrCode, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { Karyawan, PengajuanAPD, RequestItem } from '../types';
import { getMasaKerja } from '../mockData';

interface PengajuanViewProps {
  karyawanList: Karyawan[];
  pengajuanList: PengajuanAPD[];
  setPengajuanList: React.Dispatch<React.SetStateAction<PengajuanAPD[]>>;
  addAuditLog: (aktivitas: string, rincian: string, status?: 'Berhasil' | 'Gagal') => void;
  currentUser: string;
}

export default function PengajuanView({
  karyawanList,
  pengajuanList,
  setPengajuanList,
  addAuditLog,
  currentUser
}: PengajuanViewProps) {
  // Input resolver
  const [targetNik, setTargetNik] = React.useState('');
  const [selectedKaryawan, setSelectedKaryawan] = React.useState<Karyawan | null>(null);

  // Form states
  const [formChecklists, setFormChecklists] = React.useState({
    bangkaiDiserahkan: false,
    hilangDiaporkan: false,
    rusakDiassess: false,
    persetujuanAtasan: false
  });

  const [alasanPengajuan, setAlasanPengajuan] = React.useState<'APD Baru' | 'Penggantian Rusak' | 'Penggantian Hilang' | 'Penambahan Kebutuhan Kerja' | 'Mutasi Jabatan' | 'Karyawan Baru'>('APD Baru');

  // Cart of added PPE items
  const [addedItems, setAddedItems] = React.useState<Omit<RequestItem, 'id'>[]>([]);

  // Current item builder
  const [currCategory, setCurrCategory] = React.useState<string>('Helm Safety');
  const [currDetail, setCurrDetail] = React.useState('Putih');
  const [currQty, setCurrQty] = React.useState(1);
  const [customCategoryInput, setCustomCategoryInput] = React.useState('');
  const [customDetailInput, setCustomDetailInput] = React.useState('');

  // Auto handle details based on category
  React.useEffect(() => {
    if (currCategory === 'Helm Safety') {
      setCurrDetail('Putih');
    } else if (currCategory === 'Pakaian Kerja') {
      setCurrDetail(selectedKaryawan?.ukuranBaju || 'L');
    } else if (currCategory === 'Kacamata Safety') {
      setCurrDetail('Clear');
    } else if (currCategory === 'Sarung Tangan') {
      setCurrDetail('Katun');
    } else if (currCategory === 'Sepatu Safety') {
      setCurrDetail(selectedKaryawan?.ukuranSepatu || '42');
    } else if (currCategory === 'Radio/HT') {
      setCurrDetail('HT Digital');
    }
  }, [currCategory, selectedKaryawan]);

  // NIK Search Handler
  const handleSearchNik = () => {
    const found = karyawanList.find(k => k.nik.toUpperCase() === targetNik.trim().toUpperCase());
    if (found) {
      setSelectedKaryawan(found);
      // Auto prefilled if they are a "Karyawan Baru" or similar
      if (found.statusAktif !== 'Aktif') {
        alert(`Pekerja ${found.namaLengkap} berstatus ${found.statusAktif}. Tetap dapat diproses.`);
      }
    } else {
      alert('NIK tidak ditemukan dalam database PT. Watu Perkasa Abadi.');
      setSelectedKaryawan(null);
    }
  };

  // Add Item to List
  const handleAddItem = () => {
    if (currQty < 1) return;
    
    const finalCategory = currCategory === 'Kustom APD' ? customCategoryInput.trim() : currCategory;
    const finalDetail = currCategory === 'Kustom APD' ? customDetailInput.trim() : currDetail;

    if (!finalCategory) {
      alert('Tulis nama APD kustom terlebih dahulu.');
      return;
    }
    if (!finalDetail) {
      alert('Tulis detail atau varian spesifikasi APD.');
      return;
    }

    // Check if category already added, sum quantity
    const existsIndex = addedItems.findIndex(i => i.kategori === finalCategory && i.detail === finalDetail);
    if (existsIndex > -1) {
      const updated = [...addedItems];
      updated[existsIndex].jumlah += currQty;
      setAddedItems(updated);
    } else {
      setAddedItems(prev => [...prev, {
        kategori: finalCategory,
        detail: finalDetail,
        jumlah: currQty
      }]);
    }

    // Reset custom text values
    if (currCategory === 'Kustom APD') {
      setCustomCategoryInput('');
      setCustomDetailInput('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setAddedItems(prev => prev.filter((_, i) => i !== index));
  };

  // Checklist validation constraint
  const isPrerequisitesPassed = 
    formChecklists.bangkaiDiserahkan && 
    formChecklists.hilangDiaporkan && 
    formChecklists.rusakDiassess && 
    formChecklists.persetujuanAtasan;

  // Handle Form Submission
  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKaryawan) {
      alert('Silahkan verifikasi NIK Karyawan terlebih dahulu.');
      return;
    }
    if (!isPrerequisitesPassed) {
      alert('Sistem Menolak: Seluruh checklist wajib divalidasi sebelum mengajukan APD.');
      return;
    }
    if (addedItems.length === 0) {
      alert('Pilih dan tambahkan minimal satu item APD ke dalam daftar pengajuan.');
      return;
    }

    // Auto calculate seq
    const nextSeq = pengajuanList.length + 1;
    const padSeq = String(nextSeq).padStart(4, '0');
    const autoNomor = `REQ/WPA/2026/05/${padSeq}`;

    const newRequest: PengajuanAPD = {
      id: `REQ-${padSeq}`,
      nomorPengajuan: autoNomor,
      tanggalPengajuan: "2026-05-30",
      karyawanNik: selectedKaryawan.nik,
      namaKaryawan: selectedKaryawan.namaLengkap,
      jabatan: selectedKaryawan.jabatan,
      departemen: selectedKaryawan.departemen,
      masaKerja: getMasaKerja(selectedKaryawan.tanggalBergabung),
      alasanPengajuan: alasanPengajuan,
      checklist: { ...formChecklists },
      items: addedItems.map((item, index) => ({
        id: `ri-${Date.now()}-${index}`,
        ...item
      })),
      statusAlur: "Verifikasi HSE", // Starts at HSE approval
      verifikasiHse: null,
      pemeriksaanGa: null,
      pelaporanHrd: null,
      serahTerima: null
    };

    setPengajuanList(prev => [newRequest, ...prev]);
    addAuditLog("Pengajuan APD Baru", `Mengajukan form APD ${autoNomor} untuk ${selectedKaryawan.namaLengkap}. Status: Verifikasi HSE.`);
    
    // Reset wizard
    setTargetNik('');
    setSelectedKaryawan(null);
    setAddedItems([]);
    setFormChecklists({
      bangkaiDiserahkan: false,
      hilangDiaporkan: false,
      rusakDiassess: false,
      persetujuanAtasan: false
    });
    alert(`PENGIRIMAN SUKSES!\nNomor Pengajuan: ${autoNomor}\nSilahkan lakukan verifikasi HSE pada tab "Assessment HSE".`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <FileSpreadsheet size={22} className="text-orange-500" />
          Formulir Pengajuan APD Baru / Pengganti
        </h1>
        <p className="text-xs text-slate-400 mt-1">Sistem berstandar terpadu HSE. Enforce pengembalian bangkai & persetujuan berjenjang secara digital.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step 1 & 2: Employee lookup & Checklist Prerequisite (Strict validator block) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* NIK Lookup section */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <span className="w-1.5 h-3 bg-orange-500 rounded-sm"></span>
              Bagian 1: Identifikasi Karyawan PT. WPA
            </h3>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">NIK Karyawan:</span>
                <input 
                  type="text" 
                  placeholder="Contoh: WPA-21045"
                  value={targetNik}
                  onChange={(e) => setTargetNik(e.target.value)}
                  className="w-full text-xs pl-24 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:border-orange-500 focus:outline"
                  id="nik-search-pengajuan"
                />
              </div>
              <button 
                type="button" 
                onClick={handleSearchNik}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 rounded-lg flex items-center gap-1 transition-all"
                id="btn-search-nik"
              >
                <Search size={14} />
                Cari & Validasi
              </button>
            </div>

            {selectedKaryawan ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800/60 transition-all">
                <div className="flex items-center gap-3">
                  <img src={selectedKaryawan.fotoKaryawan} alt="" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full border border-slate-700 object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">{selectedKaryawan.namaLengkap}</h4>
                    <p className="text-xs text-orange-500 font-mono font-bold mt-0.5">{selectedKaryawan.nik}</p>
                    <p className="text-[10px] bg-slate-900 text-slate-400 font-semibold px-1.5 py-0.5 rounded border border-slate-800 inline-block mt-1">{selectedKaryawan.statusKaryawan}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1 bg-slate-900/40 p-2.5 rounded-lg">
                  <p><strong>Jabatan:</strong> {selectedKaryawan.jabatan}</p>
                  <p><strong>Departemen:</strong> {selectedKaryawan.departemen}</p>
                  <p><strong>Join Date:</strong> {selectedKaryawan.tanggalBergabung}</p>
                  <p><strong>Masa Kerja (Kalkulator):</strong> <span className="text-emerald-400 font-bold">{getMasaKerja(selectedKaryawan.tanggalBergabung)}</span></p>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500 text-xs bg-slate-950/20 border border-slate-800/40 border-dashed rounded-lg">
                Masukan NIK Karyawan tambang di atas, lalu tekan cari untuk memulai integrasi database otomatis.
              </div>
            )}
          </div>

          {/* CHECKLIST PREREQUISITE REQUIREMENT (LOCKER PANEL) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <CheckSquare size={16} className="text-orange-500" />
                Bagian 2: Prasyarat Wajib Risk Clearance (Assessment HSE)
              </span>
              {isPrerequisitesPassed ? (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Clearance Safe
                </span>
              ) : (
                <span className="text-[10px] bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lock size={12} />
                  Sistem Terkunci
                </span>
              )}
            </h3>

            <p className="text-xs text-slate-400">
              Berdasarkan Aturan Kepatuhan K3 PT Watu Perkasa Abadi, setiap karyawan **WAJIB** menyelesaikan pemeriksaan kelayakan APD lama terlebih dahulu sebelum tombol simpan dapat diaktifkan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Checklist 1: Bangkai APD diserahkan */}
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                formChecklists.bangkaiDiserahkan 
                  ? 'bg-emerald-500/5 border-emerald-500/30' 
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}>
                <input 
                  type="checkbox" 
                  checked={formChecklists.bangkaiDiserahkan}
                  onChange={(e) => setFormChecklists({...formChecklists, bangkaiDiserahkan: e.target.checked})}
                  className="mt-1 rounded border-slate-800 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-200">Bangkai APD Telah Diserahkan</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Petugas HSE mencatat fisik sisa APD lama telah masuk ke kotak pos.</p>
                </div>
              </label>

              {/* Checklist 2: APD Hilang telah dilaporkan */}
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                formChecklists.hilangDiaporkan 
                  ? 'bg-emerald-500/5 border-emerald-500/30' 
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}>
                <input 
                  type="checkbox" 
                  checked={formChecklists.hilangDiaporkan}
                  onChange={(e) => setFormChecklists({...formChecklists, hilangDiaporkan: e.target.checked})}
                  className="mt-1 rounded border-slate-800 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-200">Jika Hilang, Telah Dilaporkan</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Membuat Berita Acara kehilangan APD bermaterai atau form kehilangan.</p>
                </div>
              </label>

              {/* Checklist 3: APD Rusak diassess */}
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                formChecklists.rusakDiassess 
                  ? 'bg-emerald-500/5 border-emerald-500/30' 
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}>
                <input 
                  type="checkbox" 
                  checked={formChecklists.rusakDiassess}
                  onChange={(e) => setFormChecklists({...formChecklists, rusakDiassess: e.target.checked})}
                  className="mt-1 rounded border-slate-800 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-200">Telah Dilakukan Assessment</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Tingkat kerusakan diuji untuk mencegah penyalahgunaan barang.</p>
                </div>
              </label>

              {/* Checklist 4: Persetujuan Atasan */}
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                formChecklists.persetujuanAtasan 
                  ? 'bg-emerald-500/5 border-emerald-500/30' 
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}>
                <input 
                  type="checkbox" 
                  checked={formChecklists.persetujuanAtasan}
                  onChange={(e) => setFormChecklists({...formChecklists, persetujuanAtasan: e.target.checked})}
                  className="mt-1 rounded border-slate-800 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-200">Persetujuan Atasan Langsung</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Mendapatkan persetujuan verbal atau memo tertulis Foreman/Mngr.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Form Item Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <span className="w-1.5 h-3 bg-orange-500 rounded-sm"></span>
              Bagian 3: Pilih Item APD Tambahan
            </h3>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Kategori APD</label>
                  <select 
                    value={currCategory}
                    onChange={(e) => {
                      setCurrCategory(e.target.value);
                      if (e.target.value === 'Kustom APD') {
                        setCustomCategoryInput('');
                        setCustomDetailInput('');
                      }
                    }}
                    className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 border-orange-500/30"
                  >
                    <option value="Helm Safety">Helm Safety</option>
                    <option value="Pakaian Kerja">Pakaian Kerja (Wearpack)</option>
                    <option value="Kacamata Safety">Kacamata Safety</option>
                    <option value="Sarung Tangan">Sarung Tangan</option>
                    <option value="Sepatu Safety">Sepatu Safety</option>
                    <option value="Radio/HT">Radio/HT Komunikasi</option>
                    <option value="Kustom APD">Kustom APD Lainnya / Manual (+)</option>
                  </select>
                </div>

                {currCategory !== 'Kustom APD' ? (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Detail Ukuran / Varian</label>
                    {currCategory === 'Helm Safety' && (
                      <select value={currDetail} onChange={(e) => setCurrDetail(e.target.value)} className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200">
                        <option value="Putih">Warna Putih (Staff/Supv)</option>
                        <option value="Kuning">Warna Kuning (Operator/Helper)</option>
                        <option value="Biru">Warna Biru (Kontraktor)</option>
                        <option value="Merah">Warna Merah (Fire Rescue)</option>
                        <option value="Hijau">Warna Hijau (HSE Inspector)</option>
                      </select>
                    )}
                    {currCategory === 'Pakaian Kerja' && (
                      <select value={currDetail} onChange={(e) => setCurrDetail(e.target.value)} className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200">
                        <option value="S">Ukuran S</option>
                        <option value="M">Ukuran M</option>
                        <option value="L">Ukuran L</option>
                        <option value="XL">Ukuran XL</option>
                        <option value="XXL">Ukuran XXL</option>
                        <option value="XXXL">Ukuran XXXL</option>
                      </select>
                    )}
                    {currCategory === 'Kacamata Safety' && (
                      <select value={currDetail} onChange={(e) => setCurrDetail(e.target.value)} className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200">
                        <option value="Clear">Clear Lens (Indoors/Night)</option>
                        <option value="Dark">Dark Smoke Lens (Field Day)</option>
                      </select>
                    )}
                    {currCategory === 'Sarung Tangan' && (
                      <select value={currDetail} onChange={(e) => setCurrDetail(e.target.value)} className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200">
                        <option value="Katun">Rajut Katun Bintik</option>
                        <option value="Karet">Coating Latex (Karet)</option>
                        <option value="Leather">Full Leather (Heavy Duty)</option>
                      </select>
                    )}
                    {currCategory === 'Sepatu Safety' && (
                      <select value={currDetail} onChange={(e) => setCurrDetail(e.target.value)} className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200">
                        {['39','40','41','42','43','44','45','46'].map(sh => (
                          <option key={sh} value={sh}>Ukuran {sh}</option>
                        ))}
                      </select>
                    )}
                    {currCategory === 'Radio/HT' && (
                      <select value={currDetail} onChange={(e) => setCurrDetail(e.target.value)} className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200">
                        <option value="HT Digital">HT Digital Motorola</option>
                        <option value="HT Analog">HT Analog Icom</option>
                      </select>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-orange-400 block mb-1.5 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
                      Nama APD Kustom
                    </label>
                    <input 
                      type="text"
                      placeholder="Contoh: Body Harness, Ear Muff, Vest"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-orange-500/40 rounded-lg text-white"
                    />
                  </div>
                )}

                {currCategory === 'Kustom APD' ? (
                  <div>
                    <label className="text-xs text-orange-400 block mb-1.5 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      Detail Ukuran / Spesifikasi
                    </label>
                    <input 
                      type="text"
                      placeholder="Contoh: Double Lanyard / XL"
                      value={customDetailInput}
                      onChange={(e) => setCustomDetailInput(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-orange-500/40 rounded-lg text-white"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Jumlah Kebutuhan</label>
                    <input 
                      type="number" 
                      min={1} 
                      value={currQty}
                      onChange={(e) => setCurrQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                )}

                {currCategory === 'Kustom APD' ? (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Jumlah</label>
                    <input 
                      type="number" 
                      min={1} 
                      value={currQty}
                      onChange={(e) => setCurrQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                ) : null}

                <button 
                  type="button" 
                  onClick={handleAddItem}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs py-2 rounded-lg border border-orange-500/40 transition-all flex items-center justify-center gap-1.5 h-[34px] shadow-sm"
                >
                  <Plus size={16} />
                  Tambah APD (+)
                </button>
              </div>
            </div>

            {/* Render items in draft cart */}
            {addedItems.length > 0 ? (
              <div className="space-y-2 border border-slate-850 p-3 rounded-lg bg-slate-950/20">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Daftar APD untuk Diajukan:</p>
                <div className="divide-y divide-slate-800/60 max-h-44 overflow-y-auto pr-1">
                  {addedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 text-xs">
                      <div className="flex items-center gap-2">
                        <CornerDownRight size={12} className="text-orange-500" />
                        <span className="font-bold text-slate-200">{item.kategori}</span>
                        <span className="text-slate-400">({item.detail})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded font-bold text-white text-[11px]">{item.jumlah} Pcs</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-400 hover:text-red-500 p-0.5"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-3 bg-slate-950/10 border border-dashed border-slate-850 rounded-lg">Masukkan item APD yang ingin diajukan di atas.</p>
            )}
          </div>

        </div>

        {/* --- PROCESS FORM CONTAINER (SIDEBAR FLANK) --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <ClipboardList size={16} className="text-orange-500" />
            Detail Pengajuan Akhir
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Nomor Pengajuan (Otomatis)</label>
              <div className="bg-slate-950 px-3 py-2 border border-slate-850 text-slate-400 rounded-lg text-xs font-mono font-bold">
                REQ/WPA/2026/05/XXXX (Generated)
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Tanggal Pengajuan Kerja</label>
              <div className="bg-slate-950 px-3 py-2 border border-slate-850 text-slate-400 rounded-lg text-xs font-mono">
                2026-05-30
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Alasan Pengajuan APD</label>
              <select
                value={alasanPengajuan}
                onChange={(e) => setAlasanPengajuan(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
              >
                <option value="APD Baru">APD Baru (Masa pakai habis)</option>
                <option value="Penggantian Rusak">Penggantian Rusak (Sobek / Pecah)</option>
                <option value="Penggantian Hilang">Penggantian Hilang (Berita Acara)</option>
                <option value="Penambahan Kebutuhan Kerja">Penambahan Kebutuhan Kerja Khusus</option>
                <option value="Mutasi Jabatan">Mutasi Jabatan Baru</option>
                <option value="Karyawan Baru">Karyawan Baru / Induksi HSE</option>
              </select>
            </div>
          </div>

          {/* Verification summary cards */}
          <div className="space-y-2 bg-slate-950/45 p-3 rounded-lg border border-slate-850">
            <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Review Persetujuan Sistem</h5>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Karyawan Tervalidasi</span>
                <span className={selectedKaryawan ? 'text-emerald-400 font-bold' : 'text-rose-500 font-semibold'}>{selectedKaryawan ? 'Ya' : 'Belum'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Log Pengembalian APD Lama</span>
                <span className={formChecklists.bangkaiDiserahkan ? 'text-emerald-400 font-bold' : 'text-rose-500 font-semibold'}>{formChecklists.bangkaiDiserahkan ? 'Clear' : 'Perlu Checklist'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prasyarat Berkas Hilang</span>
                <span className={formChecklists.hilangDiaporkan ? 'text-emerald-400 font-bold' : 'text-rose-500 font-semibold'}>{formChecklists.hilangDiaporkan ? 'Clear' : 'Perlu Checklist'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Item</span>
                <span className="text-white font-bold">{addedItems.length} Kategori</span>
              </div>
            </div>
          </div>

          {/* Submit button with visual LOCK design */}
          <button
            onClick={handleFormSubmission}
            disabled={!isPrerequisitesPassed || !selectedKaryawan || addedItems.length === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-xs text-center transition-all flex items-center justify-center gap-2 ${
              isPrerequisitesPassed && selectedKaryawan && addedItems.length > 0
                ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg cursor-pointer'
                : 'bg-slate-950 border border-slate-850 text-slate-600 cursor-not-allowed'
            }`}
            id="btn-submit-pengajuan"
          >
            {!isPrerequisitesPassed ? <Lock size={14} className="text-red-500" /> : <FileCheck2 size={14} className="text-emerald-400" />}
            Kirim Pengajuan APD
          </button>
        </div>

      </div>

      {/* --- PIPELINE WORKFLOW EXPLAINER BOX --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 mb-4 pb-2 border-b border-slate-800">
          <ShieldCheck size={16} className="text-emerald-500" />
          Alur Pelayanan Digital & Verifikator Berwenang
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 relative z-10">
            <span className="absolute -top-2.5 -left-1.5 w-6 h-6 rounded-full bg-orange-600 font-mono font-bold text-xs flex items-center justify-center">1</span>
            <p className="text-xs font-bold text-white mt-1">Pengajuan Karyawan</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Input detail items & lengkapi checklists K3.</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 relative z-10">
            <span className="absolute -top-2.5 -left-1.5 w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-mono font-bold text-xs flex items-center justify-center">2</span>
            <p className="text-xs font-bold text-white mt-1">Verifikasi HSE</p>
            <p className="text-[10px] text-orange-400 font-bold mt-0.5">Ilham Akbar Rialdin</p>
            <p className="text-[9px] text-slate-500 uppercase mt-0.5">Penilaian APD & TTD</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 relative z-10">
            <span className="absolute -top-2.5 -left-1.5 w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-mono font-bold text-xs flex items-center justify-center">3</span>
            <p className="text-xs font-bold text-white mt-1">Persetujuan GA</p>
            <p className="text-[10px] text-amber-500 font-bold mt-0.5">Heri Tan</p>
            <p className="text-[9px] text-slate-500 uppercase mt-0.5">Stok Gudang & TTD</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 relative z-10">
            <span className="absolute -top-2.5 -left-1.5 w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-mono font-bold text-xs flex items-center justify-center">4</span>
            <p className="text-xs font-bold text-white mt-1">Pelaporan HRD</p>
            <p className="text-[10px] text-sky-400 font-bold mt-0.5">Moh. Irfan</p>
            <p className="text-[9px] text-slate-500 uppercase mt-0.5">Pencatatan Sejarah Karyawan</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 relative z-10">
            <span className="absolute -top-2.5 -left-1.5 w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-mono font-bold text-xs flex items-center justify-center">5</span>
            <p className="text-xs font-bold text-white mt-1">Serah Terima & Scan QR</p>
            <p className="text-[10px] text-emerald-400 font-bold mt-0.5">HSE Handover</p>
            <p className="text-[9px] text-slate-500 uppercase mt-0.5">Foto Bukti & Tanda Tangan</p>
          </div>

        </div>
      </div>

    </div>
  );
}
