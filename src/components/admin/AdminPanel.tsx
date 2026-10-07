import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  Building2, 
  BedDouble, 
  Users, 
  Settings, 
  ShieldCheck, 
  Stethoscope, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Save,
  AlertTriangle
} from 'lucide-react';
import { DOCTORS_LIST, INITIAL_USERS } from '../../data/mockData';

export const AdminPanel: React.FC = () => {
  const { wards, beds, currentUser, resetToDefaultData } = useHospital();
  const [activeTab, setActiveTab] = useState<'wards' | 'users' | 'doctors' | 'settings'>('wards');
  const [occupancyWarningThreshold, setOccupancyWarningThreshold] = useState(85);
  const [autoCleaningAlertMins, setAutoCleaningAlertMins] = useState(45);
  const [emergencyReserveBeds, setEmergencyReserveBeds] = useState(4);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Hospital Administration & System Settings</h2>
          <p className="text-xs text-slate-500">
            Configure department wards, clinical roster, bed classifications, and system governance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowResetModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Hospital operational settings saved successfully.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('wards')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'wards'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Hospital Wards ({wards.length})
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'doctors'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Doctors & Consultants ({DOCTORS_LIST.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          System Users & RBAC ({INITIAL_USERS.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          System Policies & Thresholds
        </button>
      </div>

      {/* TAB 1: Hospital Wards */}
      {activeTab === 'wards' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Department Wards & Nurse Supervisors
            </h3>
            <span className="text-xs text-slate-400">Total 6 Wards Configured</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wards.map((ward) => {
              const bedCountInWard = beds.filter(b => b.ward === ward.name).length;
              const occCount = beds.filter(b => b.ward === ward.name && b.status === 'occupied').length;

              return (
                <div key={ward.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{ward.name}</h4>
                      <span className="font-mono text-xs text-sky-700 bg-sky-100 px-2 py-0.5 rounded font-bold">
                        {occCount}/{bedCountInWard} Occupied
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1">
                      {ward.floor} · {ward.contactExt}
                    </p>

                    <p className="text-xs text-slate-600 mt-2">
                      Head Nurse: <strong>{ward.headNurse}</strong>
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      {ward.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Doctors & Consultants */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Attending Medical Staff Directory
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DOCTORS_LIST.map((doc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <strong className="text-xs text-slate-900 block truncate">{doc}</strong>
                  <span className="text-[11px] text-slate-500 block">St. Jude Medical Staff</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: System Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Role-Based Access Control (RBAC) Accounts
          </h3>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {INITIAL_USERS.map((usr) => (
              <div key={usr.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900">{usr.name}</strong>
                    <p className="text-[11px] text-slate-500">{usr.email} · {usr.department}</p>
                  </div>
                </div>

                <span className="font-semibold px-2.5 py-1 rounded-lg text-xs bg-sky-50 text-sky-800 border border-sky-200">
                  {usr.role} Role
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: System Policies & Thresholds */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Capacity Governance & Automation Triggers
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hospital Occupancy Alert Threshold (%)
              </label>
              <input
                type="number"
                min="50"
                max="98"
                value={occupancyWarningThreshold}
                onChange={(e) => setOccupancyWarningThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Triggers visual warning banner when hospital capacity exceeds this percentage.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Emergency Bay Reserve Quota (Beds)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={emergencyReserveBeds}
                onChange={(e) => setEmergencyReserveBeds(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Protected reserve beds kept unallocated for inbound ambulance trauma calls.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Terminal Sanitization Timeout Warning (Minutes)
              </label>
              <input
                type="number"
                min="15"
                max="180"
                value={autoCleaningAlertMins}
                onChange={(e) => setAutoCleaningAlertMins(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Notifies Housekeeping supervisor if a bed remains in cleaning status past this timeframe.
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span>Restore Demo State?</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              This will restore all default mock hospital beds, patient queues, admission records, and notifications. All locally added records will be reset.
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDefaultData();
                  setShowResetModal(false);
                }}
                className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs"
              >
                Reset Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
