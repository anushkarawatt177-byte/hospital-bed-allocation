import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Patient, Bed } from '../../types/hospital';
import { 
  ClipboardList, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  LogOut, 
  User, 
  BedDouble, 
  Search,
  FileCheck,
  RotateCcw
} from 'lucide-react';

interface AdmissionsDischargesProps {
  onNavigateTab: (tab: string) => void;
  onAllocateBedForPatient: (patient: Patient) => void;
}

export const AdmissionsDischarges: React.FC<AdmissionsDischargesProps> = ({
  onNavigateTab,
  onAllocateBedForPatient
}) => {
  const { patients, beds, markBedCleaned, dischargePatient, currentUser, stats } = useHospital();
  const [activeTab, setActiveTab] = useState<'admissions' | 'discharges' | 'pending' | 'cleaning'>('cleaning');
  const [searchQuery, setSearchQuery] = useState('');
  const [dischargeModalPatient, setDischargeModalPatient] = useState<Patient | null>(null);
  const [dischargeSummaryInput, setDischargeSummaryInput] = useState('');

  // Groups
  const cleaningBeds = beds.filter(b => b.status === 'cleaning');
  const pendingPatients = patients.filter(p => p.status === 'Pending Bed' || p.status === 'In Triage');
  const dischargedPatients = patients.filter(p => p.status === 'Discharged');
  const todayAdmittedPatients = patients.filter(p => p.status === 'Admitted');

  const handleDischargeConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dischargeModalPatient) return;
    dischargePatient(dischargeModalPatient.patientId, dischargeSummaryInput || 'Discharged in stable condition.');
    setDischargeModalPatient(null);
    setDischargeSummaryInput('');
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('cleaning')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'cleaning'
              ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-400'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">Terminal Sanitization</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {cleaningBeds.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Beds requiring cleaning clearance</p>
        </div>

        <div 
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">Pending Bed Intake</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {pendingPatients.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Patients waiting in triage/ED</p>
        </div>

        <div 
          onClick={() => setActiveTab('admissions')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'admissions'
              ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-400'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">Active Inpatients</span>
            <ArrowUpRight className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {todayAdmittedPatients.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Currently assigned to beds</p>
        </div>

        <div 
          onClick={() => setActiveTab('discharges')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'discharges'
              ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-400'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">Discharged Patients</span>
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {dischargedPatients.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Released with summary</p>
        </div>
      </div>

      {/* Main Tabbed Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="px-5 pt-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('cleaning')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'cleaning'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Terminal Cleaning Queue ({cleaningBeds.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Pending Admissions ({pendingPatients.length})
            </button>

            <button
              onClick={() => setActiveTab('admissions')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'admissions'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Active Inpatients / Discharge ({todayAdmittedPatients.length})
            </button>

            <button
              onClick={() => setActiveTab('discharges')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'discharges'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Discharged Archive ({dischargedPatients.length})
            </button>
          </div>

          <div className="relative pb-2 sm:pb-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {/* TAB 1: Terminal Cleaning Queue */}
        {activeTab === 'cleaning' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <p>
                Hospital beds vacated following patient discharge. After housekeeping terminal sanitization and disinfection, mark as Available.
              </p>
              <span className="font-mono text-xs font-bold text-blue-700">
                {cleaningBeds.length} in queue
              </span>
            </div>

            {cleaningBeds.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-800 text-sm">All vacated beds are fully sanitized</p>
                <p className="text-xs text-slate-400 mt-1">There are no beds currently awaiting cleaning.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {cleaningBeds.map((bed) => (
                  <div
                    key={bed.id}
                    className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-base text-slate-900">
                          {bed.bedNumber}
                        </span>
                        <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-spin" />
                          Sanitizing
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-1">
                        {bed.ward} · {bed.floor}
                      </div>
                      <div className="text-[11px] text-slate-500">{bed.bedType}</div>

                      {bed.notes && (
                        <p className="text-[11px] text-blue-900 bg-white/80 p-2 rounded-lg border border-blue-100 mt-2">
                          {bed.notes}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => markBedCleaned(bed.id)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Sanitized & Mark Available</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Pending Admissions Queue */}
        {activeTab === 'pending' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <p>Patients accepted for inpatient admission but awaiting bed allocation.</p>
              <button
                onClick={() => onNavigateTab('allocate')}
                className="text-sky-600 font-semibold hover:underline"
              >
                Go to Allocation Wizard &rarr;
              </button>
            </div>

            {pendingPatients.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl">
                All admitted patients have been assigned hospital beds.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {pendingPatients.map((pat) => (
                  <div key={pat.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900">{pat.name}</strong>
                          <span className="font-mono text-slate-400 text-[11px]">{pat.patientId}</span>
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.2 rounded">
                            {pat.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {pat.diagnosis} · Ward requested: <strong>{pat.requiredWard}</strong> ({pat.requiredBedType})
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onAllocateBedForPatient(pat)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <BedDouble className="w-3.5 h-3.5" />
                      <span>Allocate Bed</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Active Inpatients / Initiate Discharge */}
        {activeTab === 'admissions' && (
          <div className="p-5 space-y-4">
            <div className="text-xs text-slate-600">
              Active inpatients with assigned beds. Click Discharge to release bed into terminal sanitization.
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {todayAdmittedPatients.map((pat) => (
                <div key={pat.id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{pat.name}</strong>
                        <span className="font-mono text-sky-800 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200 font-bold">
                          Bed: {pat.assignedBedNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {pat.diagnosis} · Attending: {pat.assignedDoctor}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                      Admitted: {pat.admissionDate}
                    </span>
                    <button
                      onClick={() => setDischargeModalPatient(pat)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Discharge</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Discharged Archive */}
        {activeTab === 'discharges' && (
          <div className="p-5 space-y-4">
            <div className="text-xs text-slate-600">
              Audit archive of recently discharged inpatients and clinical discharge instructions.
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {dischargedPatients.map((pat) => (
                <div key={pat.id} className="p-3.5 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">{pat.name}</strong>
                      <span className="font-mono text-slate-400 text-[11px]">{pat.patientId}</span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded">
                        Discharged {pat.dischargeDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      {pat.dischargeSummary || pat.diagnosis}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    Doctor: {pat.assignedDoctor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Discharge Action Modal */}
      {dischargeModalPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LogOut className="w-5 h-5 text-rose-600" />
              <span>Discharge Inpatient & Release Bed</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Discharging <strong>{dischargeModalPatient.name}</strong> from bed{' '}
              <strong>{dischargeModalPatient.assignedBedNumber}</strong>.
              The bed will immediately change status to <strong>Cleaning</strong>.
            </p>

            <form onSubmit={handleDischargeConfirm} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Discharge Summary Notes
                </label>
                <textarea
                  rows={3}
                  value={dischargeSummaryInput}
                  onChange={(e) => setDischargeSummaryInput(e.target.value)}
                  placeholder="e.g. Inpatient afebrile, recovery criteria met. Oral medication dispensed. Follow-up clinic in 10 days."
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDischargeModalPatient(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Confirm Discharge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
