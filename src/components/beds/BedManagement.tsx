import React, { useState, useMemo } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Bed, WardType, BedStatus, BedType } from '../../types/hospital';
import { BedDetailModal } from './BedDetailModal';
import { 
  BedDouble, 
  Search, 
  Filter, 
  Plus, 
  User, 
  Sparkles, 
  Wrench, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpDown,
  Building,
  Layers,
  Activity
} from 'lucide-react';

interface BedManagementProps {
  onNavigateTab: (tab: string) => void;
  onAllocateBedTarget: (bed: Bed) => void;
  onDischargePatientTarget: (patientId: string) => void;
  preselectedBedNumber?: string;
}

export const BedManagement: React.FC<BedManagementProps> = ({
  onNavigateTab,
  onAllocateBedTarget,
  onDischargePatientTarget,
  preselectedBedNumber
}) => {
  const { beds, stats, currentUser, addNewBed } = useHospital();

  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [selectedBedType, setSelectedBedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(preselectedBedNumber || '');
  const [selectedBedForModal, setSelectedBedForModal] = useState<Bed | null>(null);
  const [isAddBedOpen, setIsAddBedOpen] = useState(false);

  // New bed modal form state
  const [newBedForm, setNewBedForm] = useState({
    bedNumber: '',
    ward: 'General Ward' as WardType,
    bedType: 'Standard Bed' as BedType,
    floor: '3rd Floor',
    equipment: 'Nurse Call Bell, Oxygen Port'
  });

  const wardTabs = [
    'All',
    'General Ward',
    'ICU',
    'Emergency',
    'Pediatric',
    'Private Ward',
    'Semi-Private Ward'
  ];

  // Filtering logic
  const filteredBeds = useMemo(() => {
    return beds.filter((bed) => {
      const matchWard = selectedWard === 'All' || bed.ward === selectedWard;
      const matchStatus = selectedStatus === 'All' || bed.status === selectedStatus;
      const matchFloor = selectedFloor === 'All' || bed.floor.includes(selectedFloor);
      const matchType = selectedBedType === 'All' || bed.bedType === selectedBedType;
      
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        bed.bedNumber.toLowerCase().includes(q) ||
        bed.ward.toLowerCase().includes(q) ||
        (bed.currentPatientName && bed.currentPatientName.toLowerCase().includes(q)) ||
        (bed.currentPatientId && bed.currentPatientId.toLowerCase().includes(q));

      return matchWard && matchStatus && matchFloor && matchType && matchSearch;
    });
  }, [beds, selectedWard, selectedStatus, selectedFloor, selectedBedType, searchQuery]);

  const handleCreateBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBedForm.bedNumber) return;

    addNewBed({
      bedNumber: newBedForm.bedNumber.toUpperCase(),
      ward: newBedForm.ward,
      bedType: newBedForm.bedType,
      floor: newBedForm.floor,
      status: 'available',
      equipment: newBedForm.equipment.split(',').map(s => s.trim()),
      notes: 'Newly commissioned bed.'
    });

    setIsAddBedOpen(false);
    setNewBedForm({
      bedNumber: '',
      ward: 'General Ward',
      bedType: 'Standard Bed',
      floor: '3rd Floor',
      equipment: 'Nurse Call Bell, Oxygen Port'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Bed Inventory & Matrix</h2>
          <p className="text-xs text-slate-500">
            Real-time status display of all hospital beds across inpatient departments
          </p>
        </div>

        {/* Status Indicators Pill Counter */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setSelectedStatus('All')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              selectedStatus === 'All'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All: <span className="font-mono tabular-nums">{stats.totalBeds}</span>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === 'available' ? 'All' : 'available')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedStatus === 'available'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50/80 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Available:</span>
            <span className="font-mono tabular-nums">{stats.availableBeds}</span>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === 'occupied' ? 'All' : 'occupied')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedStatus === 'occupied'
                ? 'bg-sky-700 text-white border-sky-700'
                : 'bg-sky-50/80 text-sky-800 border-sky-200 hover:bg-sky-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <span>Occupied:</span>
            <span className="font-mono tabular-nums">{stats.occupiedBeds}</span>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === 'reserved' ? 'All' : 'reserved')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedStatus === 'reserved'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50/80 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Reserved:</span>
            <span className="font-mono tabular-nums">{stats.reservedBeds}</span>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === 'cleaning' ? 'All' : 'cleaning')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedStatus === 'cleaning'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-blue-50/80 text-blue-800 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Cleaning:</span>
            <span className="font-mono tabular-nums">{stats.cleaningBeds}</span>
          </button>

          {currentUser?.role === 'Admin' && (
            <button
              onClick={() => setIsAddBedOpen(true)}
              className="ml-auto px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Bed</span>
            </button>
          )}
        </div>
      </div>

      {/* Ward Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {wardTabs.map((ward) => {
          const isSelected = selectedWard === ward;
          const count = ward === 'All' 
            ? beds.length 
            : beds.filter(b => b.ward === ward).length;

          return (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{ward}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                isSelected ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Multi-Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bed number, patient name, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Floor filter */}
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="All">All Floors</option>
            <option value="Ground">Ground Floor (Emergency)</option>
            <option value="2nd">2nd Floor (ICU)</option>
            <option value="3rd">3rd Floor (General)</option>
            <option value="4th">4th Floor (Pediatric & Semi)</option>
            <option value="5th">5th Floor (Private)</option>
          </select>

          {/* Bed type filter */}
          <select
            value={selectedBedType}
            onChange={(e) => setSelectedBedType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500 max-w-[180px] truncate"
          >
            <option value="All">All Bed Types</option>
            <option value="Standard Bed">Standard Bed</option>
            <option value="ICU Bed with Ventilator">ICU Bed with Ventilator</option>
            <option value="ICU High Dependency">ICU High Dependency</option>
            <option value="Emergency Trauma Bed">Emergency Trauma Bed</option>
            <option value="Oxygen Supported Bed">Oxygen Supported Bed</option>
            <option value="Pediatric Crib">Pediatric Crib</option>
            <option value="Deluxe Private Suite">Deluxe Private Suite</option>
            <option value="Isolation Bed">Isolation Bed</option>
          </select>

          {/* Reset Filters */}
          {(selectedWard !== 'All' || selectedStatus !== 'All' || selectedFloor !== 'All' || selectedBedType !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedWard('All');
                setSelectedStatus('All');
                setSelectedFloor('All');
                setSelectedBedType('All');
                setSearchQuery('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline px-2 py-1 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bed Grid Display */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
          <span>
            Showing <strong className="text-slate-900 font-mono">{filteredBeds.length}</strong> of{' '}
            <strong className="text-slate-900 font-mono">{beds.length}</strong> hospital beds
          </span>
          <span className="text-[11px] text-slate-400">Click any bed card to inspect or perform actions</span>
        </div>

        {filteredBeds.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <BedDouble className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-sm text-slate-800">No beds matched your criteria</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your ward, floor, or status filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
            {filteredBeds.map((bed) => {
              const isAvailable = bed.status === 'available';
              const isOccupied = bed.status === 'occupied';
              const isReserved = bed.status === 'reserved';
              const isCleaning = bed.status === 'cleaning';
              const isMaintenance = bed.status === 'maintenance';

              return (
                <div
                  key={bed.id}
                  onClick={() => setSelectedBedForModal(bed)}
                  className={`bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative ${
                    isAvailable
                      ? 'border-emerald-200/90 hover:border-emerald-400'
                      : isOccupied
                      ? 'border-sky-200/90 hover:border-sky-400'
                      : isReserved
                      ? 'border-amber-200/90 hover:border-amber-400'
                      : isCleaning
                      ? 'border-blue-200/90 hover:border-blue-400'
                      : 'border-slate-300 bg-slate-50/50'
                  }`}
                >
                  {/* Top Bar of Bed Card */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-mono font-bold text-sm text-slate-900 tracking-tight block">
                        {bed.bedNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {bed.floor}
                      </span>
                    </div>

                    {/* Status Dot / Pill */}
                    <div>
                      {isAvailable && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Available
                        </span>
                      )}
                      {isOccupied && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                          Occupied
                        </span>
                      )}
                      {isReserved && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Reserved
                        </span>
                      )}
                      {isCleaning && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-spin" />
                          Cleaning
                        </span>
                      )}
                      {isMaintenance && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          <Wrench className="w-2.5 h-2.5 text-slate-600" />
                          Service
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bed Details */}
                  <div className="space-y-1.5 my-1">
                    <div className="text-[11px] font-semibold text-slate-800 truncate">
                      {bed.ward}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {bed.bedType}
                    </div>

                    {/* Occupant Info */}
                    {isOccupied && bed.currentPatientName && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-sky-950">
                        <User className="w-3 h-3 text-sky-600 shrink-0" />
                        <span className="text-[11px] font-semibold truncate">
                          {bed.currentPatientName}
                        </span>
                      </div>
                    )}

                    {isReserved && bed.currentPatientName && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-amber-900">
                        <User className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="text-[11px] font-medium truncate">
                          Res: {bed.currentPatientName}
                        </span>
                      </div>
                    )}

                    {isCleaning && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-blue-800 text-[10px]">
                        <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>Terminal sanitization</span>
                      </div>
                    )}

                    {isAvailable && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-emerald-700 text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>Ready for intake</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Equipment snippet */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[120px]">
                      {bed.equipment?.[0] || 'Standard'}
                    </span>
                    <span className="text-sky-600 group-hover:underline font-semibold">
                      Inspect &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bed Detail Modal */}
      {selectedBedForModal && (
        <BedDetailModal
          bed={selectedBedForModal}
          isOpen={!!selectedBedForModal}
          onClose={() => setSelectedBedForModal(null)}
          onAllocateBed={(bed) => {
            onAllocateBedTarget(bed);
          }}
          onDischargePatient={(patientId) => {
            onDischargePatientTarget(patientId);
          }}
        />
      )}

      {/* Add New Bed Modal (Admin feature) */}
      {isAddBedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Commission New Hospital Bed</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter hardware inventory specs to register a new bed to the census.
            </p>

            <form onSubmit={handleCreateBed} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bed Number / Code</label>
                <input
                  type="text"
                  placeholder="e.g. ICU-109 or GEN-215"
                  value={newBedForm.bedNumber}
                  onChange={(e) => setNewBedForm({ ...newBedForm, bedNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl uppercase font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department / Ward</label>
                  <select
                    value={newBedForm.ward}
                    onChange={(e) => setNewBedForm({ ...newBedForm, ward: e.target.value as WardType })}
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
                  <label className="block font-semibold text-slate-700 mb-1">Floor Location</label>
                  <input
                    type="text"
                    value={newBedForm.floor}
                    onChange={(e) => setNewBedForm({ ...newBedForm, floor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bed Classification</label>
                <select
                  value={newBedForm.bedType}
                  onChange={(e) => setNewBedForm({ ...newBedForm, bedType: e.target.value as BedType })}
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Installed Equipment (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newBedForm.equipment}
                  onChange={(e) => setNewBedForm({ ...newBedForm, equipment: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="Nurse Call Bell, Oxygen Wall Port, Telemetry"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddBedOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save & Commission Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
