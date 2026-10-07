import React from 'react';
import { ShieldCheck, HeartPulse, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-3.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="font-medium text-slate-700">
            Hospital Bed Allocation System | Smart Healthcare Management Prototype
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            HIPAA Compliant Data Model
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-red-500" />
            Trauma Dispatch: Ext 991
          </span>
          <span aria-hidden="true">·</span>
          <span>v2.4.0 Production Build</span>
        </div>
      </div>
    </footer>
  );
};
