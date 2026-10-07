import React, { useState, useMemo } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Patient, PriorityLevel, PatientStatus } from '../../types/hospital';
import { AddPatientModal } from './AddPatientModal';
import { PatientDetailModal } from './PatientDetailModal';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  BedDouble, 
  LogOut, 
  Eye, 
  ArrowUpDown, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

interface PatientManagementProps {
  onNavigateTab: (tab: string) => void;
  onAllocateBedForPatient: (patient: Patient) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({
  onNavigateTab,
  onAllocateBedForPatient
}) => {
  const { patients, dischargePatient, currentUser } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [selectedPatientForModal, setSelectedPatientForModal] = useState<Patient | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [dischargeTarget, setDischargeTarget] = useState<Patient | null>(null);
  const [dischargeNotes, setDischargeNotes] = useState('');

  // Filtering
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchStatus = statusFilter === 'All' || patient.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || patient.priority === priorityFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        patient.name.toLowerCase().includes(q) ||
        patient.patientId.toLowerCase().includes(q) ||
        patient.diagnosis.toLowerCase().includes(q) ||
        (patient.assignedBedNumber && patient.assignedBedNumber.toLowerCase().includes(q)) ||
        patient.assignedDoctor.toLowerCase().includes(q);

      return matchStatus && matchPriority && matchSearch;
    });
  }, [patients, statusFilter, priorityFilter, searchQuery]);

  const handleConfirmDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dischargeTarget) return;

    dischargePatient(dischargeTarget.patientId, dischargeNotes || 'Discharged in stable condition.');
    setDischargeTarget(null);
    setDischargeNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Intake Metrics */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Inpatient Clinical Registry</h2>
          <p className="text-xs text-slate-500">
            Comprehensive hospital admissions database, priority triage, and bed linkage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Admit New Patient</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name, ID, diagnosis, doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="All">All Statuses ({patients.length})</option>
            <option value="Admitted">Admitted ({patients.filter(p => p.status === 'Admitted').length})</option>
            <option value="Pending Bed">Pending Bed ({patients.filter(p => p.status === 'Pending Bed').length})</option>
            <option value="In Triage">In Triage ({patients.filter(p => p.status === 'In Triage').length})</option>
            <option value="Discharged">Discharged ({patients.filter(p => p.status === 'Discharged').length})</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="All">All Priorities</option>
            <option value="Emergency">🚨 Emergency Only</option>
            <option value="High">⚠️ High Priority</option>
            <option value="Normal">Normal Priority</option>
          </select>

          {(statusFilter !== 'All' || priorityFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setPriorityFilter('All');
                setSearchQuery('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline px-2 py-1 font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Patient ID</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Admission Date</th>
                <th className="py-3.5 px-4">Diagnosis</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Assigned Bed</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-400">
                    No patient records found matching query.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const isAdmitted = patient.status === 'Admitted';
                  const isPending = patient.status === 'Pending Bed' || patient.status === 'In Triage';
                  const isDischarged = patient.status === 'Discharged';

                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {patient.patientId}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {patient.name}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {patient.age} yrs · {patient.gender}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {patient.contact}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {patient.admissionDate}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-[200px] truncate" title={patient.diagnosis}>
                        {patient.diagnosis}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            patient.priority === 'Emergency'
                              ? 'bg-rose-100 text-rose-800'
                              : patient.priority === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {patient.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {patient.assignedBedNumber && !isDischarged ? (
                          <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                            {patient.assignedBedNumber}
                          </span>
                        ) : isDischarged ? (
                          <span className="text-slate-400 font-mono text-[11px]">
                            Vacated
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-100">
                            Unallocated
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            isAdmitted
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : isPending
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPatientForModal(patient)}
                            className="p-1 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-lg"
                            title="View Patient Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Allocate button if pending */}
                          {isPending && (
                            <button
                              onClick={() => onAllocateBedForPatient(patient)}
                              className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                              title="Allocate bed to this patient"
                            >
                              <BedDouble className="w-3 h-3" />
                              <span>Allocate</span>
                            </button>
                          )}

                          {/* Discharge button if admitted */}
                          {isAdmitted && currentUser?.role !== 'Doctor' && (
                            <button
                              onClick={() => setDischargeTarget(patient)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                              title="Discharge patient"
                            >
                              <LogOut className="w-3 h-3" />
                              <span>Discharge</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatientForModal && (
        <PatientDetailModal
          patient={selectedPatientForModal}
          isOpen={!!selectedPatientForModal}
          onClose={() => setSelectedPatientForModal(null)}
          onAllocateBed={(patient) => {
            onAllocateBedForPatient(patient);
          }}
          onDischarge={(patient) => {
            setDischargeTarget(patient);
          }}
        />
      )}

      {/* Add Patient Modal */}
      {isAddPatientOpen && (
        <AddPatientModal
          isOpen={isAddPatientOpen}
          onClose={() => setIsAddPatientOpen(false)}
          onSuccess={(newPat) => {
            if (newPat.priority === 'Emergency') {
              onNavigateTab('emergency');
            } else {
              onAllocateBedForPatient(newPat);
            }
          }}
        />
      )}

      {/* Discharge Confirmation Modal */}
      {dischargeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LogOut className="w-5 h-5 text-rose-600" />
              <span>Confirm Patient Discharge</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Discharging <strong>{dischargeTarget.name}</strong> ({dischargeTarget.patientId}).
              Assigned bed <strong>{dischargeTarget.assignedBedNumber}</strong> will automatically be switched to <strong>Terminal Cleaning</strong>.
            </p>

            <form onSubmit={handleConfirmDischarge} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Discharge Summary / Clinical Instructions
                </label>
                <textarea
                  rows={3}
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                  placeholder="e.g. Afebrile, vitals stable, sutures dry. Medications given. Return in 7 days for checkup."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDischargeTarget(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Confirm Discharge & Release Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
