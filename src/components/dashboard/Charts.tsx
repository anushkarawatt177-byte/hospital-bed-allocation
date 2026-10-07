import React, { useState } from 'react';
import { Bed } from '../../types/hospital';

interface ChartsProps {
  beds: Bed[];
  occupancyRate: number;
}

export const Charts: React.FC<ChartsProps> = ({ beds, occupancyRate }) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Status breakdown
  const total = beds.length || 1;
  const occupiedCount = beds.filter(b => b.status === 'occupied').length;
  const availableCount = beds.filter(b => b.status === 'available').length;
  const reservedCount = beds.filter(b => b.status === 'reserved').length;
  const cleaningCount = beds.filter(b => b.status === 'cleaning' || b.status === 'maintenance').length;

  const occupiedPct = Math.round((occupiedCount / total) * 100);
  const availablePct = Math.round((availableCount / total) * 100);
  const reservedPct = Math.round((reservedCount / total) * 100);
  const cleaningPct = Math.max(0, 100 - occupiedPct - availablePct - reservedPct);

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffsetOccupied = circumference - (occupiedPct / 100) * circumference;

  // 7-day Admissions & Discharges trend data
  const daysData = [
    { day: 'Wed', date: 'Oct 01', admissions: 12, discharges: 8 },
    { day: 'Thu', date: 'Oct 02', admissions: 15, discharges: 11 },
    { day: 'Fri', date: 'Oct 03', admissions: 18, discharges: 14 },
    { day: 'Sat', date: 'Oct 04', admissions: 9, discharges: 13 },
    { day: 'Sun', date: 'Oct 05', admissions: 11, discharges: 7 },
    { day: 'Mon', date: 'Oct 06', admissions: 17, discharges: 12 },
    { day: 'Tue', date: 'Oct 07', admissions: 14, discharges: 9 }
  ];

  const maxVal = Math.max(...daysData.flatMap(d => [d.admissions, d.discharges]), 20);

  // Ward breakdown
  const wardList = ['ICU', 'Emergency', 'General Ward', 'Pediatric', 'Private Ward', 'Semi-Private Ward'] as const;
  const wardBreakdown = wardList.map(w => {
    const wardBeds = beds.filter(b => b.ward === w);
    const wardTotal = wardBeds.length;
    const wardOccupied = wardBeds.filter(b => b.status === 'occupied').length;
    const wardAvail = wardBeds.filter(b => b.status === 'available').length;
    const rate = wardTotal > 0 ? Math.round((wardOccupied / wardTotal) * 100) : 0;
    return { name: w, total: wardTotal, occupied: wardOccupied, available: wardAvail, rate };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* 1. Bed Occupancy Percentage Gauge */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Bed Occupancy
            </h3>
            <p className="text-[11px] text-slate-400">Total hospital bed capacity</p>
          </div>
          <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
            {occupancyRate}% Occupied
          </span>
        </div>

        <div className="flex items-center justify-center my-4 relative">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 130 130">
            {/* Background Circle */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              className="text-slate-100"
              strokeWidth="14"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Available Arc */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              className="text-emerald-500"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - ((occupiedPct + availablePct) / 100) * circumference}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Occupied Arc */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              className="text-sky-600"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffsetOccupied}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Centered Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
              {occupancyRate}%
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Utilization
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              Occupied
            </span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {occupiedCount} ({occupiedPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Available
            </span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {availableCount} ({availablePct}%)
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Reserved
            </span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {reservedCount} ({reservedPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              Cleaning
            </span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {cleaningCount} ({cleaningPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Admissions vs Discharges (Last 7 Days) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Patient Flow (Last 7 Days)
            </h3>
            <p className="text-[11px] text-slate-400">Admissions vs Discharges comparison</p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-xs bg-sky-600" />
              Admissions
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              Discharges
            </span>
          </div>
        </div>

        {/* Bar Chart Canvas */}
        <div className="h-44 flex items-end justify-between gap-2 pt-4 pb-2 border-b border-slate-100">
          {daysData.map((d, index) => {
            const admHeight = Math.round((d.admissions / maxVal) * 110);
            const disHeight = Math.round((d.discharges / maxVal) * 110);
            const isHovered = hoveredDay === index;

            return (
              <div
                key={d.day}
                onMouseEnter={() => setHoveredDay(index)}
                onMouseLeave={() => setHoveredDay(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-11 z-20 bg-slate-900 text-white rounded-lg px-2 py-1 text-[10px] shadow-lg whitespace-nowrap pointer-events-none">
                    <p className="font-semibold">{d.date}</p>
                    <p className="text-sky-300">Adm: {d.admissions} · Dis: {d.discharges}</p>
                  </div>
                )}

                <div className="w-full flex items-end justify-center gap-1.5 h-32">
                  {/* Admissions Bar */}
                  <div
                    style={{ height: `${admHeight}px` }}
                    className="w-3 sm:w-3.5 bg-sky-600 rounded-t-xs group-hover:bg-sky-500 transition-all duration-200"
                  />
                  {/* Discharges Bar */}
                  <div
                    style={{ height: `${disHeight}px` }}
                    className="w-3 sm:w-3.5 bg-emerald-500 rounded-t-xs group-hover:bg-emerald-400 transition-all duration-200"
                  />
                </div>

                <span className="text-[10px] font-medium text-slate-500 mt-2">
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs pt-3 text-slate-500 font-medium">
          <span>7-Day Admissions Total: <strong className="text-slate-800 font-mono">96</strong></span>
          <span>7-Day Discharges Total: <strong className="text-slate-800 font-mono">74</strong></span>
        </div>
      </div>

      {/* 3. Ward Occupancy Distribution */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Ward Occupancy Levels
            </h3>
            <p className="text-[11px] text-slate-400">Current active ward utilization</p>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            6 Wards Active
          </span>
        </div>

        <div className="space-y-3 my-auto py-2">
          {wardBreakdown.map((wb) => {
            const isHigh = wb.rate >= 80;
            return (
              <div key={wb.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 truncate max-w-[130px]">
                    {wb.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {wb.occupied}/{wb.total} beds
                    </span>
                    <span className={`font-mono font-bold text-[11px] ${isHigh ? 'text-rose-600' : 'text-slate-700'}`}>
                      {wb.rate}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHigh ? 'bg-rose-500' : wb.rate > 60 ? 'bg-sky-600' : 'bg-teal-500'
                    }`}
                    style={{ width: `${Math.min(wb.rate, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            &gt;80% High Load
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            Normal Load
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            Optimal
          </span>
        </div>
      </div>
    </div>
  );
};
