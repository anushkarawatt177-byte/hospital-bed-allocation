import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  X, 
  CheckCheck, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  Clock
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHospital();

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Hospital Dispatch Alerts</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time bed alerts & admission activity
              </p>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="p-1.5 text-xs text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg flex items-center gap-1 font-medium"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active notifications at this time.
              </div>
            ) : (
              notifications.map((n) => {
                const getIcon = () => {
                  switch (n.type) {
                    case 'critical':
                      return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
                    case 'warning':
                      return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
                    case 'success':
                      return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
                    default:
                      return <Info className="w-4 h-4 text-sky-600 shrink-0" />;
                  }
                };

                const getBg = () => {
                  if (!n.read) {
                    switch (n.type) {
                      case 'critical': return 'bg-rose-50/50';
                      case 'warning': return 'bg-amber-50/50';
                      case 'success': return 'bg-emerald-50/50';
                      default: return 'bg-sky-50/50';
                    }
                  }
                  return 'bg-white hover:bg-slate-50';
                };

                return (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-4 transition-colors cursor-pointer ${getBg()}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon()}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-semibold ${!n.read ? 'text-slate-900 font-bold' : 'text-slate-800'}`}>
                            {n.title}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono shrink-0">
                            <Clock className="w-3 h-3" />
                            <span>{n.timestamp}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {n.message}
                        </p>

                        {n.linkTab && (
                          <div className="mt-2.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotificationRead(n.id);
                                onNavigateTab(n.linkTab!);
                                onClose();
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-800 hover:underline"
                            >
                              <span>Take action in {n.linkTab.toUpperCase()}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
            <p className="text-[11px] text-slate-400">
              Live hospital clinical priority dispatch · Automated telemetry alerts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
