/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import KaryawanView from './components/KaryawanView';
import PengajuanView from './components/PengajuanView';
import PengembalianView from './components/PengembalianView';
import AssessmentHseView from './components/AssessmentHseView';
import PersetujuanGaView from './components/PersetujuanGaView';
import MonitoringStokView from './components/MonitoringStokView';
import PelaporanHrdView from './components/PelaporanHrdView';
import SerahTerimaView from './components/SerahTerimaView';
import RiwayatApdView from './components/RiwayatApdView';
import ResignPhkView from './components/ResignPhkView';
import LaporanView from './components/LaporanView';
import PengaturanSistemView from './components/PengaturanSistemView';

import { 
  initialKaryawan, 
  initialStock, 
  initialPengajuan, 
  initialPengembalian, 
  initialExitClearance, 
  initialAuditTrail 
} from './mockData';
import { Karyawan, StockItem, PengajuanAPD, PengembalianAPD, ExitClearance, AuditTrail } from './types';
import { ShieldCheck, Bell, AlertTriangle } from 'lucide-react';

export default function App() {
  // Helper to load client side data
  const loadLocalStorage = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored) as T;
      }
    } catch (e) {
      console.warn(`Local storage key ${key} is empty or inaccessible.`);
    }
    return fallback;
  };

  // State initialization with Local Storage persistence for auto-save
  const [karyawanList, setKaryawanList] = React.useState<Karyawan[]>(() => loadLocalStorage('karyawanList', initialKaryawan));
  const [stockList, setStockList] = React.useState<StockItem[]>(() => loadLocalStorage('stockList', initialStock));
  const [pengajuanList, setPengajuanList] = React.useState<PengajuanAPD[]>(() => loadLocalStorage('pengajuanList', initialPengajuan));
  const [pengembalianList, setPengembalianList] = React.useState<PengembalianAPD[]>(() => loadLocalStorage('pengembalianList', initialPengembalian));
  const [exitClearanceList, setExitClearanceList] = React.useState<ExitClearance[]>(() => loadLocalStorage('exitClearanceList', initialExitClearance));
  const [auditTrailList, setAuditTrailList] = React.useState<AuditTrail[]>(() => loadLocalStorage('auditTrailList', initialAuditTrail));

  const [currentMenu, setCurrentMenu] = React.useState<string>('dashboard');
  const [activeRole, setActiveRole] = React.useState<'Admin' | 'HSE' | 'GA' | 'HRD' | 'Karyawan'>('Admin');

  // Auto-save triggers whenever reactive arrays are edited, uploaded, or deleted
  React.useEffect(() => {
    localStorage.setItem('karyawanList', JSON.stringify(karyawanList));
  }, [karyawanList]);

  React.useEffect(() => {
    localStorage.setItem('stockList', JSON.stringify(stockList));
  }, [stockList]);

  React.useEffect(() => {
    localStorage.setItem('pengajuanList', JSON.stringify(pengajuanList));
  }, [pengajuanList]);

  React.useEffect(() => {
    localStorage.setItem('pengembalianList', JSON.stringify(pengembalianList));
  }, [pengembalianList]);

  React.useEffect(() => {
    localStorage.setItem('exitClearanceList', JSON.stringify(exitClearanceList));
  }, [exitClearanceList]);

  React.useEffect(() => {
    localStorage.setItem('auditTrailList', JSON.stringify(auditTrailList));
  }, [auditTrailList]);

  // Audit logger helper
  const addAuditLog = (aktivitas: string, rincian: string, status: 'Berhasil' | 'Gagal' | 'Sistem' = 'Berhasil') => {
    const nextSeq = auditTrailList.length + 1;
    const padSeq = String(nextSeq).padStart(3, '0');
    
    let officerName = 'System Admin';
    if (activeRole === 'HSE') officerName = 'Ilham Akbar Rialdin (HSE)';
    else if (activeRole === 'GA') officerName = 'Heri Tan (GA)';
    else if (activeRole === 'HRD') officerName = 'Moh. Irfan (HRD)';
    else if (activeRole === 'Karyawan') officerName = 'Karyawan Lapangan';

    const newLog: AuditTrail = {
      id: `AUD-${padSeq}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: officerName,
      role: activeRole,
      aktivitas,
      rincian,
      status
    };
    setAuditTrailList(prev => [newLog, ...prev]);
  };

  // Automated notification generator for urgent limits
  const urgentStockCount = stockList.filter(s => s.jumlahStok <= s.minimumStok).length;
  const pendingHseCount = pengajuanList.filter(p => p.statusAlur === 'Verifikasi HSE').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-orange-600/30 selection:text-orange-200">
      
      {/* Sidebar navigation Flank */}
      <Sidebar 
        currentMenu={currentMenu} 
        setCurrentMenu={setCurrentMenu} 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
      />

      {/* Main Screen body */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Top Header navbar with notification counters */}
        <header className="h-16 border-b border-slate-900 bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-xs font-bold text-slate-350">Portal Sirkulasi APD Real-time</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Quick counters */}
            <div className="flex items-center gap-3">
              {urgentStockCount > 0 && (
                <div className="flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded font-mono font-bold">
                  <AlertTriangle size={12} className="animate-bounce" />
                  <span>{urgentStockCount} Low Stok</span>
                </div>
              )}
              {pendingHseCount > 0 && (
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded font-mono font-bold">
                  <ShieldCheck size={12} />
                  <span>{pendingHseCount} Antrean HSE</span>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-slate-800"></div>

            {/* Simulated Live User Profile Card */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Demo Role:</span>
              <span className="bg-orange-600/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-extrabold">
                {activeRole}
              </span>
            </div>
          </div>
        </header>

        {/* Content canvas padding */}
        <main className="p-6 max-w-7xl w-full mx-auto flex-1 space-y-6">
          
          {/* Dynamic view routers */}
          {currentMenu === 'dashboard' && (
            <DashboardView 
              karyawan={karyawanList} 
              setKaryawan={setKaryawanList}
              stock={stockList} 
              setStock={setStockList}
              pengajuan={pengajuanList} 
              setPengajuan={setPengajuanList}
              pengembalian={pengembalianList} 
              setPengembalian={setPengembalianList}
              setCurrentMenu={setCurrentMenu} 
              addAuditLog={addAuditLog}
            />
          )}

          {currentMenu === 'karyawan' && (
            <KaryawanView 
              karyawanList={karyawanList} 
              setKaryawanList={setKaryawanList} 
              addAuditLog={addAuditLog} 
              currentUser={activeRole === 'HSE' ? 'Ilham' : activeRole === 'GA' ? 'Heri' : activeRole === 'HRD' ? 'Irfan' : 'Admin'} 
            />
          )}

          {currentMenu === 'pengajuan' && (
            <PengajuanView 
              karyawanList={karyawanList} 
              pengajuanList={pengajuanList} 
              setPengajuanList={setPengajuanList} 
              addAuditLog={addAuditLog} 
              currentUser={activeRole} 
            />
          )}

          {currentMenu === 'pengembalian' && (
            <PengembalianView 
              karyawanList={karyawanList} 
              pengembalianList={pengembalianList} 
              setPengembalianList={setPengembalianList} 
              addAuditLog={addAuditLog} 
              currentUser={activeRole} 
            />
          )}

          {currentMenu === 'assessment' && (
            <AssessmentHseView 
              pengajuanList={pengajuanList} 
              setPengajuanList={setPengajuanList} 
              pengembalianList={pengembalianList} 
              setPengembalianList={setPengembalianList} 
              addAuditLog={addAuditLog} 
              currentUser={activeRole} 
            />
          )}

          {currentMenu === 'persetujuan' && (
            <PersetujuanGaView 
              pengajuanList={pengajuanList} 
              setPengajuanList={setPengajuanList} 
              stockList={stockList} 
              setStockList={setStockList} 
              addAuditLog={addAuditLog} 
              currentUser={activeRole} 
            />
          )}

          {currentMenu === 'monitoring' && (
            <MonitoringStokView 
              stockList={stockList} 
              setStockList={setStockList} 
              addAuditLog={addAuditLog} 
            />
          )}

          {currentMenu === 'pelaporan' && (
            <PelaporanHrdView 
              pengajuanList={pengajuanList} 
              setPengajuanList={setPengajuanList} 
              addAuditLog={addAuditLog} 
              currentUser={activeRole} 
            />
          )}

          {currentMenu === 'serahterima' && (
            <SerahTerimaView 
              pengajuanList={pengajuanList} 
              setPengajuanList={setPengajuanList} 
              addAuditLog={addAuditLog} 
              currentUser={activeRole} 
            />
          )}

          {currentMenu === 'riwayat' && (
            <RiwayatApdView 
              karyawanList={karyawanList} 
              pengajuanList={pengajuanList} 
            />
          )}

          {currentMenu === 'resign' && (
            <ResignPhkView 
              karyawanList={karyawanList} 
              setKaryawanList={setKaryawanList} 
              exitClearanceList={exitClearanceList} 
              setExitClearanceList={setExitClearanceList} 
              addAuditLog={addAuditLog} 
              currentUser={activeRole} 
            />
          )}

          {currentMenu === 'laporan' && (
            <LaporanView 
              karyawanList={karyawanList} 
              pengajuanList={pengajuanList} 
              stockList={stockList} 
            />
          )}

          {currentMenu === 'pengaturan' && (
            <PengaturanSistemView 
              auditTrailList={auditTrailList} 
              setAuditTrailList={setAuditTrailList} 
            />
          )}

        </main>
      </div>

    </div>
  );
}
