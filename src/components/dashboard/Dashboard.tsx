import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Charts } from './Charts';
import { 
  BedDouble, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Ambulance, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  Search,
  Filter,
  Eye,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  onNavigateTab: (tab: string) => void;
  onSelectBed?: (bedNumber: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateTab, onSelectBed }) => {
  const { stats, beds, allocations } = useHospital();
  const [allocationFilter, setAllocationFilter] = useState('All');
  const [allocationSearch, setAllocationSearch] = useState('');

  // 9 Metric Stat Cards
  const statCards = [
    {
      label: 'Total Beds',
      value: stats.totalBeds,
      sub: 'All wards combined',
      icon: BedDouble,
      iconColor: 'text-slate-700',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200'
    },
    {
      label: 'Available Beds',
      value: stats.availableBeds,
      sub: 'Ready for allocation',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/60',
      borderColor: 'border-emerald-200'
    },
    {
      label: 'Occupied Beds',
      value: stats.occupiedBeds,
      sub: `${stats.occupancyRate}% occupancy`,
      icon: Activity,
      iconColor: 'text-sky-600',
      bgColor: 'bg-sky-50/60',
      borderColor: 'border-sky-200'
    },
    {
      label: 'Reserved Beds',
      value: stats.reservedBeds,
      sub: 'Pending scheduled intake',
      icon: Clock,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50/60',
      borderColor: 'border-amber-200'
    },
    {
      label: 'ICU Beds Available',
      value: stats.icuAvailable,
      sub: stats.icuAvailable <= 2 ? '⚠️ Critical low stock' : 'Optimal capacity',
      icon: ShieldAlert,
      iconColor: stats.icuAvailable <= 2 ? 'text-rose-600' : 'text-purple-600',
      bgColor: stats.icuAvailable <= 2 ? 'bg-rose-50/80' : 'bg-purple-50/60',
      borderColor: stats.icuAvailable <= 2 ? 'border-rose-300' : 'border-purple-200'
    },
    {
      label: 'Emergency Ready',
      value: stats.emergencyAvailable,
      sub: 'Immediate trauma bays',
      icon: Ambulance,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50/60',
      borderColor: 'border-rose-200'
    },
    {
      label: 'Total Inpatients',
      value: stats.totalPatients,
      sub: 'Active admitted & triage',
      icon: Users,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50/60',
      borderColor: 'border-indigo-200'
    },
    {
      label: "Today's Admissions",
      value: stats.todayAdmissions,
      sub: '+12% vs yesterday',
      icon: ArrowUpRight,
      iconColor: 'text-sky-700',
      bgColor: 'bg-sky-50/60',
      borderColor: 'border-sky-200'
    },
    {
      label: "Today's Discharges",
      value: stats.todayDischarges,
      sub: '9 beds sent to sanitization',
      icon: ArrowDownRight,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50/60',
      borderColor: 'border-teal-200'
    }
  ];

  // Filter allocations
  const filteredAllocations = allocations.filter(item => {
    const matchesFilter = allocationFilter === 'All' || item.ward === allocationFilter;
    const matchesSearch = 
      item.patientName.toLowerCase().includes(allocationSearch.toLowerCase()) ||
      item.patientId.toLowerCase().includes(allocationSearch.toLowerCase()) ||
      item.bedNumber.toLowerCase().includes(allocationSearch.toLowerCase()) ||
      item.ward.toLowerCase().includes(allocationSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Alert Banner for low ICU if applicable */}
      {stats.icuAvailable <= 2 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-xl text-rose-700 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Critical Alert: Only {stats.icuAvailable} ICU beds are currently available
              </h4>
              <p className="text-xs text-rose-700">
                Hospital critical care capacity is running low. Please triage general ward step-downs or delay non-urgent surgical admissions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('beds')}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              View ICU Status
            </button>
            <button
              onClick={() => onNavigateTab('emergency')}
              className="px-3 py-1.5 bg-white border border-rose-300 text-rose-800 hover:bg-rose-50 rounded-xl text-xs font-semibold"
            >
              Emergency Routing
            </button>
          </div>
        </div>
      )}

      {/* Top Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Hospital Bed Allocation System</h2>
          <p className="text-xs text-slate-500">
            Real-time census across all 6 departments · Shift: Morning (07:00 - 15:00)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('allocate')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Allocate Bed</span>
          </button>

          <button
            onClick={() => onNavigateTab('emergency')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Ambulance className="w-4 h-4" />
            <span>Emergency Intake</span>
          </button>

          <button
            onClick={() => onNavigateTab('admissions')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <span>Discharge & Clean</span>
            {stats.cleaningBeds > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-900 text-[10px] flex items-center justify-center font-bold">
                {stats.cleaningBeds}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 9 Key Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-9 gap-3">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${card.borderColor} ${card.bgColor} shadow-2xs flex flex-col justify-between transition-all hover:shadow-xs`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-600 truncate">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.iconColor} shrink-0`} />
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
                  {card.value}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {card.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Charts */}
      <Charts beds={beds} occupancyRate={stats.occupancyRate} />

      {/* Recent Bed Allocations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Bed Allocations</h3>
            <p className="text-xs text-slate-500">
              Latest patient admissions and department assignments
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Ward */}
            <div className="relative">
              <select
                value={allocationFilter}
                onChange={(e) => setAllocationFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="All">All Wards</option>
                <option value="ICU">ICU</option>
                <option value="Emergency">Emergency</option>
                <option value="General Ward">General Ward</option>
                <option value="Pediatric">Pediatric</option>
                <option value="Private Ward">Private Ward</option>
                <option value="Semi-Private Ward">Semi-Private Ward</option>
              </select>
            </div>

            {/* Live Search Table */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={allocationSearch}
                onChange={(e) => setAllocationSearch(e.target.value)}
                placeholder="Filter patient or bed..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              onClick={() => onNavigateTab('allocate')}
              className="text-xs px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl flex items-center gap-1 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Allocation</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Bed Number</th>
                <th className="py-3 px-4">Ward</th>
                <th className="py-3 px-4">Bed Type</th>
                <th className="py-3 px-4">Admission Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAllocations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No bed allocation records matching your filter.
                  </td>
                </tr>
              ) : (
                filteredAllocations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {item.patientId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {item.patientName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {item.bedNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {item.ward}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-[160px] truncate">
                      {item.bedType}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {item.admissionDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                          item.priority === 'Emergency'
                            ? 'bg-rose-100 text-rose-800'
                            : item.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                          item.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (onSelectBed) onSelectBed(item.bedNumber);
                          onNavigateTab('beds');
                        }}
                        className="text-sky-600 hover:text-sky-800 font-semibold inline-flex items-center gap-1 hover:underline text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Bed</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
