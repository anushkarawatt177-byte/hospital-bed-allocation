import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoginPage } from './components/auth/LoginPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { BedManagement } from './components/beds/BedManagement';
import { PatientManagement } from './components/patients/PatientManagement';
import { BedAllocation } from './components/allocation/BedAllocation';
import { EmergencyAllocation } from './components/allocation/EmergencyAllocation';
import { AdmissionsDischarges } from './components/admissions/AdmissionsDischarges';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { AdminPanel } from './components/admin/AdminPanel';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { Bed, Patient } from './types/hospital';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useHospital();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Cross-page payload state
  const [allocationPatientTarget, setAllocationPatientTarget] = useState<Patient | null>(null);
  const [allocationBedTarget, setAllocationBedTarget] = useState<Bed | null>(null);
  const [selectedBedNumberQuery, setSelectedBedNumberQuery] = useState<string>('');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAllocateBedForPatient = (patient: Patient) => {
    setAllocationPatientTarget(patient);
    setAllocationBedTarget(null);
    setActiveTab('allocate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAllocateBedTarget = (bed: Bed) => {
    setAllocationBedTarget(bed);
    setAllocationPatientTarget(null);
    setActiveTab('allocate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBed = (bedNumber: string) => {
    setSelectedBedNumberQuery(bedNumber);
    setActiveTab('beds');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigateTab={handleNavigateTab} 
            onSelectBed={handleSelectBed} 
          />
        );
      case 'beds':
        return (
          <BedManagement
            onNavigateTab={handleNavigateTab}
            onAllocateBedTarget={handleAllocateBedTarget}
            onDischargePatientTarget={(patientId) => {
              setActiveTab('admissions');
            }}
            preselectedBedNumber={selectedBedNumberQuery || globalSearch}
          />
        );
      case 'patients':
        return (
          <PatientManagement
            onNavigateTab={handleNavigateTab}
            onAllocateBedForPatient={handleAllocateBedForPatient}
          />
        );
      case 'allocate':
        return (
          <BedAllocation
            onNavigateTab={handleNavigateTab}
            preselectedPatient={allocationPatientTarget}
            preselectedBed={allocationBedTarget}
          />
        );
      case 'emergency':
        return (
          <EmergencyAllocation 
            onNavigateTab={handleNavigateTab} 
          />
        );
      case 'admissions':
        return (
          <AdmissionsDischarges
            onNavigateTab={handleNavigateTab}
            onAllocateBedForPatient={handleAllocateBedForPatient}
          />
        );
      case 'reports':
        return <ReportsAnalytics />;
      case 'notifications':
        return (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Hospital System Alerts & Activity</h2>
            <NotificationDrawer
              isOpen={true}
              onClose={() => setActiveTab('dashboard')}
              onNavigateTab={handleNavigateTab}
            />
          </div>
        );
      case 'settings':
        return <AdminPanel />;
      default:
        return (
          <Dashboard 
            onNavigateTab={handleNavigateTab} 
            onSelectBed={handleSelectBed} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        <Header
          activeTab={activeTab}
          setActiveTab={handleNavigateTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          onToggleNotifications={() => setNotificationsOpen(true)}
          globalSearch={globalSearch}
          setGlobalSearch={(q) => {
            setGlobalSearch(q);
            if (q && activeTab !== 'beds' && activeTab !== 'patients') {
              setActiveTab('beds');
            }
          }}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        <Footer />
      </div>

      {/* Notifications Slide-over Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNavigateTab={handleNavigateTab}
      />
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainLayout />
    </HospitalProvider>
  );
}
