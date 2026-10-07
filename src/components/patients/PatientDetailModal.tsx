import React, { useState } from 'react';
import { Patient } from '../../types/hospital';
import { useHospital } from '../../context/HospitalContext';
import { 
  X, 
  User, 
  BedDouble, 
  Activity, 
  HeartPulse, 
  Calendar, 
  Phone, 
  AlertCircle, 
  Stethoscope, 
  LogOut, 
  PlusCircle, 
  FileText,
  Save
} from 'lucide-react';

interface PatientDetailModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onAllocateBed: (patient: Patient) => void;
  onDischarge: (patient: Patient) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
  onAllocateBed,
  onDischarge
}) => {
  const { updatePatient } = useHospital();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(patient.dischargeSummary || patient.diagnosis);

  if (!isOpen) return null;

  const handleSaveNotes = () => {
    updatePatient({
      ...patient,
      dischargeSummary: notesText
    });
    setIsEditingNotes(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {patient.name}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {patient.patientId}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {patient.age} yrs · {patient.gender} · Blood Group {patient.bloodGroup}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* Priority & Assigned Bed Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Admission Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                  patient.status === 'Admitted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : patient.status === 'Pending Bed' || patient.status === 'In Triage'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {patient.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Assigned Bed:</span>
              {patient.assignedBedNumber ? (
                <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {patient.assignedBedNumber}
                </span>
              ) : (
                <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Unallocated
                </span>
              )}
            </div>
          </div>

          {/* Clinical Profile */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Clinical Diagnosis & Treatment
            </h4>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Primary Diagnosis</span>
                <p className="font-medium text-slate-900 text-sm mt-0.5">{patient.diagnosis}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Attending Physician</span>
                  <span className="font-semibold text-slate-800">{patient.assignedDoctor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Admission Date</span>
                  <span className="font-mono text-slate-800">{patient.admissionDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Required Ward</span>
                  <span className="font-semibold text-slate-800">{patient.requiredWard}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Bed Type Needed</span>
                  <span className="font-semibold text-slate-800">{patient.requiredBedType}</span>
                </div>
              </div>

              {patient.allergies && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase">Allergies</span>
                  <span className="text-rose-700 font-medium">{patient.allergies}</span>
                </div>
              )}
            </div>
          </div>

          {/* Vitals Telemetry */}
          {patient.vitals && (
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                Latest Vital Telemetry Readings
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase">Blood Pressure</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{patient.vitals.bloodPressure}</span>
                  <span className="text-[9px] text-slate-400 block">mmHg</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase">Heart Rate</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{patient.vitals.heartRate}</span>
                  <span className="text-[9px] text-slate-400 block">bpm</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase">SpO2 Oxygen</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{patient.vitals.oxygenSaturation}%</span>
                  <span className="text-[9px] text-slate-400 block">room air</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase">Temperature</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{patient.vitals.temperature}°C</span>
                  <span className="text-[9px] text-slate-400 block">tympanic</span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
              Emergency & Next of Kin Contacts
            </h4>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Patient Direct:</span>
                <span className="font-mono text-slate-800">{patient.contact}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Emergency Escort:</span>
                <span className="font-semibold text-slate-800">{patient.emergencyContact}</span>
              </div>
            </div>
          </div>

          {/* Clinical Progress Notes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Clinical Progress & Discharge Notes
              </h4>
              {!isEditingNotes ? (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-sky-600 hover:text-sky-800 font-semibold text-[11px]"
                >
                  Edit Note
                </button>
              ) : (
                <button
                  onClick={handleSaveNotes}
                  className="text-emerald-600 hover:text-emerald-800 font-semibold text-[11px] flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Save Note
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                rows={3}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
              />
            ) : (
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 leading-relaxed italic">
                {patient.dischargeSummary || patient.diagnosis || 'No additional clinical remarks recorded.'}
              </p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl font-medium"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {patient.status !== 'Admitted' && (
              <button
                onClick={() => {
                  onAllocateBed(patient);
                  onClose();
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Allocate Bed</span>
              </button>
            )}

            {patient.status === 'Admitted' && (
              <button
                onClick={() => {
                  onDischarge(patient);
                  onClose();
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Discharge Patient</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
