import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  PlusCircle, 
  Ambulance, 
  ClipboardList, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  X,
  Stethoscope,
  ShieldCheck,
  UserCog
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose
}) => {
  const { currentUser, stats, notifications, logout } = useHospital();

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'beds',
      label: 'Bed Management',
      icon: BedDouble,
      badge: `${stats.availableBeds} Avail`
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: Users,
      badge: `${stats.totalPatients}`
    },
    {
      id: 'allocate',
      label: 'Allocate Bed',
      icon: PlusCircle,
      badge: stats.pendingAdmissions > 0 ? `${stats.pendingAdmissions} Pending` : null,
      badgeColor: 'amber'
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: Ambulance,
      badge: stats.emergencyAvailable > 0 ? `${stats.emergencyAvailable} Ready` : '0',
      badgeColor: 'rose'
    },
    {
      id: 'admissions',
      label: 'Admissions & Discharges',
      icon: ClipboardList,
      badge: stats.cleaningBeds > 0 ? `${stats.cleaningBeds} Clean` : null
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? `${unreadNotifs}` : null,
      badgeColor: 'red'
    },
    {
      id: 'settings',
      label: 'Admin Settings',
      icon: Settings,
      badge: null
    }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center overflow-hidden p-1">
              <img 
                src="/src/assets/images/hospital_logo_1791390835305.jpg" 
                alt="Hospital Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
                Hospital Bed System
              </div>
              <div className="text-[11px] text-sky-600 font-semibold tracking-wide uppercase">
                St. Jude Medical Center
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Capacity Quick Snapshot */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700">Hospital Occupancy</span>
            <span className="font-mono font-bold text-sky-700 tabular-nums">
              {stats.occupancyRate}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                stats.occupancyRate > 90 ? 'bg-red-500' : stats.occupancyRate > 75 ? 'bg-amber-500' : 'bg-sky-600'
              }`}
              style={{ width: `${Math.min(stats.occupancyRate, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
            <span>{stats.availableBeds} beds available</span>
            <span>{stats.totalBeds} total</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 shadow-xs border border-sky-100 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-medium shrink-0 ${
                      item.badgeColor === 'rose'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : item.badgeColor === 'amber'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : item.badgeColor === 'red'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Role Info in Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.role === 'Admin' && <UserCog className="w-4 h-4" />}
              {currentUser?.role === 'Doctor' && <Stethoscope className="w-4 h-4" />}
              {currentUser?.role === 'Staff' && <ShieldCheck className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {currentUser?.name || 'Staff Member'}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{currentUser?.role || 'Staff'} Access</span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
