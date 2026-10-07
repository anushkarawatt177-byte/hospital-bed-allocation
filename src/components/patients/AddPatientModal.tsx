import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { PriorityLevel, WardType, BedType, Patient } from '../../types/hospital';
import { DOCTORS_LIST } from '../../data/mockData';
import { X, UserPlus, HeartPulse } from 'lucide-react';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (patient: Patient) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addPatient } = useHospital();

  const [formData, setFormData] = useState({
    name: '',
    age: 35,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    contact: '',
    emergencyContact: '',
    diagnosis: '',
    priority: 'Normal' as PriorityLevel,
    requiredWard: 'General Ward' as WardType,
    requiredBedType: 'Standard Bed' as BedType,
    assignedDoctor: DOCTORS_LIST[0],
    bloodGroup: 'O+',
    allergies: '',
    bp: '120/80',
    hr: 75,
    spo2: 98,
    temp: 36.8
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Patient name is required.');
      return;
    }
    if (!formData.diagnosis.trim()) {
      setError('Clinical diagnosis is required.');
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];

    const newPatient = addPatient({
      name: formData.name.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      contact: formData.contact || '+1 (555) 000-0000',
      emergencyContact: formData.emergencyContact || 'Emergency Contact On File',
      admissionDate: todayDate,
      diagnosis: formData.diagnosis.trim(),
      priority: formData.priority,
      requiredWard: formData.requiredWard,
      requiredBedType: formData.requiredBedType,
      assignedDoctor: formData.assignedDoctor,
      status: 'Pending Bed',
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies || 'None recorded',
      vitals: {
        bloodPressure: formData.bp,
        heartRate: Number(formData.hr),
        oxygenSaturation: Number(formData.spo2),
        temperature: Number(formData.temp)
      }
    });

    onClose();
    if (onSuccess) onSuccess(newPatient);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">New Patient Admission Intake</h3>
              <p className="text-xs text-slate-500">
                Register inpatient to clinical queue for bed allocation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Demographic Data */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Patient Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Morris"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Contact</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Clinical Assessment */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Clinical Assessment & Bed Requirements
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Diagnosis / Presenting Complaint *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Coronary Syndrome, Dehydration, Post-Op recovery..."
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Triage Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-sky-800"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Emergency">🚨 Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Required Ward</label>
                  <select
                    value={formData.requiredWard}
                    onChange={(e) => setFormData({ ...formData, requiredWard: e.target.value as WardType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
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
                    value={formData.requiredBedType}
                    onChange={(e) => setFormData({ ...formData, requiredBedType: e.target.value as BedType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
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
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Physician</label>
                <select
                  value={formData.assignedDoctor}
                  onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  {DOCTORS_LIST.map(doc => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Known Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Latex, NSAIDs or None"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Vitals Snapshot */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              Initial Triage Vitals
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">BP (mmHg)</label>
                <input
                  type="text"
                  value={formData.bp}
                  onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-center font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={formData.hr}
                  onChange={(e) => setFormData({ ...formData, hr: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-center font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">SpO2 (%)</label>
                <input
                  type="number"
                  value={formData.spo2}
                  onChange={(e) => setFormData({ ...formData, spo2: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-center font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temp}
                  onChange={(e) => setFormData({ ...formData, temp: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-center font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Admit & Queue for Bed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
