import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Bed, Patient, WardType, BedType, PriorityLevel } from '../../types/hospital';
import { 
  CheckCircle2, 
  Search, 
  BedDouble, 
  User, 
  Sparkles, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Layers, 
  ShieldCheck, 
  RotateCcw
} from 'lucide-react';

interface BedAllocationProps {
  onNavigateTab: (tab: string) => void;
  preselectedPatient?: Patient | null;
  preselectedBed?: Bed | null;
}

export const BedAllocation: React.FC<BedAllocationProps> = ({
  onNavigateTab,
  preselectedPatient,
  preselectedBed
}) => {
  const { patients, beds, allocateBed } = useHospital();

  // Pending patients queue (or all non-discharged)
  const availablePatients = patients.filter(p => p.status === 'Pending Bed' || p.status === 'In Triage');

  // Step state
  const [step, setStep] = useState<number>(1);

  // Form selections
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    preselectedPatient ? preselectedPatient.id : availablePatients[0]?.id || ''
  );
  const [patientSearch, setPatientSearch] = useState('');

  const currentPatient = patients.find(p => p.id === selectedPatientId);

  const [ward, setWard] = useState<WardType>(
    (currentPatient?.requiredWard as WardType) || 'General Ward'
  );
  const [bedType, setBedType] = useState<BedType>(
    (currentPatient?.requiredBedType as BedType) || 'Standard Bed'
  );
  const [priority, setPriority] = useState<PriorityLevel>(
    currentPatient?.priority || 'Normal'
  );

  const [selectedBedId, setSelectedBedId] = useState<string>(
    preselectedBed ? preselectedBed.id : ''
  );

  const [allocationNotes, setAllocationNotes] = useState('');
  const [confirmationSuccess, setConfirmationSuccess] = useState<string | null>(null);

  // Sync state if preselectedPatient changes
  useEffect(() => {
    if (preselectedPatient) {
      setSelectedPatientId(preselectedPatient.id);
      setWard(preselectedPatient.requiredWard);
      setBedType(preselectedPatient.requiredBedType);
      setPriority(preselectedPatient.priority);
      setStep(2); // Jump directly to ward/bed criteria
    }
  }, [preselectedPatient]);

  useEffect(() => {
    if (preselectedBed) {
      setSelectedBedId(preselectedBed.id);
      setWard(preselectedBed.ward);
      setBedType(preselectedBed.bedType);
    }
  }, [preselectedBed]);

  // Update ward & bed type when patient selection changes
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatientId(patient.id);
    setWard(patient.requiredWard);
    setBedType(patient.requiredBedType);
    setPriority(patient.priority);
    setStep(2);
  };

  // 5. Show ONLY currently available beds
  const availableBeds = beds.filter(b => b.status === 'available');

  // Filter available beds matching current ward & bed type
  const matchingBeds = availableBeds.filter(b => {
    return b.ward === ward;
  });

  // Recommendation engine: scored by matching bed type and floor
  const recommendedBeds = matchingBeds.filter(b => b.bedType === bedType);
  const otherWardBeds = matchingBeds.filter(b => b.bedType !== bedType);

  const selectedBed = beds.find(b => b.id === selectedBedId);

  const handleConfirmAllocation = () => {
    if (!selectedPatientId || !selectedBedId) return;

    const res = allocateBed(selectedPatientId, selectedBedId, allocationNotes);
    if (res.success) {
      setConfirmationSuccess('Bed successfully allocated to the patient.');
    }
  };

  const handleResetWorkflow = () => {
    setConfirmationSuccess(null);
    setStep(1);
    setSelectedBedId('');
    setAllocationNotes('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title & Wizard Stepper */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Bed Allocation Workflow</h2>
            <p className="text-xs text-slate-500">
              Match patient requirements with sterilized hospital beds in 3 streamlined steps
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="font-bold text-sky-700">{availableBeds.length}</span> beds currently available for allocation
          </div>
        </div>

        {/* Wizard Stepper Progress Bar */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div
            onClick={() => setStep(1)}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              step === 1
                ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold'
                : step > 1
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-wider">Step 1</div>
            <div className="font-semibold text-xs mt-0.5">Select Patient</div>
          </div>

          <div
            onClick={() => currentPatient && setStep(2)}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              step === 2
                ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold'
                : step > 2
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-wider">Step 2</div>
            <div className="font-semibold text-xs mt-0.5">Ward & Bed Criteria</div>
          </div>

          <div
            onClick={() => selectedBed && setStep(3)}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              step === 3
                ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-wider">Step 3</div>
            <div className="font-semibold text-xs mt-0.5">Summary & Confirm</div>
          </div>
        </div>
      </div>

      {/* Confirmation Success Banner */}
      {confirmationSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 shadow-sm text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950">
            Bed successfully allocated to the patient.
          </h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            Patient <strong>{currentPatient?.name}</strong> has been assigned to bed{' '}
            <strong>{selectedBed?.bedNumber}</strong> ({selectedBed?.ward}). The bed status is now updated to Occupied, and the hospital census has adjusted automatically.
          </p>

          <div className="flex justify-center gap-3 pt-3">
            <button
              onClick={() => onNavigateTab('beds')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              View Bed Management
            </button>
            <button
              onClick={handleResetWorkflow}
              className="px-4 py-2 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-semibold"
            >
              Allocate Another Patient
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Select Patient */}
      {!confirmationSuccess && step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Step 1: Choose Inpatient for Allocation</h3>
              <p className="text-xs text-slate-500">
                Select from pending admission intake or filter by patient name
              </p>
            </div>
            <span className="font-mono text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-semibold">
              {availablePatients.length} Waiting for Beds
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient name, ID or diagnosis..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Patient Cards List */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto">
            {availablePatients.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No patients currently waiting for beds. All active inpatients are allocated.
              </div>
            ) : (
              availablePatients
                .filter(p => 
                  p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
                  p.patientId.toLowerCase().includes(patientSearch.toLowerCase()) ||
                  p.diagnosis.toLowerCase().includes(patientSearch.toLowerCase())
                )
                .map((pat) => {
                  const isSelected = selectedPatientId === pat.id;
                  return (
                    <div
                      key={pat.id}
                      onClick={() => handleSelectPatient(pat)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/70 shadow-2xs ring-1 ring-sky-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{pat.name}</span>
                            <span className="font-mono text-[11px] text-slate-400">{pat.patientId}</span>
                            <span
                              className={`text-[10px] px-2 py-0.2 rounded font-semibold ${
                                pat.priority === 'Emergency'
                                  ? 'bg-rose-100 text-rose-800'
                                  : pat.priority === 'High'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {pat.priority}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate mt-0.5">
                            {pat.diagnosis} · Ward requested: <strong>{pat.requiredWard}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                          {pat.admissionDate}
                        </span>
                        <button
                          type="button"
                          className="px-3 py-1 bg-sky-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <span>Select</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* STEP 2: Configure Ward & Bed Requirements & Choose Bed */}
      {!confirmationSuccess && step === 2 && currentPatient && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
          {/* Patient Quick Strip */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Allocating for:</span>
              <strong className="text-slate-900">{currentPatient.name}</strong>
              <span className="font-mono text-slate-400">({currentPatient.patientId})</span>
              <span className="text-slate-600">· {currentPatient.diagnosis}</span>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-sky-600 hover:text-sky-800 font-semibold text-[11px]"
            >
              Change Patient
            </button>
          </div>

          {/* Step 2 Inputs: Ward, Bed Type, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Ward</label>
              <select
                value={ward}
                onChange={(e) => {
                  setWard(e.target.value as WardType);
                  setSelectedBedId('');
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-sky-500"
              >
                <option value="General Ward">General Ward</option>
                <option value="ICU">ICU</option>
                <option value="Emergency">Emergency</option>
                <option value="Pediatric">Pediatric</option>
                <option value="Private Ward">Private Ward</option>
                <option value="Semi-Private Ward">Semi-Private Ward</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Required Bed Type</label>
              <select
                value={bedType}
                onChange={(e) => {
                  setBedType(e.target.value as BedType);
                  setSelectedBedId('');
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-sky-500"
              >
                <option value="Standard Bed">Standard Bed</option>
                <option value="ICU Bed with Ventilator">ICU Bed with Ventilator</option>
                <option value="ICU High Dependency">ICU High Dependency</option>
                <option value="Emergency Trauma Bed">Emergency Trauma Bed</option>
                <option value="Oxygen Supported Bed">Oxygen Supported Bed</option>
                <option value="Pediatric Crib">Pediatric Crib</option>
                <option value="Deluxe Private Suite">Deluxe Private Suite</option>
                <option value="Isolation Bed">Isolation Bed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Triage Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-sky-800"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* 6. Display Recommended and Currently Available Beds */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Available Beds in {ward} ({matchingBeds.length})
              </h4>
              <span className="text-[11px] text-slate-400">
                Only currently sterilized & vacant beds shown
              </span>
            </div>

            {matchingBeds.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-rose-200 bg-rose-50/50 text-center">
                <AlertCircle className="w-6 h-6 text-rose-500 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-rose-800">No available beds in {ward}</p>
                <p className="text-[11px] text-rose-600 mt-1">
                  All beds in this department are currently occupied, reserved, or in terminal cleaning.
                  Consider selecting an alternate ward or checking cleaning status.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Recommended Matches */}
                {recommendedBeds.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-emerald-700 mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Best Recommended Matches for {currentPatient.name}:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {recommendedBeds.map((b) => {
                        const isChosen = selectedBedId === b.id;
                        return (
                          <div
                            key={b.id}
                            onClick={() => setSelectedBedId(b.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isChosen
                                ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-500'
                                : 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-400'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono font-bold text-sm text-slate-900">
                                {b.bedNumber}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                Recommended
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600">{b.bedType}</p>
                            <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                              <span>{b.floor}</span>
                              <span className="text-sky-700 font-semibold">
                                {isChosen ? 'Selected ✓' : 'Select'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Other Available Beds in this ward */}
                {otherWardBeds.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                      Other Available Beds in {ward}:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {otherWardBeds.map((b) => {
                        const isChosen = selectedBedId === b.id;
                        return (
                          <div
                            key={b.id}
                            onClick={() => setSelectedBedId(b.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isChosen
                                ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-500'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono font-bold text-sm text-slate-900">
                                {b.bedNumber}
                              </span>
                              <span className="text-[10px] text-emerald-700">🟢 Vacant</span>
                            </div>
                            <p className="text-[11px] text-slate-600">{b.bedType}</p>
                            <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                              <span>{b.floor}</span>
                              <span className="text-sky-700 font-semibold">
                                {isChosen ? 'Selected ✓' : 'Select'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50"
            >
              &larr; Back to Patient
            </button>

            <button
              type="button"
              disabled={!selectedBedId}
              onClick={() => setStep(3)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedBedId
                  ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Review Allocation Summary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Allocation Summary & Confirm */}
      {!confirmationSuccess && step === 3 && currentPatient && selectedBed && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Step 3: Bed Allocation Summary</h3>
            <p className="text-xs text-slate-500">
              Please verify all inpatient details and hardware requirements before confirming assignment
            </p>
          </div>

          {/* 8. Summary Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Patient</span>
                <strong className="text-sm text-slate-900">{currentPatient.name}</strong>
                <span className="text-[11px] text-slate-500 block">
                  ID: {currentPatient.patientId} · {currentPatient.age} yrs · {currentPatient.gender}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Assigned Bed</span>
                <span className="text-sm font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                  {selectedBed.bedNumber}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {selectedBed.ward} ({selectedBed.floor})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Bed Type</span>
                <span className="font-semibold text-slate-800">{selectedBed.bedType}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Priority</span>
                <span className="font-semibold text-slate-800">{priority}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Attending Doctor</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {currentPatient.assignedDoctor}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Diagnosis</span>
              <p className="font-medium text-slate-800 mt-0.5">{currentPatient.diagnosis}</p>
            </div>
          </div>

          {/* Allocation Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical Allocation Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Patient requires bedside oxygen hookup and cardiac telemetry."
              value={allocationNotes}
              onChange={(e) => setAllocationNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* 9. Confirm Allocation Button */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50"
            >
              &larr; Back to Bed Selection
            </button>

            <button
              type="button"
              onClick={handleConfirmAllocation}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Allocate Bed</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
