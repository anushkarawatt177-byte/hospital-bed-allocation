import React, { useState } from 'react';
import { Bed, Patient } from '../../types/hospital';
import { useHospital } from '../../context/HospitalContext';
import { 
  X, 
  BedDouble, 
  Activity, 
  User, 
  Calendar, 
  Stethoscope, 
  CheckCircle2, 
  Wrench, 
  Sparkles, 
  LogOut, 
  PlusCircle, 
  History,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface BedDetailModalProps {
  bed: Bed;
  isOpen: boolean;
  onClose: () => void;
  onAllocateBed: (bed: Bed) => void;
  onDischargePatient: (patientId: string) => void;
}

export const BedDetailModal: React.FC<BedDetailModalProps> = ({
  bed,
  isOpen,
  onClose,
  onAllocateBed,
  onDischargePatient
}) => {
  const { patients, markBedCleaned, setBedStatus, currentUser } = useHospital();
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

  if (!isOpen) return null;

  // Find linked patient if any
  const currentPatient = patients.find(
    p => p.patientId === bed.currentPatientId || p.assignedBedId === bed.id || p.assignedBedNumber === bed.bedNumber
  );

  const getStatusBadge = (status: Bed['status']) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            🟢 Available
          </span>
        );
      case 'occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            🔴 Occupied
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            🟡 Reserved
          </span>
        );
      case 'cleaning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-spin" />
            🔵 Terminal Cleaning
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800">
            <Wrench className="w-3 h-3 text-slate-700" />
            ⚙️ Maintenance Hold
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {bed.bedNumber}
                </h3>
                {getStatusBadge(bed.status)}
              </div>
              <p className="text-xs text-slate-500">
                {bed.ward} · {bed.floor} · {bed.bedType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch between Current Details and History */}
        <div className="px-5 pt-3 border-b border-slate-100 flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'details'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Bed Specifications & Patient
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Allocation History</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs text-slate-700">
          {activeTab === 'details' ? (
            <>
              {/* Linked Patient Info (if occupied or reserved) */}
              {(bed.status === 'occupied' || bed.status === 'reserved') && currentPatient ? (
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      Current Inpatient Profile
                    </span>
                    <span className="font-mono text-xs bg-white text-sky-800 px-2 py-0.5 rounded font-bold border border-sky-200">
                      {currentPatient.patientId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Patient Name</span>
                      <strong className="text-sm text-slate-900">{currentPatient.name}</strong>
                      <span className="text-[11px] text-slate-500 block">
                        {currentPatient.age} yrs · {currentPatient.gender} · Blood {currentPatient.bloodGroup}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 block">Attending Doctor</span>
                      <strong className="text-xs text-slate-900 block truncate">
                        {currentPatient.assignedDoctor || bed.assignedDoctor || 'Dr. On Duty'}
                      </strong>
                      <span className="text-[11px] text-slate-500 block">
                        Admitted: {currentPatient.admissionDate}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sky-100">
                    <span className="text-[11px] text-slate-500 block">Clinical Diagnosis</span>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {currentPatient.diagnosis}
                    </p>
                  </div>

                  {currentPatient.vitals && (
                    <div className="pt-2 border-t border-sky-100 grid grid-cols-4 gap-2 text-center">
                      <div className="bg-white p-2 rounded-lg border border-sky-100">
                        <span className="text-[10px] text-slate-400 block">BP</span>
                        <span className="font-mono font-bold text-slate-800">{currentPatient.vitals.bloodPressure}</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-sky-100">
                        <span className="text-[10px] text-slate-400 block">Pulse</span>
                        <span className="font-mono font-bold text-slate-800">{currentPatient.vitals.heartRate} bpm</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-sky-100">
                        <span className="text-[10px] text-slate-400 block">SpO2</span>
                        <span className="font-mono font-bold text-slate-800">{currentPatient.vitals.oxygenSaturation}%</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-sky-100">
                        <span className="text-[10px] text-slate-400 block">Temp</span>
                        <span className="font-mono font-bold text-slate-800">{currentPatient.vitals.temperature}°C</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : bed.status === 'cleaning' ? (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-900 font-semibold mb-1">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Terminal Disinfection in Progress</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    This bed was recently vacated and is undergoing UV sterilization and linen sanitization.
                  </p>
                  {currentUser?.role !== 'Doctor' && (
                    <button
                      onClick={() => {
                        markBedCleaned(bed.id);
                        onClose();
                      }}
                      className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Cleaned & Mark Available</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Bed is sterilized, inspected, and ready for patient intake.</span>
                  </div>
                  <button
                    onClick={() => {
                      onAllocateBed(bed);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Allocate Now</span>
                  </button>
                </div>
              )}

              {/* Hardware & Equipment specs */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Installed Clinical Hardware & Features
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {bed.equipment && bed.equipment.length > 0 ? (
                    bed.equipment.map((eq, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                      >
                        {eq}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">Standard ward equipment</span>
                  )}
                </div>
              </div>

              {/* Clinical notes */}
              {bed.notes && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Bed Notes / Maintenance Log
                  </h4>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 leading-relaxed">
                    {bed.notes}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Historical Allocations */
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Prior Patient Occupancies for {bed.bedNumber}
              </h4>
              {bed.allocationHistory && bed.allocationHistory.length > 0 ? (
                bed.allocationHistory.map((hist) => (
                  <div key={hist.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{hist.patientName}</strong>
                      <span className="font-mono text-[11px] text-slate-500">{hist.patientId}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Allocated: {hist.allocatedAt} · Doctor: {hist.doctor}
                    </div>
                    {hist.notes && (
                      <p className="text-[11px] text-slate-600 italic mt-1">"{hist.notes}"</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                  No previous allocation records logged in this session.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Action Buttons */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {currentUser?.role === 'Admin' && (
              <button
                onClick={() => {
                  const newStatus = bed.status === 'maintenance' ? 'available' : 'maintenance';
                  setBedStatus(bed.id, newStatus, newStatus === 'maintenance' ? 'Service hold' : 'Cleared');
                  onClose();
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl font-medium flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5 text-slate-500" />
                <span>{bed.status === 'maintenance' ? 'Clear Maintenance' : 'Set Maintenance'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {bed.status === 'occupied' && currentPatient && (
              <button
                onClick={() => {
                  onDischargePatient(currentPatient.patientId);
                  onClose();
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Discharge Patient</span>
              </button>
            )}

            {bed.status === 'available' && (
              <button
                onClick={() => {
                  onAllocateBed(bed);
                  onClose();
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Allocate Patient</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
