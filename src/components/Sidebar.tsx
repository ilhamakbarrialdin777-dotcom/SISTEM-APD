/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  RotateCcw, 
  ShieldCheck, 
  CheckSquare, 
  TrendingUp, 
  FileText, 
  History, 
  UserMinus, 
  BarChart3, 
  Settings, 
  Briefcase,
  ChevronRight,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  currentMenu: string;
  setCurrentMenu: (menu: string) => void;
  activeRole: 'Admin' | 'HSE' | 'GA' | 'HRD' | 'Karyawan';
  setActiveRole: (role: 'Admin' | 'HSE' | 'GA' | 'HRD' | 'Karyawan') => void;
}

export default function Sidebar({ 
  currentMenu, 
  setCurrentMenu, 
  activeRole, 
  setActiveRole 
}: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  // List of menus with matching icons and badges if relevant
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'karyawan', label: 'Master Data Karyawan', icon: Users },
    { id: 'pengajuan', label: 'Pengajuan APD', icon: FileSpreadsheet },
    { id: 'pengembalian', label: 'Pengembalian APD', icon: RotateCcw },
    { id: 'assessment', label: 'Assessment HSE', icon: ShieldCheck, restricted: ['GA', 'HRD'] },
    { id: 'persetujuan', label: 'Persetujuan GA', icon: CheckSquare, restricted: ['HSE', 'HRD'] },
    { id: 'monitoring', label: 'Monitoring Stok', icon: TrendingUp },
    { id: 'pelaporan', label: 'Pelaporan HRD', icon: FileText, restricted: ['HSE', 'GA'] },
    { id: 'serahterima', label: 'Serah Terima APD (Langkah 5)', icon: CheckSquare, restricted: ['GA', 'HRD'] },
    { id: 'riwayat', label: 'Riwayat APD Karyawan', icon: History },
    { id: 'resign', label: 'Resign & PHK (Clearance)', icon: UserMinus },
    { id: 'laporan', label: 'Laporan & Analisis', icon: BarChart3 },
    { id: 'pengaturan', label: 'Pengaturan Sistem', icon: Settings },
  ];

  // Officer names based on active role
  const getOfficerName = () => {
    switch(activeRole) {
      case 'HSE': return 'Ilham Akbar Rialdin';
      case 'GA': return 'Heri Tan';
      case 'HRD': return 'Moh. Irfan';
      case 'Admin': return 'Administrator WPA';
      default: return 'Karyawan Lapangan';
    }
  };

  const getOfficerTitle = () => {
    switch(activeRole) {
      case 'HSE': return 'HSE Coordinator';
      case 'GA': return 'GA Warehouse Supervisor';
      case 'HRD': return 'HR Administrator';
      case 'Admin': return 'System Superadmin';
      default: return 'Field Operator / Staff';
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-slate-900 border border-slate-700 text-white rounded-lg shadow-lg focus:outline-none"
          id="sidebar-toggle-btn"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside 
        id="app-sidebar"
        className={`fixed top-0 left-0 h-screen bg-slate-950 border-r border-slate-800 text-slate-100 flex flex-col transition-all duration-300 z-40
          ${isOpen ? 'w-72 translation-none' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-20'}
        `}
      >
        {/* Header - Corporate Logo PT. Watu Perkasa Abadi */}
        <div className="p-5 border-b border-slate-800 flex flex-col items-center justify-center bg-slate-950">
          <div className="flex items-center gap-3 w-full">
            {/* SVG Logo: W in Blue, P in Safety Orange */}
            <svg className="w-12 h-10 flex-shrink-0" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Slanted "W" in Blue */}
              <path d="M5 5 L30 5 L40 50 L50 20 L58 50 L68 5 L85 5 L68 75 L52 75 L43 45 L34 75 L18 75 Z" fill="#0284c7" />
              {/* Slanted "P" in Safety Orange overlapping */}
              <path d="M48 5 H76 C86 5, 92 12, 92 22 C92 32, 85 38, 75 38 H60 L54 62 L42 62 Z M62 14 L58 30 H73 C76 30, 79 28, 79 22 C79 16, 76 14, 73 14 Z" fill="#f97316" />
            </svg>
            
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg leading-tight tracking-tight text-white flex items-center gap-1">
                  WPA <span className="text-orange-500 font-medium text-xs border border-orange-500 px-1 rounded">PPE</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  PT. Watu Perkasa Abadi
                </span>
              </div>
            )}
          </div>
        </div>

        {/* User Role Quick Switcher Profile Area */}
        {isOpen && (
          <div className="p-4 mx-3 my-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-start gap-2.5">
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                activeRole === 'HSE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                activeRole === 'GA' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                activeRole === 'HRD' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                activeRole === 'Admin' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              }`}>
                <UserCheck size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktif Petugas</p>
                <h4 className="text-sm font-bold text-white truncate leading-snug mt-0.5">{getOfficerName()}</h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{getOfficerTitle()}</p>
              </div>
            </div>

            {/* Quick switcher select dropdown */}
            <div className="mt-3">
              <label className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block mb-1">Simulasi Hak Akses</label>
              <select
                value={activeRole}
                onChange={(e) => {
                  const role = e.target.value as any;
                  setActiveRole(role);
                  // Auto redirect based on role to make demo beautiful
                  if (role === 'HSE') setCurrentMenu('assessment');
                  else if (role === 'GA') setCurrentMenu('persetujuan');
                  else if (role === 'HRD') setCurrentMenu('pelaporan');
                }}
                className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1.5 focus:border-orange-500 focus:outline-none"
                id="role-simulator-sidebar"
              >
                <option value="Admin">Admin (Semua Akses)</option>
                <option value="HSE">Ilham Akbar Rialdin (HSE)</option>
                <option value="GA">Heri Tan (GA Warehouse)</option>
                <option value="HRD">Moh. Irfan (HRD)</option>
                <option value="Karyawan">Karyawan (Operator)</option>
              </select>
            </div>
          </div>
        )}

        {/* Sidebar Middle Menu Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1 py-2 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = currentMenu === item.id;
            const isRestricted = item.restricted?.includes(activeRole);

            // Filter menu slightly if restricted based on role (unless Admin)
            if (isRestricted && activeRole !== 'Admin') {
              return null;
            }

            return (
              <button
                key={item.id}
                onClick={() => setCurrentMenu(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                  ${isSelected 
                    ? 'bg-orange-600 font-semibold text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }
                  ${!isOpen ? 'justify-center' : ''}
                `}
                title={item.label}
                id={`sidebar-menu-${item.id}`}
              >
                <Icon size={18} className={`transition-transform duration-200 group-hover:scale-105 ${
                  isSelected ? 'text-white' : 'text-slate-404 group-hover:text-orange-500'
                }`} />
                {isOpen && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {isOpen && isSelected && (
                  <ChevronRight size={14} className="text-white/80" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {isOpen && (
          <div className="p-4 border-t border-slate-900 bg-slate-950 text-[11px] text-slate-500 flex flex-col gap-1">
            <p className="font-semibold text-slate-400">WPA PPE Dashboard v4.2</p>
            <p>© 2026 PT. Watu Perkasa Abadi</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Sistem Terkoneksi (Real-time)</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
