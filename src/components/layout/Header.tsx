import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types/hospital';
import { 
  Menu, 
  Search, 
  Bell, 
  Ambulance, 
  ChevronDown, 
  User, 
  ShieldCheck, 
  Stethoscope, 
  UserCog, 
  Check, 
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSidebar: () => void;
  onToggleNotifications: () => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSidebar,
  onToggleNotifications,
  globalSearch,
  setGlobalSearch
}) => {
  const { currentUser, switchRole, notifications, stats, resetToDefaultData } = useHospital();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Operational Command Dashboard', subtitle: 'Live inpatient metrics, bed census & daily flow' },
    beds: { title: 'Bed Management Matrix', subtitle: 'Real-time bed availability by ward, floor and status' },
    patients: { title: 'Inpatient Registry', subtitle: 'Searchable patient admissions, clinical priority & vitals' },
    allocate: { title: 'Intelligent Bed Allocation', subtitle: 'Step-by-step clinical bed matching and assignment' },
    emergency: { title: 'Emergency Rapid Triage', subtitle: 'Priority ICU & Trauma bay express allocation' },
    admissions: { title: 'Admissions & Discharges', subtitle: 'Patient admission logs, terminal sanitization & turn-around' },
    reports: { title: 'Hospital Analytics & Reports', subtitle: 'Occupancy velocity, utilization trends & exportable audits' },
    notifications: { title: 'System Alerts & Dispatch', subtitle: 'Clinical capacity warnings and maintenance events' },
    settings: { title: 'System Administration', subtitle: 'Ward rosters, bed commission, user roles & policies' }
  };

  const currentTabInfo = tabTitles[activeTab] || { title: 'Hospital Bed System', subtitle: 'Operational Console' };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
              {currentTabInfo.title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block truncate">
              {currentTabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Zone: Search, Emergency Quick Action, Notifications, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Global Search Bar */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search beds, patients, IDs..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Emergency Code 1 Rapid Trigger */}
          <button
            onClick={() => setActiveTab('emergency')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer ${
              activeTab === 'emergency'
                ? 'bg-rose-700 text-white ring-2 ring-rose-400'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
            title="Fast emergency triage allocation"
          >
            <Ambulance className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span className="hidden sm:inline">Emergency Intake</span>
            <span className="font-mono text-[10px] bg-rose-200/80 px-1.5 py-0.2 rounded text-rose-900">
              {stats.emergencyAvailable} Ready
            </span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onToggleNotifications}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="View system notifications"
            aria-label="System notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
            )}
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs text-slate-700 font-medium"
            >
              <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold">
                {currentUser?.role === 'Admin' ? 'A' : currentUser?.role === 'Doctor' ? 'D' : 'S'}
              </div>
              <span className="hidden sm:inline font-semibold text-slate-800">
                {currentUser?.role || 'Staff'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Active Role
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Test role-based permissions
                  </p>
                </div>

                <div className="py-1">
                  {(['Admin', 'Doctor', 'Staff'] as UserRole[]).map((r) => {
                    const isCurrent = currentUser?.role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          isCurrent ? 'bg-sky-50/70 text-sky-900 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {r === 'Admin' && <UserCog className="w-3.5 h-3.5 text-slate-600" />}
                          {r === 'Doctor' && <Stethoscope className="w-3.5 h-3.5 text-teal-600" />}
                          {r === 'Staff' && <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />}
                          <span>{r} Access</span>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-sky-600" />}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1 px-1">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      setResetConfirmOpen(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-600" />
                    <span>Reset Prototype Demo Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Mock Data */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Reset Demo Data</h3>
            <p className="text-xs text-slate-500 mt-1.5">
              This will restore all default mock beds (150 total, 92 occupied, 38 available, 6 ICU) and patient records.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setResetConfirmOpen(false);
                }}
                className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
