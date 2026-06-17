/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  Settings, 
  Search, 
  Terminal, 
  UserCheck, 
  Trash2
} from 'lucide-react';
import { AuditTrail } from '../types';

interface PengaturanSistemViewProps {
  auditTrailList: AuditTrail[];
  setAuditTrailList: React.Dispatch<React.SetStateAction<AuditTrail[]>>;
}

export default function PengaturanSistemView({
  auditTrailList,
  setAuditTrailList
}: PengaturanSistemViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('Semua');

  const filteredLogs = auditTrailList.filter(log => {
    const matchSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.aktivitas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.rincian.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = filterRole === 'Semua' || log.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleClearLogs = () => {
    if (confirm('Konfirmasi: Apakah Anda yakin ingin mematikan / menghapus seluruh daftar Audit Trail log saat ini? Tindakan ini tidak dapat dibatalkan.')) {
      setAuditTrailList([
        {
          id: 'log-000',
          timestamp: '2026-05-30 01:35:59',
          user: 'System Coordinator',
          role: 'Admin',
          aktivitas: 'Membersihkan Audit Trail',
          rincian: 'Seluruh riwayat log dibersihkan demi optimalisasi database.',
          status: 'Sistem'
        }
      ]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Settings size={22} className="text-orange-500" />
            Konfigurasi Sistem & Audit Trail Keamanan
          </h1>
          <p className="text-xs text-slate-400 mt-1">UJI kepatuhan logs keamanan, audit sirkulasi token data, dan petakan wewenang penanggung jawab.</p>
        </div>
        <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg font-bold font-mono">
          System Core V4.1
        </span>
      </div>

      {/* Authoritative Signers Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <UserCheck size={16} className="text-orange-500" />
          Verifikator Otorisasi Utama & Jabatan Terdaftar
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1.5">
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">01. HSE Koordinator Verifikator</p>
            <h4 className="text-sm font-bold text-white">Ilham Akbar Rialdin</h4>
            <p className="text-xs text-slate-500">Memeriksa kesesuaian APD terhadap tingkat risiko area kerja pertambangan PT. WPA.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1.5">
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">02. GA Warehouse & Stock Master</p>
            <h4 className="text-sm font-bold text-white">Heri Tan</h4>
            <p className="text-xs text-slate-500">Mengelola sirkulasi fisik di rak logistik, menjamin kecukupan pasokan safety gears.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1.5">
            <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">03. HRD Administrator Pegawai</p>
            <h4 className="text-sm font-bold text-white">Moh. Irfan</h4>
            <p className="text-xs text-slate-500">Mencatat riwayat sirkulasi APD dalam berkas kepegawaian untuk audit masa depan.</p>
          </div>
        </div>
      </div>

      {/* Real-time audit trail logs console */}
      <div className="space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-xl">
          
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-orange-500 animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Database Audit Trail (Real-time Records)</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            
            <div className="relative">
              <span className="absolute inset-y-0 left-2.5 flex items-center text-slate-500">
                <Search size={12} />
              </span>
              <input 
                type="text" 
                placeholder="Cari Log, User, Aktivitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-350 focus:outline"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-800 text-slate-300 py-1.5 px-2 rounded focus:outline-none"
            >
              <option value="Semua">Semua Hak Akses</option>
              <option value="Admin">Admin</option>
              <option value="HSE">HSE</option>
              <option value="GA">GA</option>
              <option value="HRD">HRD</option>
              <option value="Karyawan">Karyawan</option>
            </select>

            <button 
              onClick={handleClearLogs}
              className="bg-slate-950 hover:bg-slate-850 border border-slate-800 p-1.5 px-3 rounded text-red-405 hover:text-red-500 text-xs flex items-center gap-1 font-semibold"
            >
              <Trash2 size={12} /> Bersihkan Log
            </button>
          </div>

        </div>

        {/* System Monospace Console table */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden shadow-inner">
          <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
            <table className="w-full text-left font-mono text-[11px] text-slate-300">
              <thead className="bg-slate-900 text-slate-500 border-b border-slate-850 tracking-wider">
                <tr>
                  <th className="p-2.5 w-36">Timestamp</th>
                  <th className="p-2.5 w-48">Petugas Terkait</th>
                  <th className="p-2.5 w-24">Role</th>
                  <th className="p-2.5 text-orange-500 w-44">Aktivitas Utama</th>
                  <th className="p-2.5">Rincian Modifikasi</th>
                  <th className="p-2.5 w-24">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-900/40">
                    <td className="p-2.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-2.5 text-slate-400 font-bold whitespace-nowrap">{log.user}</td>
                    <td className="p-2.5 text-slate-500 whitespace-nowrap">{log.role}</td>
                    <td className="p-2.5 text-white font-bold">{log.aktivitas}</td>
                    <td className="p-2.5 text-slate-400 max-w-xs truncate">{log.rincian}</td>
                    <td className="p-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        log.status === 'Berhasil' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        log.status === 'Sistem' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
