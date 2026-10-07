import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Bed, Patient } from '../../types/hospital';
import { 
  Ambulance, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  HeartPulse, 
  BedDouble, 
  Activity, 
  Clock,
  ArrowRight
} from 'lucide-react';

interface EmergencyAllocationProps {
  onNavigateTab: (tab: string) => void;
}

export const EmergencyAllocation: React.FC<EmergencyAllocationProps> = ({ onNavigateTab }) => {
  const { beds, emergencyAllocate, stats } = useHospital();

  const [patientName, setPatientName] = useState('Emergency Trauma Inbound #402');
  const [patientAge, setPatientAge] = useState(42);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [diagnosis, setDiagnosis] = useState('Severe Polytrauma / Hemorrhagic Shock');
  const [bloodGroup, setBloodGroup] = useState('O- (Universal)');
  const [selectedEmergencyBedId, setSelectedEmergencyBedId] = useState<string>('');
  const [recentEmergencySuccess, setRecentEmergencySuccess] = useState<string | null>(null);

  // Available Critical Care / Emergency Beds (ICU + Emergency wards)
  const availableCriticalBeds = beds.filter(
    b => (b.ward === 'Emergency' || b.ward === 'ICU') && b.status === 'available'
  );

  // Auto-pick the best bed if not selected
  const bestEmergencyBed = availableCriticalBeds.find(b => b.ward === 'Emergency') || availableCriticalBeds[0];

  const handleOneClickAllocation = (bed: Bed) => {
    const res = emergencyAllocate(
      {
        name: patientName,
        age: Number(patientAge),
        gender,
        diagnosis,
        bloodGroup,
        priority: 'Emergency',
        emergencyContact: 'EMS Paramedic Squad 14'
      },
      bed.id
    );

    if (res.success) {
      setRecentEmergencySuccess(`Bed ${bed.bedNumber} immediately assigned to ${patientName}!`);
      setSelectedEmergencyBedId(bed.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* High Alert Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Ambulance className="w-7 h-7 text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-rose-800 uppercase tracking-wider">
                Code Red Protocol
              </span>
              <h2 className="text-base font-bold text-white">Emergency Rapid Bed Allocation</h2>
            </div>
            <p className="text-xs text-rose-100 mt-0.5">
              Zero-latency bed assignment for trauma resuscitation, stroke, and critical EMS transfers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-center">
            <span className="text-[10px] text-rose-200 block uppercase">Emergency Bays</span>
            <span className="font-mono text-base font-bold">{stats.emergencyAvailable} Ready</span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-center">
            <span className="text-[10px] text-rose-200 block uppercase">ICU Beds</span>
            <span className="font-mono text-base font-bold">{stats.icuAvailable} Ready</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {recentEmergencySuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-emerald-900 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-950">{recentEmergencySuccess}</p>
              <p className="text-[11px] text-emerald-700">
                Staff alerted at Nursing Station. Bed telemetry initialized.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('beds')}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shrink-0"
          >
            View in Bed Matrix &rarr;
          </button>
        </div>
      )}

      {/* Rapid Patient Info Intake Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          Rapid Patient Identification & Triage Note
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Patient Name / EMS Tag</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
            <input
              type="text"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Acute Presentation / Triage Assessment
          </label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            placeholder="e.g. Acute STEMI, Anaphylactic shock, Massive GI bleed..."
          />
        </div>
      </div>

      {/* Available Critical Beds & 1-Click Allocation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Prioritized Emergency & ICU Beds ({availableCriticalBeds.length} Ready)
            </h3>
            <p className="text-xs text-slate-500">
              Select any bed for instant one-click express allocation
            </p>
          </div>

          {bestEmergencyBed && (
            <button
              onClick={() => handleOneClickAllocation(bestEmergencyBed)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Auto-Assign Best Bed ({bestEmergencyBed.bedNumber})</span>
            </button>
          )}
        </div>

        {availableCriticalBeds.length === 0 ? (
          <div className="p-8 rounded-xl bg-rose-50 border border-rose-200 text-center">
            <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-rose-950">CRITICAL: No Emergency or ICU Beds Available</h4>
            <p className="text-xs text-rose-700 max-w-md mx-auto mt-1">
              All trauma and critical care units are at maximum capacity. Immediate diversion or urgent discharge of recovering patients is required.
            </p>
            <button
              onClick={() => onNavigateTab('admissions')}
              className="mt-3 px-4 py-1.5 bg-rose-700 text-white rounded-xl text-xs font-semibold"
            >
              Check Discharge / Cleaning Queue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableCriticalBeds.map((b) => {
              const isBest = bestEmergencyBed?.id === b.id;

              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isBest
                      ? 'border-rose-400 bg-rose-50/40 ring-1 ring-rose-300'
                      : 'border-slate-200 bg-white hover:border-rose-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-base text-slate-900">
                        {b.bedNumber}
                      </span>
                      {isBest ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase">
                          ★ Prime Match
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          🟢 Ready
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-800">
                      {b.ward} · {b.floor}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {b.bedType}
                    </div>

                    <div className="mt-3 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Hardware Installed:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {b.equipment?.map((eq, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOneClickAllocation(b)}
                    className="w-full mt-4 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Instant Allocate {b.bedNumber}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
