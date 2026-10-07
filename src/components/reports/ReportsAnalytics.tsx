import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Calendar, 
  TrendingUp, 
  Activity, 
  FileText,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { beds, patients, stats } = useHospital();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [reportGenerated, setReportGenerated] = useState(false);

  // Ward occupancy rates
  const wardBreakdown = [
    { name: 'ICU', total: 12, occupied: beds.filter(b => b.ward === 'ICU' && b.status === 'occupied').length, util: 83 },
    { name: 'Emergency', total: 10, occupied: beds.filter(b => b.ward === 'Emergency' && b.status === 'occupied').length, util: 70 },
    { name: 'General Ward', total: 40, occupied: beds.filter(b => b.ward === 'General Ward' && b.status === 'occupied').length, util: 78 },
    { name: 'Pediatric', total: 15, occupied: beds.filter(b => b.ward === 'Pediatric' && b.status === 'occupied').length, util: 60 },
    { name: 'Private Ward', total: 18, occupied: beds.filter(b => b.ward === 'Private Ward' && b.status === 'occupied').length, util: 72 },
    { name: 'Semi-Private Ward', total: 24, occupied: beds.filter(b => b.ward === 'Semi-Private Ward' && b.status === 'occupied').length, util: 67 }
  ];

  // Export CSV Functionality
  const handleExportCSV = () => {
    const headers = ['Bed Number', 'Ward', 'Bed Type', 'Floor', 'Status', 'Current Patient', 'Patient ID'];
    const rows = beds.map(b => [
      b.bedNumber,
      b.ward,
      b.bedType,
      b.floor,
      b.status,
      b.currentPatientName || 'N/A',
      b.currentPatientId || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.map(item => `"${item}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hospital_Bed_Census_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleGenerateReport = () => {
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Hospital Reports & Capacity Analytics</h2>
          <p className="text-xs text-slate-500">
            Audit-grade bed utilization metrics, length of stay analysis, and CSV/PDF export
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateReport}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate Report</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {reportGenerated && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>New clinical utilization report generated successfully for October 2026!</span>
        </div>
      )}

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Daily Occupancy</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {stats.occupancyRate}%
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Optimal threshold (75-85%)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Weekly Patient Turnover</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            170 Pts
          </div>
          <span className="text-[11px] text-slate-500 font-medium">96 Admitted · 74 Discharged</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Length of Stay (ALOS)</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            4.2 Days
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">-0.4 days vs regional target</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Bed Sanitization Turnaround</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            38 Mins
          </div>
          <span className="text-[11px] text-sky-700 font-medium">From release to available</span>
        </div>
      </div>

      {/* Timeframe View Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Occupancy Velocity by Time Horizon
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['daily', 'weekly', 'monthly'] as const).map(t => (
              <button
                key={t}
                onClick={() => setReportType(t)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                  reportType === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Breakdown table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Department / Ward</th>
                <th className="py-3 px-4">Total Bed Capacity</th>
                <th className="py-3 px-4">Currently Occupied</th>
                <th className="py-3 px-4">Available Capacity</th>
                <th className="py-3 px-4">Average Utilization</th>
                <th className="py-3 px-4">Status Threshold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {wardBreakdown.map((w) => {
                const avail = w.total - w.occupied;
                const isCritical = w.util >= 80;
                return (
                  <tr key={w.name} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{w.name}</td>
                    <td className="py-3 px-4 font-mono">{w.total} beds</td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-700">{w.occupied}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">{avail}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full ${isCritical ? 'bg-rose-500' : 'bg-sky-600'}`}
                            style={{ width: `${w.util}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-900 font-semibold">{w.util}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isCritical ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isCritical ? 'High Load' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
