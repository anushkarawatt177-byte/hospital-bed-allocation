import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types/hospital';
import { 
  Building2, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Stethoscope, 
  UserCog, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useHospital();
  const [email, setEmail] = useState('admin@stjudeshospital.org');
  const [password, setPassword] = useState('demo123456');
  const [role, setRole] = useState<UserRole>('Admin');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide an email or username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    login(email, role);
    if (onSuccess) onSuccess();
  };

  const handleQuickLogin = (demoRole: UserRole, demoEmail: string) => {
    setRole(demoRole);
    setEmail(demoEmail);
    setPassword('demo123456');
    login(demoEmail, demoRole);
    if (onSuccess) onSuccess();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background clinical geometric accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-100/60 via-teal-50/40 to-transparent pointer-events-none rounded-b-[4rem]" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-white shadow-md border border-slate-200/80 p-2 flex items-center justify-center">
            <img 
              src="/src/assets/images/hospital_logo_1791390835305.jpg" 
              alt="Hospital Logo" 
              className="h-12 w-12 object-contain rounded-xl"
              onError={(e) => {
                // Graceful fallback to medical icon
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Building2 className="h-9 w-9 text-sky-600 hidden group-hover:block" />
          </div>
        </div>

        <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          Hospital Bed Allocation System
        </h1>
        <p className="mt-1 text-center text-xs text-slate-500 font-medium">
          St. Jude Metropolitan Medical Center · Central Operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Staff Email or Username
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="name@hospital.org"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Operational Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Admin', 'Doctor', 'Staff'] as UserRole[]).map((r) => {
                  const isSelected = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/80 text-sky-900 font-semibold ring-1 ring-sky-500'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {r === 'Admin' && <UserCog className="w-4 h-4 mb-1 text-slate-700" />}
                      {r === 'Doctor' && <Stethoscope className="w-4 h-4 mb-1 text-teal-600" />}
                      {r === 'Staff' && <ShieldCheck className="w-4 h-4 mb-1 text-sky-600" />}
                      <span>{r}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all cursor-pointer"
            >
              <span>Sign In to Hospital Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Section */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>One-Click Prototype Demo Accounts:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('Admin', 'admin@stjudeshospital.org')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-medium text-slate-700 transition-colors text-center"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('Doctor', 'c.harris@stjudeshospital.org')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-medium text-slate-700 transition-colors text-center"
              >
                Doctor Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('Staff', 'm.vance@stjudeshospital.org')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-medium text-slate-700 transition-colors text-center"
              >
                Staff Demo
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Hospital Bed Allocation System | Smart Healthcare Management Prototype
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">Reset System Access</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered hospital email address to receive password reset instructions.
            </p>

            {forgotSuccess ? (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reset token sent! Check your hospital inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-4 space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="staff@stjudeshospital.org"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  required
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
